function init_menu() {
  const $header_menu_toggle = $('.js_header_menu_toggle'),
    $header_menu_close = $('.js_header_menu_close'),
    $main_nav = $('.main-nav');

  $header_menu_toggle.on('click', function (evt) {
    evt.preventDefault();
    $main_nav.addClass('open');

    $(document).on('click', function document_click_handler(evt) {
      if (
        !$(evt.target).is($main_nav) &&
        !$(evt.target).closest($main_nav).length &&
        !$(evt.target).is($header_menu_toggle) &&
        !$(evt.target).closest($header_menu_toggle).length
      ) {
        $main_nav.removeClass('open');
        $(document).off('click', document_click_handler);
      }
    });
  });

  $header_menu_close.on('click', function (evt) {
    evt.preventDefault();
    $main_nav.removeClass('open');
    $(document).off('click', document_click_handler);
  });

  if ($(window).width() < 1200) {
    const $dropdown_toggle = $('.dropdown__toggle');

    $dropdown_toggle.on('click', function (evt) {
      evt.preventDefault();

      const $menu = $(this).next('.js_dropdown');

      if ($menu.is(':visible')) {
        $menu.stop(true, true).slideUp(300);
      } else {
        $menu.stop(true, true).slideDown(300);
      }
    });
  }
}

function init_modals() {
  $.fn.modal = function (action) {
    return this.each(function () {
      var $modal = $(this);

      function show_modal() {
        $modal.fadeIn(0, function () {
          $modal.addClass('show');
        });
        $('body').addClass('modal_open'); // можно потом использовать для блокировки скролла
      }

      function hide_modal() {
        $modal.removeClass('show');
        setTimeout(function () {
          $modal.fadeOut(0);
          $('body').removeClass('modal_open');
        }, 300);
      }

      if (action === 'show') {
        show_modal();
      } else if (action === 'hide') {
        hide_modal();
      }

      // Поддержка кликов на кнопки и фон
      if (!$modal.data('modal_initialized')) {
        $modal.on('click', function (e) {
          if ($(e.target).is('.modal')) hide_modal();
        });
        $modal.on('click', '[data-dismiss="modal"]', hide_modal);
        $modal.data('modal_initialized', true);
      }
    });
  };

  $(document).on('click', '[data-dismiss="modal"]', function () {
    var $modal = $(this).closest('.modal');
    $modal.modal('hide');
  });

  // Открытие через data-атрибуты (bootstrap-стиль)
  $(document).on('click', '[data-toggle="modal"]', function (evt) {
    evt.preventDefault();
    var target = $(this).data('target');
    $(target).modal('show');
  });

  // Закрытие по Esc
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') {
      $('.modal.show').each(function () {
        $(this).modal('hide');
      });
    }
  });
}

function init_sliders() {
  if ($('.js_idx_equipment_slider').length) {
    if ($(window).width() >= 768) {
      var swiper = new Swiper('.js_idx_equipment_slider', {
        slidesPerView: 'auto',
        spaceBetween: 16,
        slidesOffsetBefore: 16,
        slidesOffsetAfter: 16,
        freeMode: {
          enabled: true,
          sticky: true,
        },
        navigation: {
          prevEl: $('.js_idx_eqiup_prev')[0],
          nextEl: $('.js_idx_eqiup_next')[0],
        },
      });
    }
  }

  if ($('.js_news_slider').length) {
    if ($(window).width() < 992) {
      var swiper = new Swiper('.js_news_slider', {
        slidesPerView: 'auto',
        spaceBetween: 16,
        slidesOffsetBefore: 16,
        slidesOffsetAfter: 16,
        freeMode: {
          enabled: true,
          sticky: true,
        },
      });
    }
  }

  if ($('.js_idx_partners_slider').length) {
    var swiper = new Swiper('.js_idx_partners_slider', {
      navigation: {
        nextEl: $('.js_idx_partners_next')[0],
        prevEl: $('.js_idx_partners_prev')[0],
      },

      breakpoints: {
        0: {
          slidesPerView: 2,
          grid: {
            rows: 2,
            fill: 'row',
          },
          spaceBetween: 12,
          slidesOffsetBefore: 12,
          slidesOffsetAfter: 12,
        },

        768: {
          slidesPerView: 'auto',
          grid: {
            rows: 1,
            fill: 'row',
          },
          freeMode: {
            enabled: true,
            sticky: true,
          },
          spaceBetween: 24,
          slidesOffsetBefore: 24,
          slidesOffsetAfter: 24,
        },
      },
    });
  }
}

