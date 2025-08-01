import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import type { Plugin } from 'vue'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(Toast, {
        position: 'top-right',
        timeout: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        showCloseButtonOnHover: false,
        hideProgressBar: false,
        closeButton: 'button',
        icon: true,
        rtl: false
    })
})
