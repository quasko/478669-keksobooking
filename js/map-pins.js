'use strict';

(function () {
  var ADVERTS_COUNT = 8;
  var template = document.querySelector('template').content;
  var mapPinsElement = document.querySelector('.map__pins');
  var mapPinSize = {
    WIDTH: 50,
    HEIGHT: 70
  };

  var mapPins = [];

  var mapPinStatus = {
    pin: null,
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
        mapPinStatus.deactivatePin();
        mapPinStatus.activatePin(evt.currentTarget);

        /* var newCard = createMapCardElement(mapPin);
        renderCard(newCard); */
        window.renderMapCard(mapPin);
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

  /* var adverts = window.generateAdverts(ADVERTS_COUNT);
  var mapPinFragment = createMapPinFragment(adverts);
  mapPinsElement.appendChild(mapPinFragment); */

  window.renderMapPins = function () {
    var adverts = window.generateAdverts(ADVERTS_COUNT);
    var mapPinFragment = createMapPinFragment(adverts);
    mapPinsElement.appendChild(mapPinFragment);
  };

})();
