'use strict';

window.effects = (function () {
  var EFFECTS_DESC = {
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
  var currentEffect = 'effect-none';

  var uploadEffectElement = document.querySelector('.upload-effect-controls');
  var uploadEffectPreviewElement = document.querySelector('.effect-image-preview');
  var uploadEffectLevelElement = document.querySelector('.upload-effect-level');

  // Change upload image effect.
  var onUploadEffectClick = function (evt) {
    if (evt.target.tagName.toLowerCase() === 'input') {
      currentEffect = evt.target.id.substring(7);
      if (EFFECTS_DESC[currentEffect].sliderEnabled) {
        uploadEffectLevelElement.style.visibility = 'visible';
      } else {
        uploadEffectLevelElement.style.visibility = 'hidden';
      }

      // uploadEffectPreviewElement.setAttribute('class', 'effect-image-preview ' + currentEffect);
      window.effectLevelSlider.initializeEffectSlider();
    }
  };

  var onEffectLevelValueChanged = function (effectLevelValue) {
    var curEffectDesc = EFFECTS_DESC[currentEffect];
    if (curEffectDesc.sliderEnabled) {
      var effectValue = effectLevelValue * curEffectDesc.maxValue;
      if (curEffectDesc.floorValue) {
        effectValue = Math.floor(effectValue);
      }
      uploadEffectPreviewElement.style.filter =
          curEffectDesc.filterName + '(' + effectValue + curEffectDesc.valueSuffix + ')';
    } else {
      uploadEffectPreviewElement.style.filter = 'none';
    }
  };

  return {
    setupEffects: function () {
      window.effectLevelSlider.setupEffectSlider(onEffectLevelValueChanged);
      uploadEffectElement.addEventListener('click', onUploadEffectClick);
    },

    resetEffects: function () {
      window.effectLevelSlider.resetEffectSlider();
      uploadEffectElement.removeEventListener('click', onUploadEffectClick);
    }
  };
})();
