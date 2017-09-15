'use strict';

window.filters = (function () {
  var currentFilter = 'effect-none';

  var filtersElement = null;

  var filterChangedCallback = null;

  // Change an image filter.
  var onFilterChosen = function (evt) {
    if (evt.target.tagName.toLowerCase() === 'input') {
      currentFilter = evt.target.id.substring(7);

      // filtersPreviewElement.setAttribute('class', 'effect-image-preview ' + currentEffect);
      window.slider.resetSlider();
    }
  };

  var onFilterLevelChanged = function (filterLevelValue) {
    return filterChangedCallback(currentFilter, filterLevelValue);
  };

  return {
    initializeFilters: function (filtersElm, onFilterChangedCallback) {
      filtersElement = filtersElm;
      filterChangedCallback = onFilterChangedCallback;

      var scaleElement = document.querySelector('.upload-effect-level');

      window.slider.initializeSlider(scaleElement, onFilterLevelChanged);
      filtersElement.addEventListener('click', onFilterChosen);

      currentFilter = 'effect-none';
      window.slider.resetSlider();
    },

    finalizeFilters: function () {
      filtersElement = null;
      filterChangedCallback = null;

      window.slider.finalizeSlider();
      filtersElement.removeEventListener('click', onFilterChosen);
    }
  };
})();
