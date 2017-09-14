'use strict';

(function () {
  var RESIZE_MIN_VALUE = 25;
  var RESIZE_MAX_VALUE = 100;
  var RESIZE_STEP = 25;

  var DESCRIPTION_MAX_LENGTH = 140;

  var TAG_MAX_LENGTH = 20;
  var TAGS_MAX_NUMBER = 5;

  var uploadFileElement = document.querySelector('.upload-input');
  var uploadFormElement = document.querySelector('.upload-form');
  var uploadOverlayElement = document.querySelector('.upload-overlay');
  var uploadResizeValueElement = document.querySelector('.upload-resize-controls-value');
  var uploadResizeDecElement = document.querySelector('.upload-resize-controls-button-dec');
  var uploadResizeIncElement = document.querySelector('.upload-resize-controls-button-inc');
  var uploadEffectPreviewElement = document.querySelector('.effect-image-preview');
  var uploadEffectElement = document.querySelector('.upload-effect-controls');
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

  // Decrease resize value.
  var uploadResizeValueDec = function () {
    var currentValue = parseInt(uploadResizeValueElement.value, 10);
    if (currentValue > RESIZE_MIN_VALUE) {
      currentValue -= RESIZE_STEP;
      uploadResizeValueElement.value = currentValue + '%';
      resizeUploadImagePreview();
    }
  };

  // Increase resize value.
  var uploadResizeValueInc = function () {
    var currentValue = parseInt(uploadResizeValueElement.value, 10);
    if (currentValue < RESIZE_MAX_VALUE) {
      currentValue += RESIZE_STEP;
      uploadResizeValueElement.value = currentValue + '%';
      resizeUploadImagePreview();
    }
  };

  // Resize upload image.
  var resizeUploadImagePreview = function () {
    var resizeValue = parseInt(uploadResizeValueElement.value, 10);
    uploadEffectPreviewElement.style.transform = 'scale(' + (resizeValue / 100) + ')';
  };

  // Change upload image effect.
  var onUploadEffectClick = function (evt) {
    if (evt.target.tagName.toLowerCase() === 'input') {
      var effect = evt.target.id.substring(7);
      uploadEffectPreviewElement.setAttribute('class', 'effect-image-preview ' + effect);
    }
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

    uploadResizeDecElement.addEventListener('click', uploadResizeValueDec);
    uploadResizeIncElement.addEventListener('click', uploadResizeValueInc);

    uploadEffectElement.addEventListener('click', onUploadEffectClick);

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

    uploadResizeDecElement.removeEventListener('click', uploadResizeValueDec);
    uploadResizeIncElement.removeEventListener('click', uploadResizeValueInc);

    uploadEffectElement.removeEventListener('click', onUploadEffectClick);

    uploadDescriptionElement.removeEventListener('input', validateUploadDescription);
    uploadHashtagsElement.removeEventListener('input', validateUploadHashtags);

    uploadFormElement.removeEventListener('submit', onUploadFormSubmit);
    uploadFormElement.removeEventListener('input', updateInputValidationStatus);

    uploadFileElement.click();
  };

  var uploadFileInputElement = document.querySelector('#upload-file');
  uploadFileInputElement.addEventListener('change', openUploadOverlay);
})();