'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var DEBOUNCE_TIMEOUT = 500;

  /**
   * определение правильной формы множественного числа существительного
   * @param {Array.<string>} options - массив с вариантами существительного во множественном числе, например ['комната', 'комнаты', 'комнат'].
   * @param {number} number - число которому должна соотвествовать форма существительного, например 1 комната, 2 комнаты 5 комнат.
   * @return {string} - например 1 'комната', 2 'комнаты' 5 'комнат'.
   */
  var getInclineNoun = function (options, number) {
    if (number % 100 >= 5 && number % 100 <= 20) {
      return options[2];
    }
    if (number % 10 === 1) {
      return options[0];
    } else if (number % 10 >= 2 && number % 10 <= 4) {
      return options[1];
    } else {
      return options[2];
    }
  };

  window.utils = {
    getInclineNoun: getInclineNoun,
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
    debounce: function (callback) {
      var timeout = null;
      var context = this;
      var args = arguments;

      return function () {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          callback.apply(context, args);
        }, DEBOUNCE_TIMEOUT);
      };
    }
  };
})();
