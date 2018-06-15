'use strict';

var ADVERTS_COUNT = 8;
var AVATAR_FOLDER_PATH = 'img/avatars/user';
var AVATAR_FILE_TYPE = '.png';
var ESC_KEYCODE = 27;
var ROOMS_MAX_VALUE = 100;

var photoSize = {
  WIDTH: 45,
  HEIGTH: 40
};

var mainPinSize = {
  inactive: {
    WIDTH: 65,
    HEIGHT: 65
  },

  active: {
    WIDTH: 65,
    HEIGHT: 77
  }
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


/**
 * @typedef {Object} OfferTypesDict
 * @param {string} flat
 * @param {string} bungalo
 * @param {string} house
 * @param {string} palace
 */
var OfferTypesDict = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец'
};

/**
 * @typedef {Object} MinPrices
 * @param {number} bungalo
 * @param {number} flat
 * @param {number} house
 * @param {number} palace
 */
var MinPrices = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 1000000
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
var mainPin = document.querySelector('.map__pin--main');
var adForm = document.querySelector('.ad-form');
var inputAddress = document.querySelector('#address');
var fieldsets = document.querySelectorAll('.ad-form > fieldset');
var mapFilter = document.querySelector('.map__filters-container');
var mapPinsElement = mapElement.querySelector('.map__pins');

var form = document.querySelector('.ad-form');
var typeField = form.querySelector('#type');
var priceField = form.querySelector('#price');
var resetButton = form.querySelector('.ad-form__reset');
var checkInField = form.querySelector('#timein');
var checkOutField = form.querySelector('#timeout');
var roomsNumberField = form.querySelector('#room_number');
var capacityField = form.querySelector('#capacity');

var mapPins = [];

var mapOffersStatus = {
  pin: null,
  card: null,
  checkCard: function () {
    return this.card ? true : false;
  },
  deactivateCard: function () {
    this.card.remove();
    this.card = null;
  },
  deactivatePin: function () {
    if (this.pin) {
      this.pin.classList.remove('map__pin--active');
      this.pin = null;
    }
  },
  activatePin: function (pin) {
    this.pin = pin;
    this.pin.classList.add('map__pin--active');
  }
};

/**
 * активация элементов формы
 */
var enableFieldsets = function () {
  fieldsets.forEach(function (item) {
    item.disabled = false;
  });
};

var disableFieldsets = function () {
  fieldsets.forEach(function (item) {
    item.disabled = true;
  });
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
 * вставка карточки объявления в DOM
 * @param {Node} card - карточка объявления
 */
var renderCard = function (card) {
  if (mapOffersStatus.checkCard()) {
    mapOffersStatus.deactivateCard();
  }
  mapOffersStatus.card = card;
  mapElement.insertBefore(card, mapFilter);
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

  mapPinElement.addEventListener('click', function (evt) {
    if (!evt.currentTarget.classList.contains('map__pin--active')) {
      mapOffersStatus.deactivatePin();
      mapOffersStatus.activatePin(evt.currentTarget);

      var newCard = createMapCardElement(mapPin);
      renderCard(newCard);
    }
  });

  mapPins.push(mapPinElement);
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

  var closeButton = mapCardElement.querySelector('.popup__close');
  closeButton.addEventListener('click', closePopup);
  document.addEventListener('keydown', popupEscPressHandler);

  return mapCardElement;
};

var closePopup = function () {
  mapOffersStatus.deactivateCard();
  mapOffersStatus.deactivatePin();
  document.removeEventListener('keydown', popupEscPressHandler);
};

var popupEscPressHandler = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

var initPage = function () {
  mainPin.addEventListener('mouseup', mainPinHandler);
  setAddress(getMainPinAddress());
};

/**
 * перевод карты в активное состояние
 */
var initMap = function () {
  var adverts = generateAdverts(ADVERTS_COUNT);
  mapElement.classList.remove('map--faded');
  var mapPinFragment = createMapPinFragment(adverts);
  mapPinsElement.appendChild(mapPinFragment);
};

/**
 * перевод карты в неактивное стояние
 */
var resetMap = function () {
  mapPins.forEach(function (item) {
    item.remove();
  });
  if (mapOffersStatus.checkCard()) {
    mapOffersStatus.deactivateCard();
  }
  mapOffersStatus.deactivatePin();
  mapElement.classList.add('map--faded');
};

/**
 * @typedef {Object} Coordinates - координаты метки mainPin
 * @param {number} x - координата X
 * @param {number} y - координата Y
 */

/**
 * вычисление адреса метки mainPin на карте
 * @return {Coordinates}
 */
var getMainPinAddress = function () {
  var state = mapElement.classList.contains('map--faded') ? 'inactive' : 'active';
  var addressX = Math.round(mainPin.offsetLeft + mainPinSize[state].WIDTH / 2);
  var addressY = state === 'active' ? Math.round(mainPin.offsetTop + mainPinSize.active.HEIGHT)
    : Math.round(mainPin.offsetTop + mainPinSize.inactive.HEIGHT / 2);
  var coord = {
    x: addressX,
    y: addressY
  };
  return coord;
};

/**
 * установка значения в поле Адрес
 * @param {Coordinates} address - координаты
 */
var setAddress = function (address) {
  inputAddress.value = address.x + ', ' + address.y;
};

/**
 * перевод формы в активное состояние
 */
var initForm = function () {
  adForm.classList.remove('ad-form--disabled');
  enableFieldsets();
};

/**
 * перевод формы в неактивное состояние
 */
var resetForm = function () {
  form.reset();
  disableFieldsets();
  adForm.classList.add('ad-form--disabled');
};

var mainPinHandler = function () {
  initMap();
  initForm();
  setAddress(getMainPinAddress());
  mainPin.removeEventListener('mouseup', mainPinHandler);
};

resetButton.addEventListener('click', function () {
  resetForm();
  resetMap();
  initPage();
});

/**
 * Установка параметров поля "Цена за ночь"
 * @param {number} minPrice
 */
var setPriceFieldParams = function (minPrice) {
  priceField.placeholder = minPrice;
  priceField.min = minPrice;
};

typeField.addEventListener('change', function (evt) {
  setPriceFieldParams(MinPrices[evt.target.value]);
});


var timeFieldsHandler = function (evt) {
  if (evt.target === checkInField) {
    checkOutField.value = evt.target.value;
  } else {
    checkInField.value = evt.target.value;
  }
};

checkInField.addEventListener('change', timeFieldsHandler);

checkOutField.addEventListener('change', timeFieldsHandler);

roomsNumberField.addEventListener('change', function () {
  capacityField.value = roomsNumberField.value;
  var capacityOptions = capacityField.options;
  var currentRoomsValue = parseInt(roomsNumberField.value, 10);

  for (var i = 0; i < capacityOptions.length; i++) {
    if (parseInt(capacityOptions[i].value, 10) <= currentRoomsValue) {
      capacityOptions[i].disabled = false;

      if (currentRoomsValue === ROOMS_MAX_VALUE) {
        capacityOptions[i].disabled = true;
        capacityOptions[i].selected = false;

        if (parseInt(capacityOptions[i].value, 10) === ROOMS_MAX_VALUE) {
          capacityOptions[i].disabled = false;
          capacityOptions[i].selected = true;
        }
      }
    } else {
      capacityOptions[i].disabled = true;
    }

  }
});

initPage();
