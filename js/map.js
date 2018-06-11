'use strict';

var ADVERTS_COUNT = 8;
var AVATAR_FOLDER_PATH = 'img/avatars/user';
var AVATAR_FILE_TYPE = '.png';

var photoSize = {
  WIDTH: 45,
  HEIGTH: 40
};

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

var mapPinSize = {
  WIDTH: 50,
  HEIGHT: 70
};

var OfferTypesDict = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец'
};

/**
 * @typedef {Object} Advert - объект с параметрами карточки объявления.
 * @param {Author} author - объект с данными автора объявления.
 * @param {Offer} offer - объект с данными о предложении.
 * @param {Location} location - объекс с координами метки предложения на карте.
 */

/**
 * @typedef {Object} Author - объект с данными автора объявления.
 * @param {string} avatar - путь к  фото автора.
 */

/**
  * @typedef {Object} Offer - объект с данными о предложении.
  * @param {string} title - заголовок предложения.
  * @param {string} address - адрес предложения.
  * @param {number} price - цена предложения.
  * @param {string} type - тип предложения.
  * @param {number} rooms - количество комнат.
  * @param {number} guests - максимальное количество гостей.
  * @param {string} checkin - время заезда.
  * @param {string} checkout - время выезда.
  * @param {Array.<string>} features - массив со списком удобств.
  * @param {string} description - описание.
  * @param {Array.<string>} photos - массив с путями к фотографиям предложения.
  */

/**
  * @typedef {Object} Location - объекс с координами метки предложения на карте.
  * @param {number} x - x координата метки предложения на карте.
  * @param {number} y - y координата метки предложения на карте.
  */

var template = document.querySelector('template').content;
var mapElement = document.querySelector('.map');

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
 * создание DOM элемента для метки на карте
 * @param {Advert} mapPin - объект с параметрами метки на карте
 * @return {Node}
 */
var createPinElement = function (mapPin) {
  var mapPinElement = template.querySelector('.map__pin').cloneNode(true);

  mapPinElement.style.left = (mapPin.location.x - mapPinSize.WIDTH / 2) + 'px';
  mapPinElement.style.top = (mapPin.location.y - mapPinSize.HEIGHT).toString() + 'px';
  mapPinElement.querySelector('img').src = mapPin.author.avatar;
  mapPinElement.querySelector('img').alt = mapPin.offer.title;

  return mapPinElement;
};

/**
 * создание фрагмента содержащего метки на карте.
 * @param {Array.<Advert>} array - массив с параметрами меток на карте.
 * @return {Node}
 */
var createMapPinFragment = function (array) {
  var fragment = document.createDocumentFragment();
  array.forEach(function (item) {
    fragment.appendChild(createPinElement(item));
  });

  return fragment;
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

/**
 * создание элемента из списка удобств в объявлении.
 * @param {string} feature - название удобства
 * @return {Node}
 */
var createFeatureElement = function (feature) {
  var listItemElement = document.createElement('li');
  listItemElement.classList.add('popup__feature');
  listItemElement.classList.add('popup__feature--' + feature);

  return listItemElement;
};

/**
 * создание элемента с фотографией в объявлении
 * @param {string} src - путь к файлу
 * @return {Node}
 */
var createPhotoElement = function (src) {
  var photoElement = document.createElement('img');
  photoElement.classList.add('popup__photo');
  photoElement.width = photoSize.WIDTH;
  photoElement.height = photoSize.HEIGHT;
  photoElement.alt = 'Фотография жилья';
  photoElement.src = src;
  return photoElement;
};

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
 * создание карточки объявления на карте
 * @param {Advert} advert - объект с параметрами карточки объявления
 * @return {Node}
 */
var createMapCardElement = function (advert) {
  var mapCardElement = template.querySelector('.map__card').cloneNode(true);

  mapCardElement.querySelector('.popup__title').textContent = advert.offer.title;
  mapCardElement.querySelector('.popup__text--address').textContent = advert.offer.address;
  mapCardElement.querySelector('.popup__text--price').textContent = advert.offer.price + '₽/ночь';
  mapCardElement.querySelector('.popup__type').textContent = OfferTypesDict[advert.offer.type];
  mapCardElement.querySelector('.popup__text--capacity').textContent =
    advert.offer.rooms + ' ' + getInclineNoun(['комната', 'комнаты', 'комнат'], advert.offer.rooms) + ' для ' +
    advert.offer.guests + ' ' + getInclineNoun(['гостя', 'гостей', 'гостей'], advert.offer.guests) + ' гостей';
  mapCardElement.querySelector('.popup__text--time').textContent =
    'Заезд после ' + advert.offer.checkin +
    ', выезд до ' + advert.offer.checkout;

  advert.offer.features.forEach(function (item) {
    mapCardElement.querySelector('.popup__features').appendChild((createFeatureElement(item)));
  });

  advert.offer.photos.forEach(function (item) {
    mapCardElement.querySelector('.popup__photos').appendChild(createPhotoElement(item));
  });

  mapCardElement.querySelector('.popup__avatar').src = advert.author.avatar;

  return mapCardElement;
};

var initMap = function () {
  var adverts = generateAdverts(ADVERTS_COUNT);
  mapElement.classList.remove('map--faded');
  var mapPinsElement = mapElement.querySelector('.map__pins');
  var mapPinFragment = createMapPinFragment(adverts);
  mapPinsElement.appendChild(mapPinFragment);
  var mapCardElement = mapElement.querySelector('.map__filters-container');
  mapElement.insertBefore(createMapCardElement(adverts[0]), mapCardElement);
};

initMap();
