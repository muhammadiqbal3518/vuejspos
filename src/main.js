import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'

// Import Bootstrap JS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import Vue3TouchEvents from 'vue3-touch-events'

// Import Bootstrap SCSS
// import 'bootstrap/scss/bootstrap.scss'

// Import specific Bootstrap JS components
// import 'bootstrap/js/dist/alert'; 

// import { BootstrapVue3 } from 'bootstrap-vue-3'

const app = createApp(App)

app.use(router)
app.use(Vue3TouchEvents)
// app.use(BootstrapVue3)

app.mount('#app')
