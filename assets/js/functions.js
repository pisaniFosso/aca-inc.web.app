/* Background Images
-------------------------------------------------------------------*/
var pageTopImage = jQuery('#page-top').data('background-image');
var aboutImage = jQuery('#page-about').data('background-image');
var subscribeImage = jQuery('#subscribe').data('background-image');
var contactImage = jQuery('#contact').data('background-image');

if (pageTopImage) { jQuery('#page-top').css({ 'background-image': 'url(' + pageTopImage + ')' }); };
if (aboutImage) { jQuery('#page-about').css({ 'background-image': 'url(' + aboutImage + ')' }); };
if (subscribeImage) { jQuery('#subscribe').css({ 'background-image': 'url(' + subscribeImage + ')' }); };
if (contactImage) { jQuery('#contact').css({ 'background-image': 'url(' + contactImage + ')' }); };

/* Background Images End
-------------------------------------------------------------------*/



/* generateID Start
--------------------------------------------------------------------*/

function generateID() {
  var d = new Date().getTime();

  var guid = 'xxxxxxxx-xxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);

    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });

  return guid;
}
/*GenerateId end
--------------------------------------------------------------------*/


/* Document Ready function
-------------------------------------------------------------------*/
jQuery(document).ready(function ($) {
  "use strict";


  /* Window Height Resize
  -------------------------------------------------------------------*/
  var windowheight = jQuery(window).height();
  if (windowheight > 650) {
    $('.pattern').removeClass('height-resize');
  }
  /* Window Height Resize End
  -------------------------------------------------------------------*/



  /* Main Menu   
  -------------------------------------------------------------------*/
  $('#main-menu #headernavigation').onePageNav({
    currentClass: 'active',
    changeHash: true,
    scrollSpeed: 750,
    scrollThreshold: 0.5,
    scrollOffset: 0,
    filter: '',
    easing: 'swing',
    filter: ':not(.external)'
  });

  /* Main Menu End  
  -------------------------------------------------------------------*/




  /* Time Countdown 
  -------------------------------------------------------------------*/

  var today = new Date();
  var endDay = new Date('Jan 01, 2021');
  var todayDate = today.getMonth() + '/' + today.getDate() + '/' + today.getFullYear();
  var endDayDate = endDay.getMonth() + '/' + endDay.getDate() + '/' + endDay.getFullYear();
  var diff = datediff(parseDate(todayDate), parseDate(endDayDate));
  const year = diff / 365;
  const months = diff % 365 / 30;
  const days = (diff % 365) % 30;
  const hours = endDay.getHours() - today.getHours();
  const mins = endDay.getMinutes() - today.getMinutes();
  const secs = endDay.getSeconds() - today.getSeconds();
  // const year = diff/365;

  window.onunload = function () {
    //logout code here...
    auth.signOut().then(() => {
      sessionStorage.clear()
    })
  }


  function parseDate(str) {
    var mdy = str.split('/');
    return new Date(mdy[2], mdy[0] - 1, mdy[1]);
  }

  function datediff(first, second) {
    // Take the difference between the dates and divide by milliseconds per day.
    // Round to nearest whole number to deal with DST.
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
  }

  $('#time_countdown').countDown({

    // targetDate: {
    //     'day': 30,
    //     'month': 9,
    //     'year': 2015,
    //     'hour': 0,
    //     'min': 0,
    //     'sec': 0
    // },
    // omitWeeks: true


    targetOffset: {
      'day': days,
      'month': months,
      'year': year,
      'hour': hours,
      'min': mins,
      'sec': secs
    },
    omitWeeks: true

  });

// 

  /* Next Section   
  -------------------------------------------------------------------*/
  $('.next-section .go-to-about').click(function () {

    $('html,body').animate({ scrollTop: $('#page-about').offset().top }, 1000);
  });
  $('.next-section .go-to-subscribe').click(function () {
    if (sessionStorage.getItem('uid'))
      $('html,body').animate({ scrollTop: $('#contact').offset().top }, 1000);
    else
      $('html,body').animate({ scrollTop: $('#subscribe').offset().top }, 1000);
  });
  $('.next-section .go-to-contact').click(function () {
    $('html,body').animate({ scrollTop: $('#contact').offset().top }, 1000);
  });
  $('.next-section .go-to-page-top').click(function () {
    $('html,body').animate({ scrollTop: $('#page-top').offset().top }, 1000);
  });

  /* Next Section End
-------------------------------------------------------------------*/




  /* Subscribe
  -------------------------------------------------------------------*/
  $(".news-letter").ajaxChimp({
    callback: mailchimpResponse,
    url: "http://jeweltheme.us10.list-manage.com/subscribe/post?u=a3e1b6603a9caac983abe3892&amp;id=257cf1a459" // Replace your mailchimp post url inside double quote "".  
  });

  function mailchimpResponse(resp) {
    if (resp.result === 'success') {

      $('.alert-success').html(resp.msg).fadeIn().delay(3000).fadeOut();

    } else if (resp.result === 'error') {
      $('.alert-warning').html(resp.msg).fadeIn().delay(3000).fadeOut();
    }
  };




  /* Subscribe End
  -------------------------------------------------------------------*/




  /* Contact
  -------------------------------------------------------------------*/
  // Email from Validation
  $('#contact-submit').click(function (e) {

    //Stop form submission & check the validation
    e.preventDefault();


    $('.first-name-error, .last-name-error, .contact-email-error, .contact-subject-error, .contact-message-error').hide();

    // Variable declaration
    var error = false;
    var k_first_name = $('#first_name').val();
    var k_last_name = $('#last_name').val();
    var k_email = $('#contact_email').val();
    var k_subject = $('#subject').val();
    var k_message = $('#message').val();

    // Form field validation
    if (k_first_name.length == 0) {
      var error = true;
      $('.first-name-error').html('<i class="fa fa-exclamation"></i> First name is required.').fadeIn();
    }

    if (k_last_name.length == 0) {
      var error = true;
      $('.last-name-error').html('<i class="fa fa-exclamation"></i> Last name is required.').fadeIn();
    }

    if (k_email.length != 0 && validateEmail(k_email)) {

    } else {
      var error = true;
      $('.contact-email-error').html('<i class="fa fa-exclamation"></i> Please enter a valid email address.').fadeIn();
    }

    if (k_subject.length == 0) {
      var error = true;
      $('.contact-subject-error').html('<i class="fa fa-exclamation"></i> Subject is required.').fadeIn();
    }

    if (k_message.length == 0) {
      var error = true;
      $('.contact-message-error').html('<i class="fa fa-exclamation"></i> Please provide a message.').fadeIn();
    }

    // If there is no validation error, next to process the mail function
    if (error == false) {

      $('#contact-submit').hide();
      $('#contact-loading').fadeIn();
      $('.contact-error-field').fadeOut();


      // Disable submit button just after the form processed 1st time successfully.
      $('#contact-submit').attr({ 'disabled': 'true', 'value': 'Sending' });

      /* Post Ajax function of jQuery to get all the data from the submission of the form as soon as the form sends the values to email.php*/
      $.post("php/contact.php", $("#contact-form").serialize(), function (result) {
        //Check the result set from email.php file.
        if (result == 'sent') {



          //If the email is sent successfully, remove the submit button
          $('#first_name').remove();
          $('#last_name').remove();
          $('#contact_email').remove();
          $('#subject').remove();
          $('#message').remove();
          $('#contact-submit').remove();

          $('.contact-box-hide').slideUp();
          $('.contact-message').html('<i class="fa fa-check contact-success"></i><div>Your message has been sent.</div>').fadeIn();
        } else {
          $('.btn-contact-container').hide();
          $('.contact-message').html('<i class="fa fa-exclamation contact-error"></i><div>Something went wrong, please try again later.</div>').fadeIn();

        }
      });
    }
  });





  /* Contact End
  -------------------------------------------------------------------*/








});

function validateEmail(sEmail) {
  var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  if (filter.test(sEmail)) {
    return true;
  } else {
    return false;
  }
}

/* Document Ready function End
-------------------------------------------------------------------*/


/* Preloder 
-------------------------------------------------------------------*/
$(window).load(function () {
  "use strict";
  $("#loader").fadeOut();
  $("#preloader").delay(1000).fadeOut("slow");
});
 /* Preloder End
-------------------------------------------------------------------*/

