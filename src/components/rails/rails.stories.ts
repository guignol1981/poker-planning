import Rails from './rails.vue';
import { appBody } from '../../../.storybook/app-body';
import { number, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

export default {
    title: 'Rails',
    decorators: [appBody]
};

export const Default: Function = () => ({
    components: { Rails },
    template: `
        <rails></rails>
    `
});
