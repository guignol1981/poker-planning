<template>
    <div class="playing-card-selections">
        <playing-card
            v-for="(value, index) in values"
            :key="index"
            :value="1"
            :flipped="true"
        ></playing-card>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import PlayingCard from '../playing-card/PlayingCard.vue';
    import { Prop } from 'vue-property-decorator';

    @Component({
        components: {
            PlayingCard
        }
    })
    export default class PlayingCardSelections extends Vue {
        @Prop({ default: () => [1, 2, 3, 4, 5] })
        public values!: number[];
    }
</script>

<style lang="scss" scoped>
    .playing-card-selections {
        width: 100%;
        display: flex;

        & > :not(:first-child) {
            margin-left: -30px;

            :hover {
                box-shadow: 6px 8px grey;
                z-index: 1;
            }
        }

        & > {
            transition: all 2s;

            :hover {
                box-shadow: 6px 8px grey;
                z-index: 1;
                transform: translateY(-20px);
            }
        }
    }
</style>
