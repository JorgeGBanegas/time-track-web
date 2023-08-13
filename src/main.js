/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'
import VueSidebarMenu from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import VueGoogleMaps from '@fawmi/vue-google-maps'
// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'
import config from '@/config/config'

const app = createApp(App)

registerPlugins(app)

app.use(VueSidebarMenu)
app.use(VueGoogleMaps, {
    load: {
        key: config.googleMapsApiKey,
        lenguage: 'es',
        v: 'weekly',
    },
    autobindAllEvents: false,
})

app.mount('#app')
