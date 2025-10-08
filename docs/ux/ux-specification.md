# Philippine Government HRMS - UX Specification Document

**Document Version:** 1.0  
**Date:** 2025-10-06  
**Prepared By:** UX Expert (Alex)  
**Based On:** PRD v1.0 + Architecture v1.0  
**Status:** Ready for Development

---

## Table of Contents

1. [Design Philosophy & Principles](#design-philosophy--principles)
2. [Design System](#design-system)
3. [Component Library & Framework](#component-library--framework)
4. [Key Screen Wireframes](#key-screen-wireframes)
5. [Design Patterns](#design-patterns)
6. [Accessibility Implementation](#accessibility-implementation)
7. [Responsive Design Guidelines](#responsive-design-guidelines)
8. [Philippine Government Branding](#philippine-government-branding)
9. [Implementation Guide](#implementation-guide)

---

## 1. Design Philosophy & Principles

### 1.1 Core Design Philosophy

**"Government-Friendly Design for All"**

The Philippine Government HRMS interface embodies **simplicity, clarity, and accessibility**. Every design decision prioritizes:

- **Ease of Use:** Minimal clicks to accomplish tasks, clear information hierarchy
- **Familiarity:** Patterns similar to common office software (Microsoft Office, Google Workspace)
- **Accessibility:** WCAG AA compliance, high contrast, large touch targets
- **Professional Appearance:** Conservative, formal aesthetic appropriate for government context
- **Efficiency:** Task completion speed over visual flair

### 1.2 Design Principles

**1. Clarity Over Cleverness**
- Use clear labels instead of icons alone
- Explicit button text ("Submit Leave Request" not just "Submit")
- Avoid jargon, use plain Philippine English

**2. Consistency Throughout**
- Same patterns for similar actions across all modules
- Consistent placement of primary actions (bottom-right for forms)
- Uniform status indicators (colors, badges, icons)

**3. Progressive Disclosure**
- Show essential information first, details on demand
- Multi-step wizards for complex forms
- Collapsible sections for advanced options

**4. Immediate Feedback**
- Loading indicators for all async operations
- Success/error messages after every action
- Real-time validation on form fields

**5. Forgiving Interactions**
- Confirmation dialogs for destructive actions
- Undo capability where feasible
- Clear error messages with recovery guidance

### 1.3 Target User Personas

**Persona 1: Maria (Employee, 45 years old)**
- Basic computer skills, uses email and Word
- Needs to submit pass slips and leave requests
- Prefers clear instructions and large buttons
- Uses desktop computer at office

**Persona 2: Carlos (Supervisor, 38 years old)**
- Moderate computer skills, uses spreadsheets
- Needs to approve requests quickly on desktop or tablet
- Values efficiency and overview dashboards
- Sometimes approves on tablet during meetings

**Persona 3: Linda (HR Administrator, 52 years old)**
- Advanced computer skills, power user
- Manages all employee records and generates certificates
- Needs bulk operations and comprehensive reports
- Uses desktop computer exclusively

**Persona 4: Robert (System Administrator, 35 years old)**
- Expert computer skills, technical background
- Configures system settings and manages users
- Values detailed logs and system health information
- Uses desktop computer, comfortable with technical interfaces

---

## 2. Design System

### 2.1 Color Palette

**Primary Colors (Philippine Government Standard)**

```css
/* Primary - Navy Blue (Government Official Color) */
--color-primary: #003f87;
--color-primary-light: #1a5fa8;
--color-primary-dark: #002a5c;

/* Secondary - Gray (Professional Neutral) */
--color-secondary: #6c757d;
--color-secondary-light: #adb5bd;
--color-secondary-dark: #495057;

/* Accent - Gold (Philippine Flag Accent) */
--color-accent: #fcd116;
--color-accent-dark: #d4a800;
```

**Semantic Colors (Status Indicators)**

```css
/* Success - Green */
--color-success: #28a745;
--color-success-light: #d4edda;
--color-success-dark: #1e7e34;

/* Warning - Yellow */
--color-warning: #ffc107;
--color-warning-light: #fff3cd;
--color-warning-dark: #d39e00;

/* Error/Danger - Red */
--color-error: #dc3545;
--color-error-light: #f8d7da;
--color-error-dark: #bd2130;

/* Info - Blue */
--color-info: #17a2b8;
--color-info-light: #d1ecf1;
--color-info-dark: #117a8b;
```

**Neutral Colors (Backgrounds & Text)**

```css
/* Backgrounds */
--color-bg-primary: #ffffff;
--color-bg-secondary: #f8f9fa;
--color-bg-tertiary: #e9ecef;

/* Text */
--color-text-primary: #212529;
--color-text-secondary: #6c757d;
--color-text-disabled: #adb5bd;
--color-text-inverse: #ffffff;

/* Borders */
--color-border: #dee2e6;
--color-border-light: #e9ecef;
--color-border-dark: #adb5bd;
```

**Status Badge Colors**

```css
/* Pass Slip / Leave Request Statuses */
--status-pending: #ffc107;      /* Yellow */
--status-approved: #28a745;     /* Green */
--status-denied: #dc3545;       /* Red */
--status-cancelled: #6c757d;    /* Gray */
--status-completed: #17a2b8;    /* Blue */
```

### 2.2 Typography

**Font Family**

```css
/* Primary Font - Open Sans (Google Fonts, Open Source) */
--font-family-primary: 'Open Sans', 'Segoe UI', Tahoma, sans-serif;

/* Monospace Font - For codes, IDs */
--font-family-mono: 'Courier New', Courier, monospace;
```

**Font Sizes (Responsive Scale)**

```css
/* Headings */
--font-size-h1: 2rem;      /* 32px - Page titles */
--font-size-h2: 1.5rem;    /* 24px - Section headers */
--font-size-h3: 1.25rem;   /* 20px - Subsection headers */
--font-size-h4: 1.125rem;  /* 18px - Card titles */

/* Body Text */
--font-size-base: 1rem;    /* 16px - Default body text */
--font-size-small: 0.875rem; /* 14px - Helper text, labels */
--font-size-xsmall: 0.75rem; /* 12px - Captions, footnotes */

/* Large Text (Accessibility) */
--font-size-large: 1.125rem; /* 18px - Important information */
```

**Font Weights**

```css
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

**Line Heights**

```css
--line-height-tight: 1.25;   /* Headings */
--line-height-normal: 1.5;   /* Body text */
--line-height-relaxed: 1.75; /* Long-form content */
```

### 2.3 Spacing System

**Spacing Scale (8px base unit)**

```css
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;      /* 32px */
--spacing-2xl: 3rem;     /* 48px */
--spacing-3xl: 4rem;     /* 64px */
```

**Component Spacing Guidelines**

- **Form field spacing:** `--spacing-md` (16px) between fields
- **Section spacing:** `--spacing-xl` (32px) between major sections
- **Card padding:** `--spacing-lg` (24px) internal padding
- **Button padding:** `--spacing-sm` (8px) vertical, `--spacing-lg` (24px) horizontal
- **Table cell padding:** `--spacing-sm` (8px) vertical, `--spacing-md` (16px) horizontal

### 2.4 Border Radius

```css
--border-radius-sm: 0.25rem;  /* 4px - Small elements */
--border-radius-md: 0.375rem; /* 6px - Buttons, inputs */
--border-radius-lg: 0.5rem;   /* 8px - Cards, modals */
--border-radius-xl: 1rem;     /* 16px - Large containers */
--border-radius-full: 9999px; /* Circular - Badges, avatars */
```

### 2.5 Shadows

```css
/* Elevation Shadows */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);

/* Focus Shadow (Accessibility) */
--shadow-focus: 0 0 0 3px rgba(0, 63, 135, 0.3); /* Primary color with opacity */
```

### 2.6 Transitions

```css
/* Standard Transitions */
--transition-fast: 150ms ease-in-out;
--transition-base: 250ms ease-in-out;
--transition-slow: 350ms ease-in-out;

/* Usage */
.button {
  transition: background-color var(--transition-base),
              transform var(--transition-fast);
}
```

---

## 3. Component Library & Framework

### 3.1 Recommended Framework: Vuetify 3

**Selection Rationale:**

✅ **Vue.js 3 Compatible** - Matches architecture decision  
✅ **Material Design** - Proven, accessible design system  
✅ **Comprehensive Components** - 80+ pre-built components  
✅ **Accessibility Built-in** - WCAG AA compliant out-of-box  
✅ **Responsive by Default** - Mobile-first design  
✅ **Customizable Theming** - Easy to apply Philippine government branding  
✅ **Active Community** - Well-documented, regularly updated  
✅ **Open Source** - MIT license, zero cost  

**Installation:**

```bash
npm install vuetify@^3.4.0
npm install @mdi/font  # Material Design Icons
```

**Vuetify Configuration (main.js):**

```javascript
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'govPhTheme',
    themes: {
      govPhTheme: {
        dark: false,
        colors: {
          primary: '#003f87',      // Navy blue
          secondary: '#6c757d',    // Gray
          accent: '#fcd116',       // Gold
          success: '#28a745',
          warning: '#ffc107',
          error: '#dc3545',
          info: '#17a2b8',
          background: '#f8f9fa',
          surface: '#ffffff',
        }
      }
    }
  },
  defaults: {
    VBtn: {
      color: 'primary',
      variant: 'elevated',
      rounded: 'md',
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
    },
    VCard: {
      elevation: 2,
      rounded: 'lg',
    }
  }
})

const app = createApp(App)
app.use(vuetify)
app.mount('#app')
```

### 3.2 Core Components to Use

**Layout Components:**
- `<v-app>` - Root application wrapper
- `<v-app-bar>` - Top navigation bar
- `<v-navigation-drawer>` - Sidebar navigation
- `<v-main>` - Main content area
- `<v-container>`, `<v-row>`, `<v-col>` - Grid system

**Form Components:**
- `<v-text-field>` - Text inputs
- `<v-select>` - Dropdowns
- `<v-autocomplete>` - Searchable dropdowns
- `<v-textarea>` - Multi-line text
- `<v-checkbox>` - Checkboxes
- `<v-radio-group>` - Radio buttons
- `<v-date-picker>` - Date selection
- `<v-file-input>` - File uploads

**Data Display:**
- `<v-data-table>` - Tables with sorting, filtering, pagination
- `<v-card>` - Content containers
- `<v-list>` - Lists with items
- `<v-chip>` - Status badges
- `<v-avatar>` - User avatars
- `<v-badge>` - Notification badges

**Feedback Components:**
- `<v-btn>` - Buttons
- `<v-dialog>` - Modal dialogs
- `<v-snackbar>` - Toast notifications
- `<v-alert>` - Alert messages
- `<v-progress-circular>` - Loading spinners
- `<v-progress-linear>` - Progress bars

**Navigation:**
- `<v-tabs>` - Tab navigation
- `<v-breadcrumbs>` - Breadcrumb navigation
- `<v-pagination>` - Page navigation

---

## 4. Key Screen Wireframes

### 4.1 Login Screen

**Purpose:** Secure authentication entry point

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│                    [Government Seal Logo]                     │
│                                                               │
│              Philippine Government HRMS                       │
│              Human Resource Management System                 │
│                                                               │
│    ┌───────────────────────────────────────────────────┐    │
│    │                                                     │    │
│    │  Username                                          │    │
│    │  [________________________]                        │    │
│    │                                                     │    │
│    │  Password                                          │    │
│    │  [________________________] [👁]                   │    │
│    │                                                     │    │
│    │  [ ] Remember me                                   │    │
│    │                                                     │    │
│    │                    [  Login  ]                     │    │
│    │                                                     │    │
│    │  Forgot password? Contact system administrator     │    │
│    │                                                     │    │
│    └───────────────────────────────────────────────────┘    │
│                                                               │
│              © 2025 Philippine Government                     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Components:**
- Centered card (max-width: 400px)
- Government seal image (150x150px)
- Text fields with outlined variant
- Password field with show/hide toggle
- Primary button (full width)
- Helper text link (secondary color)

**Vuetify Implementation:**
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
```

### 4.2 Employee Dashboard

**Purpose:** Employee's main landing page with quick actions and overview

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│ [☰] Philippine Government HRMS          [🔔 3] [👤 Juan Dela Cruz ▼]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  Dashboard > Employee                                                     │
│                                                                           │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌────────────────┐│
│  │ Vacation Leave       │  │ Sick Leave           │  │ Pending        ││
│  │                      │  │                      │  │ Requests       ││
│  │    15.5 days         │  │    12.0 days         │  │                ││
│  │    ████████░░        │  │    ██████░░░░        │  │      2         ││
│  │                      │  │                      │  │                ││
│  └──────────────────────┘  └──────────────────────┘  └────────────────┘│
│                                                                           │
│  Quick Actions                                                            │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐      │
│  │ [📝]             │  │ [📅]             │  │ [📊]             │      │
│  │ Request          │  │ Request          │  │ View Leave       │      │
│  │ Pass Slip        │  │ Leave            │  │ Calendar         │      │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘      │
│                                                                           │
│  Recent Activity                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ✓ Leave Request #LR-2025-0042 approved        2 hours ago       │   │
│  │ ⏳ Pass Slip #PS-2025-0156 pending approval   Yesterday         │   │
│  │ ✓ Pass Slip #PS-2025-0155 completed           2 days ago        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  Upcoming Leaves                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Jan 15-17, 2025  │  Vacation Leave  │  3 days  │  [View]        │   │
│  │ Feb 10, 2025     │  Sick Leave      │  1 day   │  [View]        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

**Key Features:**
- Leave balance cards with visual progress bars
- Quick action buttons with icons
- Recent activity timeline
- Upcoming leaves table

### 4.3 Pass Slip Request Form

**Purpose:** Submit pass slip request with validation

**Layout:**
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

**Validation Rules:**
- All fields marked with * are required
- Time Out must be before Expected Time In
- Date must be today or future
- Destination and Reason minimum 10 characters

**Vuetify Implementation Snippet:**
```vue
<v-form ref="form" @submit.prevent="submitPassSlip">
  <v-select
    v-model="passSlip.type"
    :items="['Planned', 'Emergency']"
    label="Pass Slip Type"
    variant="outlined"
    :rules="[rules.required]"
  />

  <v-text-field
    v-model="passSlip.date"
    label="Date"
    type="date"
    variant="outlined"
    :rules="[rules.required, rules.futureDate]"
  />

  <v-row>
    <v-col cols="6">
      <v-text-field
        v-model="passSlip.timeOut"
        label="Time Out"
        type="time"
        variant="outlined"
        :rules="[rules.required]"
      />
    </v-col>
    <v-col cols="6">
      <v-text-field
        v-model="passSlip.expectedTimeIn"
        label="Expected Time In"
        type="time"
        variant="outlined"
        :rules="[rules.required, rules.timeAfter]"
      />
    </v-col>
  </v-row>

  <v-text-field
    v-model="passSlip.destination"
    label="Destination"
    variant="outlined"
    :rules="[rules.required, rules.minLength(10)]"
  />

  <v-textarea
    v-model="passSlip.reason"
    label="Reason for Leaving"
    variant="outlined"
    rows="3"
    :rules="[rules.required, rules.minLength(10)]"
  />

  <v-card-actions class="justify-end">
    <v-btn variant="text" @click="cancel">Cancel</v-btn>
    <v-btn color="primary" type="submit" :loading="loading">
      Submit Request
    </v-btn>
  </v-card-actions>
</v-form>
```

### 4.4 Leave Request Form (Multi-Step Wizard)

**Purpose:** Guide user through leave request with balance checking

**Step 1: Leave Type & Dates**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  Request Leave                                    Step 1 of 3            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  ● ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Type & Dates        Details        Review                               │
│                                                                           │
│  Your Leave Balances                                                      │
│  ┌──────────────────────┐  ┌──────────────────────┐                     │
│  │ Vacation Leave       │  │ Sick Leave           │                     │
│  │ 15.5 days available  │  │ 12.0 days available  │                     │
│  └──────────────────────┘  └──────────────────────┘                     │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Leave Type *                                                     │   │
│  │ [Vacation Leave ▼]                                               │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌──────────────────────┐  ┌──────────────────────┐                    │
│  │ Date From *          │  │ Date To *             │                    │
│  │ [01/15/2025] [📅]   │  │ [01/17/2025] [📅]    │                    │
│  └──────────────────────┘  └──────────────────────┘                    │
│                                                                           │
│  [ ] Half Day    ( ) AM  ( ) PM                                          │
│                                                                           │
│  ℹ️ Working Days: 3 days (excluding weekends and holidays)              │
│  ℹ️ Remaining Balance: 12.5 days                                        │
│                                                                           │
│                                              [Cancel]  [Next: Details →] │
└─────────────────────────────────────────────────────────────────────────┘
```

**Step 2: Reason & Attachments**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  Request Leave                                    Step 2 of 3            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Type & Dates        ● Details        Review                             │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Reason (Optional for Vacation Leave)                            │   │
│  │ [_____________________________________________________]         │   │
│  │ [_____________________________________________________]         │   │
│  │ [_____________________________________________________]         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Medical Certificate (Required for Sick Leave)                   │   │
│  │ [Choose File] No file chosen                                    │   │
│  │ Accepted formats: PDF, JPG, PNG (Max 5MB)                       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ⚠️ Conflict Warning                                                     │
│  2 employees in your department are on leave during this period.         │
│  Supervisor approval required.                                           │
│                                                                           │
│                                         [← Back]  [Cancel]  [Next: Review →]│
└─────────────────────────────────────────────────────────────────────────┘
```

**Step 3: Review & Submit**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  Request Leave                                    Step 3 of 3            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Type & Dates        Details        ● Review                             │
│                                                                           │
│  Review Your Leave Request                                               │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Employee:        Juan Dela Cruz (2025-0001)                     │   │
│  │ Department:      Human Resources                                │   │
│  │ Leave Type:      Vacation Leave                                 │   │
│  │ Period:          January 15-17, 2025                            │   │
│  │ Duration:        3 working days                                 │   │
│  │ Current Balance: 15.5 days                                      │   │
│  │ After Approval:  12.5 days                                      │   │
│  │ Reason:          Family vacation                                │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  Approval Workflow                                                        │
│  1. Immediate Supervisor (Maria Santos)                                  │
│  2. HR Administrator (Linda Garcia)                                      │
│                                                                           │
│  ℹ️ You will receive email notification when your request is approved   │
│     or denied.                                                           │
│                                                                           │
│                                    [← Back]  [Cancel]  [Submit Request]  │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.5 Approval Queue (Supervisor)

**Purpose:** Efficient approval interface for supervisors

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│ [☰] Philippine Government HRMS          [🔔 5] [👤 Maria Santos ▼]     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  Approvals > Pending                                                      │
│                                                                           │
│  Filters: [All Types ▼] [All Employees ▼] [Last 30 Days ▼]  [Search...] │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Pass Slip #PS-2025-0156                          ⏳ Pending      │   │
│  │ Juan Dela Cruz • Admin Officer II                                │   │
│  │ Planned • Jan 6, 2025 • 10:00 AM - 12:00 PM                      │   │
│  │ Destination: City Hall • Reason: Document submission             │   │
│  │ Requested: 2 hours ago                                            │   │
│  │                                    [Deny]  [Approve]  [Details]  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Leave Request #LR-2025-0043                      ⏳ Pending      │   │
│  │ Pedro Reyes • HR Assistant                                        │   │
│  │ Sick Leave • Jan 8-9, 2025 • 2 days                              │   │
│  │ Reason: Medical checkup • Attachment: medical-cert.pdf            │   │
│  │ Current Balance: 10.5 days → After: 8.5 days                     │   │
│  │ Requested: 5 hours ago                                            │   │
│  │                                    [Deny]  [Approve]  [Details]  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Pass Slip #PS-2025-0157                          ⏳ Pending      │   │
│  │ Ana Lopez • Records Officer                                       │   │
│  │ Emergency • Jan 6, 2025 • 2:00 PM - 4:00 PM                      │   │
│  │ Destination: Hospital • Reason: Family emergency                 │   │
│  │ Requested: 1 hour ago                                             │   │
│  │                                    [Deny]  [Approve]  [Details]  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  Showing 3 of 5 pending approvals                        [1] 2 > Last   │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

**Key Features:**
- Card-based layout for each pending request
- Quick approve/deny buttons
- Expandable details
- Filters and search
- Pagination for large lists

### 4.6 Certificate Generation Interface

**Purpose:** Generate certificates with template selection and preview

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│ [☰] Philippine Government HRMS          [🔔 1] [👤 Linda Garcia ▼]     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  Certificates > Generate                                                  │
│                                                                           │
│  ┌────────────────────────────────┐  ┌──────────────────────────────┐  │
│  │ Certificate Details            │  │ Preview                      │  │
│  │                                │  │                              │  │
│  │ ┌────────────────────────────┐│  │ ┌──────────────────────────┐│  │
│  │ │ Employee *                 ││  │ │ [Government Seal]        ││  │
│  │ │ [Search employee...      ▼]││  │ │                          ││  │
│  │ └────────────────────────────┘│  │ │ REPUBLIC OF THE          ││  │
│  │                                │  │ │ PHILIPPINES              ││  │
│  │ Selected: Juan Dela Cruz       │  │ │                          ││  │
│  │ Employee ID: 2025-0001         │  │ │ CERTIFICATE OF           ││  │
│  │ Position: Admin Officer II     │  │ │ EMPLOYMENT               ││  │
│  │ Department: Human Resources    │  │ │                          ││  │
│  │                                │  │ │ This is to certify that  ││  │
│  │ ┌────────────────────────────┐│  │ │ Juan Dela Cruz has been  ││  │
│  │ │ Certificate Type *         ││  │ │ employed in this office  ││  │
│  │ │ [Certificate of Employment▼]││  │ │ as Admin Officer II since││  │
│  │ └────────────────────────────┘│  │ │ January 1, 2020...       ││  │
│  │                                │  │ │                          ││  │
│  │ ┌────────────────────────────┐│  │ │ [Signature]              ││  │
│  │ │ Signatory *                ││  │ │ Linda Garcia             ││  │
│  │ │ [Linda Garcia - HR Manager▼]││  │ │ HR Manager               ││  │
│  │ └────────────────────────────┘│  │ │                          ││  │
│  │                                │  │ │ Ref: CERT-2025-0001      ││  │
│  │ [ ] Generate Word version     │  │ └──────────────────────────┘│  │
│  │                                │  │                              │  │
│  │                                │  │ [Refresh Preview]            │  │
│  │ [Cancel]  [Generate PDF]       │  │                              │  │
│  └────────────────────────────────┘  └──────────────────────────────┘  │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

**Key Features:**
- Employee autocomplete search
- Template selection dropdown
- Signatory selection
- Live preview of certificate
- Option to generate Word version
- Download PDF after generation

---

## 5. Design Patterns

### 5.1 Form Design Pattern

**Standard Form Layout:**

```vue
<v-card>
  <v-card-title class="text-h5 bg-primary text-white">
    Form Title
  </v-card-title>

  <v-card-text class="pa-6">
    <v-form ref="form" @submit.prevent="handleSubmit">
      <!-- Read-only Information Section (if applicable) -->
      <div class="mb-6">
        <h3 class="text-h6 mb-4">Section Title</h3>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              label="Field Label"
              variant="outlined"
              readonly
            />
          </v-col>
        </v-row>
      </div>

      <v-divider class="my-6" />

      <!-- Editable Fields Section -->
      <div class="mb-6">
        <h3 class="text-h6 mb-4">Section Title</h3>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.field"
              label="Field Label *"
              variant="outlined"
              :rules="[rules.required]"
              hint="Helper text"
              persistent-hint
            />
          </v-col>
        </v-row>
      </div>
    </v-form>
  </v-card-text>

  <v-divider />

  <v-card-actions class="pa-4 justify-end">
    <v-btn variant="text" @click="cancel">Cancel</v-btn>
    <v-btn color="primary" @click="handleSubmit" :loading="loading">
      Submit
    </v-btn>
  </v-card-actions>
</v-card>
```

**Form Validation Rules:**

```javascript
const rules = {
  required: (value) => !!value || 'This field is required',
  email: (value) => /.+@.+\..+/.test(value) || 'Invalid email address',
  minLength: (min) => (value) =>
    (value && value.length >= min) || `Minimum ${min} characters required`,
  maxLength: (max) => (value) =>
    (value && value.length <= max) || `Maximum ${max} characters allowed`,
  futureDate: (value) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const selected = new Date(value).setHours(0, 0, 0, 0);
    return selected >= today || 'Date must be today or in the future';
  },
  phoneNumber: (value) =>
    /^(\+63|0)[0-9]{10}$/.test(value) || 'Invalid Philippine phone number',
};
```

### 5.2 Data Table Pattern

**Standard Table with Actions:**

```vue
<v-card>
  <v-card-title class="d-flex align-center">
    <span class="text-h5">Table Title</span>
    <v-spacer />
    <v-text-field
      v-model="search"
      prepend-inner-icon="mdi-magnify"
      label="Search"
      variant="outlined"
      density="compact"
      hide-details
      class="mr-4"
      style="max-width: 300px"
    />
    <v-btn color="primary" prepend-icon="mdi-plus">
      Add New
    </v-btn>
  </v-card-title>

  <v-data-table
    :headers="headers"
    :items="items"
    :search="search"
    :loading="loading"
    :items-per-page="10"
    :items-per-page-options="[10, 25, 50, 100]"
  >
    <!-- Status Column with Chip -->
    <template v-slot:item.status="{ item }">
      <v-chip
        :color="getStatusColor(item.status)"
        size="small"
        variant="flat"
      >
        {{ item.status }}
      </v-chip>
    </template>

    <!-- Actions Column -->
    <template v-slot:item.actions="{ item }">
      <v-btn
        icon="mdi-eye"
        size="small"
        variant="text"
        @click="viewItem(item)"
      />
      <v-btn
        icon="mdi-pencil"
        size="small"
        variant="text"
        @click="editItem(item)"
      />
      <v-btn
        icon="mdi-delete"
        size="small"
        variant="text"
        color="error"
        @click="deleteItem(item)"
      />
    </template>

    <!-- Empty State -->
    <template v-slot:no-data>
      <div class="text-center pa-8">
        <v-icon size="64" color="grey-lighten-1">mdi-inbox</v-icon>
        <p class="text-h6 mt-4">No data available</p>
        <p class="text-body-2 text-grey">Add your first item to get started</p>
      </div>
    </template>
  </v-data-table>
</v-card>
```

**Status Color Helper:**

```javascript
function getStatusColor(status) {
  const colors = {
    'Pending': 'warning',
    'Approved': 'success',
    'Denied': 'error',
    'Cancelled': 'grey',
    'Completed': 'info',
  };
  return colors[status] || 'grey';
}
```

### 5.3 Confirmation Dialog Pattern

**Delete Confirmation:**

```vue
<v-dialog v-model="deleteDialog" max-width="500">
  <v-card>
    <v-card-title class="text-h5 d-flex align-center">
      <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
      Confirm Deletion
    </v-card-title>

    <v-card-text class="pt-4">
      <p class="text-body-1">
        Are you sure you want to delete this item? This action cannot be undone.
      </p>
      <v-alert type="warning" variant="tonal" class="mt-4">
        <strong>{{ itemToDelete.name }}</strong> will be permanently deleted.
      </v-alert>
    </v-card-text>

    <v-card-actions class="pa-4">
      <v-spacer />
      <v-btn variant="text" @click="deleteDialog = false">Cancel</v-btn>
      <v-btn color="error" @click="confirmDelete" :loading="deleting">
        Delete
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
```

### 5.4 Notification Pattern

**Toast Notifications (Snackbar):**

```vue
<v-snackbar
  v-model="snackbar.show"
  :color="snackbar.color"
  :timeout="snackbar.timeout"
  location="top right"
>
  <div class="d-flex align-center">
    <v-icon class="mr-2">{{ snackbar.icon }}</v-icon>
    <span>{{ snackbar.message }}</span>
  </div>
  <template v-slot:actions>
    <v-btn variant="text" @click="snackbar.show = false">Close</v-btn>
  </template>
</v-snackbar>
```

**Notification Helper:**

```javascript
function showNotification(type, message) {
  const config = {
    success: { color: 'success', icon: 'mdi-check-circle', timeout: 3000 },
    error: { color: 'error', icon: 'mdi-alert-circle', timeout: 5000 },
    warning: { color: 'warning', icon: 'mdi-alert', timeout: 4000 },
    info: { color: 'info', icon: 'mdi-information', timeout: 3000 },
  };

  snackbar.value = {
    show: true,
    message,
    ...config[type],
  };
}

// Usage
showNotification('success', 'Leave request submitted successfully');
showNotification('error', 'Failed to submit request. Please try again.');
```

### 5.5 Loading State Pattern

**Full Page Loading:**

```vue
<v-overlay v-model="loading" class="align-center justify-center">
  <v-progress-circular
    indeterminate
    size="64"
    color="primary"
  />
  <p class="text-h6 mt-4">Loading...</p>
</v-overlay>
```

**Skeleton Loaders:**

```vue
<v-card>
  <v-skeleton-loader
    v-if="loading"
    type="article, actions"
  />
  <div v-else>
    <!-- Actual content -->
  </div>
</v-card>
```

### 5.6 Empty State Pattern

**No Data State:**

```vue
<div class="text-center pa-12">
  <v-icon size="96" color="grey-lighten-2">mdi-inbox-outline</v-icon>
  <h3 class="text-h5 mt-4 mb-2">No Items Found</h3>
  <p class="text-body-1 text-grey mb-6">
    You haven't created any items yet. Get started by adding your first item.
  </p>
  <v-btn color="primary" prepend-icon="mdi-plus" size="large">
    Add First Item
  </v-btn>
</div>
```

**Search No Results:**

```vue
<div class="text-center pa-12">
  <v-icon size="96" color="grey-lighten-2">mdi-magnify</v-icon>
  <h3 class="text-h5 mt-4 mb-2">No Results Found</h3>
  <p class="text-body-1 text-grey mb-6">
    Try adjusting your search or filters to find what you're looking for.
  </p>
  <v-btn variant="text" @click="clearSearch">Clear Search</v-btn>
</div>
```

### 5.7 Approval Workflow Pattern

**Approval Card Component:**

```vue
<v-card class="mb-4" elevation="2">
  <v-card-text>
    <div class="d-flex justify-space-between align-start mb-2">
      <div>
        <h3 class="text-h6">{{ request.referenceNo }}</h3>
        <p class="text-body-2 text-grey">
          {{ request.employeeName }} • {{ request.position }}
        </p>
      </div>
      <v-chip :color="getStatusColor(request.status)" size="small">
        {{ request.status }}
      </v-chip>
    </div>

    <v-divider class="my-3" />

    <div class="mb-3">
      <p class="text-body-2">
        <strong>{{ request.type }}</strong> • {{ request.dateRange }}
      </p>
      <p class="text-body-2 mt-1">{{ request.reason }}</p>
    </div>

    <div class="text-caption text-grey">
      Requested {{ request.timeAgo }}
    </div>
  </v-card-text>

  <v-card-actions class="pa-4 pt-0">
    <v-spacer />
    <v-btn variant="text" @click="viewDetails(request)">Details</v-btn>
    <v-btn variant="text" color="error" @click="denyRequest(request)">
      Deny
    </v-btn>
    <v-btn color="success" @click="approveRequest(request)">
      Approve
    </v-btn>
  </v-card-actions>
</v-card>
```

---

## 6. Accessibility Implementation

### 6.1 WCAG AA Compliance Checklist

**Color Contrast:**
- ✅ Text contrast ratio minimum 4.5:1 for normal text
- ✅ Text contrast ratio minimum 3:1 for large text (18pt+)
- ✅ UI component contrast ratio minimum 3:1
- ✅ Status indicators don't rely on color alone (use icons + text)

**Keyboard Navigation:**
- ✅ All interactive elements accessible via Tab key
- ✅ Logical tab order (top to bottom, left to right)
- ✅ Visible focus indicators on all focusable elements
- ✅ Skip navigation link for keyboard users
- ✅ Escape key closes modals and dropdowns

**Screen Reader Support:**
- ✅ Semantic HTML elements (header, nav, main, footer)
- ✅ ARIA labels for icon-only buttons
- ✅ ARIA live regions for dynamic content updates
- ✅ Form labels properly associated with inputs
- ✅ Error messages announced to screen readers

**Visual Design:**
- ✅ Text resizable up to 200% without loss of functionality
- ✅ Minimum touch target size 44x44px
- ✅ Clear visual hierarchy with headings
- ✅ Sufficient spacing between interactive elements

### 6.2 Focus Management

**Focus Indicator Styles:**

```css
/* Global focus styles */
*:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Button focus */
.v-btn:focus-visible {
  box-shadow: 0 0 0 3px rgba(0, 63, 135, 0.3);
}

/* Input focus */
.v-text-field:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0, 63, 135, 0.2);
}
```

**Focus Trap in Modals:**

```javascript
// Trap focus within modal dialog
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
}
```

### 6.3 ARIA Labels and Roles

**Icon-Only Buttons:**

```vue
<v-btn
  icon="mdi-pencil"
  aria-label="Edit employee"
  @click="editEmployee"
/>

<v-btn
  icon="mdi-delete"
  aria-label="Delete employee"
  @click="deleteEmployee"
/>
```

**Status Indicators:**

```vue
<v-chip
  :color="getStatusColor(status)"
  :aria-label="`Status: ${status}`"
>
  <v-icon start>{{ getStatusIcon(status) }}</v-icon>
  {{ status }}
</v-chip>
```

**Live Regions for Dynamic Updates:**

```vue
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  class="sr-only"
>
  {{ statusMessage }}
</div>

<!-- Screen reader only class -->
<style>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
```

### 6.4 Form Accessibility

**Proper Label Association:**

```vue
<v-text-field
  id="employee-name"
  v-model="employeeName"
  label="Employee Name"
  :rules="[rules.required]"
  :error-messages="errors.employeeName"
  aria-required="true"
  aria-describedby="employee-name-hint"
/>
<span id="employee-name-hint" class="text-caption">
  Enter the employee's full name
</span>
```

**Error Announcement:**

```vue
<v-form @submit.prevent="handleSubmit">
  <!-- Form fields -->

  <div
    v-if="formErrors.length"
    role="alert"
    aria-live="assertive"
    class="v-alert v-alert--error mb-4"
  >
    <p class="font-weight-bold">Please correct the following errors:</p>
    <ul>
      <li v-for="error in formErrors" :key="error">{{ error }}</li>
    </ul>
  </div>
</v-form>
```

### 6.5 Keyboard Shortcuts

**Global Shortcuts:**

```javascript
// Keyboard shortcut handler
document.addEventListener('keydown', (e) => {
  // Alt + D: Go to Dashboard
  if (e.altKey && e.key === 'd') {
    e.preventDefault();
    router.push('/dashboard');
  }

  // Alt + P: New Pass Slip
  if (e.altKey && e.key === 'p') {
    e.preventDefault();
    router.push('/pass-slips/new');
  }

  // Alt + L: New Leave Request
  if (e.altKey && e.key === 'l') {
    e.preventDefault();
    router.push('/leave/new');
  }

  // Escape: Close modal/drawer
  if (e.key === 'Escape') {
    closeModal();
  }
});
```

**Shortcut Help Dialog:**

```vue
<v-dialog v-model="showShortcuts" max-width="600">
  <v-card>
    <v-card-title>Keyboard Shortcuts</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item>
          <template v-slot:prepend>
            <v-chip size="small">Alt + D</v-chip>
          </template>
          <v-list-item-title>Go to Dashboard</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <template v-slot:prepend>
            <v-chip size="small">Alt + P</v-chip>
          </template>
          <v-list-item-title>New Pass Slip</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <template v-slot:prepend>
            <v-chip size="small">Alt + L</v-chip>
          </template>
          <v-list-item-title>New Leave Request</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <template v-slot:prepend>
            <v-chip size="small">Esc</v-chip>
          </template>
          <v-list-item-title>Close Modal</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</v-dialog>
```

---

## 7. Responsive Design Guidelines

### 7.1 Breakpoints

**Vuetify Breakpoints (Mobile-First):**

```javascript
// Breakpoint values
xs: 0px      // Extra small (phones, portrait)
sm: 600px    // Small (phones, landscape)
md: 960px    // Medium (tablets, portrait)
lg: 1280px   // Large (tablets, landscape / desktops)
xl: 1920px   // Extra large (large desktops)
```

**Usage in Components:**

```vue
<v-row>
  <v-col cols="12" sm="6" md="4" lg="3">
    <!-- Responsive column -->
  </v-col>
</v-row>

<!-- Conditional rendering based on breakpoint -->
<v-navigation-drawer
  v-model="drawer"
  :permanent="$vuetify.display.mdAndUp"
  :temporary="$vuetify.display.smAndDown"
/>
```

### 7.2 Desktop-First Design Strategy

**Primary Target: Desktop (1280px - 1920px)**

The HRMS is primarily used on desktop computers in government offices. Design for desktop first, then adapt for tablets and mobile.

**Desktop Layout (1280px+):**
- Sidebar navigation always visible (240px width)
- Content area: 1040px - 1680px
- Multi-column forms (2-3 columns)
- Data tables with all columns visible
- Dashboard with 3-4 widget columns

**Tablet Layout (768px - 1279px):**
- Collapsible sidebar navigation
- Content area: full width minus padding
- 2-column forms
- Data tables with horizontal scroll
- Dashboard with 2 widget columns

**Mobile Layout (< 768px):**
- Bottom navigation or hamburger menu
- Single-column forms
- Simplified data tables (card view)
- Dashboard with 1 widget column
- Larger touch targets (minimum 44x44px)

### 7.3 Responsive Navigation

**Desktop Navigation (Permanent Drawer):**

```vue
<v-navigation-drawer
  v-model="drawer"
  :permanent="$vuetify.display.mdAndUp"
  :rail="rail"
  width="240"
>
  <v-list density="compact" nav>
    <v-list-item
      prepend-icon="mdi-view-dashboard"
      title="Dashboard"
      to="/dashboard"
    />
    <v-list-item
      prepend-icon="mdi-account-multiple"
      title="Employees"
      to="/employees"
    />
    <!-- More items -->
  </v-list>
</v-navigation-drawer>
```

**Mobile Navigation (Bottom Navigation):**

```vue
<v-bottom-navigation
  v-if="$vuetify.display.smAndDown"
  v-model="activeTab"
  grow
>
  <v-btn value="dashboard">
    <v-icon>mdi-view-dashboard</v-icon>
    <span>Dashboard</span>
  </v-btn>
  <v-btn value="pass-slips">
    <v-icon>mdi-file-document</v-icon>
    <span>Pass Slips</span>
  </v-btn>
  <v-btn value="leave">
    <v-icon>mdi-calendar</v-icon>
    <span>Leave</span>
  </v-btn>
  <v-btn value="more">
    <v-icon>mdi-menu</v-icon>
    <span>More</span>
  </v-btn>
</v-bottom-navigation>
```

### 7.4 Responsive Data Tables

**Desktop: Full Table**

```vue
<v-data-table
  :headers="headers"
  :items="items"
  class="d-none d-md-block"
/>
```

**Mobile: Card View**

```vue
<div class="d-md-none">
  <v-card
    v-for="item in items"
    :key="item.id"
    class="mb-4"
  >
    <v-card-text>
      <div class="d-flex justify-space-between mb-2">
        <strong>{{ item.name }}</strong>
        <v-chip :color="getStatusColor(item.status)" size="small">
          {{ item.status }}
        </v-chip>
      </div>
      <p class="text-body-2 mb-1">{{ item.position }}</p>
      <p class="text-caption text-grey">{{ item.department }}</p>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn size="small" @click="viewItem(item)">View</v-btn>
    </v-card-actions>
  </v-card>
</div>
```

### 7.5 Responsive Forms

**Multi-Column on Desktop, Single-Column on Mobile:**

```vue
<v-row>
  <v-col cols="12" md="6">
    <v-text-field label="First Name" />
  </v-col>
  <v-col cols="12" md="6">
    <v-text-field label="Last Name" />
  </v-col>
  <v-col cols="12" md="4">
    <v-text-field label="Employee ID" />
  </v-col>
  <v-col cols="12" md="4">
    <v-select label="Department" />
  </v-col>
  <v-col cols="12" md="4">
    <v-select label="Position" />
  </v-col>
</v-row>
```

### 7.6 Touch-Friendly Design

**Minimum Touch Target Size:**

```css
/* Ensure all interactive elements are at least 44x44px */
.v-btn {
  min-height: 44px;
  min-width: 44px;
}

.v-list-item {
  min-height: 48px;
}

.v-checkbox,
.v-radio {
  min-height: 44px;
  min-width: 44px;
}
```

**Spacing for Touch:**

```css
/* Increase spacing between interactive elements on touch devices */
@media (hover: none) {
  .v-btn + .v-btn {
    margin-left: 12px;
  }

  .v-list-item {
    padding: 12px 16px;
  }
}
```

---

## 8. Philippine Government Branding

### 8.1 Government Seal Usage

**Official Seal Placement:**
- Login page: Centered, 150x150px
- Header: Left side, 40x40px
- Certificates: Top center, 100x100px
- Print documents: Top left, 80x80px

**Seal File Requirements:**
- Format: PNG with transparent background
- Resolution: Minimum 300 DPI for print
- Color: Full color (blue, red, yellow, white)
- Location: `/public/assets/government-seal.png`

### 8.2 Office Branding Customization

**Configurable Branding Elements:**

```javascript
// System configuration (stored in database)
const systemConfig = {
  office_name: 'Department of Human Resources',
  office_address: '123 Government Street, Manila, Philippines',
  office_contact: '+63 2 1234 5678',
  office_email: 'hr@gov.ph',
  office_logo: '/storage/branding/office-logo.png', // Optional
  letterhead_template: '/storage/branding/letterhead.png', // Optional
};
```

**Header with Office Branding:**

```vue
<v-app-bar color="primary" dark elevation="2">
  <v-img
    src="/assets/government-seal.png"
    width="40"
    height="40"
    class="ml-2"
  />
  <v-toolbar-title class="ml-4">
    <div class="text-h6">{{ systemConfig.office_name }}</div>
    <div class="text-caption">Human Resource Management System</div>
  </v-toolbar-title>
  <!-- Rest of app bar -->
</v-app-bar>
```

### 8.3 Certificate Letterhead

**Standard Government Letterhead:**

```html
<div class="letterhead" style="text-align: center; padding: 20px;">
  <img src="/assets/government-seal.png" width="100" height="100" />
  <h1 style="color: #003f87; font-size: 18px; margin: 10px 0;">
    REPUBLIC OF THE PHILIPPINES
  </h1>
  <h2 style="color: #003f87; font-size: 16px; margin: 5px 0;">
    {{ systemConfig.office_name }}
  </h2>
  <p style="font-size: 12px; color: #6c757d;">
    {{ systemConfig.office_address }}
  </p>
  <p style="font-size: 12px; color: #6c757d;">
    Tel: {{ systemConfig.office_contact }} | Email: {{ systemConfig.office_email }}
  </p>
</div>
```

### 8.4 Footer Branding

**Standard Footer:**

```vue
<v-footer color="grey-lighten-4" class="text-center pa-4">
  <v-row>
    <v-col cols="12">
      <p class="text-body-2 text-grey-darken-1">
        © {{ new Date().getFullYear() }} {{ systemConfig.office_name }}
      </p>
      <p class="text-caption text-grey">
        Philippine Government Human Resource Management System
      </p>
      <p class="text-caption text-grey">
        Powered by Open Source Technology
      </p>
    </v-col>
  </v-row>
</v-footer>
```

---

## 9. Implementation Guide

### 9.1 Project Setup

**Step 1: Install Vuetify**

```bash
cd frontend
npm install vuetify@^3.4.0
npm install @mdi/font
```

**Step 2: Configure Vuetify (src/plugins/vuetify.js)**

```javascript
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'govPhTheme',
    themes: {
      govPhTheme: {
        dark: false,
        colors: {
          primary: '#003f87',
          secondary: '#6c757d',
          accent: '#fcd116',
          success: '#28a745',
          warning: '#ffc107',
          error: '#dc3545',
          info: '#17a2b8',
          background: '#f8f9fa',
          surface: '#ffffff',
        }
      }
    }
  },
  defaults: {
    VBtn: {
      color: 'primary',
      variant: 'elevated',
      rounded: 'md',
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
    },
    VTextarea: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
    },
    VCard: {
      elevation: 2,
      rounded: 'lg',
    },
    VDataTable: {
      density: 'comfortable',
    }
  }
})
```

**Step 3: Register Vuetify in main.js**

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import vuetify from './plugins/vuetify'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(vuetify)
app.mount('#app')
```

### 9.2 Global Styles

**Create src/styles/global.css:**

```css
/* Import Open Sans font */
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap');

/* CSS Variables */
:root {
  /* Colors */
  --color-primary: #003f87;
  --color-primary-light: #1a5fa8;
  --color-primary-dark: #002a5c;
  --color-secondary: #6c757d;
  --color-accent: #fcd116;
  --color-success: #28a745;
  --color-warning: #ffc107;
  --color-error: #dc3545;
  --color-info: #17a2b8;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;

  /* Typography */
  --font-family-primary: 'Open Sans', 'Segoe UI', Tahoma, sans-serif;
  --font-size-base: 1rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

  /* Transitions */
  --transition-base: 250ms ease-in-out;
}

/* Global styles */
* {
  font-family: var(--font-family-primary);
}

/* Focus styles for accessibility */
*:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Screen reader only class */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }

  .v-navigation-drawer,
  .v-app-bar,
  .v-footer,
  .v-btn {
    display: none !important;
  }
}
```

**Import in main.js:**

```javascript
import './styles/global.css'
```

### 9.3 Reusable Composables

**Create src/composables/useNotification.js:**

```javascript
import { ref } from 'vue'

const snackbar = ref({
  show: false,
  message: '',
  color: 'info',
  icon: 'mdi-information',
  timeout: 3000,
})

export function useNotification() {
  function showNotification(type, message) {
    const config = {
      success: { color: 'success', icon: 'mdi-check-circle', timeout: 3000 },
      error: { color: 'error', icon: 'mdi-alert-circle', timeout: 5000 },
      warning: { color: 'warning', icon: 'mdi-alert', timeout: 4000 },
      info: { color: 'info', icon: 'mdi-information', timeout: 3000 },
    }

    snackbar.value = {
      show: true,
      message,
      ...config[type],
    }
  }

  return {
    snackbar,
    showNotification,
  }
}
```

**Create src/composables/useValidation.js:**

```javascript
export function useValidation() {
  const rules = {
    required: (value) => !!value || 'This field is required',

    email: (value) => {
      const pattern = /.+@.+\..+/
      return pattern.test(value) || 'Invalid email address'
    },

    minLength: (min) => (value) => {
      return (value && value.length >= min) || `Minimum ${min} characters required`
    },

    maxLength: (max) => (value) => {
      return (value && value.length <= max) || `Maximum ${max} characters allowed`
    },

    futureDate: (value) => {
      const today = new Date().setHours(0, 0, 0, 0)
      const selected = new Date(value).setHours(0, 0, 0, 0)
      return selected >= today || 'Date must be today or in the future'
    },

    phoneNumber: (value) => {
      const pattern = /^(\+63|0)[0-9]{10}$/
      return pattern.test(value) || 'Invalid Philippine phone number'
    },
  }

  return { rules }
}
```

### 9.4 Component Development Workflow

**Step 1: Create Component Structure**

```
src/components/
├── layout/
│   ├── AppBar.vue
│   ├── NavigationDrawer.vue
│   └── Footer.vue
├── common/
│   ├── StatusChip.vue
│   ├── ConfirmDialog.vue
│   └── EmptyState.vue
└── features/
    ├── pass-slips/
    │   ├── PassSlipForm.vue
    │   ├── PassSlipList.vue
    │   └── PassSlipCard.vue
    ├── leave/
    │   ├── LeaveRequestForm.vue
    │   ├── LeaveBalanceCard.vue
    │   └── LeaveCalendar.vue
    └── certificates/
        ├── CertificateGenerator.vue
        └── CertificatePreview.vue
```

**Step 2: Follow Component Template**

```vue
<template>
  <v-card>
    <!-- Component markup -->
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNotification } from '@/composables/useNotification'
import { useValidation } from '@/composables/useValidation'

// Props
const props = defineProps({
  // Define props
})

// Emits
const emit = defineEmits(['submit', 'cancel'])

// Composables
const { showNotification } = useNotification()
const { rules } = useValidation()

// State
const loading = ref(false)
const form = ref({})

// Computed
const isValid = computed(() => {
  // Validation logic
})

// Methods
async function handleSubmit() {
  try {
    loading.value = true
    // Submit logic
    showNotification('success', 'Operation successful')
    emit('submit', form.value)
  } catch (error) {
    showNotification('error', error.message)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  // Initialization
})
</script>

<style scoped>
/* Component-specific styles */
</style>
```

### 9.5 Testing Checklist

**Before Deployment:**

- [ ] All screens tested on desktop (1920px, 1280px)
- [ ] All screens tested on tablet (768px)
- [ ] All screens tested on mobile (375px)
- [ ] Keyboard navigation works on all forms
- [ ] Focus indicators visible on all interactive elements
- [ ] Screen reader announces all important information
- [ ] Color contrast meets WCAG AA standards
- [ ] All forms validate correctly
- [ ] Error messages are clear and helpful
- [ ] Loading states display correctly
- [ ] Empty states display correctly
- [ ] Success/error notifications work
- [ ] Print styles work for certificates and reports
- [ ] All icons have proper aria-labels
- [ ] All images have alt text

---

## 10. Conclusion

This UX Specification provides comprehensive design guidance for implementing the Philippine Government HRMS interface. The specification prioritizes:

✅ **Simplicity** - Clear, intuitive interfaces for users with varying computer literacy
✅ **Accessibility** - WCAG AA compliance with keyboard navigation and screen reader support
✅ **Consistency** - Unified design system with reusable patterns
✅ **Efficiency** - Vuetify component library for rapid development
✅ **Government Context** - Professional appearance with Philippine government branding
✅ **Responsive Design** - Desktop-first with tablet and mobile adaptations

**Document Status:** ✅ **COMPLETE AND READY FOR DEVELOPMENT**

**Next Steps:**
1. Set up Vuetify per Implementation Guide (Section 9.1)
2. Create global styles and composables (Sections 9.2-9.3)
3. Build layout components (AppBar, NavigationDrawer, Footer)
4. Implement screens following wireframes (Section 4)
5. Apply design patterns consistently (Section 5)
6. Test accessibility compliance (Section 6.1)

**Development Team Handoff:**
- Designers: Use wireframes and design system for mockups
- Frontend Developers: Follow component patterns and Vuetify configuration
- QA Team: Use accessibility checklist and testing checklist

---

*End of UX Specification Document*

