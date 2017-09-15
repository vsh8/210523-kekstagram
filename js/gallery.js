'use strict';

(function () {
  // Function for adding the given photos to the specified block.
  var renderPhotos = function (containerBlock, photos) {
    var fragment = document.createDocumentFragment();
    for (var j = 0; j < photos.length; j++) {
      fragment.appendChild(window.picture.renderPhoto(photos[j]));
    }
    containerBlock.appendChild(fragment);
  };

  // Get photos from the server and render them.
  window.backend.load(
      function (photos) {
        // Draw the obtained from the server photos.
        var picturesBlock = document.querySelector('.pictures');
        renderPhotos(picturesBlock, photos);
      },
      window.error.displayError);
})();
