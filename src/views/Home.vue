<template>
    <div class="home">
        <room></room>
    </div>
</template>

<script>
    // @ is an alias to /src
    import Room from '@/components/Room.vue';

    export default {
        name: 'Home',
        components: {
            Room
        }
    };
</script>
