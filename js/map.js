'use strict';

var ADVERTS_COUNT = 8;
var AVATAR_FOLDER_PATH = 'img/avatars/user';
var AVATAR_FILE_TYPE = '.png';
var PHOTO_WIDTH = 45;
var PHOTO_HEIGHT = 40;

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
    MIN: 5,
    MAX: 10
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

var mapPinOffset = {
  X: 25,
  Y: 70
};

var offerType = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец'
};

/**
 * shuffleArray - расположение элементов массива в случайном порядке.
 * @param {Array.<string>} array - массив в котором нужно изменить порядок элементов на случайный.
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
 * getRandomInteger - генерация случайного числа в указанном диапазоне.
 * @param {number} minValue - миниальное значение из диапазона.
 * @param {number} maxValue - максимальное значение из диапазона.
 * @return {number}
 */
var getRandomInteger = function (minValue, maxValue) {
  return Math.round(Math.random() * (maxValue - minValue)) + minValue;
};

/**
 * getRandomArrayItem - получение случайного элемента массива.
 * @param {Array.<String>} array - массив из которого нужно получить случайный элемент.
 * @return {String}
 */
var getRandomArrayItem = function (array) {
  return array[getRandomInteger(0, array.length - 1)];
};

/**
 * sliceArrayRandomly - получение случайного количества элементов массива.
 * @param {Array.<String>} array - массив, из которого нужно взять элементы.
 * @return {Array}
 */
var sliceArrayRandomly = function (array) {
  return array.slice(0, getRandomInteger(1, array.length - 1));
};

var template = document.querySelector('template').content;

/**
 * createPinElement - создание DOM элемента для метки на карте
 * @param {Object} mapPin - объект с параметрами метки на карте
 * @return {Node}
 */
var createPinElement = function (mapPin) {
  var mapPinElement = template.querySelector('.map__pin').cloneNode(true);

  mapPinElement.style.left = (mapPin.location.x - mapPinOffset.X) + 'px';
  mapPinElement.style.top = (mapPin.location.y - mapPinOffset.Y).toString() + 'px';
  mapPinElement.querySelector('img').src = mapPin.author.avatar;
  mapPinElement.querySelector('img').alt = mapPin.offer.title;

  return mapPinElement;
};

/**
 * createMapPinFragment - создание фрагмента содержащего метки на карте.
 * @param {Array.<HTMLElement>} array - массив с параметрами меток на карте.
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
 * getAvatarPath - получение пути к файлу аватара по индексу.
 * @param {number} index - индекс аватара.
 * @return {string}
 */
var getAvatarPath = function (index) {
  var avatarIndex = index < 10 ? '0' + (index + 1) : '' + (index + 1);
  return AVATAR_FOLDER_PATH + avatarIndex + AVATAR_FILE_TYPE;
};

/**
 * generateAdvertItem - генерация случайного объявления.
 * @param {number} index - индекс объявления.
 * @return {Object}
 */
