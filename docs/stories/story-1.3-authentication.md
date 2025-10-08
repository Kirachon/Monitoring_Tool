# Story 1.3: User Authentication System

**Epic:** 1 - Foundation & Authentication  
**Story ID:** 1.3  
**Story Type:** Technical Foundation  
**Priority:** Critical  
**Estimated Effort:** 6-8 hours  
**Dependencies:** Story 1.1 (Project Setup), Story 1.2 (Database Schema)  
**Status:** Ready for Development

---

## User Story

As a **system user**,  
I want **to securely log in with username and password**,  
so that **I can access the HRMS system with my assigned role and permissions**.

---

## Acceptance Criteria

1. ✅ Login page displays username and password fields with "Remember Me" checkbox
2. ✅ POST /api/auth/login endpoint accepts username and password, validates credentials
3. ✅ Passwords hashed using bcrypt with appropriate salt rounds (minimum 10)
4. ✅ Successful login returns JWT token with user ID, username, and roles encoded
5. ✅ JWT token expires after 8 hours (configurable)
6. ✅ Failed login returns 401 Unauthorized with generic error message (no username/password hints)
7. ✅ Account locks after 5 consecutive failed login attempts within 15 minutes
8. ✅ Locked accounts display message: "Account locked. Contact system administrator."
9. ✅ Session management stores active sessions with user ID, login time, IP address, user agent
10. ✅ Logout endpoint (/api/auth/logout) invalidates JWT token and clears session
11. ✅ Authentication middleware validates JWT token on all protected routes
12. ✅ Expired or invalid tokens return 401 with redirect to login page

---

## Technical Specifications

### API Endpoints

**POST /api/auth/login**

Request:
```json
{
  "username": "jdoe",
  "password": "SecurePass123!",
  "rememberMe": true
}
```

Response (200 OK):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "jdoe",
      "employeeId": "2025-0001",
      "roles": ["Employee"],
      "permissions": ["pass_slip.create", "leave.create"]
    }
  }
}
```

**POST /api/auth/logout**

Request Headers:
```
Authorization: Bearer <token>
```

Response (200 OK):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**GET /api/auth/me**

Response (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "jdoe",
    "employeeId": "2025-0001",
    "fullName": "Juan Dela Cruz",
    "roles": ["Employee"],
    "permissions": ["pass_slip.create", "leave.create"],
    "lastLogin": "2025-01-06T08:30:00Z"
  }
}
```

### JWT Token Payload

```json
{
  "userId": 1,
  "username": "jdoe",
  "employeeId": "2025-0001",
  "roles": ["Employee"],
  "permissions": ["pass_slip.create", "leave.create"],
  "iat": 1704528000,
  "exp": 1704556800
}
```

---

## Backend Implementation

### Authentication Service (src/services/authService.js)

```javascript
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const logger = require('../config/logger');

class AuthService {
  async login(username, password, ipAddress, userAgent) {
    // Find user
    const user = await db('users')
      .where({ username, status: 'active' })
      .first();
    
    if (!user) {
      await this.logFailedAttempt(username, ipAddress);
      throw new Error('Invalid credentials');
    }
    
    // Check if account is locked
    if (user.failed_login_attempts >= 5) {
      const lockoutTime = new Date(user.last_failed_login);
      lockoutTime.setMinutes(lockoutTime.getMinutes() + 15);
      
      if (new Date() < lockoutTime) {
        throw new Error('Account locked. Contact system administrator.');
      } else {
        // Reset failed attempts after lockout period
        await db('users').where({ id: user.id }).update({
          failed_login_attempts: 0,
          last_failed_login: null
        });
      }
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isValid) {
      await this.incrementFailedAttempts(user.id);
      throw new Error('Invalid credentials');
    }
    
    // Reset failed attempts on successful login
    await db('users').where({ id: user.id }).update({
      failed_login_attempts: 0,
      last_failed_login: null,
      last_login: db.fn.now()
    });
    
    // Get user roles and permissions
    const roles = await this.getUserRoles(user.id);
    const permissions = await this.getUserPermissions(user.id);
    
    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        employeeId: user.employee_id,
        roles: roles.map(r => r.name),
        permissions: permissions.map(p => p.name)
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || '8h' }
    );
    
    // Create session
    await db('sessions').insert({
      user_id: user.id,
      token,
      ip_address: ipAddress,
      user_agent: userAgent,
      expires_at: new Date(Date.now() + 8 * 60 * 60 * 1000)
    });
    
    logger.info(`User ${username} logged in successfully`);
    
    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        employeeId: user.employee_id,
        roles: roles.map(r => r.name),
        permissions: permissions.map(p => p.name)
      }
    };
  }
  
  async logout(token) {
    await db('sessions').where({ token }).delete();
    logger.info('User logged out');
  }
  
  async getUserRoles(userId) {
    return db('user_roles')
      .join('roles', 'user_roles.role_id', 'roles.id')
      .where('user_roles.user_id', userId)
      .select('roles.id', 'roles.name');
  }
  
  async getUserPermissions(userId) {
    return db('user_roles')
      .join('role_permissions', 'user_roles.role_id', 'role_permissions.role_id')
      .join('permissions', 'role_permissions.permission_id', 'permissions.id')
      .where('user_roles.user_id', userId)
      .distinct('permissions.id', 'permissions.name');
  }
  
  async incrementFailedAttempts(userId) {
    await db('users')
      .where({ id: userId })
      .increment('failed_login_attempts', 1)
      .update({ last_failed_login: db.fn.now() });
  }
  
  async logFailedAttempt(username, ipAddress) {
    logger.warn(`Failed login attempt for username: ${username} from IP: ${ipAddress}`);
  }
}

module.exports = new AuthService();
```

