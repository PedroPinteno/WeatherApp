class WeatherApp {
    constructor() {
        this.API_KEY = '337c5998683b1e6ef0016d505931e1f2'; // OpenWeatherMap API Key
        this.BASE_URL = 'https://api.openweathermap.org/data/2.5';
        this.recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
        this.forecastData = null; // Almacenar datos del pronóstico
        
        // Mapeo de ciudades comunes
        this.cityTranslations = {
            'roma': 'rome',
            'londres': 'london',
            'nueva york': 'new york',
            'paris': 'paris',
            'moscu': 'moscow',
            'moscú': 'moscow',
            'venecia': 'venice',
            'florencia': 'florence',
            'milan': 'milan',
            'milán': 'milan',
            'napoles': 'naples',
            'nápoles': 'naples'
        };
        
        this.createModal();
        this.initializeElements();
        this.setupEventListeners();
        this.loadRecentSearches();
    }

    createModal() {
        // Crear el modal dinámicamente
        const modalHTML = `
            <div class="modal" id="hourlyModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 id="modalDate">Lunes, 1 de Enero</h2>
                        <button class="close-modal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="hourly-list" id="hourlyList">
                            <!-- La información por horas se añadirá aquí dinámicamente -->
                        </div>
                    </div>
                </div>
            </div>`;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    initializeElements() {
        // Input y botones
        this.cityInput = document.getElementById('cityInput');
        this.searchBtn = document.getElementById('searchBtn');

        // Contenedores principales
        this.weatherInfo = document.getElementById('weatherInfo');
        this.errorMessage = document.getElementById('errorMessage');
        this.loading = document.getElementById('loading');
        this.forecast = document.getElementById('forecast');
        this.recentList = document.getElementById('recentList');

        // Elementos de información del clima
        this.cityName = document.getElementById('cityName');
        this.date = document.getElementById('date');
        this.weatherIcon = document.getElementById('weatherIcon');
        this.temp = document.getElementById('temp');
        this.description = document.getElementById('description');
        this.feelsLike = document.getElementById('feelsLike');
        this.humidity = document.getElementById('humidity');
        this.wind = document.getElementById('wind');

        // Elementos del modal
        this.modal = document.getElementById('hourlyModal');
        this.modalDate = document.getElementById('modalDate');
        this.hourlyList = document.getElementById('hourlyList');
        this.closeModal = this.modal.querySelector('.close-modal');
    }

    setupEventListeners() {
        this.searchBtn.addEventListener('click', () => this.getWeather());
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.getWeather();
        });

        // Eventos del modal
        this.closeModal.addEventListener('click', () => this.hideModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.hideModal();
        });

        // Evento para búsquedas recientes
        this.recentList.addEventListener('click', (e) => {
            const cityItem = e.target.closest('.recent-item');
            if (cityItem) {
                this.cityInput.value = cityItem.textContent.trim();
                this.getWeather();
            }
        });
    }

    async getWeather() {
        const cityInput = this.cityInput.value.trim();
        if (!cityInput) return;

        // Limpiar estado anterior
        this.clearWeatherInfo();
        this.showLoading();
        this.hideError();

        try {
            // Separar ciudad y país
            let [city, country] = cityInput.split(',').map(part => part.trim());
            
            // Solo traducir si la ciudad está en el diccionario
            const cityLower = city.toLowerCase();
            if (this.cityTranslations[cityLower]) {
                city = this.cityTranslations[cityLower];
            }
            
            // Construir la consulta
            const query = country ? `${city},${country}` : city;

            const weatherResponse = await fetch(
                `${this.BASE_URL}/weather?q=${query}&appid=${this.API_KEY}&units=metric&lang=es`
            );
            
            if (!weatherResponse.ok) {
                throw new Error('Ciudad no encontrada');
            }

            const weatherData = await weatherResponse.json();

            const forecastResponse = await fetch(
                `${this.BASE_URL}/forecast?q=${query}&appid=${this.API_KEY}&units=metric&lang=es`
            );
            
            if (!forecastResponse.ok) {
                throw new Error('Error al obtener el pronóstico');
            }

            const forecastData = await forecastResponse.json();

            this.updateWeather(weatherData);
            this.updateForecast(forecastData.list);
            this.addToRecentSearches(cityInput);
            this.showWeatherInfo();
        } catch (error) {
            console.error('Error:', error);
            this.showError();
        } finally {
            this.hideLoading();
        }
    }

    clearWeatherInfo() {
        // Limpiar datos anteriores
        this.weatherInfo.classList.add('hidden');
        this.forecast.innerHTML = '';
        this.cityName.textContent = '';
        this.date.textContent = '';
        this.temp.textContent = '';
        this.description.textContent = '';
        this.feelsLike.textContent = '';
        this.humidity.textContent = '';
        this.wind.textContent = '';
        this.weatherIcon.innerHTML = '';
    }

    updateWeather(currentData) {
        // Actualizar información principal
        this.cityName.textContent = currentData.name;
        this.date.textContent = this.formatDate(new Date());
        this.temp.textContent = `${Math.round(currentData.main.temp)}°C`;
        this.description.textContent = currentData.weather[0].description;
        this.feelsLike.textContent = `${Math.round(currentData.main.feels_like)}°C`;
        this.humidity.textContent = `${currentData.main.humidity}%`;
        this.wind.textContent = `${Math.round(currentData.wind.speed * 3.6)} km/h`;
        
        // Actualizar icono
        this.weatherIcon.innerHTML = this.getWeatherIcon(currentData.weather[0].icon);
        
        // Actualizar el color según la nubosidad
        this.updateSkyColor(currentData.clouds.all);
    }

    getWeatherIcon(code) {
        const iconMap = {
            '01d': { icon: 'sun', class: 'clear-sky' },
            '01n': { icon: 'moon', class: 'clear-sky' },
            '02d': { icon: 'cloud-sun', class: 'clouds' },
            '02n': { icon: 'cloud-moon', class: 'clouds' },
            '03d': { icon: 'cloud', class: 'clouds' },
            '03n': { icon: 'cloud', class: 'clouds' },
            '04d': { icon: 'clouds', class: 'clouds' },
            '04n': { icon: 'clouds', class: 'clouds' },
            '09d': { icon: 'cloud-showers-heavy', class: 'rain' },
            '09n': { icon: 'cloud-showers-heavy', class: 'rain' },
            '10d': { icon: 'cloud-sun-rain', class: 'rain' },
            '10n': { icon: 'cloud-moon-rain', class: 'rain' },
            '11d': { icon: 'bolt', class: 'thunderstorm' },
            '11n': { icon: 'bolt', class: 'thunderstorm' },
            '13d': { icon: 'snowflake', class: 'snow' },
            '13n': { icon: 'snowflake', class: 'snow' },
            '50d': { icon: 'smog', class: 'mist' },
            '50n': { icon: 'smog', class: 'mist' }
        };

        const iconData = iconMap[code] || { icon: 'question', class: '' };
        return `<div class="weather-icon ${iconData.class}"><i class="fas fa-${iconData.icon}"></i></div>`;
    }

    updateForecast(forecastList) {
        this.forecastData = forecastList; // Guardar datos para uso posterior
        
        // Filtrar pronóstico para obtener un dato por día
        const dailyForecasts = forecastList.filter((forecast, index) => index % 8 === 0).slice(0, 5);
        
        this.forecast.innerHTML = dailyForecasts.map((day, index) => `
            <div class="forecast-item" onclick="app.showHourlyForecast(${index})">
                <div class="day">${this.formatDay(new Date(day.dt * 1000))}</div>
                ${this.getWeatherIcon(day.weather[0].icon)}
                <div class="temp">${Math.round(day.main.temp)}°C</div>
            </div>
        `).join('');
    }

    showHourlyForecast(dayIndex) {
        const startIndex = dayIndex * 8;
        const endIndex = startIndex + 8;
        const dayData = this.forecastData.slice(startIndex, endIndex);
        const date = new Date(dayData[0].dt * 1000);

        this.modalDate.textContent = this.formatDate(date);
        
        this.hourlyList.innerHTML = dayData.map(hour => `
            <div class="hourly-item">
                <div class="hourly-time">
                    ${new Date(hour.dt * 1000).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div class="hourly-info">
                    ${this.getWeatherIcon(hour.weather[0].icon)}
                    <div class="hourly-temp">${Math.round(hour.main.temp)}°C</div>
                </div>
                <div class="hourly-details">
                    <span><i class="fas fa-tint"></i> ${hour.main.humidity}%</span>
                    <span><i class="fas fa-wind"></i> ${Math.round(hour.wind.speed * 3.6)} km/h</span>
                </div>
            </div>
        `).join('');

        this.showModal();
    }

    showModal() {
        this.modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    hideModal() {
        this.modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    addToRecentSearches(city) {
        const capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
        
        // Remover si ya existe
        this.recentSearches = this.recentSearches.filter(item => item !== capitalizedCity);
        
        // Agregar al inicio
        this.recentSearches.unshift(capitalizedCity);
        
        // Mantener solo las últimas 5 búsquedas
        if (this.recentSearches.length > 5) {
            this.recentSearches.pop();
        }

        // Guardar en localStorage
        localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
        
        // Actualizar UI
        this.loadRecentSearches();
    }

    loadRecentSearches() {
        this.recentList.innerHTML = this.recentSearches.map(city => `
            <div class="recent-item" onclick="app.searchCity('${city}')">
                ${city}
            </div>
        `).join('');
    }

    searchCity(city) {
        this.cityInput.value = city;
        this.getWeather();
    }

    formatDate(date) {
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatDay(date) {
        return date.toLocaleDateString('es-ES', { weekday: 'short' });
    }

    showLoading() {
        this.loading.classList.remove('hidden');
        this.weatherInfo.classList.add('hidden');
        this.errorMessage.classList.add('hidden');
    }

    hideLoading() {
        this.loading.classList.add('hidden');
    }

    hideError() {
        this.errorMessage.classList.add('hidden');
    }

    showWeatherInfo() {
        this.weatherInfo.classList.remove('hidden');
    }

    updateSkyColor(cloudiness) {
        const weatherApp = document.querySelector('.weather-app');
        
        // Remover clases anteriores
        weatherApp.classList.remove('sky-clear', 'sky-few-clouds', 'sky-scattered-clouds', 'sky-overcast');
        
        // Añadir clase según el porcentaje de nubosidad
        if (cloudiness < 25) {
            weatherApp.classList.add('sky-clear');
        } else if (cloudiness < 50) {
            weatherApp.classList.add('sky-few-clouds');
        } else if (cloudiness < 75) {
            weatherApp.classList.add('sky-scattered-clouds');
        } else {
            weatherApp.classList.add('sky-overcast');
        }
    }

    showError() {
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <p>Ciudad no encontrada. Por favor, verifica el nombre e inténtalo de nuevo.</p>
            <p>Si buscas una ciudad que existe en varios países, puedes especificar el país (ejemplo: "Granada,ES" para Granada, España)</p>
        `;
        errorMessage.classList.remove('hidden');
    }
}

// Inicializar app
const app = new WeatherApp();
