'use strict';

window.effectLevelSlider = (function () {
  var EFFECT_LEVEL_PIN_MAX_X = 455;

  var effectLevelPinElement = document.querySelector('.upload-effect-level-pin');
  var effectLevelValElement = document.querySelector('.upload-effect-level-val');

  var effectLevelValueChangedCallback = null;

  var onEffectLevelPinMouseUp = function (evt) {
    var mouseStartX = evt.clientX;
    var effectLevelPinX = effectLevelPinElement.offsetLeft;

    // Move pin on mouse move.
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shiftX = mouseStartX - moveEvt.clientX;
      var effectLevelPinXNew = effectLevelPinX - shiftX;
      effectLevelPinXNew = Math.max(0, effectLevelPinXNew);
      effectLevelPinXNew = Math.min(EFFECT_LEVEL_PIN_MAX_X, effectLevelPinXNew);

      effectLevelValueChangedCallback(effectLevelPinXNew / EFFECT_LEVEL_PIN_MAX_X);

      effectLevelPinElement.style.left = effectLevelPinXNew + 'px';
      effectLevelValElement.style.width = effectLevelPinXNew + 'px';
    };

    // Remove mouse event listeners on mouse up.
    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return {
    setupEffectSlider: function (onValueChangedCallback) {
      effectLevelValueChangedCallback = onValueChangedCallback;
      effectLevelPinElement.addEventListener('mousedown', onEffectLevelPinMouseUp);
    },

    initializeEffectSlider: function () {
      effectLevelPinElement.style.left = EFFECT_LEVEL_PIN_MAX_X + 'px';
      effectLevelValElement.style.width = EFFECT_LEVEL_PIN_MAX_X + 'px';

      effectLevelValueChangedCallback(1);
    },

    resetEffectSlider: function () {
      effectLevelPinElement.removeEventListener('mousedown', onEffectLevelPinMouseUp);
    }
  };
})();
