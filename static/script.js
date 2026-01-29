const API_BASE_URL = 'http://localhost:5000';

// Event listeners
document.getElementById('cityInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

document.getElementById('cityInput').addEventListener('input', (e) => {
    const value = e.target.value.trim();
    if (value.length > 2) {
        // Suggestions could be added here
    }
});

function searchCity(cityName) {
    document.getElementById('cityInput').value = cityName;
    searchWeather();
}

async function searchWeather() {
    const city = document.getElementById('cityInput').value.trim();
    
    if (!city) {
        showError('Por favor, digite o nome de uma cidade');
        return;
    }

    showLoading(true);
    hideError();

    try {
        const response = await fetch(`${API_BASE_URL}/api/weather`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ city })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao buscar dados');
        }

        const data = await response.json();
        displayWeather(data);

    } catch (error) {
        console.error('Erro:', error);
        showError(error.message || 'Erro ao buscar dados do tempo. Tente novamente.');
    } finally {
        showLoading(false);
    }
}

function displayWeather(data) {
    const { current, daily_forecast, hourly_forecast } = data;

    // Hide default message
    document.getElementById('defaultMessage').classList.add('hidden');

    // Display current weather
    displayCurrentWeather(current);

    // Display hourly forecast
    displayHourlyForecast(hourly_forecast);

    // Display daily forecast
    displayDailyForecast(daily_forecast);

    // Show sections
    document.getElementById('currentWeather').classList.remove('hidden');
    document.getElementById('hourlySection').classList.remove('hidden');
    document.getElementById('dailySection').classList.remove('hidden');
}

function displayCurrentWeather(current) {
    const location = `${current.city}${current.admin1 ? ', ' + current.admin1 : ''}${current.country ? ', ' + current.country : ''}`;
    
    document.getElementById('cityName').textContent = location;
    document.getElementById('currentTemp').textContent = current.temperature;
    document.getElementById('apparentTemp').textContent = `${current.apparent_temperature}°C`;
    document.getElementById('humidity').textContent = `${current.humidity}%`;
    document.getElementById('windSpeed').textContent = `${current.wind_speed} km/h`;
    document.getElementById('windDirection').textContent = getWindDirectionName(current.wind_direction);
    document.getElementById('weatherEmoji').textContent = current.emoji;
    document.getElementById('weatherDesc').textContent = current.description;

    // Update last update time
    const updateTime = new Date(current.timestamp).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('lastUpdate').textContent = `Atualizado às ${updateTime}`;
}

function displayHourlyForecast(hourlyData) {
    const container = document.getElementById('hourlyForecast');
    container.innerHTML = '';

    hourlyData.forEach((hour, index) => {
        const time = new Date(hour.time);
        const timeStr = time.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });

        const hourDiv = document.createElement('div');
        hourDiv.className = 'hourly-item';
        hourDiv.innerHTML = `
            <div class="hourly-time">${timeStr}</div>
            <div class="hourly-emoji">${hour.emoji}</div>
            <div class="hourly-temp">${hour.temperature}°</div>
            <div class="hourly-prob">💧 ${hour.precipitation_probability}%</div>
        `;
        container.appendChild(hourDiv);
    });
}

function displayDailyForecast(dailyData) {
    const container = document.getElementById('dailyForecast');
    container.innerHTML = '';

    dailyData.forEach((day, index) => {
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
        const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

        const dayDiv = document.createElement('div');
        dayDiv.className = 'daily-item';
        dayDiv.innerHTML = `
            <div class="daily-date">${dayName}, ${dateStr}</div>
            <div class="daily-emoji">${day.emoji}</div>
            <div class="daily-temps">
                <span class="daily-max">${day.max_temp}°</span>
                <span class="daily-min">${day.min_temp}°</span>
            </div>
            <div class="daily-precipitation">💧 ${day.precipitation_probability}%</div>
            <div class="daily-description">${day.description}</div>
        `;
        container.appendChild(dayDiv);
    });
}

function getWindDirectionName(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 
                       'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return `${directions[index]} (${Math.round(degrees)}°)`;
}

function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (show) {
        spinner.classList.remove('hidden');
    } else {
        spinner.classList.add('hidden');
    }
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

function hideError() {
    document.getElementById('errorMessage').classList.add('hidden');
}

// Initialize with default message
window.addEventListener('load', () => {
    document.getElementById('defaultMessage').classList.remove('hidden');
});
