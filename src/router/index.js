import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
// 1.axios cancel token API
// 2.存入需要取消的请求列表导出给导航守卫使用
// 3.路由发生变化的时候取消当前页面还没有返回结果的请求，
// 在复杂的页面中请求可能会有很多个，增加取消请求的功能可以让页面切换的时候不卡顿。

import { sources } from '@/utils/axios'


Vue.use(Router);

var router =  new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    }
  ]
});
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || to.name;
  //路由发生变化时取消当前页面网络请求
  Object.keys(sources).forEach(item => {
    sources[item]('取消前页面请求')
  });
  for (var key in sources) {
    delete sources[key]
  }
  next()
});
export default router
