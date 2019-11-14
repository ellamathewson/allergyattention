/* eslint-disable linebreak-style */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable object-shorthand */
/* eslint-disable no-undef */
const handleError = (message) => {
  $('#errorMessage').text(message);
  $('#errorModal').modal();
};

const sendAjax = (action, data) => {
  $.ajax({
    cache: false,
    type: 'POST',
    url: action,
    data: data,
    dataType: 'json',
    success: (result, status, xhr) => {
      $('#errorModal').modal('hide');

      window.location = result.redirect;
    },
    error: (xhr, status, error) => {
      const messageObj = JSON.parse(xhr.responseText);

      handleError(messageObj.error);
    },
  });
};

$(document).ready(() => {
  $('#signupForm').on('submit', (e) => {
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

  $('#loginForm').on('submit', (e) => {
    e.preventDefault();

    $('#errorModal').modal('hide');

    if ($('#user').val() == '' || $('#pass').val() == '') {
      handleError('Username or password is empty');
      return false;
    }

    sendAjax($('#loginForm').attr('action'), $('#loginForm').serialize());

    return false;
  });

  $('#mealForm').on('submit', (e) => {
    e.preventDefault();

    $('#errorModal').modal('hide');
    console.log(`test${$('#reactionLevel').val()}`);

    if ($('#mealName').val() == '' || $('#mealIngredients').val() == '') {
      handleError('All fields are required');
      return false;
    }

    sendAjax($('#mealForm').attr('action'), $('#mealForm').serialize());

    return false;
  });
});
