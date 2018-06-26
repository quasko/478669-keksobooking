'use strict';

(function () {

  var SIMILAR_OFFERS_COUNT = 5;

  var price = {
    LOW: 10000,
    HIGH: 50000
  };

  var advertsDefault = [];
  var advertsFiltered = [];

  var filter = document.querySelector('.map__filters');
  var features = filter.querySelector('.map__features');

  var disableFilters = function () {
    Array.from(filter.elements).forEach(function (item) {
      item.disabled = true;
    });
    filter.removeEventListener('change', filterChangeHandler);
  };

  var enableFilters = function () {
    Array.from(filter.elements).forEach(function (item) {
      item.disabled = false;
    });
    filter.addEventListener('change', filterChangeHandler);
  };

  disableFilters();

  /**
   * @typedef {Object} Filter - объект с параметрами выбранных фильтров
   * @param {string} type - тип жилья
   * @param {string} price - цена за ночь
   * @param {string} rooms - количество комнат
   * @param {string} guests - количество гостей
   * @param {Array.<string>} features - массив со списком удобств
   */

  /**
   * проверка всех полей фильтра
   * @return {Filter}
   */
  var checkfilterState = function () {
    var filterState = {
      type: 'any',
      price: 'any',
      rooms: 'any',
      guests: 'any',
      features: []
    };

    Array.from(filter.elements).forEach(function (item) {

      if (item.tagName === 'FIELDSET') {
        return;
      }

      var key = item.name.includes('-') ?
        item.name.split('-')[1] :
        item.name;

      var value = item.value;

      if (key === 'features') {
        filterState[key] = Array.from(features.elements)
        .filter(function (feature) {
          return feature.checked;
        })
        .map(function (feature) {
          return feature.value;
        });
      } else {
        filterState[key] = value;
      }
    });

    return filterState;
  };

  var filterChangeHandler = window.utils.debounce(function () {
    var filterState = checkfilterState();

    window.card.deactivate();

    advertsFiltered = advertsDefault.filter(function (item) {
      var offer = item.offer;

      if (filterState.type !== offer.type && filterState.type !== 'any') {
        return false;
      }

      if (((filterState.price === 'low' && offer.price >= price.LOW) ||
        (filterState.price === 'middle' && (offer.price < price.LOW || offer.price > price.HIGH)) ||
        (filterState.price === 'high' && offer.price <= price.HIGH)) && (filterState.price !== 'any')) {
        return false;
      }

      if (filterState.rooms !== offer.rooms.toString() && filterState.rooms !== 'any') {
        return false;
      }

      if (filterState.guests !== offer.guests.toString() && filterState.guests !== 'any') {
        return false;
      }

      if (!filterState.features.every(function (feature) {
        return offer.features.includes(feature);
      })) {
        return false;
      }

      return true;
    });

    window.pin.remove();
    window.map.filter(advertsFiltered.slice(0, SIMILAR_OFFERS_COUNT));
  });

  window.filter = {
    disable: disableFilters,
    enable: enableFilters,
    saveAdverts: function (adverts) {
      advertsDefault = adverts.slice();
    }
  };
})();
