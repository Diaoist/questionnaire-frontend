import Promise from '../plugins/es6-promise';
import urls from '../common/api'

let max_request = 5;

let requestFn = wx.request;
let queue = requestQueue();
let eventEmit = eventHandler();

function requestTypeCheck(type) {

  switch (type) {
    case 'wx.request':
      max_request = 5;
      break;
    case 'wx.downloadFile':
      max_request = 10;
      break;
    case 'wx.uploadFile':
      max_request = 10;
      break;
    default:
      max_request = 9999999999;
  }

}

function getFunctionName(params) {

  let paramsArg = Object.keys(params);
  let fnType = '';

  if (paramsArg.indexOf('method')) {
    fnType = 'wx.request';
  } else if (paramsArg.indexOf('filePath')) {
    fnType = 'wx.uploadFile';
  } else {
    fnType = 'wx.downloadFile';
  }

  return fnType;
}

function requestQueue() {

  let proto = Queue.prototype;

  function Queue() {
    this.map = {};
    this.queue = [];
    this.loading = [];
  }

  proto.push = function push(params) {
    params.id = +new Date();
    while ((this.queue.indexOf(params.id) > -1 || this.loading.indexOf(params.id) > -1)) {
      params.id += Math.random() * 10 >> 0;
    }
    this.queue.push(params.id);
    this.map[params.id] = params;
  }

  proto.next = function next() {

    if (this.queue.length === 0) {
      if (this.loading.length === 0) {
        eventEmit.emit('loading', false);
      }
      return;
    }

    if (this.loading.length < max_request) {
      let head = this.queue.shift();
      let params = this.map[head];
      let oldComplete = params.complete;
      params.complete = (...args) => {
        this.loading.splice(this.loading.indexOf(params.id), 1);
        delete this.map[params.id];
        oldComplete && oldComplete.apply(params, args);
        this.next();
      }
      this.loading.push(params.id);
      eventEmit.emit('loading', true);
      return requestFn(params);
    }

  }

  proto.request = function (params) {

    this.push(params);

    return this.next();
  }

  return new Queue();

}

function eventHandler() {

  let proto = Event.prototype;

  function Event() {
    this._cbs = {};
  }

  proto.on = function on(event, fn) {
    if (typeof fn != "function") {
      console.error('fn must be a function')
      return
    }

    this._cbs = this._cbs || {};
    (this._cbs[event] = this._cbs[event] || []).push(fn)
  }

  proto.emit = function emit(event) {
    this._cbs = this._cbs || {}
    let callbacks = this._cbs[event], args;
    if (callbacks) {
      callbacks = callbacks.slice(0)
      args = [].slice.call(arguments, 1)
      for (let i = 0, len = callbacks.length; i < len; i++) {
        callbacks[i].apply(null, args)
      }
    }
  }

  return new Event();

}

function promiseRequest(params) {

  return new Promise((resolve, reject) => {
    ['fail', 'success', 'complete'].forEach((k) => {
      params[k] = (res) => {
        if (k === 'success')
          resolve(res)
        else if (k === 'fail')
          reject(res);
      };
    });
    queue.request(params);
  });

}

function getLoginSession() {
  let session = ''
  try {
    session = wx.getStorageSync('JSESSIONID_CiticWap');
  } catch (e) {
    console.log(e);
  } finally {
    return session;
  }
}

function extend() {
  for (var i = 1; i < arguments.length; i++)
    for (var key in arguments[i])
      if (arguments[i].hasOwnProperty(key))
        arguments[0][key] = arguments[i][key];
  return arguments[0];
}

function extendParams(params) {

  let session = getLoginSession();

  let defaultParams = {
    url: '',
    method: 'POST',
    dataType: 'json',
    data: {},
    header: {
      'content-Type': 'application/json; charset=utf-8'
    },
    success: () => { },
    fail: () => { },
    complete: () => { }
  };

  return extend({}, defaultParams, params);
}

export function request(apiName = '', params = {}, wxFn = wx.request) {
  let url = '';

  if (urls.hasOwnProperty(apiName)) {
    url = urls[apiName];
  } else {
    throw new Error('apiName [' + apiName + '] not exist in api list.');
  }

  if (wxFn) {
    requestFn = wxFn;
  }
  // 设置最大连接数
  requestTypeCheck(getFunctionName(params));

  params.url = url;
  let setting = extendParams(params);
  return promiseRequest(setting);
}

export function observerLoading(fn) {
  eventEmit.on('loading', fn);
}