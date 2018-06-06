'use strict';
var ADVERTS_COUNT = 8;

var adverts = [];

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
  switch(type) {
    case 'flat':
      return 'Квартира';
    case 'bungalo':
      return 'Бунгало';
    case 'house':
      return 'Дом';
    case 'palace':
      return 'Дворец';
    default:
      break;
  }
};

var renderMapPin = function (mapPin) {
  var mapPinElement = mapPinTemplate.cloneNode(true);
  mapPinElement.style = 'left: ' + (mapPin.location.x - 25) +  'px; top: ' + (mapPin.location.y - 70) + 'px;';
  mapPinElement.querySelector('img').src = mapPin.author.avatar;
  mapPinElement.querySelector('img').alt = mapPin.offer.title;

  return mapPinElement;
};

var renderMapCard = function (mapCard) {
  var mapCardElement = mapCardTemplate.cloneNode(true);

  mapCardElement.querySelector('.popup__title').textContent = mapCard.offer.title;
  mapCardElement.querySelector('.popup__text--address').textContent = mapCard.offer.address;
  mapCardElement.querySelector('.popup__text--price').textContent = mapCard.offer.price + '₽/ночь';
  mapCardElement.querySelector('.popup__type').textContent = getOfferType(mapCard.offer.type);
  mapCardElement.querySelector('.popup__text--capacity').textContent = mapCard.offer.rooms + ' комнаты для ' + mapCard.offer.guests + ' гостей';
  mapCardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + mapCard.offer.checkin + ', выезд до ' + mapCard.offer.checkout;
  mapCardElement.querySelector('.popup__features').textContent = mapCard.offer.features;
  mapCardElement.querySelector('.popup__description').textContent = mapCard.offer.description;
  mapCardElement.querySelector('.popup__photos img').src = mapCard.offer.photos[0];
  mapCardElement.querySelector('.popup__avatar').src = mapCard.author.avatar;

  //console.log(mapCardElement);
  return mapCardElement;
};
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

var avatarIndex = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8]);

titles = shuffleArray(titles);

for (var i = 0; i < ADVERTS_COUNT; i++) {
  var locationX = getRandomNumber(300, 900);
  var locationY = getRandomNumber(130, 630);
  var advert = {
    author: {
      avatar: 'img/avatars/user0' + avatarIndex[i] + '.png'
    },

    offer: {
      title: titles[i],
      address: locationX + ', ' + locationY,
      price: getRandomNumber(1000, 1000000),
      type: types[getRandomNumber(0, checkTimes.length - 1)],
      rooms: getRandomNumber(1, 5),
      guests: getRandomNumber(3, 10),
      checkin: checkTimes[getRandomNumber(0, checkTimes.length - 1)],
      checkout: checkTimes[getRandomNumber(0, checkTimes.length - 1)],
      features: shuffleArray(features).slice(0, getRandomNumber(0, features.length - 1)),
      description: '',
      photos: shuffleArray(photos)
    },

    location: {
      x: locationX,
      y: locationY
    }
  };

  adverts.push(advert);

};

var map = document.querySelector('.map');
map.classList.remove('map--faded');
//console.log(adverts);

var mapPinTemplate = document.querySelector('template')
    .content
    .querySelector('.map__pin');

var mapCardTemplate = document.querySelector('template')
    .content
    .querySelector('.map__card');

var mapPinsElement = document.querySelector('.map__pins');
var mapCardElement = document.querySelector('.map__filters-container');

var fragmentMapPin = document.createDocumentFragment();


for (var i = 0; i < adverts.length; i++) {
  fragmentMapPin.appendChild(renderMapPin(adverts[i]));
  //console.log(adverts[i].author.avatar);
};

console.log(renderMapCard(adverts[0]));

mapPinsElement.appendChild(fragmentMapPin);

var fragmentMapCard = document.createDocumentFragment();

fragmentMapCard.appendChild(renderMapCard(adverts[0]));

//console.log(fragmentMapCard);
//mapCardElement.insertAdjacentHTML('beforebegin', fragmentMapCard.content);

//console.log(adverts);



