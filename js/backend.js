'use strict';

(function () {
  /**
   * @constant {string}
   */
  var GET_URL = 'https://js.dump.academy/keksobooking/data';

  /**
   * @constant {string}
   */
  var POST_URL = 'https://js.dump.academy/keksobooking';

  /**
   * @constant {number}
   */
  var SUCCESS_STATUS_CODE = 200;

  var createXHR = function (method, url, loadHandler, errorHandler, data) {
    var xhr = new XMLHttpRequest();
    if (method === 'GET') {
      xhr.responseType = 'json';
    }
    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_STATUS_CODE) {
        loadHandler(xhr.response);
      } else {
        errorHandler('Во время загрузки произошла ошибка. Обновите страницу. Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      errorHandler('Произошла ошибка соединения. Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
    });

    xhr.addEventListener('timeout', function () {
      errorHandler('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.open(method, url);

    if (typeof data !== 'undefined') {
      xhr.send(data);
    } else {
      xhr.send();
    }
  };

  window.backend = {
    load: function (loadHandler, errorHandler) {
      createXHR('GET', GET_URL, loadHandler, errorHandler);
    },
    upload: function (data, loadHandler, errorHandler) {
      createXHR('POST', POST_URL, loadHandler, errorHandler, data);
    }
  };

})();
