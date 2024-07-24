$(document).ready(function() {

  'use strict';

  // =====================
  // Membership Navigation
  // Add current class to
  // the current page
  // =====================

  var pathname = window.location.pathname;

  $('.js-nav__link-membership[href="'+ pathname +'"]').addClass('c-nav__link--current');

  // =====================
  // Mobile Drawer
  // =====================

  $('.js-nav-toggle').click(function(e) {
    e.preventDefault();
    $('.c-header-drawer').toggleClass('is-active');

    // $(this).toggleClass('c-nav-toggle--close');

    $('body').toggleClass('e-mode-mobile');
  });

  // =====================
  // Koenig Gallery
  // =====================
  var gallery_images = document.querySelectorAll('.kg-gallery-image img');

  gallery_images.forEach(function (image) {
    var container = image.closest('.kg-gallery-image');
    var width = image.attributes.width.value;
    var height = image.attributes.height.value;
    var ratio = width / height;
    container.style.flex = ratio + ' 1 0%';
  });

  // =====================
  // Decode HTML entities returned by Ghost translations
  // Input: Plus d&#x27;articles
  // Output: Plus d'articles
  // =====================

  function decoding_translation_chars(string) {
    return $('<textarea/>').html(string).text();
  }

  // =====================
  // Responsive videos
  // =====================

  $('.c-content').fitVids({
    'customSelector': [ 'iframe[src*="ted.com"]'          ,
                        'iframe[src*="player.twitch.tv"]' ,
                        'iframe[src*="dailymotion.com"]'  ,
                        'iframe[src*="facebook.com"]'
                      ]
  });

  // =====================
  // Images zoom
  // =====================

  $('.c-content img').attr('data-action', 'zoom');

  // If the image is inside a link, remove zoom
  $('.c-content a img').removeAttr('data-action');

  // =====================
  // Clipboard URL Copy
  // =====================

  var clipboard = new ClipboardJS('.js-share__link--clipboard');

  clipboard.on('success', function(e) {
    var element = $(e.trigger);

    element.addClass('tooltipped tooltipped-s');
    element.attr('aria-label', clipboard_copied_text);

    element.mouseleave(function() {
      $(this).removeAttr('aria-label');
      $(this).removeClass('tooltipped tooltipped-s');
    });
  });

  // =====================
  // Ajax Load More
  // =====================

  var pagination_next_url = $('link[rel=next]').attr('href'),
    $load_posts_button = $('.js-load-posts');

  $load_posts_button.click(function(e) {
    e.preventDefault();

    var request_next_link =
      pagination_next_url.split(/page/)[0] +
      'page/' +
      pagination_next_page_number +
      '/';

    $.ajax({
      url: request_next_link,
      beforeSend: function() {
        $load_posts_button.text(decoding_translation_chars(pagination_loading_text));
        $load_posts_button.addClass('c-btn--loading');
      }
    }).done(function(data) {
      var posts = $('.js-post-card__wrap', data);

      $('.js-grid').append(posts);

      $load_posts_button.text(decoding_translation_chars(pagination_more_posts_text));
      $load_posts_button.removeClass('c-btn--loading');

      pagination_next_page_number++;

      // If you are on the last pagination page, hide the load more button
      if (pagination_next_page_number > pagination_available_pages_number) {
        $load_posts_button.addClass('c-btn--disabled').attr('disabled', true);
      }
    });
  });

  // Header Search form
  var hSearchForm = document.querySelectorAll(".c-header__search--form");
  [].map.call(hSearchForm, function (obj, idx) {
    obj.addEventListener('submit', function (e) {
      e.preventDefault();

      var searchParam = $(this).find('.c-header__search--input')[0].value;
      window.location.href = '/search/' + encodeURIComponent(searchParam.trim());
      return false;
    });
  });

});

/**
 * Social
 */

function toggleShareDropdown() {
  var shareIcons = document.getElementById('share-icons');
  shareIcons.classList.toggle('show');
}

function shareOnFacebook() {
  var sharedURL = location.href;
  var facebookShareURL = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(sharedURL);
  window.open(facebookShareURL, '_blank');
}

function shareOnTwitter() {
  var sharedURL = location.href;
  var twitterShareURL = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(sharedURL);
  window.open(twitterShareURL, '_blank');
}

function shareOnPinterest() {
  var sharedURL = location.href;
  var pinterestShareURL = 'https://www.pinterest.com/pin/create/button/?url=' + encodeURIComponent(sharedURL);
  window.open(pinterestShareURL, '_blank');
}

function shareOnLinkedIn() {
  var sharedURL = location.href;
  var linkedInShareURL = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(sharedURL);
  window.open(linkedInShareURL, '_blank');
}

function shareOnFlipboard() {
  var sharedURL = location.href;
  var flipboardShareURL = 'https://share.flipboard.com/bookmarklet/popout?v=2&title=&url=' + encodeURIComponent(sharedURL);
  window.open(flipboardShareURL, '_blank');
}

function shareOnTelegram() {
  var sharedURL = location.href;
  var telegramShareURL = 'https://telegram.me/share/url?url=' + encodeURIComponent(sharedURL);
  window.open(telegramShareURL, '_blank');
}

function shareOnWhatsApp() {
  var sharedURL = location.href;
  var whatsAppShareURL = 'whatsapp://send?text=' + encodeURIComponent(sharedURL);
  window.open(whatsAppShareURL, '_blank');
}

function shareOnReddit() {
  var sharedURL = location.href;
  var redditShareURL = 'https://www.reddit.com/submit?url=' + encodeURIComponent(sharedURL);
  window.open(redditShareURL, '_blank');
}

function shareViaEmail() {
  var sharedURL = location.href;
  var emailSubject = 'Check out this link';
  var emailBody = 'I found this interesting link and thought you might like it: ' + sharedURL;
  var mailToLink = 'mailto:?subject=' + encodeURIComponent(emailSubject) + '&body=' + encodeURIComponent(emailBody);
  window.location.href = mailToLink;
}

function shareNative() {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // Mobile device, trigger native sharing
    var sharedURL = location.href;
    navigator.share({ url: sharedURL })
      .then(() => console.log('Shared successfully.'))
      .catch((error) => console.log('Error sharing:', error));
  } else {
    console.log('Native sharing not supported on this device.');
  }
}

function copyCurrentPageURL() {
  navigator.clipboard.writeText(window.location.href).then(
    () => {
      alert('URL이 복사되었습니다.');
    }
  );
}