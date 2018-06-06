'use strict';

var ADVERTS_COUNT = 8;
var AVATARS_COUNT = 8;
var MIN_GUESTS_COUNT = 5;
var MAX_GUESTS_COUNT = 10;
var MIN_ROOMS_COUNT = 1;
var MAX_ROOMS_COUNT = 5;
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var MIN_LOCATION_X = 300;
var MAX_LOCATION_X = 900;
var MIN_LOCATION_Y = 130;
var MAX_LOCATION_Y = 630;
var MAP_PIN_X_OFFSET = 25;
var MAP_PIN_Y_OFFSET = 70;

var adverts = [];

var titles = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var types = [
  'palace',
  'flat',
  'house',
  'bungalo'
];

var checkTimes = [
  '12:00',
  '13:00',
  '14:00',
];

var features = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var photos = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var shuffleArray = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
};

var getRandomNumber = function (minValue, maxValue) {
  return Math.round(Math.random() * (maxValue - minValue)) + minValue;
};

var getOfferType = function (type) {
  switch (type) {
    case 'flat':
      return 'Квартира';
    case 'bungalo':
      return 'Бунгало';
    case 'house':
      return 'Дом';
    case 'palace':
      return 'Дворец';
    default:
      return 'Квартира';
  }
};

var renderMapPin = function (mapPin) {
  var mapPinElement = mapPinTemplate.cloneNode(true);

  mapPinElement.style = 'left: ' + (mapPin.location.x - MAP_PIN_X_OFFSET) + 'px;top: ' + (mapPin.location.y - MAP_PIN_Y_OFFSET) + 'px;';
  mapPinElement.querySelector('img').src = mapPin.author.avatar;
  mapPinElement.querySelector('img').alt = mapPin.offer.title;

  return mapPinElement;
};

var renderFeatures = function (listFeatures) {
  var featuresFragment = document.createDocumentFragment();

  for (var i = 0; i < listFeatures.length; i++) {
    var listItemElement = document.createElement('li');
    listItemElement.classList.add('popup__feature');
    listItemElement.classList.add('popup__feature--' + listFeatures[i]);
    featuresFragment.appendChild(listItemElement);
  }

  return featuresFragment;
};

var renderPhotos = function (listPhotos) {
  var photosFragment = document.createDocumentFragment();

  for (var i = 0; i < listPhotos.length; i++) {
    var photoElement = popupPhotoTemplate.cloneNode();
    photoElement.src = listPhotos[i];
    photosFragment.appendChild(photoElement);
  }

  return photosFragment;
};

var renderMapCard = function (mapCard) {
  var mapCardElement = mapCardTemplate.cloneNode(true);

  mapCardElement.querySelector('.popup__title').textContent = mapCard.offer.title;
  mapCardElement.querySelector('.popup__text--address').textContent = mapCard.offer.address;
  mapCardElement.querySelector('.popup__text--price').textContent = mapCard.offer.price + '₽/ночь';
  mapCardElement.querySelector('.popup__type').textContent = getOfferType(mapCard.offer.type);
  mapCardElement.querySelector('.popup__text--capacity').textContent = mapCard.offer.rooms + ' комнаты для ' + mapCard.offer.guests + ' гостей';
  mapCardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + mapCard.offer.checkin + ', выезд до ' + mapCard.offer.checkout;
  mapCardElement.querySelector('.popup__features').innerHTML = '';
  mapCardElement.querySelector('.popup__features').appendChild(renderFeatures(mapCard.offer.features));
  mapCardElement.querySelector('.popup__description').textContent = mapCard.offer.description;
  mapCardElement.querySelector('.popup__photos').innerHTML = '';
  mapCardElement.querySelector('.popup__photos').appendChild(renderPhotos(mapCard.offer.photos));
  mapCardElement.querySelector('.popup__avatar').src = mapCard.author.avatar;

  return mapCardElement;
};

var avatarIndex = [];

for (var i = 1; i <= AVATARS_COUNT; i++) {
  avatarIndex.push(i);
}

avatarIndex = shuffleArray(avatarIndex);

titles = shuffleArray(titles);

for (i = 0; i < ADVERTS_COUNT; i++) {
  var locationX = getRandomNumber(MIN_LOCATION_X, MAX_LOCATION_X);
  var locationY = getRandomNumber(MIN_LOCATION_Y, MAX_LOCATION_Y);
  var advert = {
    author: {
      avatar: 'img/avatars/user0' + avatarIndex[i] + '.png'
    },

    offer: {
      title: titles[i],
      address: locationX + ', ' + locationY,
      price: getRandomNumber(MIN_PRICE, MAX_PRICE),
      type: types[getRandomNumber(0, checkTimes.length - 1)],
      rooms: getRandomNumber(MIN_ROOMS_COUNT, MAX_ROOMS_COUNT),
      guests: getRandomNumber(MIN_GUESTS_COUNT, MAX_GUESTS_COUNT),
      checkin: checkTimes[getRandomNumber(0, checkTimes.length - 1)],
      checkout: checkTimes[getRandomNumber(0, checkTimes.length - 1)],
      features: shuffleArray(features).slice(0, getRandomNumber(1, features.length - 1)),
      description: '',
      photos: shuffleArray(photos)
    },

    location: {
      x: locationX,
      y: locationY
    }
  };

  adverts.push(advert);
}

var map = document.querySelector('.map');
map.classList.remove('map--faded');

var mapPinTemplate = document.querySelector('template')
    .content
    .querySelector('.map__pin');

var mapCardTemplate = document.querySelector('template')
    .content
    .querySelector('.map__card');

var popupPhotoTemplate = document.querySelector('template')
    .content
    .querySelector('.popup__photo');

var mapPinsElement = document.querySelector('.map__pins');
var mapElement = document.querySelector('.map');
var mapCardElement = document.querySelector('.map__filters-container');
var fragmentMapPin = document.createDocumentFragment();

for (i = 0; i < adverts.length; i++) {
  fragmentMapPin.appendChild(renderMapPin(adverts[i]));
}

mapPinsElement.appendChild(fragmentMapPin);

var fragmentMapCard = document.createDocumentFragment();

fragmentMapCard.appendChild(renderMapCard(adverts[0]));
mapElement.insertBefore(fragmentMapCard, mapCardElement);
