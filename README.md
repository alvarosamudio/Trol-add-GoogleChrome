# 🎭 Trol Images - Extensión de Chrome

## Descripción

Esta extensión de Chrome reemplaza todas las imágenes de cualquier página web con una imagen de "Error 404". ¡La broma perfecta para trollear páginas web!

## 📁 Estructura de Archivos

```
Trol-add-GoogleChrome/
├── manifest.json          # Configuración de la extensión
├── content.js             # Script que ejecuta el trol en las páginas
├── background.js          # Service worker (gestiona estado)
├── popup.html             # Interfaz del popup
├── popup.js               # Lógica del popup
├── icons/
│   ├── icon16.png        # Ícono 16x16
│   ├── icon48.png        # Ícono 48x48
│   └── icon128.png       # Ícono 128x128
└── README.md             # Este archivo
```

## 🚀 Instalación

### Opción 1: Cargar como extensión sin empaquetar

1. **Abre Chrome** y ve a `chrome://extensions/`

2. **Activa el "Modo de desarrollador"** (esquina superior derecha)

3. **Haz clic en "Cargar descomprimida"**

4. **Selecciona la carpeta** `Trol-add-GoogleChrome/`

5. **¡Listo!** Verás el ícono 🎭 en tu barra de extensiones

### Opción 2: Generar íconos personalizados

1. Abre `generate-icons.html` en tu navegador

2. Haz clic en "Generar Íconos"

3. Descarga los 3 archivos PNG

4. Crea una carpeta `icons/` y guárdalos ahí

## 🎮 Cómo Usar

1. **Navega** a cualquier página web

2. **Haz clic** en el ícono 🎭 de la extensión

3. **Activa** el toggle para iniciar el trol

4. **¡Observa** cómo todas las imágenes se convierten en Error 404!

## ⚙️ Características

- ✅ Reemplazo automático de imágenes cada 3 segundos
- ✅ Detecta imágenes nuevas (lazy loading, AJAX, etc.)
- ✅ Popup moderno para activar/desactivar
- ✅ Persistencia de estado
- ✅ Compatible con todas las páginas web

## 📝 Permisos

- `storage` - Guardar configuración
- `activeTab` - Acceder a la pestaña actual
- `scripting` - Inyectar scripts si es necesario

## 🎨 Personalizar Imagen

Para cambiar la imagen de reemplazo, edita `content.js`:

```javascript
const TROL_IMAGE = 'TU_IMAGEN_AQUI';
```

## 👨‍💻 Desarrollo

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/Trol-add-GoogleChrome.git
cd Trol-add-GoogleChrome

# Hacer cambios en los archivos...

# Recargar extensión en Chrome
# (botón "Recargar" en chrome://extensions/)
```

## ☕ ¿Te Gustó?

Si te diviertes con esta extensión, considera apoyarme:

[<img src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_100x26.png" style="width:72px;">](https://paypal.me/G4SP3R)

---

**¡Diviértete trolleando! 🎭😄**
