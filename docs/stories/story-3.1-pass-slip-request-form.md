# Story 3.1: Pass Slip Request Form

**Epic:** 3 - Pass Slip Management  
**Story ID:** 3.1  
**Story Type:** Feature Development  
**Priority:** High  
**Estimated Effort:** 6-8 hours  
**Dependencies:** Story 1.3 (Authentication), Story 2.2 (Employee Management)  
**Status:** Ready for Development

---

## User Story

As an **employee**,  
I want **to submit a digital pass slip request through a web form**,  
so that **I can request permission to leave the office temporarily without using paper forms**.

---

## Acceptance Criteria

1. ✅ Pass slip request form accessible from employee dashboard via "Request Pass Slip" button
2. ✅ Form displays read-only employee information: name, employee ID, position, department
3. ✅ Form includes fields: pass slip type (dropdown: Planned/Emergency), date (date picker), time out (time picker), expected time in (time picker), destination (text input), reason for leaving (textarea)
4. ✅ All fields marked with asterisk (*) are required and validated before submission
5. ✅ Date field defaults to current date, cannot select past dates
6. ✅ Time out must be before expected time in (validation error if not)
7. ✅ Destination field requires minimum 10 characters
8. ✅ Reason field requires minimum 10 characters
9. ✅ "Submit Request" button disabled until all validations pass
10. ✅ Successful submission displays success message with reference number (e.g., "PS-2025-0001")
11. ✅ Successful submission redirects to pass slip list page after 2 seconds
12. ✅ "Cancel" button returns to dashboard without saving
13. ✅ Form data persists in browser if user navigates away accidentally (localStorage)
14. ✅ API endpoint POST /api/pass-slips creates pass slip record with status "Pending"
15. ✅ Pass slip automatically routed to appropriate approver based on workflow configuration

---

## Technical Specifications

### API Endpoint

**POST /api/pass-slips**

**Request Body:**
```json
{
  "employee_id": 1,
  "pass_slip_type": "Planned",
  "date": "2025-01-06",
  "time_out": "10:00",
  "expected_time_in": "12:00",
  "destination": "City Hall - Document Submission",
  "reason": "Need to submit clearance documents to City Hall Records Office"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "reference_no": "PS-2025-0001",
    "employee_id": 1,
    "pass_slip_type": "Planned",
    "date": "2025-01-06",
    "time_out": "10:00:00",
    "expected_time_in": "12:00:00",
    "destination": "City Hall - Document Submission",
    "reason": "Need to submit clearance documents to City Hall Records Office",
    "status": "Pending",
    "created_at": "2025-01-06T08:30:00Z"
  },
  "message": "Pass slip request submitted successfully"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "field": "time_out", "message": "Time out must be before expected time in" },
      { "field": "destination", "message": "Destination must be at least 10 characters" }
    ]
  }
}
```

### Database Schema

**Table:** `pass_slips`

```sql
CREATE TABLE pass_slips (
    id SERIAL PRIMARY KEY,
    reference_no VARCHAR(30) UNIQUE NOT NULL,
    employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    pass_slip_type VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    time_out TIME NOT NULL,
    expected_time_in TIME NOT NULL,
    actual_time_in TIME,
    destination VARCHAR(255) NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_time_out_before_in CHECK (time_out < expected_time_in),
    CONSTRAINT chk_pass_slip_type CHECK (pass_slip_type IN ('Planned', 'Emergency'))
);

CREATE INDEX idx_pass_slips_employee ON pass_slips(employee_id);
CREATE INDEX idx_pass_slips_status ON pass_slips(status);
CREATE INDEX idx_pass_slips_date ON pass_slips(date);
```

---

## UI/UX Specifications

