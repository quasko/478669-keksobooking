'use strict';

(function () {
  /**
   * @constant {string}
   */
  var DEFAULT_AVATAR_SRC = 'img/muffin-grey.svg';

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
  var avatarPreview = form.querySelector('.ad-form-header__preview > img');
  var fieldsets = form.querySelectorAll('fieldset');
  var addressField = form.querySelector('#address');
  var typeField = form.querySelector('#type');
  var priceField = form.querySelector('#price');
  var resetButton = form.querySelector('.ad-form__reset');
  var checkInField = form.querySelector('#timein');
  var checkOutField = form.querySelector('#timeout');
  var roomsNumberField = form.querySelector('#room_number');
  var capacityField = form.querySelector('#capacity');
  var successMessage = document.querySelector('.success');

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
    window.image.removeListeners();
    avatarPreview.src = DEFAULT_AVATAR_SRC;
    form.removeEventListener('invalid', formInvalidHandler);
    typeField.removeEventListener('change', typeChangeHandler);
    roomsNumberField.removeEventListener('change', roomNumberChangeHandler);
    checkInField.removeEventListener('change', checkInChangehandler);
    checkOutField.removeEventListener('change', checkOutChangeHandler);
    form.classList.add('ad-form--disabled');
    setCapacity(roomsNumberField.value);
  };

  /**
   * Установка параметров поля "Цена за ночь"
   * @param {number} minPrice
   */
  var setPriceParams = function (minPrice) {
    priceField.placeholder = minPrice;
    priceField.min = minPrice;
  };

  /**
   * Установка параметра value указанного поля
   * @param {Node} field - ссылка на поле в котором нужно изменить значение атрибута value
   * @param {string} value - значение атрибута value
   */
  var setTimeField = function (field, value) {
    field.value = value;
  };

  /**
   * установка возможных вариантов выбора количества мест в соответствии с количеством комнат
   * @param {string} roomsValue - текущее значение количества комнат
   */
  var setCapacity = function (roomsValue) {
    Array.from(capacityField.options).forEach(function (item) {
      item.disabled = !RoomsCapacity[roomsValue].includes(item.value);
    });

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

  var typeChangeHandler = function (evt) {
    setPriceParams(MinPrices[evt.target.value]);
  };

  var roomNumberChangeHandler = function (evt) {
    setCapacity(evt.target.value);
  };

  var checkInChangehandler = function (evt) {
    setTimeField(checkOutField, evt.target.value);
  };

  var checkOutChangeHandler = function (evt) {
    setTimeField(checkInField, evt.target.value);
  };

  var formInvalidHandler = function (evt) {
    evt.target.parentNode.classList.add('ad-form__element--invalid');
    evt.target.addEventListener('keydown', fieldInvalidHandler);
    evt.target.addEventListener('change', fieldInvalidHandler);
  };

  var fieldInvalidHandler = function (evt) {
    if (evt.target.checkValidity()) {
      evt.target.parentNode.classList.remove('ad-form__element--invalid');
      evt.target.removeEventListener('keydown', fieldInvalidHandler);
      evt.target.removeEventListener('change', fieldInvalidHandler);
    }
  };

  var closeSuccess = function () {
    successMessage.classList.add('hidden');
    document.removeEventListener('click', closeSuccess);
    document.removeEventListener('keydown', successEscPressHandler);
  };

  var successEscPressHandler = function (evt) {
    window.utils.isEscEvent(evt, closeSuccess);
  };

  var formSubmitSuccessHandler = function () {
    successMessage.classList.remove('hidden');
    document.addEventListener('click', closeSuccess);
    document.activeElement.blur();
    document.addEventListener('keydown', successEscPressHandler);
    resetForm();
    window.pin.remove();
    window.map.reset();
  };

  var formSubmitErrorHandler = function (errorMessage) {
    document.body.insertAdjacentElement('afterbegin', window.createErrorMessage(errorMessage));
  };

  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    var formData = new FormData(form);
    window.backend.upload(formData, formSubmitSuccessHandler, formSubmitErrorHandler);
  });

  resetButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    resetForm();
    window.pin.remove();
    window.map.reset();
  });

  disableFieldsets();

  window.form = {
    setAddress: setAddress,
    enable: function () {
      form.addEventListener('invalid', formInvalidHandler, true);
      typeField.addEventListener('change', typeChangeHandler);
      roomsNumberField.addEventListener('change', roomNumberChangeHandler);
      checkInField.addEventListener('change', checkInChangehandler);
      checkOutField.addEventListener('change', checkOutChangeHandler);
      enableFieldsets();
      window.image.addListeners();
      setCapacity(roomsNumberField.value);
    }
  };
})();
