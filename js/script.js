// Endpoint open meteo api
const OPEN_METEO_API = "https://api.open-meteo.com/v1/forecast"

// Elementos del DOM
const btnObtenerUbicacion = document.getElementById("btnObtenerUbicacion") // botón para obtener la ubi
const loadingLocation = document.getElementById("loadingLocation") // div donde aparecerá el spinner
const errorLocation = document.getElementById("errorLocation") // div de error si no obtenemos la ubi
const infoUbicacion = document.getElementById("infoUbicacion") // div info de la ubi

const loadingWeather = document.getElementById("loadingWeather") // div donde aparecerá el spinner
const errorWeather = document.getElementById("errorWeather") // div de error del tiempo si no obtenemos la info
const weatherContainer = document.getElementById("weatherContainer") // div info del tiempo

// Coordenadas
const latitudElement = document.getElementById("latitud") // latitud
const longitudElement = document.getElementById("longitud") // longitud
const precisionElement = document.getElementById("precision") // precisión

// Tiempo actual
const weatherIcon = document.getElementById("weatherIcon") // icono del tiempo que hace
const temperature = document.getElementById("temperature") // temperatura
const weatherDescription = document.getElementById("weatherDescription") // descripción del tiempo actual
const windSpeed = document.getElementById("windSpeed") // viento
const humidity = document.getElementById("humidity") // humedad
const cloudCover = document.getElementById("cloudCover") // nubosidad
const apparentTemp = document.getElementById("apparentTemp") // sensación térmica

// Pronóstico
const forecastContainer = document.getElementById("forecastContainer") // div donde mostraremos el pronóstico

// ---------- Funciones Helpers ----------

// Mostrar/ocultar loading

// Mostrar error

// Obtener el icono según el código meteorológico (WMO Weather interpretation codes)

// Obtener descripción según código meteorológico

// Formatear fecha a día de la semana

// ---------- GEOLOCALIZACIÓN ----------

/**
 * PASO 1: Obtener ubicación del usuario con navigator.geolocation
 */

/**
 * PASO 2: Obtener nombre de la ubicación (ciudad, barrio) usando coordenadas
 * API: Nominatim (OpenStreetMap) - Reverse Geocoding
 */

/**
 * PASO 3: Obtener datos del tiempo usando las coordenadas
 */

/**
 * FUNCIÓN PRINCIPAL: Coordina geolocalización + nombre ubicación + API del tiempo
 */

// ---------- RENDERIZADO ----------

/**
 * Renderizar los datos del tiempo en el DOM
 */

/**
 * Renderizar el pronóstico de 5 días
 */

// ---------- Eventos ----------
