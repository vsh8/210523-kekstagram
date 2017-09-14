'use strict';

(function () {

  var DESCRIPTION_MAX_LENGTH = 140;

  var TAG_MAX_LENGTH = 20;
  var TAGS_MAX_NUMBER = 5;

  var uploadFileElement = document.querySelector('.upload-input');
  var uploadFormElement = document.querySelector('.upload-form');
  var uploadOverlayElement = document.querySelector('.upload-overlay');
  var uploadResizeElement = document.querySelector('.upload-resize-controls');
  var uploadEffectPreviewElement = document.querySelector('.effect-image-preview');
  var uploadDescriptionElement = document.querySelector('.upload-form-description');
  var uploadHashtagsElement = document.querySelector('.upload-form-hashtags');
  var uploadCancelElement = document.querySelector('.upload-form-cancel');

  // Close upload dialog if Esc key pressed.
  var onUploadOverlayEscPress = function (evt) {
    window.util.isEscEvent(evt, closeUploadOverlay);
  };

  // Prevent upload dialog closing on pressing Esc key in description input.
  var onUploadDescriptionEscPress = function (evt) {
    window.util.isEscEvent(evt, evt.stopPropagation);
  };

  var adjustPreviewImageScale = function (scale) {
    uploadEffectPreviewElement.style.transform = 'scale(' + (scale / 100) + ')';
  };

  // Validate upload image description.
  var validateUploadDescription = function (evt) {
    if (evt.target.value.length > DESCRIPTION_MAX_LENGTH) {
      evt.target.setCustomValidity('Длина комментария не должна превышать 140 символов');
    } else {
      evt.target.setCustomValidity('');
    }
  };

  // Validate uplaod image hashtags.
  var validateUploadHashtags = function (evt) {
    var tags = evt.target.value.split(/ +/);
    var usedTags = {};

    for (var j = 0; j < tags.length; j++) {
      if (tags[j] === '') {
        continue;
      }

      if (tags[j][0] !== '#') {
        evt.target.setCustomValidity('Хэш-тег должен начинаться с символа #');
        return;
      }

      if (tags[j].length > TAG_MAX_LENGTH) {
        evt.target.setCustomValidity('Максимальная длина одного хэш-тега равна 20 символов');
        return;
      }

      if (tags[j] in usedTags) {
        evt.target.setCustomValidity('Один и тот же хэш-тег не может быть использован дважды');
        return;
      }

      usedTags[tags[j]] = true;
    }

    if (tags.length > TAGS_MAX_NUMBER) {
      evt.target.setCustomValidity('Нельзя указать больше пяти хэш-тегов');
      return;
    }

    evt.target.setCustomValidity('');
  };

  // Mark invalid input.
  var updateInputValidationStatus = function (evt) {
    if (evt.target.checkValidity()) {
      evt.target.classList.remove('upload-message-error');
    } else {
      evt.target.classList.add('upload-message-error');
    }

    evt.stopPropagation();
  };

  // Reset upload form on submit.
  var onUploadFormSubmit = function (evt) {
    // evt.target.reset();
  };

  // Open upload image dialog.
  var openUploadOverlay = function () {
    uploadOverlayElement.classList.remove('hidden');

    document.addEventListener('keydown', onUploadOverlayEscPress);

    uploadCancelElement.addEventListener('click', closeUploadOverlay);

    uploadDescriptionElement.addEventListener('keydown', onUploadDescriptionEscPress);

    window.scale.initializeScale(uploadResizeElement, adjustPreviewImageScale);
    window.effects.setupEffects();

    uploadDescriptionElement.addEventListener('input', validateUploadDescription);
    uploadHashtagsElement.addEventListener('input', validateUploadHashtags);

    uploadFormElement.addEventListener('submit', onUploadFormSubmit);
    uploadFormElement.addEventListener('input', updateInputValidationStatus);
  };

  // Close upload image dialog.
  var closeUploadOverlay = function () {
    uploadOverlayElement.classList.add('hidden');

    document.removeEventListener('keydown', onUploadOverlayEscPress);

    uploadCancelElement.removeEventListener('click', closeUploadOverlay);

    uploadDescriptionElement.removeEventListener('keydown', onUploadDescriptionEscPress);

    window.scale.resetScale();
    window.effects.resetEffects();

    uploadDescriptionElement.removeEventListener('input', validateUploadDescription);
    uploadHashtagsElement.removeEventListener('input', validateUploadHashtags);

    uploadFormElement.removeEventListener('submit', onUploadFormSubmit);
    uploadFormElement.removeEventListener('input', updateInputValidationStatus);

    uploadFileElement.click();
  };

  var uploadFileInputElement = document.querySelector('#upload-file');
  uploadFileInputElement.addEventListener('change', openUploadOverlay);
})();
