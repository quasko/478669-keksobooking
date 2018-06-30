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

  var dragStartFileHandler = function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    if (evt.target.classList) {
      evt.target.classList.add('drop-highlight');
    }
  };

  var dragOverFileHandler = function (evt) {
    evt.preventDefault();
  };

  var dragEndFileHandler = function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    if (evt.target.classList) {
      evt.target.classList.remove('drop-highlight');
    }
  };

  var dropFileHandler = function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    evt.target.classList.remove('drop-highlight');
    previewImages(DropZoneInput[evt.target.htmlFor], evt.dataTransfer.files);
  };

  var addDragDropListeners = function (element) {
    element.addEventListener('dragenter', dragStartFileHandler);
    element.addEventListener('dragover', dragOverFileHandler);
    element.addEventListener('dragleave', dragEndFileHandler);
    element.addEventListener('drop', dropFileHandler, false);
  };

  var removeDragDropListeners = function (element) {
    element.removeEventListener('dragenter', dragStartFileHandler);
    element.removeEventListener('dragover', dragOverFileHandler);
    element.removeEventListener('dragleave', dragEndFileHandler);
    element.removeEventListener('drop', dropFileHandler);
  };

  /**
   * вставка выбранных изображений в соответствующее поле формы для предпросмотра
   * @param {Node} input - поле input куда загружаются файлы
   * @param {Array.<Object>} files - массив выбранных файлов
   */
  var previewImages = function (input, files) {
    if (files) {
      input.files = files;
    }

    if (input === imagesInput) {
      clearImages();
    }

    Array.from(input.files).forEach(function (file) {
      if (!file.type.match('image')) {
        return;
      }

      var reader = new FileReader();
      reader.addEventListener('load', function () {
        if (input === avatarInput) {
          avatarPreview.src = reader.result;
        } else if (input === imagesInput) {
          var newPhotoPreview = photoPreview.cloneNode();
          newPhotoPreview.appendChild(createPhoto(reader.result));
          photoContainer.insertBefore(newPhotoPreview, photoPreview);
        }
      });

      if (file) {
        reader.readAsDataURL(file);
      }
    });
  };

  /**
   * создание IMG элемента для фото
   * @param {string} src - источник фото
   * @return {Node}
   */
  var createPhoto = function (src) {
    var image = document.createElement('img');
    image.src = src;
    image.width = photoSize.WIDTH;
    image.height = photoSize.HEIGHT;

    return image;
  };

  var clearImages = function () {
    document.querySelectorAll('.ad-form__photo:not(:last-child)').forEach(function (item) {
      item.remove();
    });
  };

  var inputChangeHandler = function (evt) {
    previewImages(evt.target);
    evt.target.removeEventListener('change', inputChangeHandler);
  };

  var inputClickHandler = function (evt) {
    evt.target.addEventListener('change', inputChangeHandler);
  };

  window.image = {
    addListeners: function () {
      avatarInput.addEventListener('click', inputClickHandler);
      imagesInput.addEventListener('click', inputClickHandler);
      addDragDropListeners(avatarDropZone);
      addDragDropListeners(imageDropZone);
    },
    removeListeners: function () {
      avatarInput.removeEventListener('click', inputClickHandler);
      imagesInput.removeEventListener('click', inputClickHandler);
      removeDragDropListeners(avatarDropZone);
      removeDragDropListeners(imageDropZone);
      clearImages();
    }
  };
})();
