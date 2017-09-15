'use strict';

window.backend = (function () {
  var LOAD_URL = 'https://1510.dump.academy/kekstagram/data';
  var SAVE_URL = 'https://1510.dump.academy/kekstagram';

  return {
    load: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        onLoad(xhr.response);
      });
      xhr.addEventListener('error', function () {
        onError('При загрузке фотографий произошла ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        onError('Запрос загрузки фотографий не выполнился за ' + xhr.timeout + 'мс');
      });

      xhr.open('GET', LOAD_URL);
      xhr.send();
    },

    save: function (data, onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        onLoad(xhr.response);
      });
      xhr.addEventListener('error', function () {
        onError('При отправке формы произошла ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        onError('Запрос отправки формы не выполнился за ' + xhr.timeout + 'мс');
      });

      xhr.open('POST', SAVE_URL);
      xhr.send(data);
    }
  };
})();
