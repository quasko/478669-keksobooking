'use strict';

(function () {
  var photoSize = {
    WIDTH: 70,
    HEIGHT: 70
  };

  var avatarPreview = document.querySelector('.ad-form-header__preview > img');
  var photoPreview = document.querySelector('.ad-form__photo');
  var avatarInput = document.querySelector('#avatar');
  var imagesInput = document.querySelector('#images');
  var photoContainer = document.querySelector('.ad-form__photo-container');
  var avatarDropZone = document.querySelector('.ad-form-header__drop-zone');
  var imageDropZone = document.querySelector('.ad-form__drop-zone');

  /**
   * @enum {Node} - DropZoneInput элементы input для соответствующих элементов label загрузки изображений
   */
  var DropZoneInput = {
    'avatar': avatarInput,
    'images': imagesInput
  };

  var dragFileStartHandler = function (evt) {
    evt.preventDefault();
    evt.target.classList.add('drop__highlight');
  };

  var dragFileEndHandler = function (evt) {
    evt.preventDefault();
    evt.target.classList.remove('drop__highlight');
  };

  var dropFileHandler = function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    DropZoneInput[evt.target.htmlFor].files = evt.dataTransfer.files;
  };

  var addDragDropListeners = function (element) {
    element.addEventListener('dragenter', dragFileStartHandler);
    element.addEventListener('dragover', dragFileStartHandler);
    element.addEventListener('dragleave', dragFileEndHandler);
    element.addEventListener('drop', dropFileHandler);
  };

  var removeDragDropListeners = function (element) {
    element.removeEventListener('dragenter', dragFileStartHandler);
    element.removeEventListener('dragover', dragFileStartHandler);
    element.removeEventListener('dragleave', dragFileEndHandler);
    element.removeEventListener('drop', dropFileHandler);
  };

  var avatarChangeHandler = function () {
    var avatarFile = avatarInput.files[0];
    if (!avatarFile.type.match('image')) {
      return;
    }

    var reader = new FileReader();
    reader.addEventListener('load', function () {
      avatarPreview.src = reader.result;
    });

    if (avatarFile) {
      reader.readAsDataURL(avatarFile);
    }
  };

  /**
   * создание IMG элемента для фото
   * @param {string} src - источник фото
   * @return {Node}
   */
  var createPhoto = function (src) {
    var imgElement = document.createElement('img');
    imgElement.src = src;
    imgElement.width = photoSize.WIDTH;
    imgElement.height = photoSize.HEIGHT;

    return imgElement;
  };

  var imagesChangeHandler = function () {
    var photoFiles = imagesInput.files;

    Array.from(photoFiles).forEach(function (file) {
      if (!file.type.match('image')) {
        return;
      }

      var reader = new FileReader();

      reader.addEventListener('load', function () {
        var newPhotoPreview = photoPreview.cloneNode();
        newPhotoPreview.appendChild(createPhoto(reader.result));
        photoContainer.insertBefore(newPhotoPreview, photoPreview);
      });

      if (file) {
        reader.readAsDataURL(file);
      }
    });
  };

  window.image = {
    addListeners: function () {
      avatarInput.addEventListener('change', avatarChangeHandler);
      imagesInput.addEventListener('change', imagesChangeHandler);
      addDragDropListeners(avatarDropZone);
      addDragDropListeners(imageDropZone);
    },
    removeListeners: function () {
      avatarInput.removeEventListener('change', avatarChangeHandler);
      imagesInput.removeEventListener('change', imagesChangeHandler);
      removeDragDropListeners(avatarDropZone);
      removeDragDropListeners(imageDropZone);
    },
    clearImages: function () {
      document.querySelectorAll('.ad-form__photo').forEach(function (item) {
        item.remove();
      });
      photoContainer.appendChild(photoPreview);

    }
  };
})();
