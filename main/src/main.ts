import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'


import { app_name } from './config';

window.document.title = app_name.value;

createApp(App).use(ElementPlus).mount('#app');

