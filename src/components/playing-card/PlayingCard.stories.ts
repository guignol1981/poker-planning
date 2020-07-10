import PlayingCard from './PlayingCard.vue';
import { appBody } from '../../../.storybook/app-body';
import { number, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

export default {
    title: 'PlayingCard',
    decorators: [appBody]
};

export const Default: Function = () => ({
    components: { PlayingCard },
    props: {
        value: {
            default: number('value', 1)
        },
        selected: {
            default: boolean('selected', false)
        },
        flipped: {
            default: boolean('flipped', false)
        }
    },
    methods: {
        onClick: action('clicked')
    },
    template: `
        <playing-card :value="value" :selected="selected" :flipped="flipped" @click="onClick()"></playing-card>
    `
});