### Wireframe (from UX Specification Document)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ [☰] Philippine Government HRMS          [🔔 3] [👤 Juan Dela Cruz ▼]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  Pass Slips > New Request                                                │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Request Pass Slip                                                │   │
│  │                                                                   │   │
│  │ Employee Information (Read-only)                                 │   │
│  │ ┌─────────────────────┐  ┌─────────────────────┐               │   │
│  │ │ Name                │  │ Employee ID          │               │   │
│  │ │ Juan Dela Cruz      │  │ 2025-0001            │               │   │
│  │ └─────────────────────┘  └─────────────────────┘               │   │
│  │ ┌─────────────────────┐  ┌─────────────────────┐               │   │
│  │ │ Position            │  │ Department           │               │   │
│  │ │ Admin Officer II    │  │ Human Resources      │               │   │
│  │ └─────────────────────┘  └─────────────────────┘               │   │
│  │                                                                   │   │
│  │ Pass Slip Details                                                │   │
│  │ ┌─────────────────────────────────────────────────────────────┐│   │
│  │ │ Pass Slip Type *                                             ││   │
│  │ │ [Planned ▼]                                                  ││   │
│  │ └─────────────────────────────────────────────────────────────┘│   │
│  │                                                                   │   │
│  │ ┌─────────────────────────────────────────────────────────────┐│   │
│  │ │ Date *                                                        ││   │
│  │ │ [01/06/2025] [📅]                                            ││   │
│  │ └─────────────────────────────────────────────────────────────┘│   │
│  │                                                                   │   │
│  │ ┌──────────────────────┐  ┌──────────────────────┐            │   │
│  │ │ Time Out *           │  │ Expected Time In *    │            │   │
│  │ │ [10:00 AM] [🕐]     │  │ [12:00 PM] [🕐]      │            │   │
│  │ └──────────────────────┘  └──────────────────────┘            │   │
│  │                                                                   │   │
│  │ ┌─────────────────────────────────────────────────────────────┐│   │
│  │ │ Destination *                                                ││   │
│  │ │ [_____________________________________________________]      ││   │
│  │ └─────────────────────────────────────────────────────────────┘│   │
│  │                                                                   │   │
│  │ ┌─────────────────────────────────────────────────────────────┐│   │
│  │ │ Reason for Leaving *                                         ││   │
│  │ │ [_____________________________________________________]      ││   │
│  │ │ [_____________________________________________________]      ││   │
│  │ │ [_____________________________________________________]      ││   │
│  │ └─────────────────────────────────────────────────────────────┘│   │
│  │                                                                   │   │
│  │                                    [Cancel]  [Submit Request]   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

### Design System (from UX Specification)

**Colors:**
- Primary: #003f87 (Navy Blue)
- Success: #28a745 (Green)
- Error: #dc3545 (Red)
- Background: #f8f9fa (Light Gray)

**Typography:**
- Font: Open Sans
- Form Labels: 14px, font-weight: 500
- Input Text: 16px
- Helper Text: 12px

**Spacing:**
- Form field spacing: 16px between fields
- Section spacing: 32px between sections
- Card padding: 24px internal padding

---

## Frontend Implementation

### Vue Component: PassSlipForm.vue

