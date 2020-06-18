<template>
    <div>
        <img
            src="https://landportal.org/sites/landportal.org/files/styles/220heightmax/public/logo-universite-laval-couleur-transparent.png?itok=NyicaP6B"
            alt=""
        />
        <m-button @click="onNouvellePartieClicked()">Nouvelle partie!</m-button>
    </div>
</template>

<script lang="ts">
    /* eslint-disable @typescript-eslint/no-explicit-any */

    import Vue from 'vue';
    import Component from 'vue-class-component';

    @Component
    export default class Lobby extends Vue {
        protected created(): void {
            (this as any).$socket.on('room created', (event: any) => {
                this.$router.push({
                    name: 'Room',
                    params: {
                        id: event.roomId.toString()
                    }
                });
            });
        }

        public onNouvellePartieClicked(): void {
            (this as any).$socket.emit('new room');
        }
    }
</script>
