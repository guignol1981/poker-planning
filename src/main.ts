import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { ModulComponentPlugin, FrenchPlugin } from '@ulaval/modul-components';
import '@ulaval/modul-components/dist/modul.min.css';
import io from 'socket.io-client';

Vue.prototype.$socket = io();

Vue.use(ModulComponentPlugin);
Vue.use(FrenchPlugin);

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
