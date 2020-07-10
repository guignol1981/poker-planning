<template>
    <div class="room" v-if="myPlayer">
        <div class="leave-room-button">
            <m-button skin="secondary" @click="onLeaveRoomClicked()">
                leave
            </m-button>
        </div>
        <div>
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
                    <m-button
                        slot="footer"
                        @click="onVotingChange"
                        :disabled="room.status === 'results'"
                        >Soumettre</m-button
                    >
                </m-modal>

                <p v-else>Vote en cours: {{ room.voting }}</p>

                <div v-if="myPlayer.isAdmin" class="m-u--margin-top">
                    <m-button
                        @click="onSubmit"
                        :disabled="room.status === 'results'"
                        >Soumettre</m-button
                    >

                    <m-button
                        skin="secondary"
                        class="m-u--margin-left"
                        @click="onReset"
                        >Nouveau</m-button
                    >
                </div>

                <m-link
                    class="m-u--margin-top"
                    mode="button"
                    @click="onCopyLinkClicked()"
                    >Copier lien de la partie</m-link
                >
            </m-message>
        </div>
        <chart
            v-if="room.status === 'results'"
            :styles="chartStyle"
            :results="room.results"
        ></chart>
        <div class="room__content">
            <div class="room__card-grid">
                <playing-card
                    v-for="(value, index) in values"
                    :key="index"
                    :selected="isSelectedVote(value)"
                    @click="onVote(value)"
                    :value="value"
                >
                </playing-card>
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
    import PlayingCard from './playing-card/PlayingCard.vue';

    @Component({
        components: {
            Chart,
            PlayingCard
        }
    })
    export default class Room extends Vue {
        public room: any = {};
        public players: any = [];
        public values: number[] = [0, 1, 2, 3, 5, 8, 13];

        public chartStyle = {
            height: `${500}px`,
            position: 'relative'
        };

        public newNameSelectionOpen: boolean = false;
        public nouveauVoteEnCoursOpen: boolean = false;
        public updateRoomCallback: Function | null = null;

        protected created(): void {
            (this as any).$socket.emit('room joined', {
                roomId: this.$route.params.id
            });

            // (this as any).$socket.join(this.$route.params.id);

            (this as any).$socket.on('room updated', (event: any) => {
                if (this.newNameSelectionOpen || this.nouveauVoteEnCoursOpen) {
                    this.updateRoomCallback = (event: any) => {
                        this.room = event.room;
                        this.players = event.room.players;
                        this.updateRoomCallback = null;
                    };

                    return;
                }

                this.room = event.room;
                this.players = event.room.players;
            });

            (this as any).$socket.on('404', () => {
                this.$router.push({ name: 'Lobby' });
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
                player: this.myPlayer,
                roomId: this.$route.params.id
            });
        }

        public onSubmit(): void {
            (this as any).$socket.emit('vote submited', {
                roomId: this.$route.params.id
            });
        }

        public onNameChange(): void {
            (this as any).$socket.emit('player updated', {
                player: this.myPlayer,
                roomId: this.$route.params.id
            });

            this.newNameSelectionOpen = false;
            if (this.updateRoomCallback) {
                this.updateRoomCallback();
            }
        }

        public onVotingChange(): void {
            (this as any).$socket.emit('room updated', {
                room: this.room
            });

            this.nouveauVoteEnCoursOpen = false;

            if (this.updateRoomCallback) {
                this.updateRoomCallback();
            }
        }

        public onReset(): void {
            (this as any).$socket.emit('reset', {
                roomId: this.$route.params.id
            });
        }

        public onLeaveRoomClicked(): void {
            this.$router.push({ name: 'Lobby' });
        }

        public onCopyLinkClicked(): void {
            const url = window.location.href;
            const textArea = document.createElement('textarea');
            document.body.appendChild(textArea);
            textArea.value = url;

            textArea.select();
            textArea.setSelectionRange(0, 99999); /*For mobile devices*/
            document.execCommand('copy');

            document.body.removeChild(textArea);
            this.$toast.show({
                text: 'Lien copié!'
            });
        }
    }
</script>

<style lang="scss" scoped>
    @import '~@ulaval/modul-components/dist/styles/commons';

    .room {
        position: relative;

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

    .leave-room-button {
        position: absolute;
        top: 10px;
        right: 10px;
    }
</style>
