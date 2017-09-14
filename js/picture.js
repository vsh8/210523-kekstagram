'use strict';

window.picture = (function () {
  var photoTemplate = document.querySelector('#picture-template').content;

  // Render the photo by its description.
  return {
    renderPhoto: function (photo) {
      var photoElement = photoTemplate.cloneNode(true);

      photoElement.querySelector('img').setAttribute('src', photo.url);
      photoElement.querySelector('.picture-likes').textContent = photo.likes;
      photoElement.querySelector('.picture-comments').textContent = photo.comments.length;

      return photoElement;
    }
  };
})();
