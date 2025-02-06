# 🌤️ App del Clima

## 📋 Descripción
Aplicación web del clima que muestra información meteorológica detallada y pronóstico de 5 días utilizando la API de OpenWeatherMap.

## ✨ Características

### 🎯 Funcionalidades Principales
- Búsqueda de ciudades por nombre
- Temperatura actual y sensación térmica
- Humedad y velocidad del viento
- Pronóstico de 5 días
- Historial de búsquedas recientes
- Iconos dinámicos según el clima

### 🌟 Características Técnicas
- Integración con OpenWeatherMap API
- Manejo asíncrono de datos
- LocalStorage para búsquedas recientes
- Animaciones y transiciones suaves
- Diseño responsive

## 🛠️ Tecnologías Utilizadas
- HTML5
- CSS3 (Variables CSS, Grid, Flexbox)
- JavaScript (ES6+, Async/Await)
- OpenWeatherMap API
- LocalStorage para persistencia
- Font Awesome para iconos

## 📁 Estructura del Proyecto
```
WeatherApp/
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── img/
│   └── [iconos del clima]
├── index.html
└── README.md
```

## 🚀 Configuración

1. **Obtener API Key**
   - Regístrate en [OpenWeatherMap](https://openweathermap.org/)
   - Obtén tu API Key gratuita
   - Reemplaza `TU_API_KEY_AQUI` en `app.js` con tu API Key

2. **Instalación**
   - Clona el repositorio
   - Abre `index.html` en tu navegador
   - O usa un servidor local (recomendado)

## 💡 Características Destacadas

### 🔍 Búsqueda Inteligente
- Búsqueda instantánea de ciudades
- Historial de últimas 5 búsquedas
- Sugerencias basadas en búsquedas recientes

### 📊 Información Detallada
- Temperatura actual
- Sensación térmica
- Humedad
- Velocidad del viento
- Descripción del clima
- Iconos dinámicos

### 📅 Pronóstico
- Previsión de 5 días
- Temperaturas máximas y mínimas
- Iconos según condición climática
- Descripción del tiempo

### 🎨 Diseño
- Interfaz moderna y limpia
- Animaciones suaves
- Totalmente responsive
- Iconos intuitivos

## 📱 Responsive Design
- Adaptable a todos los dispositivos
- Layout fluido
- Menú y contenido optimizado
- Experiencia consistente

## ⚙️ API Utilizada
- OpenWeatherMap API
- Endpoints:
  - Current Weather Data
  - 5 Day Forecast
  - Geocoding API

## 🔍 Manejo de Errores
- Validación de ciudad
- Mensajes de error amigables
- Estado de carga
- Recuperación de errores

## 👤 Autor
- **SatruxDev**

## 📝 Notas
- La API Key debe mantenerse privada en producción
- Se recomienda implementar rate limiting
- Considerar caché de resultados para optimización

## 📦 Integración en WordPress

### 1. Uso de Shortcodes
- Crea un shortcode en el archivo `functions.php` de tu tema:
```php
function weather_app_shortcode() {
    ob_start();
    include 'ruta/a/tu/index.html'; // Asegúrate de proporcionar la ruta correcta
    return ob_get_clean();
}
add_shortcode('weather_app', 'weather_app_shortcode');
```

### 2. Enqueue Scripts y Estilos
- Asegúrate de encolar los archivos CSS y JavaScript en el archivo `functions.php`:
```php
function enqueue_weather_app_scripts() {
    wp_enqueue_style('weather-app-style', get_template_directory_uri() . '/css/styles.css');
    wp_enqueue_script('weather-app-script', get_template_directory_uri() . '/js/app.js', array(), null, true);
}
add_action('wp_enqueue_scripts', 'enqueue_weather_app_scripts');
```

### 3. Crear una Página de Plantilla
- Si deseas que la aplicación tenga su propia página, crea una plantilla personalizada:
```php
/* Template Name: Weather App */
get_header();
include 'ruta/a/tu/index.html';
get_footer();
```

### 4. Configuración de la API
- Regístrate en [OpenWeatherMap](https://openweathermap.org/) y obtén tu API Key. Asegúrate de reemplazar `TU_API_KEY_AQUI` en `app.js` con tu API Key.

### 5. Uso de Widgets
- Considera crear un widget para mostrar la aplicación en las barras laterales o pie de página.
