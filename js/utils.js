'use strict';

(function () {
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

  /**
   * расположение элементов массива в случайном порядке.
   * @param {Array} array - массив в котором нужно изменить порядок элементов на случайный.
   * @return {Array}
   */
  var shuffleArray = function (array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array;
  };

  /**
   * генерация случайного числа в указанном диапазоне.
   * @param {number} minValue - миниальное значение из диапазона.
   * @param {number} maxValue - максимальное значение из диапазона.
   * @return {number}
   */
  var getRandomInteger = function (minValue, maxValue) {
    return Math.round(Math.random() * (maxValue - minValue)) + minValue;
  };

  /**
   * получение случайного элемента массива.
   * @param {Array} array - массив из которого нужно получить случайный элемент.
   * @return {*}
   */
  var getRandomArrayItem = function (array) {
    return array[getRandomInteger(0, array.length - 1)];
  };

  /**
   * получение случайного количества элементов массива.
   * @param {Array} array - массив, из которого нужно взять элементы.
   * @return {Array}
   */
  var sliceArrayRandomly = function (array) {
    return shuffleArray(array).slice(0, getRandomInteger(1, array.length - 1));
  };

  window.utils = {
    getInclineNoun: getInclineNoun,
    shuffleArray: shuffleArray,
    getRandomInteger: getRandomInteger,
    getRandomArrayItem: getRandomArrayItem,
    sliceArrayRandomly: sliceArrayRandomly
  };
})();
