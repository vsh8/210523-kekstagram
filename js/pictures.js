'use strict';

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

var PHOTOS_NUMBER = 25;


// Generate a random integer number.
var randInt = function (n) {
  return Math.floor(n * Math.random());
};

// Generate a random integer number from the specified range.
var randIntRange = function (min, max) {
  return Math.floor(min + (max - min) * Math.random());
};

// Get a random item from the array.
var randChoice = function (items) {
  return items[randInt(items.length)];
};


// Generate random comment.
var generateComment = function () {
  var comment = randChoice(COMMENTS);
  var commentLength = randInt(MAX_COMMENT_LENGTH);
  for (var j = 0; j < commentLength; j++) {
    comment += ' ' + randChoice(COMMENTS);
  }
  return comment;
};

// Generate random photo description by its number.
var generatePhotoData = function (n) {
  var comments = [];
  var commentsNumber = randIntRange(MIN_COMMENTS_NUMBER, MAX_COMMENTS_NUMBER + 1);
  for (var i = 0; i < commentsNumber; i++) {
    comments.push(generateComment());
  }

  return {
    url: 'photos/' + n + '.jpg',
    likes: randIntRange(LIKES_MIN, LIKES_MAX + 1),
    comments: comments
  };
};


// Render photo by its description.
var renderPhoto = function (photo) {
  var photoTemplate = document.querySelector('#picture-template').content;
  var photoElement = photoTemplate.cloneNode(true);

  photoElement.querySelector('img').setAttribute('src', photo.url);
  photoElement.querySelector('.picture-likes').textContent = photo.likes;
  photoElement.querySelector('.picture-comments').textContent = photo.comments.length;

  return photoElement;
};


// Add the given photos to the specified block.
var renderPhotos = function (containerBlock, photos) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < photos.length; i++) {
    fragment.appendChild(renderPhoto(photos[i]));
  }
  containerBlock.appendChild(fragment);
};


// Generate 25 photos.
var photos = [];
for (var i = 0; i < PHOTOS_NUMBER; i++) {
  photos.push(generatePhotoData(i + 1));
}


// Fill the photo modal block with the photo data.
var fillPhoto = function (photoModalBlock, photo) {
  photoModalBlock.querySelector('img').setAttribute('src', photo.url);
  photoModalBlock.querySelector('.likes-count').textContent = photo.likes;
  photoModalBlock.querySelector('.comments-count').textContent = photo.comments.length;
};


// Draw the photos.
var picturesBlock = document.querySelector('.pictures');
renderPhotos(picturesBlock, photos);


// Show first photo using modal photo block.
var photoModalBlock = document.querySelector('.gallery-overlay');

fillPhoto(photoModalBlock, photos[0]);
photoModalBlock.classList.remove('hidden');
