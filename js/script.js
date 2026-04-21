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
function toggleLoading(loadingElement, show) {
  loadingElement.classList.toggle("hidden", !show)
}

// Mostrar error

function mostrarError(errorElement, mensaje) {
  errorElement.textContent = `${mensaje}`
  errorElement.classList.remove("hidden")

  setTimeout(() => {
    errorElement.classList.add("hidden")
  }, 5000)
}

// Obtener el icono según el código meteorológico (WMO Weather interpretation codes)
function obtenerIconoTiempo(weatherCode) {
  const weatherIcons = {
    0: "☀️", // Clear sky
    1: "🌤️", // Mainly clear
    2: "⛅", // Partly cloudy
    3: "☁️", // Overcast
    45: "🌫️", // Fog
    48: "🌫️", // Depositing rime fog
    51: "🌦️", // Drizzle: Light
    53: "🌦️", // Drizzle: Moderate
    55: "🌦️", // Drizzle: Dense
    61: "🌧️", // Rain: Slight
    63: "🌧️", // Rain: Moderate
    65: "🌧️", // Rain: Heavy
    71: "🌨️", // Snow fall: Slight
    73: "🌨️", // Snow fall: Moderate
    75: "🌨️", // Snow fall: Heavy
    77: "❄️", // Snow grains
    80: "🌦️", // Rain showers: Slight
    81: "🌧️", // Rain showers: Moderate
    82: "⛈️", // Rain showers: Violent
    85: "🌨️", // Snow showers: Slight
    86: "🌨️", // Snow showers: Heavy
    95: "⛈️", // Thunderstorm
    96: "⛈️", // Thunderstorm with hail
    99: "⛈️", // Thunderstorm with heavy hail
  }

  return weatherIcons[weatherCode] || "🌡️"
}

// Obtener descripción según código meteorológico

function obtenerDescripcionTiempo(weatherCode) {
  const descriptions = {
    0: "Cielo despejado",
    1: "Principalmente despejado",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Niebla",
    48: "Niebla con escarcha",
    51: "Llovizna ligera",
    53: "Llovizna moderada",
    55: "Llovizna densa",
    61: "Lluvia ligera",
    63: "Lluvia moderada",
    65: "Lluvia intensa",
    71: "Nevada ligera",
    73: "Nevada moderada",
    75: "Nevada intensa",
    77: "Granizo",
    80: "Chubascos ligeros",
    81: "Chubascos moderados",
    82: "Chubascos violentos",
    85: "Nevadas ligeras",
    86: "Nevadas intensas",
    95: "Tormenta",
    96: "Tormenta con granizo",
    99: "Tormenta fuerte con granizo",
  }

  return descriptions[weatherCode] || "Desconocido"
}

// Formatear fecha a día de la semana

function formatearFecha(fecha) {
  const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
  const date = new Date(fecha)

  return dias[date.getDay()]
}

// ---------- GEOLOCALIZACIÓN ----------

/**
 * PASO 1: Obtener ubicación del usuario con navigator.geolocation
 */

function obtenerUbicacionGPS() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Tu navegador no soporta la geolocalización"))
      return
    }

    const options = {
      enableHighAccuracy: true, // Mayor precisión a la hora de recibir datos
      timeout: 10000, // 10 segundos de timeout (espera máxima para devolver los datos)
      maximumAge: 0,
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve(position)
      },
      (error) => {
        let mensaje = "Error al obtener ubicación"

        switch (error.code) {
          case error.PERMISSION_DENIED:
            mensaje = "Permiso de ubicación denegado"
            break
          case error.POSITION_UNAVAILABLE:
            mensaje = "Información de ubicación no disponible"
            break
          case error.TIMEOUT:
            mensaje = "Tiempo de espera agotado"
            break
        }

        reject(new Error(mensaje))
      },
      options,
    )
  })
}

/**
 * PASO 2: Obtener nombre de la ubicación (ciudad, barrio) usando coordenadas
 * API: Nominatim (OpenStreetMap) - Reverse Geocoding
 */

async function obtenerNombreUbicacion(latitud, longitud) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitud}&lon=${longitud}&format=json&addressdetails=1`

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Weather-App-Exercise",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`)
    }

    const data = await response.json()
    console.log("Datos nominatim:", data)

    const { address, display_name } = data

    return {
      ciudad:
        address.city ||
        address.town ||
        address.village ||
        address.municipality ||
        "Ubicación desconocida",
      barrio: address.suburb || address.neighbourhood || address.quarter || "",
      pais: address.country || "",
      nombreCompleto: display_name,
    }
  } catch (error) {
    console.warn("No se pudo obtener el nombre de la ubicación:", error)
    return {
      ciudad: "Ubicación no disponible",
      barrio: "",
      pais: "",
    }
  }
}

