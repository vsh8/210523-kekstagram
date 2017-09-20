'use strict';

window.error = (function () {
  var errorAlertElement = document.querySelector('.error-alert');
  var errorAlertMessageElement = errorAlertElement.querySelector('.error-alert-msg');
  var errorAlertCloseButton = errorAlertElement.querySelector('.error-alert-close-btn');

  var showErrorAlert = function (errMsg) {
    errorAlertMessageElement.textContent = errMsg;
    errorAlertElement.style.visibility = 'visible';

    errorAlertCloseButton.addEventListener('click', closeErrorAlert);
  };

  var closeErrorAlert = function (evt) {
    errorAlertElement.style.visibility = 'hidden';

    errorAlertCloseButton.removeEventListener('click', closeErrorAlert);

    evt.preventDefault();
  };

  return {
    displayError: function (errMsg) {
      showErrorAlert(errMsg);
    }
  };
})();
