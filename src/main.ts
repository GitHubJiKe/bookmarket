import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueQrcode from '@chenfengyuan/vue-qrcode';
import router from './router/index'
import './style.css'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.component('VueQrcode', VueQrcode)
app.use(router)
app.mount('#app')
