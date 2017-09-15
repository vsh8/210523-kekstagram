'use strict';

window.slider = (function () {
  var SLIDER_PIN_MAX_X = 455;

  var sliderElement = null;

  var sliderPinElement = null;
  var sliderValElement = null;

  var sliderValueChangedCallback = null;

  var onSliderPinMouseUp = function (evt) {
    var mouseStartX = evt.clientX;
    var sliderPinX = sliderPinElement.offsetLeft;

    // Move pin on mouse move.
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shiftX = mouseStartX - moveEvt.clientX;
      var sliderPinXNew = sliderPinX - shiftX;
      sliderPinXNew = Math.max(0, sliderPinXNew);
      sliderPinXNew = Math.min(SLIDER_PIN_MAX_X, sliderPinXNew);

      sliderValueChangedCallback(sliderPinXNew / SLIDER_PIN_MAX_X);

      sliderPinElement.style.left = sliderPinXNew + 'px';
      sliderValElement.style.width = sliderPinXNew + 'px';
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
    initializeSlider: function (sliderElm, onSliderChangedCallback) {
      sliderValueChangedCallback = onSliderChangedCallback;

      sliderElement = sliderElm;

      sliderPinElement = sliderElement.querySelector('.upload-effect-level-pin');
      sliderValElement = sliderElement.querySelector('.upload-effect-level-val');

      sliderPinElement.addEventListener('mousedown', onSliderPinMouseUp);
    },

    resetSlider: function () {
      sliderPinElement.style.left = SLIDER_PIN_MAX_X + 'px';
      sliderValElement.style.width = SLIDER_PIN_MAX_X + 'px';

      sliderValueChangedCallback(1);
    },

    finalizeSlider: function () {
      sliderPinElement.removeEventListener('mousedown', onSliderPinMouseUp);
    }
  };
})();
