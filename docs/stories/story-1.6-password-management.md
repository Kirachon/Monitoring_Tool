# Story 1.6: Password Management

**Epic:** 1 - Foundation & Authentication  
**Story ID:** 1.6  
**Story Type:** Feature Development  
**Priority:** High  
**Estimated Effort:** 4-6 hours  
**Dependencies:** Story 1.3 (Authentication)  
**Status:** Ready for Development

---

## User Story

As an **employee**,  
I want **to change my password and be required to update it periodically**,  
so that **my account remains secure according to government cybersecurity standards**.

---

## Acceptance Criteria

1. ✅ "Change Password" link in user profile menu navigates to password change page
2. ✅ Password change form displays fields: current password, new password, confirm new password
3. ✅ PUT /api/auth/change-password endpoint validates current password, checks new password complexity
4. ✅ Password complexity requirements enforced: minimum 8 characters, at least one uppercase, one lowercase, one number, one special character
5. ✅ New password cannot match any of last 3 passwords (password history stored as hashes)
6. ✅ Successful password change logs user out, requires re-login with new password
7. ✅ Password expiration set to 90 days (configurable in system_config table)
8. ✅ Users receive warning message 7 days before password expiration: "Your password expires in X days. Please change it."
9. ✅ Expired passwords force password change on next login before accessing system
10. ✅ Password change action logged to audit log
11. ✅ Failed password change attempts (wrong current password) logged and count toward account lockout threshold

---

## Technical Specifications

### API Endpoints

**PUT /api/auth/change-password**

Request:
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewSecure456!",
  "confirmPassword": "NewSecure456!"
}
```

Response (200 OK):
```json
{
  "success": true,
  "message": "Password changed successfully. Please log in again."
}
```

Error Response (400 Bad Request):
```json
{
  "success": false,
  "error": {
    "code": "PASSWORD_REUSE",
    "message": "New password cannot match any of your last 3 passwords"
  }
}
```

**GET /api/auth/password-status**

Response:
```json
{
  "success": true,
  "data": {
    "passwordChangedAt": "2024-10-06T00:00:00Z",
    "passwordExpiresAt": "2025-01-04T00:00:00Z",
    "daysUntilExpiration": 7,
    "mustChangePassword": false
  }
}
```

### Database Schema

**password_history table** (already created in Story 1.2):
```sql
CREATE TABLE password_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Backend Implementation

### Password Service (src/services/passwordService.js)

```javascript
const bcrypt = require('bcrypt');
const db = require('../config/database');
const logger = require('../config/logger');

class PasswordService {
  async changePassword(userId, currentPassword, newPassword) {
    // Get user
    const user = await db('users').where({ id: userId }).first();
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValid) {
      // Increment failed attempts
      await db('users')
        .where({ id: userId })
        .increment('failed_login_attempts', 1);
      
      throw new Error('Current password is incorrect');
    }
    
    // Check password complexity
    this.validatePasswordComplexity(newPassword);
    
    // Check password history (last 3 passwords)
    await this.checkPasswordHistory(userId, newPassword);
    
    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    
    // Update user password
    await db('users').where({ id: userId }).update({
      password_hash: newPasswordHash,
      password_changed_at: db.fn.now(),
      password_expires_at: db.raw("CURRENT_TIMESTAMP + INTERVAL '90 days'"),
      must_change_password: false,
      failed_login_attempts: 0
    });
    
    // Add to password history
    await db('password_history').insert({
      user_id: userId,
      password_hash: newPasswordHash
    });
    
    // Keep only last 3 passwords in history
    const historyToDelete = await db('password_history')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc')
      .offset(3)
      .select('id');
    
    if (historyToDelete.length > 0) {
      await db('password_history')
        .whereIn('id', historyToDelete.map(h => h.id))
        .delete();
    }
    
    // Log password change
    logger.info(`Password changed for user ${user.username}`);
    
    // Invalidate all sessions for this user
    await db('sessions').where({ user_id: userId }).delete();
    
    return true;
  }
  
  validatePasswordComplexity(password) {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    if (errors.length > 0) {
      throw new Error(errors.join('. '));
    }
  }
  
  async checkPasswordHistory(userId, newPassword) {
    const history = await db('password_history')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc')
      .limit(3)
      .select('password_hash');
    
    for (const record of history) {
      const matches = await bcrypt.compare(newPassword, record.password_hash);
      if (matches) {
        throw new Error('New password cannot match any of your last 3 passwords');
      }
    }
  }
  
  async getPasswordStatus(userId) {
    const user = await db('users')
      .where({ id: userId })
      .select('password_changed_at', 'password_expires_at', 'must_change_password')
      .first();
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const now = new Date();
    const expiresAt = new Date(user.password_expires_at);
    const daysUntilExpiration = Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24));
    
    return {
      passwordChangedAt: user.password_changed_at,
      passwordExpiresAt: user.password_expires_at,
      daysUntilExpiration: Math.max(0, daysUntilExpiration),
      mustChangePassword: user.must_change_password || daysUntilExpiration <= 0
    };
  }
}

module.exports = new PasswordService();
```

---

## Frontend Implementation

### Change Password Component (src/views/ChangePassword.vue)

