import Train from './train.vue';
import { appBody } from '../../../.storybook/app-body';
import { number, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

export default {
    title: 'Train',
    decorators: [appBody]
};

export const Default: Function = () => ({
    components: { Train },
    template: `
        <train></train>
    `
});
