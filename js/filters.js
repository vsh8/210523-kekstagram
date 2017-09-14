'use strict';

window.filters = (function () {
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
  var currentFilter = 'effect-none';

  var filtersElement = null;
  var filtersPreviewElement = null;
  var filtersLevelElement = null;

  // Change an image filter.
  var onFilterChosen = function (evt) {
    if (evt.target.tagName.toLowerCase() === 'input') {
      currentFilter = evt.target.id.substring(7);
      if (FILTERS_DESC[currentFilter].sliderEnabled) {
        filtersLevelElement.style.visibility = 'visible';
      } else {
        filtersLevelElement.style.visibility = 'hidden';
      }

      // filtersPreviewElement.setAttribute('class', 'effect-image-preview ' + currentEffect);
      window.slider.resetSlider();
    }
  };

  var onFilterLevelChanged = function (filterLevelValue) {
    var curFilterDesc = FILTERS_DESC[currentFilter];
    if (curFilterDesc.sliderEnabled) {
      var effectValue = filterLevelValue * curFilterDesc.maxValue;
      if (curFilterDesc.floorValue) {
        effectValue = Math.floor(effectValue);
      }
      filtersPreviewElement.style.filter =
          curFilterDesc.filterName + '(' + effectValue + curFilterDesc.valueSuffix + ')';
    } else {
      filtersPreviewElement.style.filter = 'none';
    }
  };

  return {
    initializeFilters: function (filtersElm, filtersPreviewElm) {
      filtersElement = filtersElm;
      filtersPreviewElement = filtersPreviewElm;
      filtersLevelElement = filtersElement.querySelector('.upload-effect-level');

      currentFilter = 'effect-none';

      var scaleElement = document.querySelector('.upload-effect-level');

      window.slider.initializeSlider(scaleElement, onFilterLevelChanged);
      filtersElement.addEventListener('click', onFilterChosen);
    },

    finalizeFilters: function () {
      window.slider.finalizeSlider();
      filtersElement.removeEventListener('click', onFilterChosen);
    }
  };
})();
