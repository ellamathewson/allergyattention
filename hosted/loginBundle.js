"use strict";

/* eslint-disable linebreak-style */

/* eslint-disable eqeqeq */

/* eslint-disable no-unused-vars */

/* eslint-disable object-shorthand */

/* eslint-disable no-undef */
var handleError = function handleError(message) {
  $('#errorMessage').text(message);
  $('#errorModal').modal();
};

var sendAjax = function sendAjax(action, data) {
  $.ajax({
    cache: false,
    type: 'POST',
    url: action,
    data: data,
    dataType: 'json',
    success: function success(result, status, xhr) {
      $('#errorModal').modal('hide');
      window.location = result.redirect;
    },
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};

$(document).ready(function () {
  $('#signupForm').on('submit', function (e) {
    e.preventDefault();
    $('#errorModal').modal('hide');

    if ($('#user').val() == '' || $('#pass').val() == '' || $('#pass2').val() == '') {
      handleError('All fields are required');
      return false;
    }

    if ($('#pass').val() !== $('#pass2').val()) {
      handleError('Passwords do not match');
      return false;
    }

    sendAjax($('#signupForm').attr('action'), $('#signupForm').serialize());
    return false;
  });
  $('#loginForm').on('submit', function (e) {
    e.preventDefault();
    $('#errorModal').modal('hide');

    if ($('#user').val() == '' || $('#pass').val() == '') {
      handleError('Username or password is empty');
      return false;
    }

    sendAjax($('#loginForm').attr('action'), $('#loginForm').serialize());
    return false;
  });
  $('#domoForm').on('submit', function (e) {
    e.preventDefault();
    $('#errorModal').modal('hide');
    console.log("test".concat($('#reactionLevel').val()));

    if ($('#domoName').val() == '' || $('#domoAge').val() == '') {
      handleError('All fields are required');
      return false;
    }

    sendAjax($('#domoForm').attr('action'), $('#domoForm').serialize());
    return false;
  });
});