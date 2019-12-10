import axios from 'axios'
import { Message } from 'element-ui'
import store from '../store'

axios.interceptors.request.use(config => {
    // config = {
    //   headers: {
    //     'Content-Type': 'multipart/form-data'
    //   },
    //   transformRequest: [function (data) {
    //     return data
    //   }]
    // };
  return config;
}, err => {
  Message.error({ message: '请求超时!' });
  // return Promise.resolve(err);
})

axios.interceptors.response.use(data => {

  let self = this;
  if (data.status && data.status == 200 && data.data.status == 500) {
    Message.error({ message: data.data.msg });
    return;
  }
  if (data.data.status == 501) {
    // console.log(data.data)
    // self.$router.replace({
    //   path: "/"
    // });

    // 未登录，跳转到登录页
    window.location.href = '/'
  }
  if (data.data.msg) {
    Message.success({ message: data.data.msg });
  }
  return data;
}, err => {
  if (err.response.status == 504 || err.response.status == 404) {
    Message.error({ message: '服务器被吃了⊙﹏⊙∥' });
  } else if (err.response.status == 403) {
    Message.error({ message: '权限不足,请联系管理员!' });
  } else if (err.response.status == 401) {
    Message.error({ message: err.response.data.msg });
  } else {
    if (err.response.data.msg) {
      Message.error({ message: err.response.data.msg });
    } else {
      Message.error({ message: '未知错误!' });
    }
  }
  // return Promise.resolve(err);
})
let base = '';
export const postRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

export const postsRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,

    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const uploadFileRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data;'
    },
    transformRequest: [function (data) {
      return data
    }],
    onUploadProgress: progressEvent => {
      let complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%'
      console.log('complete: ', complete)
    }

  });
}
export const putRequest = (url, params) => {
  return axios({
    method: 'put',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export const putsRequest = (url, params) => {
  return axios({
    method: 'put',
    url: `${base}${url}`,
    data: params,

    transformRequest: [function (e) {
      // 数据转换的核心代码，来自我公司的前端大佬
      function setDate(e) {
        var t, n, i, r, o, s, a, c = "";
        for (t in e)
          if (n = e[t], n instanceof Array)
            for (a = 0; a < n.length; ++a)
              o = n[a], i = t + "[" + a + "]", s = {}, s[i] = o, c += setDate(s) + "&";
          else if (n instanceof Object)
            for (r in n) o = n[r], i = t + "[" + r + "]", s = {}, s[i] = o, c += setDate(s) + "&";
          else void 0 !== n && null !== n && (c += encodeURIComponent(t) + "=" + encodeURIComponent(n) + "&");
        return c.length ? c.substr(0, c.length - 1) : c
      }
      // 数据转换的核心代码结束
      return setDate(e)
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
export const deleteRequest = (url) => {
  return axios({
    method: 'delete',
    url: `${base}${url}`
  });
}
export const getRequest = (url) => {
  return axios({
    method: 'get',
    url: `${base}${url}`
  });
}
