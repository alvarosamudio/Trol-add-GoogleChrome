// Trol Images - Background Service Worker

// Estado inicial
let isEnabled = false;

// Escuchar mensajes del popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggle') {
    isEnabled = message.enabled;
    
    // Guardar estado
    chrome.storage.local.set({ trolEnabled: isEnabled });
    
    // Enviar mensaje a todos los tabs activos
    chrome.tabs.query({ active: true }, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, { 
          action: 'toggle', 
          enabled: isEnabled 
        }).catch(() => {
          // Tab puede no tener el content script cargado
        });
      });
    });
    
    sendResponse({ success: true, enabled: isEnabled });
  } else if (message.action === 'status') {
    sendResponse({ enabled: isEnabled });
  }
});

// Manejar clicks en el ícono de la extensión
chrome.action.onClicked.addListener((tab) => {
  // Alternar estado
  isEnabled = !isEnabled;
  
  chrome.storage.local.set({ trolEnabled: isEnabled });
  
  chrome.tabs.sendMessage(tab.id, { 
    action: 'toggle', 
    enabled: isEnabled 
  }).catch(() => {
    // Si falla, recargar el tab para aplicar cambios
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    }).then(() => {
      chrome.tabs.sendMessage(tab.id, { 
        action: 'toggle', 
        enabled: isEnabled 
      });
    });
  });
});

// Restaurar estado al iniciar
chrome.storage.local.get(['trolEnabled'], (result) => {
  if (result.trolEnabled !== undefined) {
    isEnabled = result.trolEnabled;
  }
});

