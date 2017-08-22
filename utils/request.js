import Promise from '../plugins/es6-promise';
import urls from '../common/api'

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
    wx.request(params);
  });

}

function extend() {
  for (var i = 1; i < arguments.length; i++)
    for (var key in arguments[i])
      if (arguments[i].hasOwnProperty(key))
        arguments[0][key] = arguments[i][key];
  return arguments[0];
}

function extendParams(params) {
  return arguments[0];
}

function extendParams(params) {

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

  params.url = url;
  let setting = extendParams(params);
  return promiseRequest(setting);
}
