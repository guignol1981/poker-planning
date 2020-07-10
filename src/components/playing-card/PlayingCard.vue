<template>
    <div class="playing-card" @click="$emit('click')">
        <template v-if="!flipped">
            <m-panel
                :padding="false"
                :highlighted="selected"
                shadow="true"
                class="playing-card__panel"
            >
                <div class="playing-card__value playing-card__value-1">
                    <div>
                        {{ value }}
                    </div>
                    <img
                        src="https://cdn-0.enacademic.com/pictures/enwiki/85/Ulaval_shield.png"
                        alt="ulaval"
                        width="20px"
                        height="auto"
                    />
                </div>
                <div class="playing-card__value playing-card__value-2">
                    <div>
                        {{ value }}
                    </div>
                    <img
                        src="https://cdn-0.enacademic.com/pictures/enwiki/85/Ulaval_shield.png"
                        alt="ulaval"
                        width="20px"
                        height="auto"
                    />
                </div>
                <div class="playing-card__value playing-card__value-3">
                    <div>
                        {{ value }}
                    </div>
                    <img
                        src="https://cdn-0.enacademic.com/pictures/enwiki/85/Ulaval_shield.png"
                        alt="ulaval"
                        width="20px"
                        height="auto"
                    />
                </div>
                <div class="playing-card__value playing-card__value-4">
                    <div>
                        {{ value }}
                    </div>
                    <img
                        src="https://cdn-0.enacademic.com/pictures/enwiki/85/Ulaval_shield.png"
                        alt="ulaval"
                        width="20px"
                        height="auto"
                    />
                </div>
                <div class="playing-card__symbols">
                    <img
                        src="https://cdn-0.enacademic.com/pictures/enwiki/85/Ulaval_shield.png"
                        alt="ulaval"
                        width="50px"
                        height="auto"
                    />
                </div>
            </m-panel>
        </template>

        <template v-else>
            <m-panel
                :padding="false"
                :highlighted="selected"
                shadow="true"
                class="playing-card__panel--flipped"
            >
            </m-panel>
        </template>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import { Prop } from 'vue-property-decorator';

    @Component
    export default class PlayingCard extends Vue {
        @Prop({ required: true })
        public value!: number;

        @Prop({ default: false })
        public selected!: boolean;

        @Prop({ default: false })
        public flipped!: boolean;
    }
</script>

<style lang="scss" scoped>
    .playing-card {
        width: 175px;
        height: 300px;

        &__panel {
            position: relative;
            height: 100%;

            &--flipped {
                height: 100%;
                background-color: red !important;
            }
        }

        &__value {
            position: absolute;
            font-weight: 700;
            font-size: 35px;

            &-1 {
                top: 5px;
                left: 5px;
            }
            &-2 {
                top: 5px;
                right: 5px;
            }
            &-3 {
                transform: rotate(180deg);
                bottom: 5px;
                left: 5px;
            }
            &-4 {
                transform: rotate(180deg);
                bottom: 5px;
                right: 5px;
            }
        }

        &__symbols {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-evenly;
            align-items: center;
            height: 100%;

            & > * {
                flex: 0 0 34%;
            }
        }
    }
</style>
