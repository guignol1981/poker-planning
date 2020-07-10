import Vue from 'vue';
import { ModulComponentPlugin, FrenchPlugin } from '@ulaval/modul-components';
import '@ulaval/modul-components/dist/modul.min.css';
import * as Storybook from '@storybook/vue';
import { withKnobs } from '@storybook/addon-knobs';
import './modul-fonts.scss';

Storybook.addDecorator(withKnobs as any);

Vue.use(ModulComponentPlugin);
Vue.use(FrenchPlugin);
