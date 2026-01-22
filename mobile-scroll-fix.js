// Исправление анимаций при скролле на мобильных устройствах
(function() {
  'use strict';
  
  // Проверка на мобильное устройство
  var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                 (window.innerWidth <= 768) ||
                 ('ontouchstart' in window);
  
  if (!isMobile) return;
  
  // Throttle для scroll событий
  var scrollTimeout;
  var lastScrollTop = 0;
  var ticking = false;
  
  function throttle(func, wait) {
    return function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          func.apply(this, arguments);
          ticking = false;
        });
        ticking = true;
      }
    };
  }
  
  // Оптимизация scroll событий
  var optimizedScrollHandler = throttle(function() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    lastScrollTop = scrollTop;
  }, 16); // ~60fps
  
  // Отключение плавного скролла на мобильных
  if (document.documentElement.style.scrollBehavior !== undefined) {
    document.documentElement.style.scrollBehavior = 'auto';
  }
  
  // Добавление обработчика scroll с оптимизацией
  window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
  
  // Отключение анимаций для элементов с проблемами производительности
  var style = document.createElement('style');
  style.textContent = `
    @media (max-width: 768px) {
      * {
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
      }
      
      /* Отключение transform-анимаций при скролле */
      [style*="transform"] {
        transition: none !important;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Оптимизация IntersectionObserver для мобильных
  if ('IntersectionObserver' in window) {
    var observerOptions = {
      rootMargin: '50px',
      threshold: [0, 0.1, 0.5, 1.0]
    };
    
    // Переопределение обработчиков анимаций при появлении в viewport
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.style.willChange = 'transform';
          entry.target.style.backfaceVisibility = 'hidden';
        } else {
          entry.target.style.willChange = 'auto';
        }
      });
    }, observerOptions);
    
    // Наблюдение за элементами с анимациями
    setTimeout(function() {
      var animatedElements = document.querySelectorAll('[class*="animate"], [style*="transform"], [style*="animation"]');
      animatedElements.forEach(function(el) {
        observer.observe(el);
      });
    }, 1000);
  }
})();
