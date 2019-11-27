// 业务场景：
//
// 全局请求配置。
// get,post,put,delete等请求的promise封装。
// 全局请求状态管理。
// 取消重复请求。
// 路由跳转取消当前页面请求。
// 请求携带token，权限错误统一管理。

// 引入网络请求库 https://github.com/axios/axios

import axios from 'axios'
// import store from '../store';
import router from '../router'

// 请求列表
const requestList = [];
// 取消列表
const CancelToken = axios.CancelToken;
let sources = {};

// axios.defaults.timeout = 10000
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

// axios.defaults.baseURL = process.env.BASE_URL;
axios.defaults.baseURL = 'http://172.18.71.104:8229';

axios.interceptors.request.use((config) => {
  const request = JSON.stringify(config.url) + JSON.stringify(config.data);
  //将请求地址及参数作为一个完整的请求
  config.cancelToken = new CancelToken((cancel) => {
    sources[request] = cancel
  });
//1.判断请求是否已存在请求列表，避免重复请求，将当前请求添加进请求列表数组；
  if(requestList.includes(request)){
    sources[request]('取消重复请求')
  }else{
    requestList.push(request);
    //2.请求开始，改变loading状态供加载动画使用
    // store.dispatch('changeGlobalState', {loading: true})
  }
//3.获取token并添加到请求头供后端作权限校验
  let token = localStorage.getItem('token');
  if (token) {
    config.headers.token = token
  }

  return config
}, function (error) {
  return Promise.reject(error)
});
// 1.响应返回后将相应的请求从请求列表中删除
// 2.当请求列表为空时，即所有请求结束，加载动画结束
// 3.权限认证报错统一拦截处理
// 4.取消请求的处理需要结合其他代码说明
// 5.由于项目后端并没有采用RESTful风格的接口请求，200以外都归为网络请求失败
axios.interceptors.response.use(function (response) {
  // 1.将当前请求中请求列表中删除
  const request = JSON.stringify(response.config.url) + JSON.stringify(response.config.data);
  requestList.splice(requestList.findIndex(item => item === request), 1);
  // 2.当请求列表为空时，更改loading状态
  if (requestList.length === 0) {
    // store.dispatch('changeGlobalState', {loading: false})
  }
  // 3.统一处理权限认证错误管理
  if (response.data.code === 900401) {
    window.ELEMENT.Message.error('认证失效，请重新登录！', 1000)
    router.push('/login')
  }
  return response
}, function (error) {
  // 4.处理取消请求
  if (axios.isCancel(error)) {
    requestList.length = 0; // 根据管理可以注释掉, 不然会重复请求
    // store.dispatch('changeGlobalState', {loading: false});
    throw new axios.Cancel('cancel request')
  } else {
    // 5.处理网络请求失败
    window.ELEMENT.Message.error('网络请求失败', 1000)
  }
  return Promise.reject(error)
});

const request = function (url, params, config, method) {
  return new Promise((resolve, reject) => {
    axios[method](url, params, Object.assign({}, config)).then(response => {
      resolve(response.data)
    }, err => {
      if (err.Cancel) {
        console.log(err)
      } else {
        reject(err)
      }
    }).catch(err => {
      reject(err)
    })
  })
};

const post = (url, params, config = {}) => {
  return request(url, params, config, 'post')
};

const get = (url, params, config = {}) => {
  return request(url, params, config, 'get')
};

export {sources, post, get}
