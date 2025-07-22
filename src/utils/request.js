import axios from 'axios';
// import { disconnect } from "@wagmi/core";
// import { MessagePlugin } from 'tdesign-react';
import { message } from 'antd'

const request = axios.create({
  
  baseURL: '/api',
  timeout: 60000, 
})


function errorHandler(error) {
  if (error.response) {
    const { data = {}, status, statusText } = error.response

    if (status === 403) {
      // showNotify({
      //   type: 'danger',
      //   message: (data && data.message) || statusText,
      // })
    }

    if (status === 401 && data.result && data.result.isLogin) {
      // showNotify({
      //   type: 'danger',
      //   message: 'Authorization verification failed',
      // })
  
      // location.replace(loginRoutePath)
    }
  }
  return Promise.reject(error)
}


function requestHandler(config) {
  const savedToken = localStorage.getItem('access_token');

  if (savedToken) {
    // config.headers['Authorization'] = `Bearer ${savedToken}`
    config.headers['clientId'] = '48688a98fd39bc5133036266b274db1c'
  }

  config.headers['Authorization'] = 'uAAthIuq2JH448NZgLxYvMLbMwW5Wq'
  return config
}

// Add a request interceptor
request.interceptors.request.use(requestHandler, errorHandler)


function responseHandler(response) {
  const res = response.data
  const code = res.code
  if (code === 401) {
    localStorage.removeItem('access_token')

    return Promise.reject(new Error('login'))
  }
  else if (code !== 200 && response.status != 200) {
    // console.log('res',res)
    // MessagePlugin.error(res.msg || 'unknown error', 5000);
    message.error(res.msg || 'unknown error')
    return res;
    // return Promise.reject(new Error(res.message))
  }
  return response.data
}

// Add a response interceptor
request.interceptors.response.use(responseHandler, errorHandler)

export default request