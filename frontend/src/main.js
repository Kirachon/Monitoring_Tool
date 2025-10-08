import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { useAuthStore } from './store/auth'

// Import global styles and design tokens
import './styles/design-tokens.css'
import './styles/typography.css'
import './styles/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(vuetify)

// Initialize auth store
const authStore = useAuthStore()
authStore.initAuth()

app.mount('#app')

