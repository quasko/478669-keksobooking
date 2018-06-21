'use strict';

(function () {
  var GET_URL = 'https://js.dump.academy/keksobooking/data';
  var POST_URL = 'https://js.dump.academy/keksobooking';

  var createXHR = function (method, url, onLoad, onError, data) {
    var xhr = new XMLHttpRequest();
    if (method === 'GET') {
      xhr.responseType = 'json';
    }
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Во время загрузки произошла ошибка. Обновите страницу. Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения. Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.open(method, url);

    if (typeof data !== 'undefined') {
      xhr.send(data);
    } else {
      xhr.send();
    }
  };

  window.backend = {
    load: function (onLoad, onError) {
      createXHR('GET', GET_URL, onLoad, onError);
    },
    upload: function (data, onLoad, onError) {
      createXHR('POST', POST_URL, onLoad, onError, data);
    }
  };

})();
