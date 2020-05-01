<template>
    <div class="room" v-if="myPlayer">
        <m-message state="information" class="room__informations">
            <m-modal
                v-if="myPlayer.isAdmin"
                title="Nouveau vote en cours"
                :open.sync="nouveauVoteEnCoursOpen"
            >
                <m-textfield
                    v-model="room.voting"
                    label="Vote en cours"
                ></m-textfield>
                <m-link slot="trigger" mode="button"
                    >Vote en cours: {{ room.voting }}</m-link
                >
                <m-button slot="footer" @click="onVotingChange"
                    >Soumettre</m-button
                >
            </m-modal>

            <span v-else>Vote en cours: {{ room.voting }}</span>
            <div v-if="myPlayer.isAdmin" class="m-u--margin-top">
                <m-button @click="onSubmit">Soumettre</m-button>

                <m-button
                    skin="secondary"
                    class="m-u--margin-left"
                    @click="onReset"
                    >Nouveau</m-button
                >
            </div>
        </m-message>
        <chart
            v-if="room.status === 'results'"
            :styles="chartStyle"
            :results="room.results"
        ></chart>
        <div class="room__content">
            <div class="room__card-grid">
                <m-panel
                    v-for="(value, index) in values"
                    :key="index"
                    :highlighted="isSelectedVote(value)"
                    shadow="true"
                    @click="onVote(value)"
                >
                    <h1 class="room__card-grid__item">{{ value }}</h1>
                </m-panel>
            </div>
            <div class="room__players">
                <ul>
                    <m-list-item
                        v-for="(player, index) in players"
                        :key="index"
                        :icon-name="!!player.vote ? 'completed-filled' : ''"
                    >
                        <m-modal
                            v-if="myPlayer === player"
                            title="Nouveau nom"
                            :open.sync="newNameSelectionOpen"
                        >
                            <m-textfield
                                v-model="myPlayer.name"
                                label="Nom"
                            ></m-textfield>
                            <m-link slot="trigger" mode="button"
                                >{{ player.name }}
                                {{ player.isAdmin ? '(admin)' : '' }}</m-link
                            >
                            <m-button slot="footer" @click="onNameChange"
                                >Soumettre</m-button
                            >
                        </m-modal>

                        <span v-else
                            >{{ player.name }}
                            {{ player.isAdmin ? '(admin)' : '' }}</span
                        ></m-list-item
                    >
                </ul>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    /* eslint-disable @typescript-eslint/no-explicit-any */
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import Chart from './Chart.vue';

    @Component({
        components: {
            Chart
        }
    })
    export default class Room extends Vue {
        public room: any = {};
        public players: any = [];
        public values: number[] = [0.5, 1, 2, 3, 5, 8, 13];
        public chartStyle = {
            height: `${500}px`,
            position: 'relative'
        };
        public newNameSelectionOpen: boolean = false;
        public nouveauVoteEnCoursOpen: boolean = false;

        protected created(): void {
            (this as any).$socket.emit('joined');

            (this as any).$socket.on('room updated', (event: any) => {
                this.room = event.room;
                this.players = event.room.players;
            });
        }

        public get myPlayer(): any {
            return this.players.find(
                (p: any) => p.id === (this as any).$socket['id']
            );
        }

        public isSelectedVote(value: number): boolean {
            return this.myPlayer.vote === value;
        }

        public onVote(value: number): void {
            if (value === this.myPlayer.vote) {
                value = 0;
            }

            this.myPlayer.vote = value;

            (this as any).$socket.emit('player updated', {
                player: this.myPlayer
            });
        }

        public onSubmit(): void {
            (this as any).$socket.emit('vote submited');
        }

        public onNameChange(): void {
            (this as any).$socket.emit('player updated', {
                player: this.myPlayer
            });

            this.newNameSelectionOpen = false;
        }

        public onVotingChange(): void {
            (this as any).$socket.emit('room updated', {
                room: this.room
            });

            this.nouveauVoteEnCoursOpen = false;
        }

        public onReset(): void {
            (this as any).$socket.emit('reset');
        }
    }
</script>

<style lang="scss" scoped>
    @import '~@ulaval/modul-components/dist/styles/commons';

    .room {
        &__content {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }

        &__card-grid {
            padding: $m-spacing--l;
            flex: 1;
            display: grid;
            align-items: center;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            row-gap: $m-spacing;
            column-gap: $m-spacing;

            &__item {
                height: 100px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }

        &__players {
            flex: 1;
            padding: $m-spacing--l;
        }

        &__informations {
            width: 100%;
            display: flex;
            justify-content: space-around;
        }

        &__chart {
            position: relative;
            height: 200px;
        }
    }
</style>