/**
 * PASO 3: Obtener datos del tiempo usando las coordenadas
 */

async function obtenerTiempo(latitud, longitud) {
  const params = new URLSearchParams({
    latitude: latitud,
    longitude: longitud,
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,cloud_cover",
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    timezone: "auto",
    forecast_days: 5,
  })

  const url = `${OPEN_METEO_API}?${params}`

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTPPS Error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    throw new Error(`Error al obtener el tiempo: ${error.message}`)
  }
}

/**
 * FUNCIÓN PRINCIPAL: Coordina geolocalización + nombre ubicación + API del tiempo
 */

async function obtenerUbicacionYTiempo() {
  // Limpiar
  errorLocation.classList.add("hidden")
  errorWeather.classList.add("hidden")
  infoUbicacion.classList.add("hidden")
  weatherContainer.classList.add("hidden")

  toggleLoading(loadingLocation, true)

  try {
    // PASO 1: Obtener ubicación
    console.log("Solicitando ubicación...")
    const position = await obtenerUbicacionGPS()

    const { latitude, longitude, accuracy } = position.coords

    latitudElement.textContent = latitude.toFixed(6)
    longitudElement.textContent = longitude.toFixed(6)
    precisionElement.textContent = `${Math.round(accuracy)} metros`

    console.log(`Ubicación obtenida: ${latitude}, ${longitude}`)

    // PASO 2: Obtener nombre de la ubicación
    console.log("Obteniendo nombre de ubicación...")
    const ubicacion = await obtenerNombreUbicacion(latitude, longitude)

    document.getElementById("ciudad").textContent = ubicacion.ciudad
    document.getElementById("pais").textContent = ubicacion.pais
    document.getElementById("barrio").textContent =
      ubicacion.barrio || "Barrio no disponible"

    console.log(`Ubicación: ${ubicacion.ciudad}, ${ubicacion.pais}`)

    infoUbicacion.classList.remove("hidden")
    toggleLoading(loadingLocation, false)

    // PASO 3: Obtener info del tiempo según localización
    toggleLoading(loadingWeather, true)
    console.log("Consultando tiempo...")
    const weatherData = await obtenerTiempo(latitude, longitude)

    console.log("Datos del tiempo obtenidos:", weatherData)

    renderizarTiempo(weatherData)

    toggleLoading(loadingWeather, false)
    weatherContainer.classList.remove("hidden")
  } catch (error) {
    console.log("Error:", error)

    if (infoUbicacion.classList.contains("hidden")) {
      toggleLoading(loadingLocation, false)
      mostrarError(errorLocation, error.message)
    } else {
      toggleLoading(loadingWeather, false)
      mostrarError(errorWeather, error.message)
    }
  }
}

// ---------- RENDERIZADO ----------

/**
 * Renderizar los datos del tiempo en el DOM
 */

function renderizarTiempo(data) {
  const {
    temperature_2m,
    relative_humidity_2m,
    apparent_temperature,
    weather_code,
    wind_speed_10m,
    cloud_cover,
  } = data.current

  weatherIcon.textContent = obtenerIconoTiempo(weather_code)
  temperature.textContent = `${Math.round(temperature_2m)}ºC`
  weatherDescription.textContent = obtenerDescripcionTiempo(weather_code)

  windSpeed.textContent = `${Math.round(wind_speed_10m)} km/h`
  humidity.textContent = `${relative_humidity_2m}%`
  cloudCover.textContent = `${cloud_cover}%`
  apparentTemp.textContent = `${Math.round(apparent_temperature)}ºC`

  renderizarPronostico(data.daily)
}

/**
 * Renderizar el pronóstico de 5 días
 */

function renderizarPronostico(dailyData) {
  const { time, weather_code, temperature_2m_max, temperature_2m_min } =
    dailyData

  const template = time
    .map((fecha, index) => {
      const dia = formatearFecha(fecha)
      const icon = obtenerIconoTiempo(weather_code[index])
      const tempMax = Math.round(temperature_2m_max[index])
      const tempMin = Math.round(temperature_2m_min[index])

      return `
    <div class="forecast-day">
      <div class="forecast-date">${dia}</div>
      <div class="forecast-icon">${icon}</div>
      <div class="forecast-temp">${tempMax}ºC</div>
      <div class="forecast-temp-range">${tempMin}ºC</div>
  </div>
    `
    })
    .join("")

  forecastContainer.innerHTML = template
}

// ---------- Eventos ----------

btnObtenerUbicacion.addEventListener("click", obtenerUbicacionYTiempo)
