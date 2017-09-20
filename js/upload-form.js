'use strict';

(function () {
  var FILTERS_DESC = {
    'effect-none': {
      sliderEnabled: false
    },
    'effect-chrome': {
      sliderEnabled: true,
      filterName: 'grayscale',
      maxValue: 1,
      floorValue: false,
      valueSuffix: ''
    },
    'effect-sepia': {
      sliderEnabled: true,
      filterName: 'sepia',
      maxValue: 1,
      floorValue: false,
      valueSuffix: ''
    },
    'effect-marvin': {
      sliderEnabled: true,
      filterName: 'invert',
      maxValue: 100,
      floorValue: true,
      valueSuffix: '%'
    },
    'effect-phobos': {
      sliderEnabled: true,
      filterName: 'blur',
      maxValue: 3,
      floorValue: true,
      valueSuffix: 'px'
    },
    'effect-heat': {
      sliderEnabled: true,
      filterName: 'brightness',
      maxValue: 3,
      floorValue: false,
      valueSuffix: ''
    }
  };

  var DESCRIPTION_MAX_LENGTH = 140;

  var TAG_MAX_LENGTH = 20;
  var TAGS_MAX_NUMBER = 5;

  var uploadFileInputElement = document.querySelector('.upload-input');
  var uploadFileControlElement = document.querySelector('.upload-control');
  var uploadFormElement = document.querySelector('.upload-form');
  var uploadFileElement = uploadFormElement.querySelector('.upload-input');
  var uploadOverlayElement = uploadFormElement.querySelector('.upload-overlay');
  var uploadResizeElement = uploadOverlayElement.querySelector('.upload-resize-controls');
  var uploadEffectElement = uploadOverlayElement.querySelector('.upload-effect-controls');
  var uploadEffectLevelElement = uploadEffectElement.querySelector('.upload-effect-level');
  var uploadEffectPreviewElement = uploadOverlayElement.querySelector('.effect-image-preview');
  var uploadEffectPreviewControlElements = uploadOverlayElement.querySelectorAll('.upload-effect-preview');
  var uploadDescriptionElement = uploadOverlayElement.querySelector('.upload-form-description');
  var uploadHashtagsElement = uploadOverlayElement.querySelector('.upload-form-hashtags');
  var uploadCancelElement = uploadOverlayElement.querySelector('.upload-form-cancel');

  var onFilterChanged = function (filter, filterLevelValue) {
    var curFilterDesc = FILTERS_DESC[filter];
    if (curFilterDesc.sliderEnabled) {
      uploadEffectLevelElement.style.visibility = 'visible';

      var effectValue = filterLevelValue * curFilterDesc.maxValue;
      if (curFilterDesc.floorValue) {
        effectValue = Math.floor(effectValue);
      }
      uploadEffectPreviewElement.style.filter =
        curFilterDesc.filterName + '(' + effectValue + curFilterDesc.valueSuffix + ')';

    } else {
      uploadEffectLevelElement.style.visibility = 'hidden';

      uploadEffectPreviewElement.style.filter = 'none';
    }

  };

  // Close upload dialog if Esc key pressed.
  var onUploadOverlayEscPress = function (evt) {
    window.util.isEscEvent(evt, closeUploadOverlay);
  };

  // Prevent upload dialog closing on pressing Esc key in description input.
  var onUploadDescriptionEscPress = function (evt) {
    window.util.isEscEvent(evt, function () {
      evt.stopPropagation();
    });
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
    evt.preventDefault();

    window.backend.save(
        new FormData(uploadFormElement),
        function (response) {
          closeUploadOverlay(null, true);
        },
        window.error.displayError);
  };


  // Open upload image dialog.
  var openUploadOverlay = function (file) {
    var reader = new FileReader();
    reader.addEventListener('load', function (evt) {
      uploadEffectPreviewElement.setAttribute('src', evt.target.result);
      for (var i = 0; i < uploadEffectPreviewControlElements.length; i++) {
        var previewControl = uploadEffectPreviewControlElements[i];
        previewControl.style.backgroundImage = 'url("' + evt.target.result + '")';
      }

      uploadOverlayElement.classList.remove('hidden');

      document.addEventListener('keydown', onUploadOverlayEscPress);

      uploadCancelElement.addEventListener('click', closeUploadOverlay);

      uploadDescriptionElement.addEventListener('keydown', onUploadDescriptionEscPress);

      window.scale.initializeScale(uploadResizeElement, adjustPreviewImageScale);
      window.filters.initializeFilters(uploadEffectElement, onFilterChanged);

      uploadDescriptionElement.addEventListener('input', validateUploadDescription);
      uploadHashtagsElement.addEventListener('input', validateUploadHashtags);

      uploadFormElement.addEventListener('submit', onUploadFormSubmit);
      uploadFormElement.addEventListener('input', updateInputValidationStatus);
    });
    reader.readAsDataURL(file);
  };

  // Close upload image dialog.
  var closeUploadOverlay = function (evt, dontReopen) {
    uploadOverlayElement.classList.add('hidden');

    document.removeEventListener('keydown', onUploadOverlayEscPress);

    uploadCancelElement.removeEventListener('click', closeUploadOverlay);

    uploadDescriptionElement.removeEventListener('keydown', onUploadDescriptionEscPress);

    window.scale.finalizeScale();
    window.filters.finalizeFilters();

    uploadDescriptionElement.removeEventListener('input', validateUploadDescription);
    uploadHashtagsElement.removeEventListener('input', validateUploadHashtags);

    uploadFormElement.removeEventListener('submit', onUploadFormSubmit);
    uploadFormElement.removeEventListener('input', updateInputValidationStatus);

    uploadFormElement.reset();

    if (!dontReopen) {
      uploadFileElement.click();
    }
  };


  var onUploadFileInputElementChange = function (evt) {
    if (evt.target.files[0]) {
      openUploadOverlay(evt.target.files[0]);
    }
  };

  uploadFileInputElement.addEventListener('change', onUploadFileInputElementChange);


  var onUploadFileControlElementDragDrop = function (evt) {
    evt.preventDefault();
    evt.target.style.border = '';

    if (evt.dataTransfer.files[0]) {
      // Set the upload file input's `files` property in order to send the form
      // using FormData.
      uploadFileInputElement.files = evt.dataTransfer.files;

      openUploadOverlay(evt.dataTransfer.files[0]);
    }
  };

  var onUploadFileControlElementDragEnd = function (evt) {
    evt.dataTransfer.clearData();
  };

  var onUploadFileControlElementDragEnter = function (evt) {
    evt.target.style.border = '1px dashed red';
  };

  var onUploadFileControlElementDragLeave = function (evt) {
    evt.target.style.border = '';
  };

  var onUploadFileControlElementDragOver = function (evt) {
    evt.preventDefault();
  };

  uploadFileControlElement.addEventListener('drop', onUploadFileControlElementDragDrop);
  uploadFileControlElement.addEventListener('dragend', onUploadFileControlElementDragEnd);
  uploadFileControlElement.addEventListener('dragenter', onUploadFileControlElementDragEnter);
  uploadFileControlElement.addEventListener('dragleave', onUploadFileControlElementDragLeave);
  uploadFileControlElement.addEventListener('dragover', onUploadFileControlElementDragOver);
})();
