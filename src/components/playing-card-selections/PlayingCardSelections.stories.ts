import PlayingCardSelections from './PlayingCardSelections.vue';
import { appBody } from '../../../.storybook/app-body';
import { number, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

export default {
    title: 'PlayingCardSelections',
    decorators: [appBody]
};

export const Default: Function = () => ({
    components: { PlayingCardSelections },
    template: `
        <div style="margin-top:30px;">
            <playing-card-selections></playing-card-selections>
        </div>
    `
});
