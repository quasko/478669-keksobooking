'use strict';

(function () {
  var AVATAR_FOLDER_PATH = 'img/avatars/user';
  var AVATAR_FILE_TYPE = '.png';

  var offerParams = {
    TITLES: [
      'Большая уютная квартира',
      'Маленькая неуютная квартира',
      'Огромный прекрасный дворец',
      'Маленький ужасный дворец',
      'Красивый гостевой домик',
      'Некрасивый негостеприимный домик',
      'Уютное бунгало далеко от моря',
      'Неуютное бунгало по колено в воде'
    ],

    TYPES: [
      'palace',
      'flat',
      'house',
      'bungalo'
    ],

    CHECK_TIMES: [
      '12:00',
      '13:00',
      '14:00',
    ],

    FEATURES: [
      'wifi',
      'dishwasher',
      'parking',
      'washer',
      'elevator',
      'conditioner'
    ],

    PHOTOS: [
      'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
    ],

    guestsCount: {
      MIN: 1,
      MAX: 200
    },

    roomsCount: {
      MIN: 1,
      MAX: 5
    },

    priceParams: {
      MIN: 1000,
      MAX: 1000000
    }
  };

  var locationParams = {
    x: {
      MIN: 300,
      MAX: 900
    },
    y: {
      MIN: 130,
      MAX: 630
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
    return array.slice(0, getRandomInteger(1, array.length - 1));
  };

  /**
   * получение пути к файлу аватара по индексу.
   * @param {number} index - индекс аватара.
   * @return {string}
   */
  var getAvatarPath = function (index) {
    var avatarIndex = index < 10 ? '0' + index : '' + index;
    return AVATAR_FOLDER_PATH + avatarIndex + AVATAR_FILE_TYPE;
  };

  /**
   * генерация случайного объявления.
   * @param {number} index - индекс объявления.
   * @return {Advert}
   */
  var generateAdvertItem = function (index) {
    var locationX = getRandomInteger(locationParams.x.MIN, locationParams.x.MAX);
    var locationY = getRandomInteger(locationParams.y.MIN, locationParams.y.MAX);
    var advert = {
      author: {
        avatar: getAvatarPath(index + 1)
      },
      offer: {
        title: offerParams.TITLES[index],
        address: locationX + ', ' + locationY,
        price: getRandomInteger(offerParams.priceParams.MIN, offerParams.priceParams.MAX),
        type: getRandomArrayItem(offerParams.TYPES),
        rooms: getRandomInteger(offerParams.roomsCount.MIN, offerParams.roomsCount.MAX),
        guests: getRandomInteger(offerParams.guestsCount.MIN, offerParams.guestsCount.MAX),
        checkin: getRandomArrayItem(offerParams.CHECK_TIMES),
        checkout: getRandomArrayItem(offerParams.CHECK_TIMES),
        features: sliceArrayRandomly(shuffleArray(offerParams.FEATURES)),
        description: '',
        photos: shuffleArray(offerParams.PHOTOS)
      },
      location: {
        x: locationX,
        y: locationY
      }
    };

    return advert;
  };

  /**
   * генерация массива случайных элементов.
   * @param {number} count - количество объявлений.
   * @return {Array.<Advert>}
   */
  var generateAdverts = function (count) {
    var adverts = [];
    for (var i = 0; i < count; i++) {
      adverts.push(generateAdvertItem(i));
    }

    return adverts;
  };

  window.data = {
    generateAdverts: generateAdverts
  };

})();
