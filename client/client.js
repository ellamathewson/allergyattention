/* eslint-disable linebreak-style */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable object-shorthand */
/* eslint-disable no-undef */

/* Shows error div on page when needed */
const handleError = (message) => {
  $('#error').text = message;
  $('#error').fadeIn(200);
};

/* Sends Ajax request */
const sendAjax = (action, data) => {
  $.ajax({
    cache: false,
    type: 'POST',
    url: action,
    data: data,
    dataType: 'json',
    success: (result, status, xhr) => {
      $('#error').fadeOut(200);

      window.location = result.redirect;
    },
    error: (xhr, status, error) => {
      const messageObj = JSON.parse(xhr.responseText);

      handleError(messageObj.error);
    },
  });
};

/* On page ready */
$(document).ready(() => {
  /* When signup form is submitted */
  $('#signupForm').on('submit', (e) => {
    /* Stops page from redirecting */
    e.preventDefault();
    $('#error').fadeOut(200);

    /* If any input is empty, show error */
    if ($('#user').val() == '' || $('#pass').val() == '' || $('#pass2').val() == '') {
      handleError('All fields are required');
      return false;
    }

    /* If the passwords do not match, show error */
    if ($('#pass').val() !== $('#pass2').val()) {
      handleError('Passwords do not match');
      return false;
    }

    /* Otherwise continue loading new page */
    sendAjax($('#signupForm').attr('action'), $('#signupForm').serialize());

    return false;
  });

  /* Login page */
  $('#loginForm').on('submit', (e) => {
    e.preventDefault();

    /* If either of the fields are blank show error */
    if ($('#user').val() == '' || $('#pass').val() == '') {
      handleError('Username or password is empty');
      return false;
    }

    /* Otherwise continue loading new page */
    sendAjax($('#loginForm').attr('action'), $('#loginForm').serialize());

    return false;
  });

  /* Adding new data to database (meals) */
  $('#mealForm').on('submit', (e) => {
    e.preventDefault();

    /* if any of the fields are blank show error */
    if ($('#mealName').val() == '' || $('#mealIngredients').val() == '' || $('#reactionLevel').val() == '') {
      handleError('All fields are required');
      return false;
    }

    /* Otherwise continue loading new page */
    sendAjax($('#mealForm').attr('action'), $('#mealForm').serialize());

    return false;
  });

  /* Adding new data to database (meals) */
  $('#changePassword').on('submit', (e) => {
    e.preventDefault();

    /* if any of the fields are blank show error */
    if ($('#oldPass').val() == '' || $('#newPass1').val() == '' || $('#newPass2').val() == '') {
      handleError('All fields are required');
      return false;
    }

    $('#error').fadeIn(200);
    /* Otherwise continue loading new page */
    // sendAjax($('#changePassword').attr('action'), $('#changePassword').serialize());

    return false;
  });
});
