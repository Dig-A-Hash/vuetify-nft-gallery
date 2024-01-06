/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue';

// Composables
import { createApp } from 'vue';

// Plugins
import { registerPlugins } from '@/plugins';
import * as dateUtils from './modules/dateUtils';

// SCSS
import './scss/site.scss';
import './scss/cursors.scss';
import './scss/variables.scss';
import './scss/fonts.scss';
import './scss/borders.scss';
import './scss/backgrounds.scss';
import './scss/navbar.scss';
import './scss/vuetify-overrides.scss';

const app = createApp(App);

// Make dateUtils globally available
app.config.globalProperties.$dateUtils = dateUtils;

registerPlugins(app);

app.mount('#app');
