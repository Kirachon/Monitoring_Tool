import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Philippine Government color scheme (extended)
const govTheme = {
  dark: false,
  colors: {
    // Core brand
    primary: '#0038A8', // Philippine Blue
    secondary: '#CE1126', // Philippine Red
    accent: '#FCD116', // Philippine Yellow

    // Semantic
    error: '#D32F2F',
    warning: '#F57C00',
    info: '#1976D2',
    success: '#388E3C',

    // Surfaces
    background: '#F5F5F5',
    surface: '#FFFFFF',
    'surface-variant': '#F0F2F5',

    // Neutrals (named for convenience)
    neutral50: '#FAFAFA',
    neutral100: '#F5F5F5',
    neutral200: '#EEEEEE',
    neutral300: '#E0E0E0',
    neutral400: '#BDBDBD',
    neutral500: '#9E9E9E',
    neutral600: '#757575',
    neutral700: '#616161',
    neutral800: '#424242',
    neutral900: '#212121',

    // Status (for chips/badges)
    statusPending: '#F57C00',
    statusApproved: '#388E3C',
    statusDenied: '#D32F2F',
    statusCancelled: '#757575',
    statusCompleted: '#1976D2'
  }
}

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'govTheme',
    themes: {
      govTheme
    }
  },
  defaults: {
    // Buttons
    VBtn: {
      color: 'primary',
      variant: 'elevated',
      height: 36,
      rounded: 'md'
    },
    // Inputs
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary'
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary'
    },
    VAutocomplete: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary'
    },
    // Cards & Dialogs
    VCard: {
      elevation: 2,
      rounded: 'lg'
    },
    VDialog: {
      elevation: 4
    },
    // Data Table
    VDataTable: {
      density: 'comfortable'
    }
  }
})

