<template>
    <div id="app" class="m-u--app-body app">
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component
    export default class App extends Vue {}
</script>

<style lang="scss">
    $m-font-path: '~@ulaval/modul-components/dist/assets/fonts/';

    @import '~@ulaval/modul-components/dist/styles/main.scss';

    .app {
        padding: $m-spacing--xl;
    }
</style>
