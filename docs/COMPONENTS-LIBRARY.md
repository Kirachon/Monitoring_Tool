# UI Components Library (Foundation)

This document describes the reusable UI components implemented in Phase 1 (Foundation) for the Philippine Government HRMS.

## Components

### 1) PageHeader.vue
Standardized page header with title, optional subtitle, breadcrumbs, and actions slot.

Props:
- `title: string` (required)
- `subtitle?: string`
- `breadcrumbs?: Array<{ title: string; to?: string }>`
- `id?: string` ARIA heading id

Slots:
- `prepend` – optional leading content (e.g., icon)
- `actions` – right-aligned actions (buttons/menus)

Usage:
```vue
<PageHeader :title="'Employees'" :subtitle="'Manage employee records'" :breadcrumbs="[{title:'Dashboard',to:'/dashboard'},{title:'Employees'}]">
  <template #actions>
    <v-btn color="primary">Add Employee</v-btn>
  </template>
</PageHeader>
```

---

### 2) EmptyState.vue
Reusable empty state for no-data, no-results, error, and no-permission.

Props:
- `icon?: string` (mdi-*)
- `illustration?: string` (URL)
- `title: string` (required)
- `description?: string`
- `actionText?: string`
- `actionColor?: string` (default `primary`)
- `variant?: 'no-data'|'no-results'|'error'|'no-permission'`

Emits:
- `action` – fired when action button is clicked

Usage:
```vue
<EmptyState icon="mdi-database-off" title="No Records" description="There are no items yet." action-text="Create" @action="onCreate" />
```

---

### 3) LoadingState.vue
Consistent loading indicators and skeletons.

Props:
- `variant?: 'spinner'|'overlay'|'skeleton-table'|'skeleton-card'|'skeleton-form'`
- `rows?: number` (table skeleton)
- `columns?: number` (table skeleton)

Usage:
```vue
<LoadingState variant="skeleton-table" :rows="5" :columns="6" />
```

---

### 4) StatusChip.vue
Status indicator chip using semantic colors.

Props:
- `status: string` (required) – pending|approved|denied|cancelled|completed
- `size?: string` (default `small`)
- `icon?: string`
- `variant?: 'flat'|'outlined'|'tonal'`

Usage:
```vue
<StatusChip status="approved" icon="mdi-check" />
```

---

### 5) ActionCard.vue
Quick action card for dashboards.

Props:
- `title: string` (required)
- `description?: string`
- `icon?: string`
- `to?: string | RouteLocationRaw` (vue-router)
- `href?: string`

Emits:
- `click`

Usage:
```vue
<ActionCard title="Request Pass Slip" description="Start a new request" icon="mdi-file-plus" :to="'/pass-slips/request'" />
```

---

## Accessibility & Content
- All components include ARIA roles/labels where appropriate.
- Follow `docs/CONTENT-GUIDELINES.md` for all text.
- Ensure touch targets ≥ 44x44px on mobile.

## Testing
Unit tests for all components are scaffolded in `frontend/tests/components`. Running tests requires the following dev dependencies:
- `vitest`
- `@vue/test-utils`
- `jsdom`

## Theming & Tokens
- Design tokens in `frontend/src/styles/design-tokens.css`
- Typography utilities in `frontend/src/styles/typography.css`
- Vuetify theme configuration in `frontend/src/plugins/vuetify.js`

