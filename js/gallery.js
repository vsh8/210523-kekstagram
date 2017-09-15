'use strict';

(function () {
  // Generate 25 photos.
  var photosData = window.data.generatePhotos();

  // Function for adding the given photos to the specified block.
  var renderPhotos = function (containerBlock, photos) {
    var fragment = document.createDocumentFragment();
    for (var j = 0; j < photos.length; j++) {
      fragment.appendChild(window.picture.renderPhoto(photos[j]));
    }
    containerBlock.appendChild(fragment);
  };

  // Draw the photos.
  var picturesBlock = document.querySelector('.pictures');
  renderPhotos(picturesBlock, photosData);
})();
