// ============================================
// КАСТОМНЫЕ ИСПРАВЛЕНИЯ БАГОВ (JavaScript)
// ============================================

(function() {
  'use strict';
  
  // Ждем загрузки DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  function init() {
    // 3. Улучшение стиля текста "Скоро тут будет продолжение"
    improveComingSoonText();
    
    // 6. Исправление копирования и кнопок на мобилке
    fixMobileCopyAndButtons();
    
    // 7. Улучшение мобильного меню
    improveMobileMenu();
    
    // Дополнительные исправления
    fixButtonOverflow();
    fixAnimations();
  }
  
  // 3. Улучшение стиля текста "Скоро тут будет продолжение"
  function improveComingSoonText() {
    const textToFind = /скоро\s+тут\s+будет\s+продолжение/i;
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    let node;
    while (node = walker.nextNode()) {
      if (textToFind.test(node.textContent)) {
        const parent = node.parentElement;
        if (parent) {
          parent.classList.add('coming-soon-text');
          parent.style.cssText += 'font-size: 18px !important; font-weight: 400 !important; color: #666 !important; font-style: italic !important; letter-spacing: 0.5px !important; line-height: 1.6 !important; opacity: 0.8 !important; text-align: center !important; padding: 20px !important;';
        }
      }
    }
  }
  
  // 6. Исправление копирования и кнопок на мобилке
  function fixMobileCopyAndButtons() {
    if (window.innerWidth <= 768) {
      // Исправление копирования текста
      const style = document.createElement('style');
      style.textContent = `
        * {
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
          user-select: text !important;
        }
      `;
      document.head.appendChild(style);
      
      // Исправление кнопок
      const buttons = document.querySelectorAll('button, a[class*="button"], [role="button"]');
      buttons.forEach(button => {
        button.style.cssText += 'cursor: pointer !important; pointer-events: auto !important; touch-action: manipulation !important; -webkit-tap-highlight-color: rgba(0, 166, 81, 0.2) !important; min-height: 44px !important; min-width: 44px !important;';
        
        // Добавляем обработчик для активного состояния
        button.addEventListener('touchstart', function() {
          this.style.opacity = '0.8';
          this.style.transform = 'scale(0.98)';
        });
        
        button.addEventListener('touchend', function() {
          setTimeout(() => {
            this.style.opacity = '';
            this.style.transform = '';
          }, 100);
        });
      });
      
      // Исправление для кнопок копирования
      const copyButtons = document.querySelectorAll('[class*="copy"], [data-action*="copy"], button[title*="copy" i], button[title*="копировать" i]');
      copyButtons.forEach(button => {
        button.style.cssText += 'display: block !important; visibility: visible !important; opacity: 1 !important; pointer-events: auto !important;';
      });
    }
  }
  
  // 7. Улучшение мобильного меню
  function improveMobileMenu() {
    if (window.innerWidth <= 768) {
      const menuElements = document.querySelectorAll('.mag-menu, [class*="menu"], [class*="nav"], [class*="toolbar"]');
      menuElements.forEach(menu => {
        menu.style.cssText += 'background-color: rgba(255, 255, 255, 0.98) !important; backdrop-filter: blur(10px) !important; -webkit-backdrop-filter: blur(10px) !important; box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1) !important; border-radius: 0 !important; padding: 16px !important;';
        
        const menuItems = menu.querySelectorAll('a, button');
        menuItems.forEach(item => {
          item.style.cssText += 'padding: 14px 16px !important; margin: 4px 0 !important; border-radius: 8px !important; font-size: 16px !important; line-height: 1.5 !important; transition: all 0.3s ease !important; display: block !important; width: 100% !important; text-align: left !important;';
          
          item.addEventListener('touchstart', function() {
            this.style.backgroundColor = 'rgba(0, 166, 81, 0.1)';
            this.style.color = '#00a651';
          });
          
          item.addEventListener('touchend', function() {
            setTimeout(() => {
              this.style.backgroundColor = '';
              this.style.color = '';
            }, 200);
          });
        });
      });
      
      // Улучшение кнопки меню (гамбургер)
      const menuButtons = document.querySelectorAll('[class*="menu-button"], [class*="hamburger"], [aria-label*="Menu" i]');
      menuButtons.forEach(button => {
        button.style.cssText += 'width: 44px !important; height: 44px !important; padding: 10px !important; border-radius: 8px !important; background-color: rgba(0, 0, 0, 0.05) !important; transition: all 0.3s ease !important;';
        
        button.addEventListener('touchstart', function() {
          this.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
          this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', function() {
          setTimeout(() => {
            this.style.backgroundColor = '';
            this.style.transform = '';
          }, 100);
        });
      });
    }
  }
  
  // Исправление выхода элементов за границы кнопок
  function fixButtonOverflow() {
    const buttons = document.querySelectorAll('button, a[class*="button"]');
    buttons.forEach(button => {
      if (!button.style.overflow) {
        button.style.overflow = 'hidden';
      }
      if (!button.style.borderRadius && !button.classList.contains('no-radius')) {
        button.style.borderRadius = '8px';
      }
    });
  }
  
  // Исправление анимаций на мобилке
  function fixAnimations() {
    if (window.innerWidth <= 768) {
      const animatedElements = document.querySelectorAll('[class*="animation"], [style*="animation"], .animation-container');
      animatedElements.forEach(element => {
        element.style.animationPlayState = 'running';
        element.style.opacity = '1';
        
        // Проверяем, есть ли анимация
        const animation = window.getComputedStyle(element).animation;
        if (!animation || animation === 'none') {
          element.style.animation = 'fadeIn 0.6s ease-in-out';
        }
      });
      
      // Добавляем keyframes, если их нет
      if (!document.getElementById('custom-animations')) {
        const style = document.createElement('style');
        style.id = 'custom-animations';
        style.textContent = `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideIn {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `;
        document.head.appendChild(style);
      }
    }
  }
  
  // Обновляем при изменении размера окна
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      fixMobileCopyAndButtons();
      improveMobileMenu();
      fixAnimations();
    }, 250);
  });
  
})();
