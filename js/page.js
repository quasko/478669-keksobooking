'use strict';

(function () {

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
  var mapElement = document.querySelector('.map');
  var adForm = document.querySelector('.ad-form');

  /**
   * перевод формы в активное состояние
   */
  var activatePage = function () {
    mapElement.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    //enableFieldsets();
    //setCapacity(roomsNumberField.value);
    window.renderMapPins();
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
    //setAddress(getMainPinAddress());
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
        x: mapElement.clientWidth - mainPin.clientWidth / 2,
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
    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();
      if (!pageActivated) {
        activatePage();

      }
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
      //setAddress(getMainPinAddress());
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  var initPage = function () {
    mainPin.addEventListener('mousedown', mainPinMouseDownHandler);
    //setAddress(getMainPinAddress());
  };

  initPage();

  window.initPage = initPage;
})();
