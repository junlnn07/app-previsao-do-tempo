const apiKey = '5be142b2adf71122421c1e95284be4ac'; // Substitua por uma nova chave se necessário

let isCompact = false;
let isNight = false;

async function getWeather() {
    const city = document.getElementById('city').value;
    if (!city) {
        alert('Por favor, digite o nome de uma cidade.');
        return;
    }

    showLoader();
    console.log(`Buscando dados para: ${city}`); // Log para debug

    if (city.toLowerCase() === 'curitiba') {
        setTimeout(() => {
            hideLoader();
            displayMockForecast();
        }, 1000);
    } else {
        try {
            // Geocoding para obter lat/lon
            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
            console.log('Fazendo geocoding:', geoUrl); // Log
            const geoResponse = await fetch(geoUrl);
            console.log('Resposta geocoding:', geoResponse.status); // Log status

            if (!geoResponse.ok) {
                throw new Error(`Erro na geocoding: ${geoResponse.status} - ${geoResponse.statusText}`);
            }

            const geoData = await geoResponse.json();
            console.log('Dados geocoding:', geoData); // Log dados

            if (geoData.length === 0) {
                hideLoader();
                document.getElementById('weather').innerHTML = '<p>Cidade não encontrada.</p>';
                return;
            }

            const { lat, lon } = geoData[0];
            fetchHourlyForecast(lat, lon);
        } catch (error) {
            console.error('Erro em getWeather:', error); // Log erro
            hideLoader();
            document.getElementById('weather').innerHTML = '<p>Erro de conexão na geocoding. Tente novamente ou use Curitiba para teste.</p>';
        }
    }
}

function getWeatherByLocation() {
    if (navigator.geolocation) {
        showLoader();
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchHourlyForecast(lat, lon);
        }, () => {
            hideLoader();
            alert('Não foi possível obter sua localização.');
        });
    } else {
        alert('Geolocalização não suportada pelo navegador.');
    }
}

async function fetchHourlyForecast(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`;
    console.log('Fazendo forecast:', url); // Log

    try {
        const response = await fetch(url);
        console.log('Resposta forecast:', response.status); // Log status

        if (!response.ok) {
            throw new Error(`Erro na forecast: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Dados forecast:', data); // Log dados
        hideLoader();

        if (data.cod === '200') {
            displayForecast(data);
        } else {
            document.getElementById('weather').innerHTML = '<p>Erro ao buscar previsão (código: ' + data.cod + ').</p>';
        }
    } catch (error) {
        console.error('Erro em fetchHourlyForecast:', error); // Log erro
        hideLoader();
        document.getElementById('weather').innerHTML = '<p>Erro de conexão na previsão. Tente Curitiba ou verifique a chave da API.</p>';
    }
}

function displayMockForecast() {
    const mockData = [
        { time: '16:27', condition: 'nublado', temp: 28.07, icon: '03d', humidity: 65, wind: 5 },
        { time: '15:50', condition: 'nublado', temp: 22.82, icon: '03d', humidity: 70, wind: 4 },
        { time: '16:18', condition: 'nublado', temp: 17.1, icon: '03n', humidity: 75, wind: 3 },
        { time: '16:07', condition: 'chuva leve', temp: 16.78, icon: '10n', humidity: 80, wind: 6 },
        { time: '16:12', condition: 'chuva leve', temp: 18.49, icon: '10d', humidity: 78, wind: 7 },
        { time: '15:55', condition: 'chuva leve', temp: 21.08, icon: '10d', humidity: 72, wind: 8 },
        { time: '16:28', condition: 'chuva leve', temp: 24.46, icon: '10d', humidity: 68, wind: 9 },
        { time: '16:23', condition: 'chuva leve', temp: 20.74, icon: '10d', humidity: 70, wind: 6 }
    ];

    displayForecast({ city: { name: 'Curitiba' }, list: mockData.map(item => ({
        dt: Date.now() / 1000 + Math.random() * 3600,
        main: { temp: item.temp, humidity: item.humidity },
        weather: [{ description: item.condition, icon: item.icon }],
        wind: { speed: item.wind }
    })) });
}

function displayForecast(data) {
    const cityName = data.city.name;
    const forecasts = data.list.slice(0, 8);

    let html = `<h2>Previsão para ${cityName}</h2><div class="forecast-grid">`;
    forecasts.forEach((item, index) => {
        const time = item.dt ? new Date(item.dt * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : item.time;
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