```vue
<template>
  <v-container>
    <v-breadcrumbs :items="breadcrumbs" />
    
    <v-card>
      <v-card-title class="text-h5 bg-primary text-white">
        Request Pass Slip
      </v-card-title>

      <v-card-text class="pa-6">
        <v-form ref="form" @submit.prevent="submitPassSlip">
          <!-- Employee Information (Read-only) -->
          <div class="mb-6">
            <h3 class="text-h6 mb-4">Employee Information</h3>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  :model-value="employee.full_name"
                  label="Name"
                  variant="outlined"
                  readonly
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  :model-value="employee.employee_id"
                  label="Employee ID"
                  variant="outlined"
                  readonly
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  :model-value="employee.position"
                  label="Position"
                  variant="outlined"
                  readonly
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  :model-value="employee.department_name"
                  label="Department"
                  variant="outlined"
                  readonly
                />
              </v-col>
            </v-row>
          </div>

          <v-divider class="my-6" />

          <!-- Pass Slip Details -->
          <div class="mb-6">
            <h3 class="text-h6 mb-4">Pass Slip Details</h3>
            
            <v-select
              v-model="passSlip.pass_slip_type"
              :items="['Planned', 'Emergency']"
              label="Pass Slip Type *"
              variant="outlined"
              :rules="[rules.required]"
              class="mb-4"
            />

            <v-text-field
              v-model="passSlip.date"
              label="Date *"
              type="date"
              variant="outlined"
              :rules="[rules.required, rules.futureDate]"
              :min="today"
              class="mb-4"
            />

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="passSlip.time_out"
                  label="Time Out *"
                  type="time"
                  variant="outlined"
                  :rules="[rules.required]"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="passSlip.expected_time_in"
                  label="Expected Time In *"
                  type="time"
                  variant="outlined"
                  :rules="[rules.required, rules.timeAfter]"
                />
              </v-col>
            </v-row>

            <v-text-field
              v-model="passSlip.destination"
              label="Destination *"
              variant="outlined"
              :rules="[rules.required, rules.minLength(10)]"
              hint="Minimum 10 characters"
              persistent-hint
              class="mb-4"
            />

            <v-textarea
              v-model="passSlip.reason"
              label="Reason for Leaving *"
              variant="outlined"
              rows="3"
              :rules="[rules.required, rules.minLength(10)]"
              hint="Minimum 10 characters"
              persistent-hint
            />
          </div>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4 justify-end">
        <v-btn variant="text" @click="cancel">Cancel</v-btn>
        <v-btn 
          color="primary" 
          @click="submitPassSlip" 
          :loading="loading"
          :disabled="!isFormValid"
        >
          Submit Request
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="top right"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-2">{{ snackbar.icon }}</v-icon>
        <span>{{ snackbar.message }}</span>
      </div>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useEmployeeStore } from '@/store/employee'
import passSlipService from '@/services/passSlipService'

const router = useRouter()
const authStore = useAuthStore()
const employeeStore = useEmployeeStore()

const form = ref(null)
const loading = ref(false)
const employee = ref({})
const today = new Date().toISOString().split('T')[0]

const passSlip = ref({
  pass_slip_type: 'Planned',
  date: today,
  time_out: '',
  expected_time_in: '',
  destination: '',
  reason: ''
})

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
  icon: 'mdi-check-circle'
})

const breadcrumbs = [
  { title: 'Dashboard', to: '/dashboard' },
  { title: 'Pass Slips', to: '/pass-slips' },
  { title: 'New Request', disabled: true }
]

// Validation rules
const rules = {
  required: (value) => !!value || 'This field is required',
  minLength: (min) => (value) => 
    (value && value.length >= min) || `Minimum ${min} characters required`,
  futureDate: (value) => {
    const selected = new Date(value).setHours(0, 0, 0, 0)
    const todayDate = new Date().setHours(0, 0, 0, 0)
    return selected >= todayDate || 'Date must be today or in the future'
  },
  timeAfter: (value) => {
    if (!passSlip.value.time_out || !value) return true
    return value > passSlip.value.time_out || 'Expected time in must be after time out'
  }
}

const isFormValid = computed(() => {
  return passSlip.value.pass_slip_type &&
         passSlip.value.date &&
         passSlip.value.time_out &&
         passSlip.value.expected_time_in &&
         passSlip.value.destination?.length >= 10 &&
         passSlip.value.reason?.length >= 10 &&
         passSlip.value.expected_time_in > passSlip.value.time_out
})

async function submitPassSlip() {
  const { valid } = await form.value.validate()
  if (!valid) return

  try {
    loading.value = true
    const response = await passSlipService.create({
      employee_id: employee.value.id,
      ...passSlip.value
    })

    snackbar.value = {
      show: true,
      message: `Pass slip ${response.data.reference_no} submitted successfully`,
      color: 'success',
      icon: 'mdi-check-circle'
    }

    // Clear localStorage
    localStorage.removeItem('passSlipDraft')

    // Redirect after 2 seconds
    setTimeout(() => {
      router.push('/pass-slips')
    }, 2000)
  } catch (error) {
    snackbar.value = {
      show: true,
      message: error.response?.data?.error?.message || 'Failed to submit pass slip',
      color: 'error',
      icon: 'mdi-alert-circle'
    }
  } finally {
    loading.value = false
  }
}

function cancel() {
  router.push('/dashboard')
}

// Load employee data
onMounted(async () => {
  employee.value = await employeeStore.getCurrentEmployee()
  
  // Load draft from localStorage if exists
  const draft = localStorage.getItem('passSlipDraft')
  if (draft) {
    passSlip.value = JSON.parse(draft)
  }
})

// Save draft to localStorage on change
watch(passSlip, (newValue) => {
  localStorage.setItem('passSlipDraft', JSON.stringify(newValue))
}, { deep: true })
</script>
```

---

## Backend Implementation

### Controller: passSlipController.js

```javascript
const passSlipService = require('../services/passSlipService')
const logger = require('../config/logger')

exports.create = async (req, res, next) => {
  try {
    const { employee_id, pass_slip_type, date, time_out, expected_time_in, destination, reason } = req.body
    
    // Validation
    if (!employee_id || !pass_slip_type || !date || !time_out || !expected_time_in || !destination || !reason) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'All fields are required'
        }
      })
    }
    
    // Time validation
    if (time_out >= expected_time_in) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Time out must be before expected time in'
        }
      })
    }
    
    // Create pass slip
    const passSlip = await passSlipService.create({
      employee_id,
      pass_slip_type,
      date,
      time_out,
      expected_time_in,
      destination,
      reason,
      status: 'Pending'
    })
    
    logger.info(`Pass slip ${passSlip.reference_no} created by employee ${employee_id}`)
    
    res.status(201).json({
      success: true,
      data: passSlip,
      message: 'Pass slip request submitted successfully'
    })
  } catch (error) {
    next(error)
  }
}
```

---

## Testing Checklist

- [ ] Form displays with all fields
- [ ] Employee information loads correctly
- [ ] All validations work (required, min length, time comparison)
- [ ] Date picker prevents past dates
- [ ] Submit button disabled when form invalid
- [ ] API creates pass slip record
- [ ] Success message displays with reference number
- [ ] Redirects to pass slip list after submission
- [ ] Cancel button returns to dashboard
- [ ] Draft saves to localStorage
- [ ] Error messages display correctly

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Frontend component implemented
- [ ] Backend API endpoint implemented
- [ ] Validation working on both frontend and backend
- [ ] Success/error notifications working
- [ ] Tested on desktop and tablet
- [ ] Code reviewed and approved
- [ ] Ready for Story 3.2 (Approval Workflow)

---

**Next Story:** 3.2 - Pass Slip Approval Workflow

