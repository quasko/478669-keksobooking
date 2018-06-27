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
    //filter.removeEventListener('change', filterChangeHandler);
  };

  var enableFilters = function () {
    Array.from(filter.elements).forEach(function (item) {
      item.disabled = false;
    });
    //ilter.addEventListener('change', filterChangeHandler);
    filter.addEventListener('change', filterHandler);

  };

  var filterHandler = function (evt) {
    //console.log(evt.target.name, evt.target.value);


    var FilterSelectDict = {
      'housing-type': 'type',
      'housing-price': 'price',
      'housing-rooms': 'rooms',
      'housing-guests': 'guests',
      'features': 'features'
    };

    var checkedFeatures = Array.from(document.querySelectorAll('[name=features]:checked')).map(function (item) {
      return item.value;
    });
    //console.log(checkedFeatures);

    advertsDefault.forEach(function (item) {
      var offer = item.offer;
      console.log(offer[FilterSelectDict[evt.target.name]]);
    });
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

  /**
   * проверка соответствия выбранного типа и типа в объявлении
   * @param {string} filterType - выбранный тип жилья
   * @param {string} offerType - тип жилья в объявлении
   * @return {boolean}
   */
  var checkFilterType = function (filterType, offerType) {
    return filterType === offerType || filterType === 'any';
  };

  /**
   * проверка соответствия выбранной цены и цены в объявлении
   * @param {string} filterPrice - выбранный диапазон цены
   * @param {number} offerPrice - цена в объявлении
   * @return {boolean}
   */
  var checkFilterPrice = function (filterPrice, offerPrice) {

    return (filterPrice === 'low' && offerPrice < price.LOW) ||
      (filterPrice === 'middle' && (offerPrice >= price.LOW && offerPrice <= price.HIGH)) ||
      (filterPrice === 'high' && offerPrice > price.HIGH) ||
      (filterPrice === 'any');
  };

  /**
   * проверка соответствия выбранного количества комнат и количества комнат в объявлении
   * @param {string} filterRooms - выбранное количество комнат
   * @param {number} offerRooms - количество комнат в объявлении
   * @return {boolean}
   */
  var checkFilterRooms = function (filterRooms, offerRooms) {
    return filterRooms === offerRooms.toString() || filterRooms === 'any';
  };

  /**
   * проверка соответствия выбранного количества гостей и количества гостей в объявлении
   * @param {string} filterGuests - выбранное количество гостей
   * @param {number} offerGuests - количество гостей в объявлении
   * @return {boolean}
   */
  var checkFilterGuests = function (filterGuests, offerGuests) {
    return filterGuests === offerGuests.toString() || filterGuests === 'any';
  };

  /**
   * проверка соответствия выбранных удобств и удобств в объявлении
   * @param {Array.<string>} filterFeatures - массив с выбранными удобствами
   * @param {Array.<string>} offerFeatures - массив с удобствами в объявлении
   * @return {boolean}
   */
  var checkFilterFeatures = function (filterFeatures, offerFeatures) {
    return filterFeatures.every(function (feature) {
      return offerFeatures.includes(feature);
    });
  };

  var filterChangeHandler = window.utils.debounce(function () {
    var filterState = checkfilterState();

    window.card.deactivate();

    advertsFiltered = advertsDefault.filter(function (item) {
      var offer = item.offer;

      return checkFilterType(filterState.type, offer.type) &&
        checkFilterPrice(filterState.price, offer.price) &&
        checkFilterRooms(filterState.rooms, offer.rooms) &&
        checkFilterGuests(filterState.guests, offer.guests) &&
        checkFilterFeatures(filterState.features, offer.features);
    });

    window.pin.remove();
    window.map.filter(advertsFiltered.slice(0, SIMILAR_OFFERS_COUNT));
  });

  window.filter = {
    disable: disableFilters,
    enable: enableFilters,
    copyAdverts: function (adverts) {
      advertsDefault = adverts.slice();
    }
  };
})();
