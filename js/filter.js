'use strict';

(function () {
  /**
   * @constant {number}
   */
  var SIMILAR_OFFERS_COUNT = 5;

  /**
   * @enum {number} Price - границы диапазона цены за ночь
   */
  var Price = {
    LOW: 10000,
    HIGH: 50000
  };

  var advertsDefault = [];
  var advertsFiltered = [];

  var filter = document.querySelector('.map__filters');
  var filterType = filter.querySelector('#housing-type');
  var filterPrice = filter.querySelector('#housing-price');
  var filterRooms = filter.querySelector('#housing-rooms');
  var filterGuests = filter.querySelector('#housing-guests');
  var filterFeatures = filter.querySelector('#housing-features');

  var filterField = {
    type: filterType,
    price: filterPrice,
    rooms: filterRooms,
    guests: filterGuests,
    features: filterFeatures
  };

  var PriceRange = {
    'low': function (value) {
      return value < Price.LOW;
    },
    'middle': function (value) {
      return value >= Price.LOW && value <= Price.HIGH;
    },
    'high': function (value) {
      return value > Price.HIGH;
    },
    'any': function () {
      return true;
    }
  };

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

  /**
   * @typedef {Object} Offer - объект с параметрами объявления
   * @param {string} type - тип жилья
   * @param {string} price - цена за ночь
   * @param {string} rooms - количество комнат
   * @param {string} guests - количество гостей
   * @param {Array.<string>} features - массив со списком удобств
   */

  /**
   * проверка соответствия выбранного фильтра и поля в объявлении, применяется для полей тип, количество комнат, количество гостей
   * @param {string} field - название фильтра
   * @param {Offer} offer - объект с параметрами объявления
   * @return {boolean}
   */
  var checkFilter = function (field, offer) {
    return filterField[field].value === offer[field].toString() || filterField[field].value === 'any';
  };

  var filterChangeHandler = window.utils.debounce(function () {
    window.card.deactivate();

    var checkedFeatures = Array.from(filterFeatures.querySelectorAll('[name = "features"]:checked'));

    advertsFiltered = advertsDefault.filter(function (item) {
      return checkFilter('type', item.offer);
    });

    advertsFiltered = advertsFiltered.filter(function (item) {
      return PriceRange[filterField.price.value](item.offer.price) || filterField.price.value === 'any';
    });

    advertsFiltered = advertsFiltered.filter(function (item) {
      return checkFilter('rooms', item.offer);
    });

    advertsFiltered = advertsFiltered.filter(function (item) {
      return checkFilter('guests', item.offer);
    });

    advertsFiltered = advertsFiltered.filter(function (item) {
      return checkedFeatures.every(function (feature) {
        return item.offer.features.includes(feature.value);
      });
    });

    window.pin.remove();
    window.map.filter(advertsFiltered.slice(0, SIMILAR_OFFERS_COUNT));
  });

  disableFilters();

  window.filter = {
    disable: disableFilters,
    enable: enableFilters,
    copyAdverts: function (adverts) {
      advertsDefault = adverts.slice();
    }
  };
})();
