'use strict';

window.data = (function () {
  var PHOTOS_NUMBER = 25;

  var LIKES_MIN = 15;
  var LIKES_MAX = 200;

  var COMMENTS = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];
  var MIN_COMMENTS_NUMBER = 1;
  var MAX_COMMENTS_NUMBER = 5;
  var MAX_COMMENT_LENGTH = 2;

  // Generate a random comment.
  var generateComment = function () {
    var comment = window.rand.randChoice(COMMENTS);
    var commentLength = window.rand.randInt(MAX_COMMENT_LENGTH);
    for (var j = 0; j < commentLength; j++) {
      comment += ' ' + window.rand.randChoice(COMMENTS);
    }
    return comment;
  };

  // Generate a random photo description by its number.
  var generatePhotoData = function (n) {
    var comments = [];
    var commentsNumber = window.rand.randIntRange(MIN_COMMENTS_NUMBER, MAX_COMMENTS_NUMBER + 1);
    for (var j = 0; j < commentsNumber; j++) {
      comments.push(generateComment());
    }

    return {
      url: 'photos/' + n + '.jpg',
      likes: window.rand.randIntRange(LIKES_MIN, LIKES_MAX + 1),
      comments: comments
    };
  };

  return {
    generatePhotos: function () {
      var photos = [];
      for (var i = 0; i < PHOTOS_NUMBER; i++) {
        photos.push(generatePhotoData(i + 1));
      }
      return photos;
    }
  };
})();
