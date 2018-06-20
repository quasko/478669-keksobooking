'use strict';

(function () {
  var photoSize = {
    WIDTH: 45,
    HEIGTH: 40
  };

  /**
   * @enum {string} OfferTypesDict - названия типов предложений
   */
  var OfferTypesDict = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };

  var mapElement = document.querySelector('.map');
  var template = document.querySelector('template').content;
  var mapFilter = document.querySelector('.map__filters-container');

  var cardStatus = {
    activeNode: null,
    check: function () {
      return Boolean(this.activeNode);
    },
    deactivate: function () {
      if (this.check()) {
        this.activeNode.remove();
        this.activeNode = null;
      }
    },
  };

  /**
   * вставка карточки объявления в DOM
   * @param {Node} card - карточка объявления
   */
  var renderCard = function (card) {
    cardStatus.activeNode = card;
    mapElement.insertBefore(card, mapFilter);
  };

  /**
   * создание элемента из списка удобств в объявлении.
   * @param {string} feature - название удобства
   * @return {Node}
   */
  var createFeature = function (feature) {
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
  var createPhoto = function (src) {
    var photoElement = document.createElement('img');
    photoElement.classList.add('popup__photo');
    photoElement.width = photoSize.WIDTH;
    photoElement.height = photoSize.HEIGTH;
    photoElement.alt = 'Фотография жилья';
    photoElement.src = src;
    return photoElement;
  };

  /**
   * создание карточки объявления на карте
   * @param {Advert} advert - объект с параметрами карточки объявления
   * @return {Node}
   */
  var createCard = function (advert) {
    var mapCardElement = template.querySelector('.map__card').cloneNode(true);
    var closeButton = mapCardElement.querySelector('.popup__close');

    mapCardElement.querySelector('.popup__title').textContent = advert.offer.title;
    mapCardElement.querySelector('.popup__text--address').textContent = advert.offer.address;
    mapCardElement.querySelector('.popup__text--price').textContent = advert.offer.price + '₽/ночь';
    mapCardElement.querySelector('.popup__type').textContent = OfferTypesDict[advert.offer.type];
    mapCardElement.querySelector('.popup__text--capacity').textContent =
      advert.offer.rooms + ' ' + window.utils.getInclineNoun(['комната', 'комнаты', 'комнат'], advert.offer.rooms) + ' для ' +
      advert.offer.guests + ' ' + window.utils.getInclineNoun(['гостя', 'гостей', 'гостей'], advert.offer.guests) + ' гостей';
    mapCardElement.querySelector('.popup__text--time').textContent =
      'Заезд после ' + advert.offer.checkin +
      ', выезд до ' + advert.offer.checkout;

    advert.offer.features.forEach(function (item) {
      mapCardElement.querySelector('.popup__features').appendChild((createFeature(item)));
    });

    mapCardElement.querySelector('.popup__description').textContent = advert.offer.description;

    advert.offer.photos.forEach(function (item) {
      mapCardElement.querySelector('.popup__photos').appendChild(createPhoto(item));
    });

    mapCardElement.querySelector('.popup__avatar').src = advert.author.avatar;
    closeButton.addEventListener('click', closeCard);
    document.addEventListener('keydown', cardEscPressHandler);

    return mapCardElement;
  };

  var closeCard = function () {
    cardStatus.deactivate();
    window.pin.deactivate();
    document.removeEventListener('keydown', cardEscPressHandler);
  };

  var cardEscPressHandler = function (evt) {
    window.utils.isEscEvent(evt, closeCard);
  };

  window.card = {
    render: function (pin) {
      var newCard = createCard(pin);
      renderCard(newCard);
    },
    deactivate: function () {
      cardStatus.deactivate();
    }
  };

})();
