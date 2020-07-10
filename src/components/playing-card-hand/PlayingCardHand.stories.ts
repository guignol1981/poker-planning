import PlayingCardHand from './PlayingCardHand.vue';
import { appBody } from '../../../.storybook/app-body';
import { number, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

export default {
    title: 'PlayingCardHand',
    decorators: [appBody]
};

export const Default: Function = () => ({
    components: { PlayingCardHand },
    template: `
        <div style="margin-top:30px;">
            <playing-card-hand></playing-card-hand>
        </div>
    `
});
