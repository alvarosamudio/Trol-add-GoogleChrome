// Popup Script for Trol Images Extension

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('toggle');
  const statusIndicator = document.getElementById('statusIndicator');
  const statusText = document.getElementById('statusText');

  // Obtener estado actual
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'status' }, (response) => {
        if (response && response.enabled !== undefined) {
          updateUI(response.enabled);
        } else {
          // Si no hay respuesta, usar estado del storage
          chrome.storage.local.get(['trolEnabled'], (result) => {
            const enabled = result.trolEnabled || false;
            updateUI(enabled);
          });
        }
      });
    }
  });

  // Manejar cambio del toggle
  toggle.addEventListener('change', () => {
    const enabled = toggle.checked;
    
    // Enviar mensaje al content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { 
          action: 'toggle', 
          enabled: enabled 
        }, (response) => {
          if (response && response.success) {
            updateUI(enabled);
          } else {
            // Si falla, usar scripting
            chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              files: ['content.js']
            }).then(() => {
              setTimeout(() => {
                chrome.tabs.sendMessage(tabs[0].id, { 
                  action: 'toggle', 
                  enabled: enabled 
                }, () => {
                  updateUI(enabled);
                });
              }, 100);
            }).catch((error) => {
              console.error('Script injection failed:', error);
              updateUI(enabled);
            });
          }
        });
      }
    });
  });

  // Actualizar UI
  function updateUI(enabled) {
    toggle.checked = enabled;
    
    if (enabled) {
      statusIndicator.classList.add('active');
      statusText.textContent = 'ACTIVADO';
      statusText.classList.add('active');
    } else {
      statusIndicator.classList.remove('active');
      statusText.textContent = 'DESACTIVADO';
      statusText.classList.remove('active');
    }
  }
});

