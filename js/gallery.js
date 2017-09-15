'use strict';

(function () {
  var picturesBlock = document.querySelector('.pictures');
  var photoFilters = document.querySelector('.filters');
  var photoFiltersRadios = photoFilters.querySelectorAll('.filters-radio');
  var photos = null;


  // Add the given photos to the specified block.
  var renderPhotos = function (containerBlock, phs) {
    while (containerBlock.firstChild) {
      containerBlock.removeChild(containerBlock.firstChild);
    }

    var fragment = document.createDocumentFragment();
    for (var j = 0; j < phs.length; j++) {
      fragment.appendChild(window.picture.renderPhoto(phs[j]));
    }

    containerBlock.appendChild(fragment);
  };


  // Sort photos by likes number.
  var sortPhotosByLikesNumber = function (phs) {
    phs.sort(function (photo1, photo2) {
      return photo2.likes - photo1.likes;
    });
  };

  // Sort photos by comments number.
  var sortPhotosByCommentsNumber = function (phs) {
    phs.sort(function (photo1, photo2) {
      return photo2.comments.length - photo1.comments.length;
    });
  };

  // Randomize photos ordering.
  var randomizePhotosOrdering = function (phs) {
    window.rand.randomizeArray(phs);
  };


  for (var i = 0; i < photoFiltersRadios.length; i++) {
    photoFiltersRadios[i].addEventListener('click', function (evt) {
      window.util.debounce(function () {
        var photos2 = null;
        if (evt.target.value === 'recommend') {
          photos2 = photos;
        } else {
          photos2 = photos.slice();
          if (evt.target.value === 'popular') {
            sortPhotosByLikesNumber(photos2);
          } else if (evt.target.value === 'discussed') {
            sortPhotosByCommentsNumber(photos2);
          } else {
            randomizePhotosOrdering(photos2);
          }
        }

        renderPhotos(picturesBlock, photos2);
      });
    });
  }


  // Get photos from the server and render them.
  window.backend.load(
      function (phs) {
        photos = phs;
        renderPhotos(picturesBlock, photos);
        photoFilters.classList.remove('hidden');
      },
      window.error.displayError);

})();
