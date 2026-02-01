const apiKey = '5be142b2adf71122421c1e95284be4ac';  

let isCompact = false;
let isNight = false;

async function getWeather() {
    const city = document.getElementById('city').value;
    if (!city) {
        alert('Por favor, digite o nome de uma cidade.');
        return;
    }

    showLoader();
    console.log(`Buscando forecast para: ${city}`);

    setTimeout(() => {
        hideLoader();
        displayMockForecast(city);
    }, 1000);
}

function getWeatherByLocation() {
    if (navigator.geolocation) {
        showLoader();
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
          
            setTimeout(() => {
                hideLoader();
                displayMockForecast('Sua Localização');
            }, 1000);
        }, () => {
            hideLoader();
            alert('Não foi possível obter sua localização.');
        });
    } else {
        alert('Geolocalização não suportada pelo navegador.');
    }
}

async function fetchForecastByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`;
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            hideLoader();
            displayForecast(data);
            return;
        }
    } catch (error) {
        console.log('Erro na API real, usando mock:', error);
    }
    hideLoader();
    displayMockForecast('Localização Atual');
}

function displayMockForecast(cityName) {
    const mockData = [
        { dt: Date.now() / 1000 + 3600, main: { temp: 28.1 }, weather: [{ description: 'nublado', icon: '03d' }], wind: { speed: 5 } },
        { dt: Date.now() / 1000 + 7200, main: { temp: 22.8 }, weather: [{ description: 'nublado', icon: '03n' }], wind: { speed: 4 } },
        { dt: Date.now() / 1000 + 10800, main: { temp: 17.1 }, weather: [{ description: 'nublado', icon: '03n' }], wind: { speed: 3 } },
        { dt: Date.now() / 1000 + 14400, main: { temp: 16.8 }, weather: [{ description: 'chuva leve', icon: '10n' }], wind: { speed: 6 } },
        { dt: Date.now() / 1000 + 18000, main: { temp: 18.5 }, weather: [{ description: 'chuva leve', icon: '10d' }], wind: { speed: 7 } },
        { dt: Date.now() / 1000 + 21600, main: { temp: 21.1 }, weather: [{ description: 'chuva leve', icon: '10d' }], wind: { speed: 8 } },
        { dt: Date.now() / 1000 + 25200, main: { temp: 24.5 }, weather: [{ description: 'chuva leve', icon: '10d' }], wind: { speed: 9 } },
        { dt: Date.now() / 1000 + 28800, main: { temp: 20.7 }, weather: [{ description: 'chuva leve', icon: '10d' }], wind: { speed: 6 } }
    ];

    displayForecast({ city: { name: cityName }, list: mockData });
}

function displayForecast(data) {
    const cityName = data.city.name;
    const forecasts = data.list.slice(0, 8); 

    let html = `<h2>Previsão para ${cityName}</h2><div class="forecast-grid">`;
    forecasts.forEach((item, index) => {
        const time = new Date(item.dt * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const temp = item.main.temp;
        const description = item.weather[0].description;
        const icon = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;
        const humidity = item.main.humidity || 'N/A';
        const wind = item.wind ? item.wind.speed : 'N/A';
        const conditionClass = description.includes('nublado') ? 'nublado' : 'chuva-leve';

        html += `
            <div class="forecast-item ${conditionClass}" style="animation-delay: ${index * 0.1}s;">
                <div class="tooltip">
                    <p class="time">${time}</p>
                    <img src="${iconUrl}" alt="${description}">
                    <p class="temp">${temp}°C</p>
                    <p>${description}</p>
                    <span class="tooltiptext">Umidade: ${humidity}%<br>Vento: ${wind} m/s</span>
                </div>
            </div>
        `;
    });
    html += '</div>';
    document.getElementById('weather').innerHTML = html;
    document.getElementById('toggleView').classList.remove('hidden');
}

function toggleView() {
    const weather = document.getElementById('weather');
    isCompact = !isCompact;
    weather.classList.toggle('compact');
    document.getElementById('toggleView').textContent = isCompact ? 'Vista Expandida' : 'Vista Compacta';
}

function toggleTheme() {
    isNight = !isNight;
    document.body.classList.toggle('night');
    document.querySelector('.theme-btn').textContent = isNight ? 'Tema Diurno' : 'Tema Noturno';
}

function showLoader() {
    document.getElementById('loader').classList.remove('hidden');
}

function hideLoader() {
    document.getElementById('loader').classList.add('hidden');
}