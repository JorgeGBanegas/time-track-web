/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as labsComponents from 'vuetify/labs/components'
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    ...components,
    ...labsComponents,
  },
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#24DCA4',
          secondary: '#1FC493',
          accent: '#72F9D0',
          'my-red-color': '#F52D56',
          'white-color': '#FFFFFF',
        },
      },
    },
  },
})
