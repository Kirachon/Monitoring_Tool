# Design System Specification
## Philippine Government HRMS Application

**Version:** 1.0  
**Date:** January 7, 2025  
**Status:** Ready for Implementation

---

## Table of Contents

1. [Introduction](#introduction)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components](#components)
6. [Patterns](#patterns)
7. [Accessibility](#accessibility)
8. [Code Examples](#code-examples)

---

## Introduction

### Purpose
This design system provides a comprehensive set of guidelines, components, and patterns for building consistent, accessible, and professional user interfaces for the Philippine Government HRMS application.

### Principles

**1. Consistency**
- Use standardized components and patterns across all views
- Maintain consistent spacing, typography, and colors
- Follow established interaction patterns

**2. Accessibility**
- Meet WCAG 2.1 AA standards
- Ensure keyboard navigation works everywhere
- Provide clear focus indicators and ARIA labels

**3. Clarity**
- Use clear visual hierarchy
- Provide helpful feedback and error messages
- Make actions and states obvious

**4. Efficiency**
- Optimize for common workflows
- Reduce cognitive load
- Minimize clicks and navigation

**5. Professionalism**
- Reflect government standards
- Use appropriate formality
- Maintain visual polish

---

## Color System

### Primary Colors

**Philippine Blue (Primary)**
```css
--color-primary-base: #0038A8;
--color-primary-lighten-1: #1E4DB7;
--color-primary-lighten-2: #4A6BC5;
--color-primary-lighten-3: #7689D3;
--color-primary-lighten-4: #A2A7E1;
--color-primary-darken-1: #002D8F;
--color-primary-darken-2: #002276;
--color-primary-darken-3: #00175D;
--color-primary-darken-4: #000C44;
```

**Usage:**
- Primary actions (buttons, links)
- App bar and navigation
- Active states
- Focus indicators

**Philippine Red (Secondary)**
```css
--color-secondary-base: #CE1126;
--color-secondary-lighten-1: #D63A4D;
--color-secondary-lighten-2: #DE6374;
--color-secondary-lighten-3: #E68C9B;
--color-secondary-lighten-4: #EEB5C2;
--color-secondary-darken-1: #B50E20;
--color-secondary-darken-2: #9C0B1A;
--color-secondary-darken-3: #830814;
--color-secondary-darken-4: #6A050E;
```

**Usage:**
- Destructive actions (delete, cancel)
- Error states
- Important alerts
- Denied status

**Philippine Yellow (Accent)**
```css
--color-accent-base: #FCD116;
--color-accent-lighten-1: #FDD745;
--color-accent-lighten-2: #FDDD74;
--color-accent-lighten-3: #FEE3A3;
--color-accent-lighten-4: #FEE9D2;
--color-accent-darken-1: #E3BC13;
--color-accent-darken-2: #CAA710;
--color-accent-darken-3: #B1920D;
--color-accent-darken-4: #987D0A;
```

**Usage:**
- Highlights and emphasis
- Warning states
- Pending status
- Decorative elements (sparingly)

### Semantic Colors

**Status Colors**
```css
--color-status-pending: #F57C00;    /* Orange */
--color-status-approved: #388E3C;   /* Green */
--color-status-denied: #D32F2F;     /* Red */
--color-status-cancelled: #757575;  /* Grey */
--color-status-completed: #1976D2;  /* Blue */
```

**Feedback Colors**
```css
--color-success: #388E3C;
--color-error: #D32F2F;
--color-warning: #F57C00;
--color-info: #1976D2;
```

**Neutral Colors**
```css
--color-neutral-50: #FAFAFA;
--color-neutral-100: #F5F5F5;
--color-neutral-200: #EEEEEE;
--color-neutral-300: #E0E0E0;
--color-neutral-400: #BDBDBD;
--color-neutral-500: #9E9E9E;
--color-neutral-600: #757575;
--color-neutral-700: #616161;
--color-neutral-800: #424242;
--color-neutral-900: #212121;
```

### Color Usage Guidelines

**Text Colors:**
- Primary text: `neutral-900` (#212121)
- Secondary text: `neutral-700` (#616161)
- Disabled text: `neutral-500` (#9E9E9E)
- Placeholder text: `neutral-400` (#BDBDBD)

**Background Colors:**
- Page background: `neutral-100` (#F5F5F5)
- Card background: `neutral-50` (#FAFAFA) or white
- Hover background: `neutral-50` (#FAFAFA)
- Selected background: `primary-lighten-4` (#A2A7E1)

**Border Colors:**
- Default border: `neutral-300` (#E0E0E0)
- Hover border: `neutral-400` (#BDBDBD)
- Focus border: `primary-base` (#0038A8)
- Error border: `error` (#D32F2F)

### Color Usage Rules (CRITICAL)

**⚠️ To prevent "flag-colored clutter" and maintain professionalism, follow these strict rules:**

**Primary Blue (#0038A8) - RESERVED FOR:**
- ✅ Primary action buttons (Submit, Save, Add, Create)
- ✅ Navigation elements (active menu items, links)
- ✅ Interactive elements (checkboxes, radio buttons when selected)
- ✅ Focus indicators
- ✅ App bar and navigation drawer
- ❌ NOT for: Decorative elements, backgrounds, large color blocks

**Secondary Red (#CE1126) - RESERVED FOR:**
- ✅ Destructive actions ONLY (Delete, Remove, Reject, Cancel)
- ✅ Critical error messages and alerts
- ✅ Denied/Rejected status indicators
- ❌ NOT for: Regular buttons, decorative elements, warnings

**Accent Yellow (#FCD116) - USE SPARINGLY:**
- ✅ Warning messages and alerts
- ✅ Pending status indicators
- ✅ Highlights and emphasis (minimal use)
- ❌ NOT for: Buttons, large backgrounds, decorative elements
- ⚠️ Use with caution due to contrast issues

**Neutral Colors - PRIMARY CHOICE:**
- ✅ Use neutral colors for most UI elements
- ✅ Backgrounds, borders, text, cards
- ✅ Secondary buttons (outlined or text variants)
- ✅ Disabled states

**Semantic Colors - SPECIFIC PURPOSES:**
- ✅ Success: Green (#388E3C) for success messages, approved status
- ✅ Info: Blue (#1976D2) for informational messages, completed status
- ✅ Warning: Orange (#F57C00) for warnings, pending status
- ✅ Error: Red (#D32F2F) for errors, denied status

**Examples:**

**✅ CORRECT Usage:**
```vue
<!-- Primary button uses blue -->
<v-btn color="primary">Submit</v-btn>

<!-- Delete button uses red -->
<v-btn color="error">Delete</v-btn>

<!-- Secondary button uses neutral (outlined) -->
<v-btn color="primary" variant="outlined">Cancel</v-btn>

<!-- Status chip uses semantic color -->
<v-chip color="success">Approved</v-chip>
```

**❌ INCORRECT Usage:**
```vue
<!-- Don't use all three flag colors together -->
<v-card color="primary">
  <v-btn color="error">Action</v-btn>
  <v-chip color="accent">Status</v-chip>
</v-card>

<!-- Don't use red for non-destructive actions -->
<v-btn color="error">Save</v-btn>

<!-- Don't use yellow for buttons (contrast issues) -->
<v-btn color="accent">Submit</v-btn>
```

---

### Dark Mode Color Tokens (Future Enhancement)

**Note:** These tokens are defined for future dark mode implementation but not currently applied in the UI.

**Dark Mode Primary Colors:**
```css
--color-primary-dark-base: #4A6BC5;
--color-primary-dark-lighten-1: #7689D3;
--color-primary-dark-lighten-2: #A2A7E1;
--color-primary-dark-darken-1: #1E4DB7;
--color-primary-dark-darken-2: #0038A8;
```

**Dark Mode Neutral Colors:**
```css
--color-neutral-dark-50: #1E1E1E;
--color-neutral-dark-100: #2D2D2D;
--color-neutral-dark-200: #3D3D3D;
--color-neutral-dark-300: #4D4D4D;
--color-neutral-dark-400: #6D6D6D;
--color-neutral-dark-500: #8D8D8D;
--color-neutral-dark-600: #ADADAD;
--color-neutral-dark-700: #CDCDCD;
--color-neutral-dark-800: #E0E0E0;
--color-neutral-dark-900: #F5F5F5;
```

**Dark Mode Background Colors:**
```css
--color-background-dark: #121212;
--color-surface-dark: #1E1E1E;
--color-surface-variant-dark: #2D2D2D;
```

**Implementation Notes:**
- Dark mode will use `data-theme="dark"` attribute
- CSS custom properties will switch based on theme
- All colors must maintain WCAG AA contrast in dark mode
- Marked as P3 priority for future implementation

---

### Illustration & Icon Guidelines

**Icon Library:**
- **Primary:** Material Design Icons (@mdi/font)
- **Version:** 7.4.47
- **Prefix:** `mdi-`

**Icon Sizing Standards:**
```css
--icon-size-xs: 16px;   /* Small inline icons */
--icon-size-sm: 20px;   /* Form field icons */
--icon-size-md: 24px;   /* Default size */
--icon-size-lg: 32px;   /* Page headers, emphasis */
--icon-size-xl: 48px;   /* Empty states, large displays */
--icon-size-2xl: 64px;  /* Hero sections, splash screens */
```

**Icon Usage:**

**Small Icons (16px):**
- Inline with text
- Table cell indicators
- Chip icons

**Medium Icons (24px):**
- Form field prepend/append
- Button icons
- Navigation menu items
- Default size for most use cases

**Large Icons (32px):**
- Page header icons
- Card header icons
- Emphasis icons

**Extra Large Icons (48px+):**
- Empty state illustrations
- Error state illustrations
- Onboarding screens
- Hero sections

**Icon Colors:**
- Default: `neutral-700` (#616161)
- Active/Selected: `primary-base` (#0038A8)
- Disabled: `neutral-400` (#BDBDBD)
- Error: `error` (#D32F2F)
- Success: `success` (#388E3C)
- Warning: `warning` (#F57C00)

**Illustration Style:**

**Government-Branded Style: Outline/Line Art**
- **Style:** Simple outline illustrations with minimal detail
- **Color:** Monochromatic or limited color palette (primary blue + neutral)
- **Stroke:** 2px stroke weight
- **Complexity:** Low to medium complexity
- **Tone:** Professional, approachable, clear

**When to Use Illustrations:**
- Empty states (no data, no results)
- Error states (404, 500, network error)
- Onboarding screens
- Success confirmations (large actions)
- Help/tutorial sections

**When to Use Icons:**
- Navigation menu items
- Button actions
- Form field indicators
- Status indicators
- Small UI elements

**Empty State Illustrations:**
```vue
<!-- Example: No data empty state -->
<EmptyState
  icon="mdi-inbox-outline"
  title="No records found"
  description="There are no records to display"
/>

<!-- Future: Custom illustration -->
<EmptyState
  illustration="/illustrations/empty-inbox.svg"
  title="No records found"
  description="There are no records to display"
/>
```

**Error State Illustrations:**
```vue
<!-- Example: Network error -->
<EmptyState
  icon="mdi-wifi-off"
  title="Connection lost"
  description="Please check your internet connection"
  action-text="Retry"
/>
```

**Illustration Asset Library (Future):**
- Empty inbox
- No search results
- Network error
- 404 not found
- Success confirmation
- Onboarding welcome
- Help/tutorial

---

## Typography

### Font Family
```css
--font-family-base: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-family-heading: 'Roboto', sans-serif;
--font-family-mono: 'Roboto Mono', 'Courier New', monospace;
```

### Type Scale

**Headings**
```css
/* H1 - Page Titles */
--text-h1-size: 2.5rem;        /* 40px */
--text-h1-weight: 700;
--text-h1-line-height: 1.2;
--text-h1-letter-spacing: -0.02em;

/* H2 - Section Titles */
--text-h2-size: 2rem;          /* 32px */
--text-h2-weight: 600;
--text-h2-line-height: 1.3;
--text-h2-letter-spacing: -0.01em;

/* H3 - Subsection Titles */
--text-h3-size: 1.75rem;       /* 28px */
--text-h3-weight: 600;
--text-h3-line-height: 1.4;
--text-h3-letter-spacing: 0;

/* H4 - Card Titles */
--text-h4-size: 1.5rem;        /* 24px */
--text-h4-weight: 500;
--text-h4-line-height: 1.4;
--text-h4-letter-spacing: 0;

/* H5 - Component Titles */
--text-h5-size: 1.25rem;       /* 20px */
--text-h5-weight: 500;
--text-h5-line-height: 1.5;
--text-h5-letter-spacing: 0;

/* H6 - Small Titles */
--text-h6-size: 1rem;          /* 16px */
--text-h6-weight: 500;
--text-h6-line-height: 1.5;
--text-h6-letter-spacing: 0.01em;
```

**Body Text**
```css
/* Body 1 - Default Text */
--text-body1-size: 1rem;       /* 16px */
--text-body1-weight: 400;
--text-body1-line-height: 1.5;
--text-body1-letter-spacing: 0.01em;

/* Body 2 - Secondary Text */
--text-body2-size: 0.875rem;   /* 14px */
--text-body2-weight: 400;
--text-body2-line-height: 1.43;
--text-body2-letter-spacing: 0.01em;
```

**Utility Text**
```css
/* Subtitle 1 */
--text-subtitle1-size: 1rem;   /* 16px */
--text-subtitle1-weight: 400;
--text-subtitle1-line-height: 1.75;

/* Subtitle 2 */
--text-subtitle2-size: 0.875rem; /* 14px */
--text-subtitle2-weight: 500;
--text-subtitle2-line-height: 1.57;

/* Button Text */
--text-button-size: 0.875rem;  /* 14px */
--text-button-weight: 500;
--text-button-line-height: 1.75;
--text-button-letter-spacing: 0.02em;
--text-button-transform: uppercase;

/* Caption */
--text-caption-size: 0.75rem;  /* 12px */
--text-caption-weight: 400;
--text-caption-line-height: 1.66;
--text-caption-letter-spacing: 0.03em;

/* Overline */
--text-overline-size: 0.75rem; /* 12px */
--text-overline-weight: 500;
--text-overline-line-height: 2.66;
--text-overline-letter-spacing: 0.08em;
--text-overline-transform: uppercase;
```

### Typography Usage

**Page Structure:**
- Page title: H4 (24px) in PageHeader
- Section title: H5 (20px) or H6 (16px)
- Card title: H6 (16px) or subtitle-1
- Body content: body-1 (16px)
- Helper text: body-2 (14px) or caption (12px)

**Forms:**
- Field labels: body-1 (16px)
- Input text: body-1 (16px)
- Helper text: caption (12px)
- Error messages: caption (12px)

**Tables:**
- Table headers: subtitle-2 (14px, medium weight)
- Table cells: body-2 (14px)
- Table captions: caption (12px)

---

## Spacing & Layout

### Spacing Scale
```css
--spacing-0: 0;
--spacing-1: 4px;
--spacing-2: 8px;
--spacing-3: 12px;
--spacing-4: 16px;
--spacing-5: 20px;
--spacing-6: 24px;
--spacing-7: 28px;
--spacing-8: 32px;
--spacing-9: 36px;
--spacing-10: 40px;
--spacing-12: 48px;
--spacing-16: 64px;
--spacing-20: 80px;
--spacing-24: 96px;
```

### Layout Guidelines

**Page Layout:**
```vue
<v-container fluid class="pa-6">
  <!-- Page content -->
</v-container>
```
- Page padding: 24px (spacing-6)
- Max width: None (fluid)

**Section Spacing:**
- Between sections: 24px (mb-6)
- Between subsections: 16px (mb-4)
- Between elements: 12px (mb-3)

**Card Layout:**
```vue
<v-card class="mb-6">
  <v-card-title class="pa-4">
    <!-- Title -->
  </v-card-title>
  <v-card-text class="pa-4">
    <!-- Content -->
  </v-card-text>
  <v-card-actions class="pa-4">
    <!-- Actions -->
  </v-card-actions>
</v-card>
```
- Card padding: 16px (pa-4)
- Card margin: 24px (mb-6)

**Form Layout:**
```vue
<v-form>
  <v-row>
    <v-col cols="12" md="6" class="mb-4">
      <v-text-field />
    </v-col>
  </v-row>
</v-form>
```
- Field spacing: 16px (mb-4)
- Field groups: 24px (mb-6)

**Grid System:**
- 12-column grid (Vuetify default)
- Breakpoints: xs (0), sm (600), md (960), lg (1264), xl (1904)
- Gutter: 24px (default)

### Responsive Breakpoints

**Breakpoint Definitions:**

**Mobile (xs):**
- Width: 0-599px
- Target devices: Smartphones (iPhone SE, iPhone 12, Android phones)
- Layout: Single column, stacked elements
- Navigation: Drawer collapses, hamburger menu
- Touch targets: Minimum 44x44px

**Tablet (sm-md):**
- Width: 600-959px
- Target devices: Tablets (iPad, Android tablets)
- Layout: 2-column where appropriate
- Navigation: Rail mode or collapsible drawer
- Touch targets: Minimum 44x44px

**Desktop (lg-xl):**
- Width: 960px+
- Target devices: Desktop computers, laptops
- Layout: Multi-column, full features
- Navigation: Persistent drawer
- Interaction: Mouse and keyboard

**Low-Resolution Desktop (Special Case):**
- Width: 1366x768 (common government office resolution)
- Must be explicitly tested
- Ensure no horizontal scrolling
- Optimize data table column widths
- Adjust dialog sizes if needed

**Responsive Design Guidelines:**

**Mobile (<600px):**
- Single column layout
- Full-width forms
- Stacked buttons
- Horizontal scroll for tables
- Full-screen dialogs
- Collapsible filters
- Bottom navigation (optional)

**Tablet (600-960px):**
- 2-column layout for forms
- Grid layout for cards (2 columns)
- Rail navigation drawer
- Appropriately sized dialogs
- Visible table columns (scroll if needed)

**Desktop (>960px):**
- Multi-column layouts
- Persistent navigation drawer
- All table columns visible
- Hover states enabled
- Keyboard shortcuts active

**Testing Requirements:**
- Test all views at 375px (mobile)
- Test all views at 768px (tablet)
- Test all views at 1366px (low-res desktop)
- Test all views at 1920px (full HD desktop)
- Verify touch targets on mobile/tablet
- Verify no horizontal scrolling

---

## Components

### Buttons

**Primary Button**
```vue
<v-btn color="primary" variant="elevated">
  Primary Action
</v-btn>
```
- Use for primary actions
- One per section/dialog
- Color: primary
- Variant: elevated

**Secondary Button**
```vue
<v-btn color="primary" variant="outlined">
  Secondary Action
</v-btn>
```
- Use for secondary actions
- Color: primary
- Variant: outlined

**Text Button**
```vue
<v-btn variant="text">
  Cancel
</v-btn>
```
- Use for tertiary actions
- Use for cancel actions
- Variant: text

**Icon Button**
```vue
<v-btn icon="mdi-pencil" size="small" variant="text" aria-label="Edit" />
```
- Use for compact actions
- Always include aria-label
- Size: small or default

**Button Sizing:**
- Default: 36px height
- Small: 28px height
- Large: 44px height
- X-Large: 52px height

**Button States:**
- Default: Solid color
- Hover: Slightly darker
- Active: Darker
- Disabled: 38% opacity
- Loading: Show spinner

### Cards

**Standard Card**
```vue
<v-card elevation="2" class="mb-6">
  <v-card-title class="d-flex align-center pa-4">
    <v-icon icon="mdi-account" class="mr-2" />
    Card Title
  </v-card-title>
  <v-card-text class="pa-4">
    Card content goes here
  </v-card-text>
  <v-card-actions class="pa-4">
    <v-spacer />
    <v-btn>Action</v-btn>
  </v-card-actions>
</v-card>
```

**Card Variants:**
- Default: elevation-2, rounded-lg
- Hover: elevation-3 (if clickable)
- Flat: elevation-0, border
- Outlined: elevation-0, border

### Form Fields

**Text Field**
```vue
<v-text-field
  v-model="value"
  label="Field Label"
  hint="Helper text"
  persistent-hint
  variant="outlined"
  density="comfortable"
  :rules="[v => !!v || 'Field is required']"
/>
```

**Select Field**
```vue
<v-select
  v-model="value"
  :items="items"
  label="Select Option"
  variant="outlined"
  density="comfortable"
/>
```

**Autocomplete**
```vue
<v-autocomplete
  v-model="value"
  :items="items"
  label="Search and Select"
  variant="outlined"
  density="comfortable"
  clearable
/>
```

**Field States:**
- Default: neutral border
- Focus: primary border, 2px
- Error: error border, error message
- Disabled: neutral-300 background
- Success: success border (optional)

### Data Tables

**Standard Table**
```vue
<v-data-table
  :headers="headers"
  :items="items"
  :loading="loading"
  :items-per-page="25"
  class="elevation-2"
>
  <template #item.status="{ item }">
    <StatusChip :status="item.status" />
  </template>
  <template #item.actions="{ item }">
    <v-btn icon="mdi-pencil" size="small" variant="text" />
    <v-btn icon="mdi-delete" size="small" variant="text" color="error" />
  </template>
</v-data-table>
```

**Table Styling:**
- Header: bold, neutral-100 background
- Rows: hover effect (neutral-50)
- Zebra striping: optional
- Borders: subtle (neutral-300)
- Pagination: bottom, centered

### Dialogs

**Standard Dialog**
```vue
<v-dialog v-model="dialog" max-width="600">
  <v-card>
    <v-card-title class="d-flex align-center pa-4">
      <v-icon icon="mdi-alert" class="mr-2" />
      Dialog Title
    </v-card-title>
    <v-card-text class="pa-4">
      Dialog content
    </v-card-text>
    <v-card-actions class="pa-4">
      <v-spacer />
      <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
      <v-btn color="primary" @click="confirm">Confirm</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
```

**Dialog Sizing:**
- Small: max-width 400px
- Medium: max-width 600px
- Large: max-width 800px
- Full-screen: mobile only

### Alerts

**Alert Variants**
```vue
<!-- Success -->
<v-alert type="success" closable>
  Operation completed successfully
</v-alert>

<!-- Error -->
<v-alert type="error" closable>
  An error occurred
</v-alert>

<!-- Warning -->
<v-alert type="warning" closable>
  Please review this information
</v-alert>

<!-- Info -->
<v-alert type="info" closable>
  Here's some helpful information
</v-alert>
```

**Alert Usage:**
- Position: top of content area
- Duration: 5 seconds (auto-dismiss) or closable
- Animation: slide-in from top
- Icon: always show
- Action: optional

### Chips

**Status Chip**
```vue
<v-chip size="small" :color="getStatusColor(status)">
  {{ status }}
</v-chip>
```

**Chip Variants:**
- Default: filled
- Outlined: outlined
- Label: square corners
- Closable: with close icon

**Chip Sizing:**
- X-Small: 20px height
- Small: 24px height
- Default: 32px height
- Large: 40px height

---

## Patterns

### Page Header Pattern

```vue
<PageHeader
  title="Page Title"
  subtitle="Optional description of the page"
  :breadcrumbs="[
    { text: 'Home', to: '/' },
    { text: 'Section', to: '/section' },
    { text: 'Current Page', disabled: true }
  ]"
>
  <template #actions>
    <v-btn color="primary" prepend-icon="mdi-plus">
      Add New
    </v-btn>
  </template>
</PageHeader>
```

### List View Pattern

```vue
<v-container fluid class="pa-6">
  <PageHeader title="List Title">
    <template #actions>
      <v-btn color="primary" prepend-icon="mdi-plus">Add New</v-btn>
    </template>
  </PageHeader>

  <!-- Filters -->
  <v-expansion-panels class="mb-6">
    <v-expansion-panel>
      <v-expansion-panel-title>
        <v-icon icon="mdi-filter" class="mr-2" />
        Filters
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field label="Search" />
          </v-col>
          <v-col cols="12" md="4">
            <v-select label="Status" />
          </v-col>
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>

  <!-- Data Table -->
  <v-card elevation="2">
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
    >
      <template #loading>
        <LoadingState variant="skeleton-table" :rows="5" />
      </template>
      <template #no-data>
        <EmptyState
          icon="mdi-inbox"
          title="No data found"
          description="Try adjusting your filters"
        />
      </template>
    </v-data-table>
  </v-card>
</v-container>
```

### Form View Pattern

```vue
<v-container fluid class="pa-6">
  <PageHeader title="Form Title" show-back @back="$router.back()">
    <template #actions>
      <v-btn variant="text" @click="cancel">Cancel</v-btn>
      <v-btn color="primary" @click="submit" :loading="submitting">
        Submit
      </v-btn>
    </template>
  </PageHeader>

  <v-form ref="form" @submit.prevent="submit">
    <v-card elevation="2" class="mb-6">
      <v-card-title class="pa-4">Section Title</v-card-title>
      <v-card-text class="pa-4">
        <v-row>
          <v-col cols="12" md="6" class="mb-4">
            <v-text-field
              v-model="form.field1"
              label="Field 1 *"
              :rules="[v => !!v || 'Required']"
            />
          </v-col>
          <v-col cols="12" md="6" class="mb-4">
            <v-text-field
              v-model="form.field2"
              label="Field 2"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-form>
</v-container>
```

### Dashboard Pattern

```vue
<v-container fluid class="pa-6">
  <PageHeader
    title="Dashboard"
    subtitle="Welcome back, {{ user.name }}"
  />

  <!-- Stats -->
  <v-row class="mb-6">
    <v-col cols="12" sm="6" md="3">
      <v-card elevation="2">
        <v-card-text class="pa-4">
          <div class="text-overline mb-2">Pending Approvals</div>
          <div class="text-h4">{{ stats.pending }}</div>
        </v-card-text>
      </v-card>
    </v-col>
    <!-- More stat cards -->
  </v-row>

  <!-- Quick Actions -->
  <v-row class="mb-6">
    <v-col cols="12">
      <div class="text-h6 mb-4">Quick Actions</div>
    </v-col>
    <v-col cols="12" sm="6" md="3">
      <ActionCard
        icon="mdi-file-document"
        title="Request Pass Slip"
        description="Submit a new pass slip request"
        to="/pass-slips/request"
      />
    </v-col>
    <!-- More action cards -->
  </v-row>
</v-container>
```

---

## Accessibility

### WCAG 2.1 AA Compliance

**Color Contrast:**
- Normal text: 4.5:1 minimum
- Large text (18pt+): 3:1 minimum
- UI components: 3:1 minimum
- Focus indicators: 3:1 minimum

**Keyboard Navigation:**
- All interactive elements must be keyboard accessible
- Tab order must be logical
- Focus indicators must be visible
- Escape key closes dialogs
- Enter key submits forms

**ARIA Labels:**
- All buttons have aria-label or visible text
- Form fields have proper labels
- Status messages use aria-live
- Dialogs have aria-modal
- Navigation has landmark roles

**Screen Reader Support:**
- Semantic HTML elements
- Proper heading hierarchy
- Alt text for images
- Descriptive link text
- Form error announcements

### Accessibility Checklist

- [ ] All text meets contrast requirements
- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible
- [ ] ARIA labels are provided
- [ ] Heading hierarchy is logical
- [ ] Form errors are announced
- [ ] Status messages use aria-live
- [ ] Images have alt text
- [ ] Links have descriptive text
- [ ] Tables have proper headers

---

## Code Examples

### Complete Page Example

```vue
<template>
  <v-container fluid class="pa-6">
    <PageHeader
      title="Employee Management"
      subtitle="Manage employee records and information"
      :breadcrumbs="breadcrumbs"
    >
      <template #actions>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="openAddDialog">
          Add Employee
        </v-btn>
      </template>
    </PageHeader>

    <v-alert v-if="error" type="error" closable @click:close="error = null" class="mb-6">
      {{ error }}
    </v-alert>

    <v-expansion-panels class="mb-6">
      <v-expansion-panel>
        <v-expansion-panel-title>
          <v-icon icon="mdi-filter" class="mr-2" />
          Filters
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="filters.search"
                label="Search"
                prepend-icon="mdi-magnify"
                clearable
                @input="loadEmployees"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="filters.department"
                :items="departments"
                label="Department"
                clearable
                @update:modelValue="loadEmployees"
              />
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-card elevation="2">
      <v-data-table
        :headers="headers"
        :items="employees"
        :loading="loading"
        :items-per-page="25"
      >
        <template #loading>
          <LoadingState variant="skeleton-table" :rows="5" :columns="6" />
        </template>
        <template #no-data>
          <EmptyState
            icon="mdi-account-off"
            title="No employees found"
            description="Try adjusting your filters or add a new employee"
            action-text="Add Employee"
            @action="openAddDialog"
          />
        </template>
        <template #item.status="{ item }">
          <StatusChip :status="item.status" />
        </template>
        <template #item.actions="{ item }">
          <v-btn
            icon="mdi-pencil"
            size="small"
            variant="text"
            @click="editEmployee(item)"
            aria-label="Edit employee"
          />
          <v-btn
            icon="mdi-delete"
            size="small"
            variant="text"
            color="error"
            @click="deleteEmployee(item)"
            aria-label="Delete employee"
          />
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import EmptyState from '@/components/EmptyState.vue'
import LoadingState from '@/components/LoadingState.vue'
import StatusChip from '@/components/StatusChip.vue'

const loading = ref(false)
const error = ref(null)
const employees = ref([])
const filters = ref({
  search: '',
  department: null
})

const breadcrumbs = [
  { text: 'Home', to: '/' },
  { text: 'Admin', to: '/admin' },
  { text: 'Employees', disabled: true }
]

const headers = [
  { title: 'Employee ID', key: 'employeeId' },
  { title: 'Name', key: 'fullName' },
  { title: 'Department', key: 'department' },
  { title: 'Position', key: 'position' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false }
]

const loadEmployees = async () => {
  loading.value = true
  try {
    // API call here
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadEmployees()
})
</script>
```

---

**Document End**

*For implementation guidance, refer to the PRD and Implementation Roadmap.*

