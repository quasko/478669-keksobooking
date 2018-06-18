'use strict';

(function () {
  var ESC_KEYCODE = 27;
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

  var mapCardStatus = {
    card: null,
    checkCard: function () {
      return this.card ? true : false;
    },
    deactivateCard: function () {
      if (this.checkCard()) {
        this.card.remove();
        this.card = null;
      }
    },
  };

  /**
   * вставка карточки объявления в DOM
   * @param {Node} card - карточка объявления
   */
  var renderCard = function (card) {
    if (mapCardStatus.checkCard()) {
      mapCardStatus.deactivateCard();
    }
    mapCardStatus.card = card;
    mapElement.insertBefore(card, mapFilter);
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
    photoElement.height = photoSize.HEIGTH;
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

    mapCardElement.querySelector('.popup__description').textContent = advert.offer.description;

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
    mapCardStatus.deactivateCard();
    window.pins.deactivatePin();
    document.removeEventListener('keydown', popupEscPressHandler);
  };

  var popupEscPressHandler = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closePopup();
    }
  };

  window.card = {
    renderMapCard: function (mapPin) {
      var newCard = createMapCardElement(mapPin);
      renderCard(newCard);
    },
    deactivateCard: function () {
      mapCardStatus.deactivateCard();
    }
  };

})();
