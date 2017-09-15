'use strict';

(function () {
  var picturesBlock = document.querySelector('.pictures');

  var photoPopup = document.querySelector('.gallery-overlay');
  var photoPopupCloseElement = document.querySelector('.gallery-overlay-close');

  var onPhotoPopupEscPress = function (evt) {
    window.util.isEscEvent(evt, closePhotoPopup);
  };

  var onPhotoPopupCloseElementEnterPress = function (evt) {
    window.util.isEnterEvent(evt, closePhotoPopup);
  };

  var openPhotoPopup = function (photoElement) {
    photoPopup.querySelector('img').setAttribute(
        'src', photoElement.querySelector('img').getAttribute('src'));
    photoPopup.querySelector('.likes-count').textContent =
        photoElement.querySelector('.picture-likes').textContent;
    photoPopup.querySelector('.comments-count').textContent =
        photoElement.querySelector('.picture-comments').textContent;

    document.addEventListener('keydown', onPhotoPopupEscPress);

    photoPopupCloseElement.addEventListener('click', closePhotoPopup);
    photoPopupCloseElement.addEventListener('keydown', onPhotoPopupCloseElementEnterPress);

    photoPopup.classList.remove('hidden');
  };

  var closePhotoPopup = function () {
    document.removeEventListener('keycode', onPhotoPopupEscPress);

    photoPopupCloseElement.removeEventListener('click', closePhotoPopup);
    photoPopupCloseElement.removeEventListener('keydown', onPhotoPopupCloseElementEnterPress);

    photoPopup.classList.add('hidden');
  };

  picturesBlock.addEventListener('click', function (evt) {
    if (evt.target.tagName.toLowerCase() === 'img') {
      openPhotoPopup(evt.target.parentElement);
      evt.preventDefault();
    }
  });
  picturesBlock.addEventListener('keydown', function (evt) {
    if (evt.target.tagName.toLowerCase() === 'a') {
      window.util.isEnterEvent(evt, function () {
        openPhotoPopup(evt.target);
        evt.preventDefault();
      });
    }
  });
})();