var generateAdvertItem = function (index) {
  var locationX = getRandomInteger(locationParams.x.MIN, locationParams.x.MAX);
  var locationY = getRandomInteger(locationParams.y.MIN, locationParams.y.MAX);
  var advert = {
    author: {
      avatar: getAvatarPath(index)
    },
    offer: {
      title: offerParams.TITLES[index],
      address: locationX + ', ' + locationY,
      price: getRandomInteger(offerParams.priceParams.MIN, offerParams.priceParams.MAX),
      type: getRandomArrayItem(offerParams.TYPES),
      rooms: getRandomInteger(offerParams.roomsCount.MIN, offerParams.roomsCount.MAX),
      guests: getRandomInteger(offerParams.guestsCount.MIN, offerParams.guestsCount.MIN),
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
 * generateAdverts - генерация массива случайных элементов.
 * @param {number} count - количество объявлений.
 * @return {Array.<Object>}
 */
var generateAdverts = function (count) {

  var adverts = [];
  for (var i = 0; i < count; i++) {
    adverts.push(generateAdvertItem(i));
  }

  return adverts;
};

/**
 * createFeatureElement - создание элемента из списка удобств в объявлении.
 * @param {string} feature - название удобства
 * @return {HTMLElement}
 */
var createFeatureElement = function (feature) {
  var listItemElement = document.createElement('li');
  listItemElement.classList.add('popup__feature');
  listItemElement.classList.add('popup__feature--' + feature);

  return listItemElement;
};

/**
 * createFeatureFragment - создание списка удобств.
 * @param {Array.<HTMLElement>} listFeatures - массив с удобствами.
 * @return {HTMLElement}
 */
var createFeatureFragment = function (listFeatures) {
  var featuresFragment = document.createDocumentFragment();

  for (var i = 0; i < listFeatures.length; i++) {
    featuresFragment.appendChild(createFeatureElement(listFeatures[i]));
  }

  return featuresFragment;
};

/**
 * createPhotoElement - создание элемента с фотографией в объявлении
 * @param {string} src - путь к файлу
 * @return {HTMLElement}
 */
var createPhotoElement = function (src) {
  var photoElement = document.createElement('img');
  photoElement.classList.add('popup__photo');
  photoElement.width = PHOTO_WIDTH;
  photoElement.height = PHOTO_HEIGHT;
  photoElement.alt = 'Фотография жилья';
  photoElement.src = src;
  return photoElement;
};

/**
 * createPhotosFragment - создание фрагмента, содержащего фотографии в объявлении
 * @param {Array.<HTMLElement>} listPhotos - массив с элементами содержащими фотографии
 * @return {HTMLElement}
 */
var createPhotosFragment = function (listPhotos) {
  var photosFragment = document.createDocumentFragment();

  for (var i = 0; i < listPhotos.length; i++) {
    photosFragment.appendChild(createPhotoElement(listPhotos[i]));
  }

  return photosFragment;
};

/**
 * createMapCardElement - создание карточки объявления на карте
 * @param {Object} advert - объект с параметрами карточки объявления
 * @return {HTMLElement}
 */
var createMapCardElement = function (advert) {
  var mapCardElement = template.querySelector('.map__card').cloneNode(true);

  mapCardElement.querySelector('.popup__title').textContent = advert.offer.title;
  mapCardElement.querySelector('.popup__text--address').textContent = advert.offer.address;
  mapCardElement.querySelector('.popup__text--price').textContent = advert.offer.price + '₽/ночь';
  mapCardElement.querySelector('.popup__type').textContent = offerType[advert.offer.type];
  mapCardElement.querySelector('.popup__text--capacity').textContent =
    advert.offer.rooms + ' комнаты для ' +
    advert.offer.guests + ' гостей';
  mapCardElement.querySelector('.popup__text--time').textContent =
    'Заезд после ' + advert.offer.checkin +
    ', выезд до ' + advert.offer.checkout;
  mapCardElement.querySelector('.popup__features').appendChild(createFeatureFragment(advert.offer.features));
  mapCardElement.querySelector('.popup__description').textContent = advert.offer.description;
  mapCardElement.querySelector('.popup__photos').appendChild(createPhotosFragment(advert.offer.photos));
  mapCardElement.querySelector('.popup__avatar').src = advert.author.avatar;

  return mapCardElement;
};

var initMap = function () {
  var adverts = generateAdverts(ADVERTS_COUNT);
  var mapElement = document.querySelector('.map');
  mapElement.classList.remove('map--faded');
  var mapPinsElement = document.querySelector('.map__pins');
  var mapPinFragment = createMapPinFragment(adverts);
  mapPinsElement.appendChild(mapPinFragment);
  var mapCardElement = document.querySelector('.map__filters-container');
  var mapCardFragment = document.createDocumentFragment();
  mapCardFragment.appendChild(createMapCardElement(adverts[0]));
  mapElement.insertBefore(mapCardFragment, mapCardElement);
};

initMap();
