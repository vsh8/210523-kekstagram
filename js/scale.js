'use strict';

window.scale = (function () {
  var RESIZE_MIN_VALUE = 25;
  var RESIZE_MAX_VALUE = 100;
  var RESIZE_STEP = 25;

  var scaleElement = null;
  var adjustScaleCallback = null;

  var uploadResizeDecElement = null;
  var uploadResizeIncElement = null;
  var uploadResizeValueElement = null;

  // Decrease resize value.
  var uploadResizeValueDec = function () {
    var scaleValue = parseInt(uploadResizeValueElement.value, 10);
    if (scaleValue > RESIZE_MIN_VALUE) {
      scaleValue -= RESIZE_STEP;
      uploadResizeValueElement.value = scaleValue + '%';

      adjustScaleCallback(scaleValue);
    }
  };

  // Increase resize value.
  var uploadResizeValueInc = function () {
    var scaleValue = parseInt(uploadResizeValueElement.value, 10);
    if (scaleValue < RESIZE_MAX_VALUE) {
      scaleValue += RESIZE_STEP;
      uploadResizeValueElement.value = scaleValue + '%';

      adjustScaleCallback(scaleValue);
    }
  };

  return {
    initializeScale: function (scaleElm, adjustScaleFunc) {
      scaleElement = scaleElm;
      adjustScaleCallback = adjustScaleFunc;

      uploadResizeDecElement = scaleElement.querySelector('.upload-resize-controls-button-dec');
      uploadResizeIncElement = scaleElement.querySelector('.upload-resize-controls-button-inc');
      uploadResizeValueElement = scaleElement.querySelector('.upload-resize-controls-value');

      uploadResizeDecElement.addEventListener('click', uploadResizeValueDec);
      uploadResizeIncElement.addEventListener('click', uploadResizeValueInc);
    },

    finalizeScale: function () {
      uploadResizeDecElement.removeEventListener('click', uploadResizeValueDec);
      uploadResizeIncElement.removeEventListener('click', uploadResizeValueInc);
    }
  };

})();
