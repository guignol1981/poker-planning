import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Room from '../components/Room.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'Room',
        component: Room
    }
];

const router = new VueRouter({
    mode: 'history',
    // base: process.env.BASE_URL,
    routes
});

export default router;
