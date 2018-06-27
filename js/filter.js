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

  var filterField = {
    type: filter.querySelector('#housing-type'),
    price: filter.querySelector('#housing-price'),
    rooms: filter.querySelector('#housing-rooms'),
    guests: filter.querySelector('#housing-guests'),
    features: filter.querySelector('#housing-features'),
  };

  var PriceRange = {
    'low': function (value) {
      return value < price.LOW;
    },
    'middle': function (value) {
      return value >= price.LOW && value <= price.HIGH;
    },
    'high': function (value) {
      return value > price.HIGH;
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

    var checkedFeatures = Array.from(filterField.features.elements)
      .filter(function (item) {
        return item.checked;
      })
      .map(function (item) {
        return item.value;
      });

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
        return item.offer.features.includes(feature);
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
