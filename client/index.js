import Vue from 'vue';
import 'babel-polyfill';

import './style.scss';

import App from './src/App.vue';

new Vue({
  el: '#root',
  render(h) {
    return h(App);
  }
});

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
