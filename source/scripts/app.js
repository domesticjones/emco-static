$(window).load(() => {
  $('body').addClass('is-loaded');
});

$(window).resize(() => {
  $('#resize-hold').fadeIn(250, () => {
    $('#resize-hold svg').fadeIn(50);
    new Vivus('resize-hold-icon', {
      type: 'oneByOne',
      duration: 250,
    });
    $('#resize-hold, #resize-hold svg').delay(5500).fadeOut(1500);
  });
});

$(document).ready(() => {
  // Main Navigation
  $('.nav-item, .inline-link').on('click', (e) => {
    e.preventDefault();
    const $this = $(e.currentTarget);
    const target = $this.attr('href').substring(1);
    $('.panel').removeClass('is-active');
    $('#container').removeClass();
    if ($this.hasClass('is-active')) {
      $this.removeClass('is-active');
      $('.panel.content-hero').addClass('is-active');
      $('#container').addClass('active-hi-there');
    } else {
      $(`.panel[data-section-name="${target}"]`).addClass('is-active');
      $('#container').addClass(`active-${target}`);
      $('.nav-item').removeClass('is-active');
      $(`.nav-item[href="#${target}"]`).addClass('is-active');
    }
    $('html, body, .panel').animate({ scrollTop: 0 }, 'slow');
  });

  // Contact Security Question
  let checkDiv = '';
  $('.check-answer').on('click', (e) => {
    const magicNumber = 666;
    const mailPre = 'info';
    const mailAt = '@';
    const mailSuf = 'domesticjones.com';
    const phone = '208.371.9234';
    const thisVal = $(e.currentTarget).data('val');
    $('#contact-pass').addClass('is-answered').slideDown();
    $('#contact-check').slideUp(1500, () => {
      checkDiv = $('#contact-check').detach();
    });
    if (magicNumber === thisVal) {
      $('body').addClass('is-human');
      $('#contact-fail').remove();
      const mailString = `<li><a href="mailto:${mailPre}${mailAt}${mailSuf}" target="_blank"><i><img src="images/social-mail.svg" alt="icon for email" /></i><span>${mailPre}${mailAt}${mailSuf}</span></a></li>`;
      const phoneString = `<li><a href="tel:${phone}" target="_blank"><i><img src="images/social-phone.svg" alt="icon for telephone" /></i><span>${phone}</span></a></li>`;
      $('#contact-personal').append(`${mailString}${phoneString}`).slideDown();
    }
  });
  // Contact Try Again
  $('#contact-try').on('click', (e) => {
    e.preventDefault();
    $('.contact-info h1').after(checkDiv);
    $('#contact-check').slideDown();
    $('#contact-pass').slideUp();
  });

  // Works navigation
  $('.works-nav-button').on('click', (e) => {
    $('#container').addClass('works-nav-active');
    const $this = $(e.currentTarget).attr('id');
    const indexTotal = $('.work-single').length - 1;
    const activeIndex = $('#work-slideshow-master .work-single.is-active').index();
    $('.work-single').removeClass('is-active');
    let targetIndex = '';
    if ($this == 'works-nav-next') {
      if (activeIndex === indexTotal) {
        targetIndex = 0;
      } else {
        targetIndex = activeIndex + 1;
      }
    } else {
      if (activeIndex === 0) {
        targetIndex = indexTotal;
      } else {
        targetIndex = activeIndex - 1;
      }
    }
    const $target = $('.work-single').eq(targetIndex);
    $target.addClass('is-active');
  });

  // Works slideshows dots navigation
  $('.work-slide-nav').on('click', (e) => {
    const $this = $(e.currentTarget);
    $this.parent().find('.work-slide-nav').removeClass('is-active');
    $this.addClass('is-active');
    const target = $this.index() - 1;
    $this.closest('.work-slideshow').find('.work-slideshow-inner').removeClass('is-active');
    const photo = $this.closest('.work-slideshow').find('.work-slideshow-inner').eq(target).find('.work-slideshow-photo').data('photo');
    $this.closest('.work-slideshow').find('.work-slideshow-inner').eq(target).find('.work-slideshow-photo').css('background-image', `url(${photo})`);
    $this.closest('.work-slideshow').find('.work-slideshow-inner').eq(target).addClass('is-active');
  });
  // Works slideshows arrows navigation
  $('.work-slide-arrow').on('click', (e) => {
    const $this = $(e.currentTarget);
    const thisWay = $this.data('way')
    const indexTotal = $this.closest('.work-slideshow').find('.work-slideshow-inner').length - 1;
    const activeIndex = $this.parent().find('.work-slide-nav.is-active').index() - 1;
    $this.parent().find('.work-slide-nav').removeClass('is-active');
    let targetIndex = '';
    if (thisWay == 'next') {
      if (activeIndex === indexTotal) {
        targetIndex = 0;
      } else {
        targetIndex = activeIndex + 1;
      }
    } else {
      if (activeIndex === 0) {
        targetIndex = indexTotal;
      } else {
        targetIndex = activeIndex - 1;
      }
    }
    const $target = $this.parent().find('.work-slide-nav').eq(targetIndex);
    $target.addClass('is-active');
    $this.closest('.work-slideshow').find('.work-slideshow-inner').removeClass('is-active');
    const photo = $this.closest('.work-slideshow').find('.work-slideshow-inner').eq(targetIndex).find('.work-slideshow-photo').data('photo');
    $this.closest('.work-slideshow').find('.work-slideshow-inner').eq(targetIndex).find('.work-slideshow-photo').css('background-image', `url(${photo})`);
    $this.closest('.work-slideshow').find('.work-slideshow-inner').eq(targetIndex).addClass('is-active');
  });
});
