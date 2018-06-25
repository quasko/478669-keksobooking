'use strict';

(function () {
  var template = document.querySelector('template').content;
  var mapPinSize = {
    WIDTH: 50,
    HEIGHT: 70
  };

  var mapPins = [];

  var pinStatus = {
    activeNode: null,
    deactivate: function () {
      if (this.activeNode) {
        this.activeNode.classList.remove('map__pin--active');
        this.activeNode = null;
      }
    },
    activate: function (pin) {
      this.activeNode = pin;
      this.activeNode.classList.add('map__pin--active');
    }
  };

  /**
   * создание DOM элемента для метки на карте
   * @param {Advert} pin - объект с параметрами метки на карте
   * @return {Node}
   */
  var createPinElement = function (pin) {
    var mapPinElement = template.querySelector('.map__pin').cloneNode(true);

    mapPinElement.style.left = (pin.location.x - mapPinSize.WIDTH / 2) + 'px';
    mapPinElement.style.top = (pin.location.y - mapPinSize.HEIGHT).toString() + 'px';
    mapPinElement.querySelector('img').src = pin.author.avatar;
    mapPinElement.querySelector('img').alt = pin.offer.title;

    mapPinElement.addEventListener('click', function (evt) {
      if (evt.currentTarget !== pinStatus.activeNode) {
        pinStatus.deactivate();
        pinStatus.activate(evt.currentTarget);
        window.card.deactivate();
        window.card.render(pin);
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
  var createPinsFragment = function (array) {
    var fragment = document.createDocumentFragment();
    array.forEach(function (item) {
      fragment.appendChild(createPinElement(item));
    });

    return fragment;
  };

  window.pin = {
    render: function (adverts) {
      var pinsFragment = createPinsFragment(adverts);
      return pinsFragment;
    },
    deactivate: function () {
      pinStatus.deactivate();
    },
    remove: function () {
      mapPins.forEach(function (item) {
        item.remove();
      });
    },
    filter: function () {
      console.log(pinStatus.activeNode);
    }
  };
})();
