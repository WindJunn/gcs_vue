// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'
import {getRequest} from './utils/api'
import {postRequest} from './utils/api'
import {postsRequest} from './utils/api'
import {uploadFileRequest} from './utils/api'

import {deleteRequest} from './utils/api'
import {putRequest} from './utils/api'
import {putsRequest} from './utils/api'

import {initMenu} from './utils/utils'
import {isNotNullORBlank} from './utils/utils'
import './utils/filter_utils'
import 'font-awesome/css/font-awesome.min.css'

// import './components/bg.styl'


import VueRouter from 'vue-router'

// 1. 定义（路由）组件。
// 加载组件
// import BlogDetail from '@/components/personnel/BlogDetail'


Vue.config.productionTip = false
Vue.use(ElementUI)

Vue.prototype.getRequest = getRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.postsRequest = postsRequest;
Vue.prototype.uploadFileRequest = uploadFileRequest;

Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.putsRequest = putsRequest;

Vue.prototype.isNotNullORBlank = isNotNullORBlank;

Vue.use(VueRouter)
//全局安装路由功能


router.beforeEach((to, from, next) => {
    if (to.name == 'Login') {
      next();
      return;
    }
    var name = store.state.user.name;
    if (name == '未登录') {
      console.log(to)
      if (to.meta.requireAuth || to.name == null) {
        next({path: '/', query: {redirect: to.path}})
        // next("/")
      } else {
        next();
      }
    } else {
      initMenu(router, store);
      // if(to.path=='/chat')
      //   store.commit("updateMsgList", []);
      next();
    }
  }
)

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
