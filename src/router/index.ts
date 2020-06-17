import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Room from '../components/Room.vue';
import Lobby from '../components/Lobby.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'Lobby',
        component: Lobby
    },
    {
        path: '/:id',
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
