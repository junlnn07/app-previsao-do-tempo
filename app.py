from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import requests
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Use Open-Meteo API (free, no API key required)
WEATHER_API = "https://api.open-meteo.com/v1/forecast"
GEOCODING_API = "https://geocoding-api.open-meteo.com/v1/search"

def get_coordinates(city_name):
    """Get latitude and longitude from city name"""
    try:
        params = {
            'name': city_name,
            'count': 1,
            'language': 'pt',
            'format': 'json'
        }
        response = requests.get(GEOCODING_API, params=params, timeout=5)
        response.raise_for_status()
        data = response.json()
        
        if data['results']:
            result = data['results'][0]
            return {
                'latitude': result['latitude'],
                'longitude': result['longitude'],
                'name': result['name'],
                'country': result.get('country', ''),
                'admin1': result.get('admin1', '')
            }
        return None
    except Exception as e:
        print(f"Erro ao buscar coordenadas: {e}")
        return None

def get_weather(latitude, longitude, timezone="auto"):
    """Get weather data from Open-Meteo API"""
    try:
        params = {
            'latitude': latitude,
            'longitude': longitude,
            'current': 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m',
            'hourly': 'temperature_2m,weather_code,precipitation_probability',
            'daily': 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max',
            'timezone': timezone,
            'language': 'pt'
        }
        response = requests.get(WEATHER_API, params=params, timeout=5)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Erro ao buscar previsão: {e}")
        return None

def interpret_weather_code(code):
    """Convert WMO weather code to readable description and emoji"""
    weather_codes = {
        0: {'description': 'Céu limpo', 'emoji': '☀️'},
        1: {'description': 'Principalmente nublado', 'emoji': '🌤️'},
        2: {'description': 'Parcialmente nublado', 'emoji': '⛅'},
        3: {'description': 'Nublado', 'emoji': '☁️'},
        45: {'description': 'Nevoeiro', 'emoji': '🌫️'},
        48: {'description': 'Nevoeiro com geada', 'emoji': '🌫️'},
        51: {'description': 'Chuva leve', 'emoji': '🌧️'},
        53: {'description': 'Chuva moderada', 'emoji': '🌧️'},
        55: {'description': 'Chuva pesada', 'emoji': '⛈️'},
        61: {'description': 'Chuva', 'emoji': '🌧️'},
        63: {'description': 'Chuva moderada', 'emoji': '🌧️'},
        65: {'description': 'Chuva pesada', 'emoji': '⛈️'},
        71: {'description': 'Neve leve', 'emoji': '❄️'},
        73: {'description': 'Neve moderada', 'emoji': '❄️'},
        75: {'description': 'Neve pesada', 'emoji': '❄️'},
        80: {'description': 'Chuva leve e isolada', 'emoji': '🌧️'},
        81: {'description': 'Chuva moderada e isolada', 'emoji': '🌧️'},
        82: {'description': 'Chuva pesada e isolada', 'emoji': '⛈️'},
        85: {'description': 'Neve leve', 'emoji': '❄️'},
        86: {'description': 'Neve pesada', 'emoji': '❄️'},
        95: {'description': 'Tempestade', 'emoji': '⛈️'},
        96: {'description': 'Tempestade com granizo', 'emoji': '⛈️'},
        99: {'description': 'Tempestade com granizo', 'emoji': '⛈️'},
    }
    return weather_codes.get(code, {'description': 'Desconhecido', 'emoji': '❓'})

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/weather', methods=['POST'])
def get_weather_api():
    try:
        data = request.json
        city = data.get('city', '').strip()
        
        if not city:
            return jsonify({'error': 'Cidade não fornecida'}), 400
        
        # Get coordinates
        coords = get_coordinates(city)
        if not coords:
            return jsonify({'error': 'Cidade não encontrada'}), 404
        
        # Get weather
        weather_data = get_weather(coords['latitude'], coords['longitude'], coords.get('timezone', 'auto'))
        if not weather_data:
            return jsonify({'error': 'Erro ao buscar dados de previsão'}), 500
        
        current = weather_data['current']
        daily = weather_data['daily']
        hourly = weather_data['hourly']
        
        # Process current weather
        weather_info = interpret_weather_code(current['weather_code'])
        current_weather = {
            'city': coords['name'],
            'country': coords['country'],
            'admin1': coords['admin1'],
            'temperature': round(current['temperature_2m']),
            'apparent_temperature': round(current['apparent_temperature']),
            'humidity': current['relative_humidity_2m'],
            'wind_speed': round(current['wind_speed_10m']),
            'wind_direction': current['wind_direction_10m'],
            'description': weather_info['description'],
            'emoji': weather_info['emoji'],
            'timestamp': current['time']
        }
        
        # Process daily forecast (next 7 days)
        forecast = []
        for i in range(min(7, len(daily['time']))):
            day_code = daily['weather_code'][i]
            day_info = interpret_weather_code(day_code)
            forecast.append({
                'date': daily['time'][i],
                'max_temp': round(daily['temperature_2m_max'][i]),
                'min_temp': round(daily['temperature_2m_min'][i]),
                'precipitation': round(daily['precipitation_sum'][i], 1),
                'precipitation_probability': daily['precipitation_probability_max'][i],
                'description': day_info['description'],
                'emoji': day_info['emoji']
            })
        
        # Process hourly forecast (next 24 hours)
        hourly_forecast = []
        for i in range(min(24, len(hourly['time']))):
            hour_code = hourly['weather_code'][i]
            hour_info = interpret_weather_code(hour_code)
            hourly_forecast.append({
                'time': hourly['time'][i],
                'temperature': round(hourly['temperature_2m'][i]),
                'precipitation_probability': hourly['precipitation_probability'][i],
                'description': hour_info['description'],
                'emoji': hour_info['emoji']
            })
        
        return jsonify({
            'current': current_weather,
            'daily_forecast': forecast,
            'hourly_forecast': hourly_forecast
        })
    
    except Exception as e:
        print(f"Erro: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
