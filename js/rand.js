'use strict';

window.rand = (function () {
  return {
    // Generate a random integer number.
    randInt: function (n) {
      return Math.floor(n * Math.random());
    },

    // Generate a random integer number from the specified range.
    randIntRange: function (min, max) {
      return Math.floor(min + (max - min) * Math.random());
    },

    // Get a random item from the array.
    randChoice: function (items) {
      return items[window.rand.randInt(items.length)];
    }
  };
})();