function init_whyus_content() {
  const $whyus_control_link = $('.js_whyus_control_link'),
    $whyus_list = $('.js_whyus_list');

  if (!$whyus_control_link.length || !$whyus_list.length || $(window).width() < 768) {
    return false;
  }

  $whyus_control_link.on('click', function (evt) {
    evt.preventDefault();

    const href = $(this).attr('href');

    $whyus_control_link.removeClass('active');
    $(this).addClass('active');

    $whyus_list.children('li').removeClass('active');
    $whyus_list.children(href).addClass('active');
  });
}

function init_contacts_map() {
  const $map = $('.js_map');

  if (!$map.length) {
    return false;
  }

  ymaps.ready(function () {
    var my_map = new ymaps.Map($map[0], {
      center: [59.902969, 30.3985],
      zoom: 15,
      controls: [],
    });

    my_map.behaviors.disable(['dblClickZoom', 'rightMouseButtonMagnifier']);

    var my_placemark = new ymaps.Placemark(
      [59.902969, 30.3985],
      {
        hintContent: 'Улица Седова, 12',
        balloonContent: 'Улица Седова, 12',
      },
      {
        preset: 'islands#redDotIcon',
      },
    );
    my_map.geoObjects.add(my_placemark);
  });
}

function init_map() {
  const $markers = $('.js_map_marker');

  if (!$markers.length) {
    return false;
  }

  const $section = $markers.closest('.map');
  const has_gsap = typeof gsap !== 'undefined';

  if (has_gsap) {
    gsap.from($markers, {
      opacity: 0,
      scale: 1.2,
      transformOrigin: 'center bottom',
      duration: 1,
      ease: 'power3.out',
      stagger: 0.03,
      scrollTrigger: {
        trigger: $section[0],
        start: 'top 60%',
        toggleActions: 'play none none once',
      },
    });
  }

  const tooltip_gap = has_gsap ? 32 : 16;
  const viewport_padding = 16;

  let $locked_marker = null;
  let $locked_tooltip = null;

  let $hover_marker = null;
  let $hover_tooltip = null;

  function create_tooltip($marker) {
    const tooltip_text = $marker.data('name');

    if (!tooltip_text) {
      return $();
    }

    const $tooltip = $('<div>', {
      class: 'map__tooltip',
      html: tooltip_text,
    });

    $section.append($tooltip);

    return $tooltip;
  }

  function activate_marker($marker) {
    if (!has_gsap || !$marker.length) {
      return;
    }

    gsap.killTweensOf($marker[0]);

    gsap.to($marker[0], {
      scale: 1.2,
      transformOrigin: 'center bottom',
      duration: 0.3,
      ease: 'power2.out',
    });
  }

  function deactivate_marker($marker) {
    if (!has_gsap || !$marker || !$marker.length) {
      return;
    }

    gsap.killTweensOf($marker[0]);

    gsap.to($marker[0], {
      scale: 0.6,
      transformOrigin: 'center bottom',
      duration: 0.25,
      ease: 'power2.out',
    });
  }

  function position_tooltip($marker, $tooltip) {
    const marker_rect = $marker[0].getBoundingClientRect();
    const tooltip_rect = $tooltip[0].getBoundingClientRect();
    const section_rect = $section[0].getBoundingClientRect();

    const tooltip_width = tooltip_rect.width;
    const tooltip_height = tooltip_rect.height;

    const marker_center_x = marker_rect.left + marker_rect.width / 2;

    let left;
    let top;

    $tooltip.removeClass('left right bottom');

    // Top
    if (marker_rect.top >= tooltip_height + tooltip_gap + viewport_padding) {
      left = marker_center_x - tooltip_width / 2;
      top = marker_rect.top - tooltip_height - tooltip_gap;

      // Right
    } else if (window.innerWidth - marker_rect.right >= tooltip_width + tooltip_gap + viewport_padding) {
      left = marker_rect.right + tooltip_gap;
      top = marker_rect.top + marker_rect.height / 2 - tooltip_height / 2;

      $tooltip.addClass('right');

      // Left
    } else if (marker_rect.left >= tooltip_width + tooltip_gap + viewport_padding) {
      left = marker_rect.left - tooltip_width - tooltip_gap;

      top = marker_rect.top + marker_rect.height / 2 - tooltip_height / 2;

      $tooltip.addClass('left');

      // Bottom
    } else {
      left = marker_center_x - tooltip_width / 2;

      top = marker_rect.bottom + tooltip_gap;

      $tooltip.addClass('bottom');
    }

    left = Math.max(viewport_padding, Math.min(left, window.innerWidth - tooltip_width - viewport_padding));

    top = Math.max(viewport_padding, Math.min(top, window.innerHeight - tooltip_height - viewport_padding));

    $tooltip.css({
      left: left - section_rect.left,
      top: top - section_rect.top,
    });
  }

  function remove_hover_tooltip() {
    if ($hover_tooltip) {
      $hover_tooltip.remove();
      $hover_tooltip = null;
    }

    if ($hover_marker) {
      // Не уменьшаем marker, если он одновременно locked
      if (!$locked_marker || !$locked_marker.is($hover_marker)) {
        deactivate_marker($hover_marker);
      }

      $hover_marker = null;
    }
  }

  function remove_locked_tooltip() {
    if ($locked_tooltip) {
      $locked_tooltip.remove();
      $locked_tooltip = null;
    }

    if ($locked_marker) {
      // Если marker сейчас находится под курсором,
      // его состояние должно остаться hover-активным
      if (!$hover_marker || !$hover_marker.is($locked_marker)) {
        deactivate_marker($locked_marker);
      }

      $locked_marker = null;
    }
  }

  function show_hover_tooltip($marker) {
    if ($locked_marker && $locked_marker.is($marker)) {
      return;
    }

    if ($hover_marker && $hover_marker.is($marker) && $hover_tooltip) {
      return;
    }

    remove_hover_tooltip();

    const $tooltip = create_tooltip($marker);

    if (!$tooltip.length) {
      return;
    }

    $hover_marker = $marker;
    $hover_tooltip = $tooltip;

    position_tooltip($marker, $tooltip);

    requestAnimationFrame(function () {
      $tooltip.addClass('is-visible');
    });
  }

  function lock_tooltip($marker) {
    activate_marker($marker);

    // Если tooltip уже показывается по hover
    // на этом же marker — просто закрепляем его
    if ($hover_marker && $hover_marker.is($marker) && $hover_tooltip) {
      $locked_marker = $marker;
      $locked_tooltip = $hover_tooltip;

      $hover_marker = null;
      $hover_tooltip = null;

      return;
    }

    const $tooltip = create_tooltip($marker);

    if (!$tooltip.length) {
      return;
    }

    $locked_marker = $marker;
    $locked_tooltip = $tooltip;

    position_tooltip($marker, $tooltip);

    requestAnimationFrame(function () {
      $tooltip.addClass('is-visible');
    });
  }

  $markers.on('mouseenter', function () {
    const $marker = $(this);

    activate_marker($marker);
    show_hover_tooltip($marker);
  });

  $markers.on('mouseleave', function () {
    const $marker = $(this);

    // Locked marker не деактивируем
    if ($locked_marker && $locked_marker.is($marker)) {
      return;
    }

    deactivate_marker($marker);

    if ($hover_marker && $hover_marker.is($marker)) {
      remove_hover_tooltip();
    }
  });

  $markers.on('click', function (event) {
    event.preventDefault();
    event.stopPropagation();

    const $marker = $(this);

    // Повторный клик по уже закреплённому marker
    if ($locked_marker && $locked_marker.is($marker)) {
      remove_locked_tooltip();

      return;
    }

    // Убираем предыдущее закрепление
    remove_locked_tooltip();

    // Если на этом marker сейчас hover —
    // превращаем hover tooltip в locked
    if ($hover_marker && $hover_marker.is($marker) && $hover_tooltip) {
      lock_tooltip($marker);

      return;
    }

    // Иначе создаём отдельный locked tooltip
    lock_tooltip($marker);
  });

  $section.on('click', function (event) {
    if (!$(event.target).closest('.js_map_marker, .map__tooltip').length) {
      remove_hover_tooltip();
      remove_locked_tooltip();
    }
  });

  $(window).on('resize', function () {
    if ($locked_marker && $locked_tooltip) {
      position_tooltip($locked_marker, $locked_tooltip);
    }

    if ($hover_marker && $hover_tooltip) {
      position_tooltip($hover_marker, $hover_tooltip);
    }
  });

  return true;
}

let map_loading = false;

async function load_map() {
  const $map_container = $('.js_map_container');


  if (!$map_container.length || !window.matchMedia('(min-width: 992px)').matches || map_loading) {
    return;
  }
  
  try {
    map_loading = true;
    const response = await fetch('/img/map copy.svg');

    if (!response.ok) {
      throw new Error('Failed to load map.svg');
    }

    const svg_content = await response.text();

    $map_container.append(svg_content);

    init_map();
  } catch (error) {
    map_loading = false;
    console.error('Failed to initialize map:', error);
  }
}

$(document).ready(function () {
  init_menu();
  init_modals();
  init_sliders();
  init_whyus_content();
  init_contacts_map();
  init_map();

  $(window).on('resize', function () {
    load_map();
  });
});
