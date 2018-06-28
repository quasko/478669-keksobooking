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
      var newPhoto = photoPreview.cloneNode();
      reader.addEventListener('load', function () {
        photoPreview.appendChild(createPhoto(reader.result));
        photoPreview = newPhoto;
      });

      if (file) {
        reader.readAsDataURL(file);
      }
      photoContainer.appendChild(newPhoto);
    });
  };

  window.image = {
    addListeners: function () {
      avatarInput.addEventListener('change', avatarChangeHandler);
      imagesInput.addEventListener('change', imagesChangeHandler);
    },
    removeListeners: function () {
      avatarInput.removeEventListener('change', avatarChangeHandler);
      imagesInput.removeEventListener('change', imagesChangeHandler);
    }
  };
})();
