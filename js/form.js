'use strict';

(function () {
  /**
  * @enum {Array.<string>} RoomsCapacity - соответствия количества гостей количеству комнат
  */
  var RoomsCapacity = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };

  /**
   * @enum {number} MinPrices - минимальные цены в зависимости от типа предложения
   */
  var MinPrices = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  var form = document.querySelector('.ad-form');
  var fieldsets = form.querySelectorAll('fieldset');
  var addressField = form.querySelector('#address');
  var typeField = form.querySelector('#type');
  var priceField = form.querySelector('#price');
  var resetButton = form.querySelector('.ad-form__reset');
  var checkInField = form.querySelector('#timein');
  var checkOutField = form.querySelector('#timeout');
  var roomsNumberField = form.querySelector('#room_number');
  var capacityField = form.querySelector('#capacity');

  /**
   * активация элементов формы
   */
  var enableFieldsets = function () {
    fieldsets.forEach(function (item) {
      item.disabled = false;
    });
  };

  var disableFieldsets = function () {
    fieldsets.forEach(function (item) {
      item.disabled = true;
      item.classList.remove('ad-form__element--invalid');
    });
  };

  /**
   * перевод формы в неактивное состояние
   */
  var resetForm = function () {
    form.reset();
    disableFieldsets();
    form.classList.add('ad-form--disabled');
    setCapacity(roomsNumberField.value);
  };

  /**
   * Установка параметров поля "Цена за ночь"
   * @param {number} minPrice
   */
  var setPriceFieldParams = function (minPrice) {
    priceField.placeholder = minPrice;
    priceField.min = minPrice;
  };

  typeField.addEventListener('change', function (evt) {
    setPriceFieldParams(MinPrices[evt.target.value]);
  });

  /**
   * Установка параметра value указанного поля
   * @param {Node} field - ссылка на поле в котором нужно изменить значение атрибута value
   * @param {string} value - значение атрибута value
   */
  var setTimeField = function (field, value) {
    field.value = value;
  };

  checkInField.addEventListener('change', function (evt) {
    setTimeField(checkOutField, evt.target.value);
  });

  checkOutField.addEventListener('change', function (evt) {
    setTimeField(checkInField, evt.target.value);
  });

  /**
   * установка возможных вариантов выбора количества мест в соответствии с количеством комнат
   * @param {string} roomsValue - текущее значение количества комнат
   */
  var setCapacity = function (roomsValue) {
    var capacityOptions = capacityField.options;

    for (var i = 0; i < capacityOptions.length; i++) {
      capacityOptions[i].disabled = !RoomsCapacity[roomsValue].includes(capacityOptions[i].value);
    }

    if (capacityField.options[capacityField.selectedIndex].disabled) {
      capacityField.value = RoomsCapacity[roomsValue][0];
    }
  };

  /**
   * установка значения в поле Адрес
   * @param {Coordinates} address - координаты
   */
  var setAddress = function (address) {
    addressField.value = address.x + ', ' + address.y;
  };

  roomsNumberField.addEventListener('change', function (evt) {
    setCapacity(evt.target.value);
  });

  form.addEventListener('invalid', function (evt) {
    evt.target.parentNode.classList.add('ad-form__element--invalid');
    evt.target.addEventListener('keydown', invalidHandler);
    evt.target.addEventListener('change', invalidHandler);
  }, true);

  var invalidHandler = function (evt) {
    if (evt.target.checkValidity()) {
      evt.target.parentNode.classList.remove('ad-form__element--invalid');
      evt.target.removeEventListener('keydown', invalidHandler);
      evt.target.removeEventListener('change', invalidHandler);
    }
  };

  resetButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    resetForm();
    window.pins.removePins();
    window.page.deactivatePage();
    window.page.initPage();
    setCapacity(roomsNumberField.value);
  });

  window.form = {
    setAddress: function (address) {
      setAddress(address);
    },
    enableForm: function () {
      enableFieldsets();
      setCapacity(roomsNumberField.value);
    }
  };
})();
