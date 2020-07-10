import App from '../src/App.vue';

export const appBody: () => string = () => ({
    components: {
        App
    },
    template: '<app><story /></app>';
});
