'use strict';

(function () {
  /**
   * @constant {numner}
   */
  var DISPLAYED_ADVERTS = 5;

  var mainPinParams = {
    defaultPosition: {
      LEFT: 570,
      TOP: 375
    },
    verticalLimits: {
      MIN: 130,
      MAX: 630
    },
    size: {
      inactive: {
        WIDTH: 65,
        HEIGHT: 65
      },
      active: {
        WIDTH: 65,
        HEIGHT: 77
      }
    }
  };

  var pageActivated = false;
  var mainPin = document.querySelector('.map__pin--main');
  var map = document.querySelector('.map');
  var mapPins = document.querySelector('.map__pins');
  var form = document.querySelector('.ad-form');

  var loadSuccessHandler = function (adverts) {
    mapPins.appendChild(window.pin.render(adverts.slice(0, DISPLAYED_ADVERTS)));
    window.filter.enable();
    window.filter.copyAdverts(adverts);
  };

  var loadErrorHandler = function (errorMessage) {
    document.body.insertAdjacentElement('afterbegin', window.createErrorMessage(errorMessage));
  };

  /**
   * перевод формы в активное состояние
   */
  var activatePage = function () {
    map.classList.remove('map--faded');
    form.classList.remove('ad-form--disabled');
    window.form.enable();
    window.backend.load(loadSuccessHandler, loadErrorHandler);
    pageActivated = true;
  };

  /**
   * перемещение mainPin по заданным координатам
   * @param {number} x - координата X
   * @param {number} y - координата Y
   */
  var moveMainPin = function (x, y) {
    mainPin.style.top = y + 'px';
    mainPin.style.left = x + 'px';
  };

  /**
   * @typedef {Object} Coordinates - координаты метки mainPin
   * @param {number} x - координата X
   * @param {number} y - координата Y
   */

  /**
   * вычисление адреса метки mainPin на карте
   * @return {Coordinates}
   */
  var getMainPinAddress = function () {
    var addressX = Math.round(mainPin.offsetLeft + (pageActivated ?
      mainPinParams.size.active.WIDTH / 2 :
      mainPinParams.size.inactive.WIDTH / 2));
    var addressY = pageActivated ?
      Math.round(mainPin.offsetTop + mainPinParams.size.active.HEIGHT) :
      Math.round(mainPin.offsetTop + mainPinParams.size.inactive.HEIGHT / 2);
    var coord = {
      x: addressX,
      y: addressY
    };
    return coord;
  };

  var mainPinMouseDownHandler = function (evt) {
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var mouseMoveHandler = function (moveEvt) {
      if (!pageActivated) {
        activatePage();
      }

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      var newCoords = {
        x: mainPin.offsetLeft - shift.x,
        y: mainPin.offsetTop - shift.y,
      };

      var minCoords = {
        x: -mainPin.clientWidth / 2,
        y: mainPinParams.verticalLimits.MIN - mainPinParams.size.active.HEIGHT
      };

      var maxCoords = {
        x: map.clientWidth - mainPin.clientWidth / 2,
        y: mainPinParams.verticalLimits.MAX - mainPinParams.size.active.HEIGHT
      };

      if (newCoords.y > maxCoords.y || newCoords.y < minCoords.y) {
        newCoords.y = mainPin.offsetTop;
      }

      if (newCoords.x < minCoords.x || newCoords.x > maxCoords.x) {
        newCoords.x = mainPin.offsetLeft;
      }

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      moveMainPin(newCoords.x, newCoords.y);
      window.form.setAddress(getMainPinAddress());
    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();
      if (!pageActivated) {
        activatePage();

      }
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
      window.form.setAddress(getMainPinAddress());
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  var initPage = function () {
    mainPin.addEventListener('mousedown', mainPinMouseDownHandler);
    window.form.setAddress(getMainPinAddress());
  };

  initPage();

  window.map = {
    reset: function () {
      pageActivated = false;
      map.classList.add('map--faded');
      window.filter.disable();
      moveMainPin(mainPinParams.defaultPosition.LEFT, mainPinParams.defaultPosition.TOP);
      window.card.deactivate();
      window.pin.deactivate();
      window.form.setAddress(getMainPinAddress());
      initPage();
    },
    filter: function (adverts) {
      mapPins.appendChild(window.pin.render(adverts));
    }
  };
})();