```vue
<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="text-h5 bg-primary text-white">
            Change Password
          </v-card-title>

          <v-card-text class="pa-6">
            <!-- Password Expiration Warning -->
            <v-alert
              v-if="passwordStatus && passwordStatus.daysUntilExpiration <= 7"
              type="warning"
              variant="tonal"
              class="mb-4"
            >
              Your password expires in {{ passwordStatus.daysUntilExpiration }} days.
              Please change it now.
            </v-alert>

            <!-- Force Change Alert -->
            <v-alert
              v-if="passwordStatus && passwordStatus.mustChangePassword"
              type="error"
              variant="tonal"
              class="mb-4"
            >
              Your password has expired. You must change it to continue.
            </v-alert>

            <!-- Password Requirements -->
            <v-alert type="info" variant="tonal" class="mb-4">
              <div class="text-subtitle-2 mb-2">Password Requirements:</div>
              <ul class="text-body-2">
                <li>Minimum 8 characters</li>
                <li>At least one uppercase letter</li>
                <li>At least one lowercase letter</li>
                <li>At least one number</li>
                <li>At least one special character (!@#$%^&*)</li>
                <li>Cannot match any of your last 3 passwords</li>
              </ul>
            </v-alert>

            <v-form ref="form" @submit.prevent="handleChangePassword">
              <v-text-field
                v-model="currentPassword"
                label="Current Password *"
                :type="showCurrentPassword ? 'text' : 'password'"
                :append-inner-icon="showCurrentPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showCurrentPassword = !showCurrentPassword"
                :rules="[rules.required]"
                variant="outlined"
                class="mb-4"
              />

              <v-text-field
                v-model="newPassword"
                label="New Password *"
                :type="showNewPassword ? 'text' : 'password'"
                :append-inner-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showNewPassword = !showNewPassword"
                :rules="[rules.required, rules.passwordComplexity]"
                variant="outlined"
                class="mb-4"
              />

              <v-text-field
                v-model="confirmPassword"
                label="Confirm New Password *"
                :type="showConfirmPassword ? 'text' : 'password'"
                :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showConfirmPassword = !showConfirmPassword"
                :rules="[rules.required, rules.passwordMatch]"
                variant="outlined"
                class="mb-4"
              />

              <!-- Password Strength Indicator -->
              <div class="mb-4">
                <div class="text-caption mb-1">Password Strength:</div>
                <v-progress-linear
                  :model-value="passwordStrength"
                  :color="passwordStrengthColor"
                  height="8"
                  rounded
                />
                <div class="text-caption mt-1">{{ passwordStrengthText }}</div>
              </div>
            </v-form>
          </v-card-text>

          <v-divider />

          <v-card-actions class="pa-4 justify-end">
            <v-btn variant="text" @click="cancel" :disabled="loading">
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              @click="handleChangePassword"
              :loading="loading"
            >
              Change Password
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import passwordService from '@/services/passwordService'
import { useNotification } from '@/composables/useNotification'

const router = useRouter()
const authStore = useAuthStore()
const { showSuccess, showError } = useNotification()

const form = ref(null)
const loading = ref(false)
const passwordStatus = ref(null)

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const rules = {
  required: (v) => !!v || 'This field is required',
  passwordComplexity: (v) => {
    if (!v) return 'Password is required'
    if (v.length < 8) return 'Minimum 8 characters'
    if (!/[A-Z]/.test(v)) return 'Must contain uppercase letter'
    if (!/[a-z]/.test(v)) return 'Must contain lowercase letter'
    if (!/[0-9]/.test(v)) return 'Must contain number'
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(v)) {
      return 'Must contain special character'
    }
    return true
  },
  passwordMatch: (v) => v === newPassword.value || 'Passwords must match'
}

const passwordStrength = computed(() => {
  const password = newPassword.value
  if (!password) return 0
  
  let strength = 0
  if (password.length >= 8) strength += 20
  if (password.length >= 12) strength += 20
  if (/[A-Z]/.test(password)) strength += 20
  if (/[a-z]/.test(password)) strength += 20
  if (/[0-9]/.test(password)) strength += 10
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 10
  
  return strength
})

const passwordStrengthColor = computed(() => {
  if (passwordStrength.value < 40) return 'error'
  if (passwordStrength.value < 70) return 'warning'
  return 'success'
})

const passwordStrengthText = computed(() => {
  if (passwordStrength.value < 40) return 'Weak'
  if (passwordStrength.value < 70) return 'Medium'
  return 'Strong'
})

async function handleChangePassword() {
  const { valid } = await form.value.validate()
  if (!valid) return
  
  loading.value = true
  
  try {
    await passwordService.changePassword({
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
      confirmPassword: confirmPassword.value
    })
    
    showSuccess('Password changed successfully. Please log in again.')
    
    // Log out user
    await authStore.logout()
    
    // Redirect to login
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error) {
    showError(error.response?.data?.error?.message || 'Failed to change password')
  } finally {
    loading.value = false
  }
}

function cancel() {
  if (passwordStatus.value?.mustChangePassword) {
    showError('You must change your password to continue')
  } else {
    router.push('/dashboard')
  }
}

async function loadPasswordStatus() {
  try {
    const response = await passwordService.getPasswordStatus()
    passwordStatus.value = response.data.data
  } catch (error) {
    console.error('Failed to load password status', error)
  }
}

onMounted(() => {
  loadPasswordStatus()
})
</script>
```

---

## Testing Checklist

- [ ] Change password page displays correctly
- [ ] Current password validation works
- [ ] New password complexity validation works
- [ ] Password match validation works
- [ ] Password strength indicator updates
- [ ] Cannot reuse last 3 passwords
- [ ] Successful change logs user out
- [ ] Password expiration warning displays
- [ ] Expired password forces change
- [ ] Password change logged to audit log
- [ ] Failed attempts count toward lockout

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Frontend component implemented
- [ ] Backend password service implemented
- [ ] Password complexity validation working
- [ ] Password history checking working
- [ ] Password expiration working
- [ ] Tests passing
- [ ] Epic 1 complete, ready for Epic 2

---

**Next Story:** 2.1 - Department Management

