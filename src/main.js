// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
// 引入淘宝适配方案
import 'lib-flexible'
import {post,get} from './utils/axios'
//定义全局变量
Vue.prototype.$post = post;
Vue.prototype.$get = get;
// 引入初始化样式
import 'normalize.css/normalize.css';
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