### Authentication Middleware (src/middleware/auth.js)

```javascript
const jwt = require('jsonwebtoken');
const db = require('../config/database');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: { code: 'NO_TOKEN', message: 'Authentication required' }
    });
  }
  
  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if session exists and is not expired
    const session = await db('sessions')
      .where({ token })
      .where('expires_at', '>', db.fn.now())
      .first();
    
    if (!session) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_SESSION', message: 'Session expired or invalid' }
      });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' }
    });
  }
};
```

---

## Frontend Implementation

### Login Component (src/views/Login.vue)

```vue
<template>
  <v-app>
    <v-main class="d-flex align-center justify-center bg-secondary-lighten-4">
      <v-card width="400" elevation="8" rounded="lg">
        <v-card-text class="text-center pa-8">
          <v-img
            src="/assets/government-seal.png"
            width="150"
            height="150"
            class="mx-auto mb-4"
          />
          <h1 class="text-h5 font-weight-bold text-primary mb-2">
            Philippine Government HRMS
          </h1>
          <p class="text-body-2 text-secondary mb-6">
            Human Resource Management System
          </p>

          <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
            {{ error }}
          </v-alert>

          <v-form @submit.prevent="handleLogin">
            <v-text-field
              v-model="username"
              label="Username"
              prepend-inner-icon="mdi-account"
              variant="outlined"
              density="comfortable"
              :rules="[rules.required]"
              class="mb-4"
            />

            <v-text-field
              v-model="password"
              label="Password"
              prepend-inner-icon="mdi-lock"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              @click:append-inner="showPassword = !showPassword"
              variant="outlined"
              density="comfortable"
              :rules="[rules.required]"
              class="mb-4"
            />

            <v-checkbox
              v-model="rememberMe"
              label="Remember me"
              density="compact"
              class="mb-4"
            />

            <v-btn
              type="submit"
              color="primary"
              size="large"
              block
              :loading="loading"
            >
              Login
            </v-btn>
          </v-form>

          <p class="text-caption text-secondary mt-4">
            Forgot password? Contact system administrator
          </p>
        </v-card-text>
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const rules = {
  required: (value) => !!value || 'This field is required'
}

async function handleLogin() {
  error.value = ''
  loading.value = true
  
  try {
    await authStore.login(username.value, password.value, rememberMe.value)
    router.push('/dashboard')
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>
```

### Auth Store (src/store/auth.js)

```javascript
import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null')
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    hasRole: (state) => (role) => state.user?.roles?.includes(role),
    hasPermission: (state) => (permission) => state.user?.permissions?.includes(permission)
  },
  
  actions: {
    async login(username, password, rememberMe) {
      const response = await axios.post('/api/auth/login', {
        username,
        password,
        rememberMe
      })
      
      this.token = response.data.data.token
      this.user = response.data.data.user
      
      localStorage.setItem('token', this.token)
      localStorage.setItem('user', JSON.stringify(this.user))
      
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
    },
    
    async logout() {
      await axios.post('/api/auth/logout')
      
      this.token = null
      this.user = null
      
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      delete axios.defaults.headers.common['Authorization']
    },
    
    async fetchCurrentUser() {
      const response = await axios.get('/api/auth/me')
      this.user = response.data.data
      localStorage.setItem('user', JSON.stringify(this.user))
    }
  }
})
```

---

## Testing Checklist

- [ ] Login page displays correctly
- [ ] Valid credentials allow login
- [ ] Invalid credentials show error message
- [ ] Account locks after 5 failed attempts
- [ ] Locked account shows appropriate message
- [ ] JWT token generated with correct payload
- [ ] Token expires after 8 hours
- [ ] Logout clears session
- [ ] Authentication middleware protects routes
- [ ] Expired tokens redirect to login
- [ ] Remember me functionality works
- [ ] Password show/hide toggle works

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Backend authentication service implemented
- [ ] Frontend login component implemented
- [ ] Auth middleware protecting routes
- [ ] JWT token generation working
- [ ] Session management implemented
- [ ] Account lockout working
- [ ] Tests passing
- [ ] Ready for Story 1.4 (RBAC)

---

**Next Story:** 1.4 - Role-Based Access Control (RBAC)

