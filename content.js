
// Trol Images - Content Script
// Adaptado para Chrome Extension

(function() {
  'use strict';

  // Imagen por defecto
  const DEFAULT_IMAGE = 'http://www.techtricksworld.com/wp-content/uploads/2015/12/Error-404.png';

  // Variables de estado
  let isRunning = false;
  let intervalId = null;
  let replacedImages = new Set();
  let currentImage = DEFAULT_IMAGE;

  // Función para reemplazar imágenes
  function replaceImages() {
    if (!isRunning) return;

    const images = document.querySelectorAll('img');
    
    images.forEach((img) => {
      // Skip si ya fue reemplazada o si es la imagen de trol
      if (replacedImages.has(img) || img.src === currentImage) return;
      
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;
      
      if (width > 0 && height > 0) {
        // Mantener dimensiones
        img.style.width = width + 'px';
        img.style.height = height + 'px';
        // Reemplazar src
        img.src = currentImage;
        // Guardar referencia
        replacedImages.add(img);
      }
    });
  }

  // Observer para nuevas imágenes (lazy loading, AJAX, etc.)
  function setupObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            if (node.tagName === 'IMG') {
              replaceImage(node);
            } else {
              const images = node.querySelectorAll('img');
              images.forEach(img => replaceImage(img));
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  function replaceImage(img) {
    if (!isRunning || replacedImages.has(img) || img.src === currentImage) return;
    
    const width = img.naturalWidth || img.width;
    const height = img.naturalHeight || img.height;
    
    if (width > 0 && height > 0) {
      img.style.width = width + 'px';
      img.style.height = height + 'px';
      img.src = currentImage;
      replacedImages.add(img);
    } else {
      img.onload = () => {
        if (!replacedImages.has(img) && isRunning) {
          img.style.width = img.naturalWidth + 'px';
          img.style.height = img.naturalHeight + 'px';
          img.src = currentImage;
          replacedImages.add(img);
        }
      };
    }
  }

  // Iniciar el trol
  function start() {
    if (isRunning) return;
    
    isRunning = true;
    replacedImages.clear();
    
    replaceImages();
    setupObserver();
    intervalId = setInterval(replaceImages, 3000);
    
    console.log('Trol Images: Activado con imagen:', currentImage);
  }

  // Detener el trol
  function stop() {
    isRunning = false;
    
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    
    replacedImages.clear();
    console.log('Trol Images: Desactivado');
  }

  // Cambiar imagen de reemplazo
  function setImage(imageUrl) {
    currentImage = imageUrl || DEFAULT_IMAGE;
    replacedImages.clear();
    // Volver a aplicar si está activo
    if (isRunning) {
      replaceImages();
    }
  }

  // Escuchar mensajes del background/popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'toggle') {
      if (message.enabled) {
        start();
      } else {
        stop();
      }
      sendResponse({ success: true, enabled: message.enabled });
    } else if (message.action === 'status') {
      sendResponse({ enabled: isRunning });
    } else if (message.action === 'setImage') {
      setImage(message.imageUrl);
      sendResponse({ success: true });
    }
  });

  // Cargar configuración al iniciar
  chrome.storage.local.get(['trolEnabled', 'trolImage'], (result) => {
    if (result.trolImage) {
      currentImage = result.trolImage;
    }
    if (result.trolEnabled) {
      start();
    }
  });

  // Escuchar cambios en storage (para cambios en tiempo real)
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.trolImage) {
      const newImage = changes.trolImage.newValue;
      if (newImage) {
        currentImage = newImage;
        replacedImages.clear();
        if (isRunning) {
          replaceImages();
        }
        console.log('Trol Images: Imagen actualizada a:', currentImage);
      }
    }
  });
})();

