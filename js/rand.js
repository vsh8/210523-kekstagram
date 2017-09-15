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
    },

    // Randomize array items ordering.
    randomizeArray: function (items) {
      var tmp = [];
      var i;
      while (items.length > 0) {
        i = Math.floor(Math.random() * items.length);
        tmp.push(items[i]);
        items.splice(i, 1);
      }
      for (i = 0; i < tmp.length; i++) {
        items.push(tmp[i]);
      }
    }
  };
})();
