import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import icons from './icons/icons'

import { library } from '@fortawesome/fontawesome-svg-core'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import './styles/base.scss'

console.log(icons);

library.add({...icons})



createApp(App)
    .component("font-awesome-icon", FontAwesomeIcon)
    .use(router)
    .mount('#app')
