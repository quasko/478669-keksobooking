'use strict';

(function () {
  var AVATAR_DIR = 'img/avatars/user';
  var AVATAR_EXT = '.png';

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
   * получение пути к файлу аватара по индексу.
   * @param {number} index - индекс аватара.
   * @return {string}
   */
  var getAvatarPath = function (index) {
    var avatarIndex = index < 10 ? '0' + index : '' + index;
    return AVATAR_DIR + avatarIndex + AVATAR_EXT;
  };

  /**
   * генерация случайного объявления.
   * @param {number} index - индекс объявления.
   * @return {Advert}
   */
  var generateAdvertItem = function (index) {
    var locationX = window.utils.getRandomInteger(locationParams.x.MIN, locationParams.x.MAX);
    var locationY = window.utils.getRandomInteger(locationParams.y.MIN, locationParams.y.MAX);
    var advert = {
      author: {
        avatar: getAvatarPath(index + 1)
      },
      offer: {
        title: offerParams.TITLES[index],
        address: locationX + ', ' + locationY,
        price: window.utils.getRandomInteger(offerParams.priceParams.MIN, offerParams.priceParams.MAX),
        type: window.utils.getRandomArrayItem(offerParams.TYPES),
        rooms: window.utils.getRandomInteger(offerParams.roomsCount.MIN, offerParams.roomsCount.MAX),
        guests: window.utils.getRandomInteger(offerParams.guestsCount.MIN, offerParams.guestsCount.MAX),
        checkin: window.utils.getRandomArrayItem(offerParams.CHECK_TIMES),
        checkout: window.utils.getRandomArrayItem(offerParams.CHECK_TIMES),
        features: window.utils.sliceArrayRandomly(offerParams.FEATURES),
        description: '',
        photos: window.utils.shuffleArray(offerParams.PHOTOS)
      },
      location: {
        x: locationX,
        y: locationY
      }
    };

    return advert;
  };

  window.generateAdvertItem = generateAdvertItem;
})();
