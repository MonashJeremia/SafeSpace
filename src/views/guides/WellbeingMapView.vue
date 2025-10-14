<template>
  <div class="guide-container">
    <MainHeader />
    
    <main class="content">
      <div class="map-header">
        <div class="header-icon">🗺️</div>
        <h1 class="page-title">Wellbeing Map</h1>
        <p class="page-subtitle">Find nearby mental health resources and plan your route</p>
      </div>

      <div class="map-wrapper">
        <div class="map-container">
          <div id="map" ref="mapContainer"></div>
          
          <!-- Search Bar on Map -->
          <div class="map-search-overlay">
            <div class="search-box">
              <input
                type="text"
                v-model="searchQuery"
                @keyup.enter="searchPlaces"
                placeholder="Search for places (parks, hospitals, counseling centers...)"
                class="search-input"
              />
              <button @click="searchPlaces" class="search-btn">Search</button>
            </div>
          </div>

          <!-- Route Planning Panel -->
          <div v-if="showRoutePanel" class="route-panel">
            <div class="route-header">
              <h3>Plan Your Route</h3>
              <button @click="closeRoutePanel" class="close-btn">✕</button>
            </div>
            
            <div class="route-inputs">
              <div class="route-input-group">
                <div class="route-label">
                  <span class="route-marker start-marker">A</span>
                  <span>Starting point</span>
                </div>
                <input 
                  type="text" 
                  v-model="startLocationName"
                  @focus="selectingStart = true"
                  placeholder="Choose a starting place"
                  class="route-input"
                  readonly
                />
              </div>

              <div class="route-input-group">
                <div class="route-label">
                  <span class="route-marker end-marker">B</span>
                  <span>Destination</span>
                </div>
                <input 
                  type="text" 
                  v-model="endLocationName"
                  @focus="selectingEnd = true"
                  placeholder="Choose destination"
                  class="route-input"
                  readonly
                />
              </div>
            </div>

            <div class="route-options">
              <button 
                :class="['route-option', { active: routeMode === 'driving' }]"
                @click="routeMode = 'driving'; updateRoute()"
              >
                🚗 Driving
              </button>
              <button 
                :class="['route-option', { active: routeMode === 'walking' }]"
                @click="routeMode = 'walking'; updateRoute()"
              >
                🚶 Walking
              </button>
              <button 
                :class="['route-option', { active: routeMode === 'cycling' }]"
                @click="routeMode = 'cycling'; updateRoute()"
              >
                🚴 Cycling
              </button>
            </div>

            <div v-if="routeInfo" class="route-info">
              <div class="route-stat">
                <strong>Distance:</strong> {{ routeInfo.distance }}
              </div>
              <div class="route-stat">
                <strong>Duration:</strong> {{ routeInfo.duration }}
              </div>
            </div>

            <button @click="clearRoute" class="clear-route-btn">Clear Route</button>
          </div>

          <!-- Search Results Panel -->
          <div v-if="searchResults.length > 0" class="results-panel">
            <div class="results-header">
              <h3>Search Results</h3>
              <button @click="searchResults = []" class="close-btn">✕</button>
            </div>
            <div 
              v-for="(result, index) in searchResults" 
              :key="index"
              class="result-item"
            >
              <div class="result-name">{{ result.name }}</div>
              <div class="result-address">{{ result.address }}</div>
              <div class="result-actions">
                <button @click="selectLocation(result, 'start')" class="action-btn">Set Start</button>
                <button @click="selectLocation(result, 'end')" class="action-btn">Set End</button>
                <button @click="viewOnMap(result)" class="action-btn">View</button>
              </div>
            </div>
          </div>

          <!-- Route Button -->
          <button @click="showRoutePanel = true" class="route-toggle-btn" v-if="!showRoutePanel">
            📍 Plan Route
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import MainHeader from '../../components/MainHeader.vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

export default {
  name: 'WellbeingMapView',
  components: {
    MainHeader
  },
  setup() {
    const mapContainer = ref(null)
    const searchQuery = ref('')
    const searchResults = ref([])
    const startLocation = ref(null)
    const endLocation = ref(null)
    const startLocationName = ref('')
    const endLocationName = ref('')
    const showRoutePanel = ref(false)
    const selectingStart = ref(false)
    const selectingEnd = ref(false)
    const routeMode = ref('driving')
    const routeInfo = ref(null)
    let map = null
    let markers = []
    let routeLayer = null
    let startMarker = null
    let endMarker = null

    // Initialize Mapbox
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY

    onMounted(() => {
      // Create map centered on a default location (you can change this)
      map = new mapboxgl.Map({
        container: mapContainer.value,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [37.8124, 144.9623], // Melbourne coordinates
        zoom: 12
      })

      // Add navigation controls
      map.addControl(new mapboxgl.NavigationControl(), 'top-right')

      // Add geolocate control to find user's location
      const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      })
      map.addControl(geolocate, 'top-right')
      map.on('load', () => geolocate.trigger())
    })

    onBeforeUnmount(() => map?.remove())

    const searchPlaces = async () => {
      if (!searchQuery.value.trim()) return

      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery.value)}.json?access_token=${mapboxgl.accessToken}&limit=10`
      const data = await fetch(url).then(r => r.json())

      searchResults.value = data.features.map(f => ({
        name: f.text,
        address: f.place_name,
        coordinates: f.center
      }))

      markers.forEach(m => m.remove())
      markers = []

      searchResults.value.forEach(result => {
        const marker = new mapboxgl.Marker({ color: '#0066cc' })
          .setLngLat(result.coordinates)
          .setPopup(new mapboxgl.Popup().setHTML(`<strong>${result.name}</strong><br>${result.address}`))
          .addTo(map)
        markers.push(marker)
      })

      if (searchResults.value.length) {
        const bounds = new mapboxgl.LngLatBounds()
        searchResults.value.forEach(r => bounds.extend(r.coordinates))
        map.fitBounds(bounds, { padding: 50 })
      }
    }

    const selectLocation = (location, type) => {
      const isStart = type === 'start'
      const marker = isStart ? startMarker : endMarker
      const color = isStart ? '#22c55e' : '#ef4444'
      const label = isStart ? 'Start' : 'End'

      if (marker) marker.remove()

      if (isStart) {
        startLocation.value = location
        startLocationName.value = location.name
        startMarker = new mapboxgl.Marker({ color })
          .setLngLat(location.coordinates)
          .setPopup(new mapboxgl.Popup().setHTML(`<strong>${label}:</strong> ${location.name}`))
          .addTo(map)
      } else {
        endLocation.value = location
        endLocationName.value = location.name
        endMarker = new mapboxgl.Marker({ color })
          .setLngLat(location.coordinates)
          .setPopup(new mapboxgl.Popup().setHTML(`<strong>${label}:</strong> ${location.name}`))
          .addTo(map)
      }

      showRoutePanel.value = true
      searchResults.value = []

      if (startLocation.value && endLocation.value) getRoute()
    }

    const viewOnMap = (location) => {
      map.flyTo({ center: location.coordinates, zoom: 15, duration: 1500 })
    }

    const getRoute = async () => {
      if (!startLocation.value || !endLocation.value) return

      const [start, end] = [startLocation.value.coordinates, endLocation.value.coordinates]
      const profile = { driving: 'driving', walking: 'walking', cycling: 'cycling' }[routeMode.value]
      const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&steps=true&access_token=${mapboxgl.accessToken}`
      
      const route = await fetch(url).then(r => r.json()).then(d => d.routes[0])

      routeInfo.value = {
        distance: `${(route.distance / 1000).toFixed(2)} km`,
        duration: `${Math.round(route.duration / 60)} min`
      }

      if (map.getLayer('route')) {
        map.removeLayer('route')
        map.removeSource('route')
      }

      map.addSource('route', {
        type: 'geojson',
        data: { type: 'Feature', properties: {}, geometry: route.geometry }
      })

      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#3b9ddd', 'line-width': 6, 'line-opacity': 0.8 }
      })

      const bounds = new mapboxgl.LngLatBounds()
      route.geometry.coordinates.forEach(c => bounds.extend(c))
      map.fitBounds(bounds, { padding: 100 })
    }

    const updateRoute = () => {
      if (startLocation.value && endLocation.value) getRoute()
    }

    const clearRoute = () => {
      startLocation.value = endLocation.value = null
      startLocationName.value = endLocationName.value = ''
      routeInfo.value = null
      showRoutePanel.value = false
      
      if (map.getLayer('route')) {
        map.removeLayer('route')
        map.removeSource('route')
      }

      if (startMarker) startMarker.remove(), startMarker = null
      if (endMarker) endMarker.remove(), endMarker = null
    }

    const closeRoutePanel = () => showRoutePanel.value = false

    return {
      mapContainer,
      searchQuery,
      searchResults,
      startLocation,
      endLocation,
      startLocationName,
      endLocationName,
      showRoutePanel,
      selectingStart,
      selectingEnd,
      routeMode,
      routeInfo,
      searchPlaces,
      selectLocation,
      viewOnMap,
      clearRoute,
      closeRoutePanel,
      updateRoute
    }
  }
}
</script>

<style scoped>
.guide-container {
  font-family: Arial, sans-serif;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.content {
  padding: 0;
}

.map-header {
  background: white;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #212529;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1rem;
  color: #6c757d;
  margin: 0;
}

.map-wrapper {
  padding: 2rem 3rem 3rem 3rem;
  background: #f8f9fa;
}

.map-container {
  position: relative;
  height: 600px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  background: white;
}

#map {
  width: 100%;
  height: 100%;
  border-radius: 12px;
}

/* Search Bar on Map */
.map-search-overlay {
  position: absolute;
  top: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: 90%;
  max-width: 600px;
}

.search-box {
  display: flex;
  gap: 0.75rem;
  background: white;
  padding: 0.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  background: #f8f9fa;
}

.search-input:focus {
  outline: none;
  background: #fff;
  box-shadow: 0 0 0 2px #0066cc;
}

.search-btn {
  padding: 0.75rem 1.5rem;
  background: #0066cc;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  cursor: pointer;
  font-weight: 500;
}

.search-btn:hover {
  background: #0052a3;
}

/* Route Toggle Button */
.route-toggle-btn {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  padding: 0.75rem 2rem;
  background: #22c55e;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.route-toggle-btn:hover {
  background: #16a34a;
}

/* Route Planning Panel */
.route-panel {
  position: absolute;
  top: 6rem;
  left: 1.5rem;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  width: 320px;
  z-index: 10;
}

.route-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.route-header h3 {
  font-size: 1.1rem;
  margin: 0;
  color: #212529;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6c757d;
  cursor: pointer;
  padding: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.close-btn:hover {
  background: #f3f4f6;
}

.route-inputs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.route-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.route-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #374151;
  font-weight: 500;
}

.route-marker {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
}

.start-marker {
  background: #22c55e;
}

.end-marker {
  background: #ef4444;
}

.route-input {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  background: #f8f9fa;
  color: #6c757d;
}

.route-input:focus {
  outline: none;
  border-color: #0066cc;
}

.route-options {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.route-option {
  flex: 1;
  padding: 0.6rem 0.5rem;
  background: #f3f4f6;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  color: #374151;
}

.route-option:hover {
  background: #e5e7eb;
}

.route-option.active {
  background: #dbeafe;
  border-color: #0066cc;
  color: #0066cc;
  font-weight: 600;
}

.route-info {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.route-stat {
  font-size: 0.9rem;
  color: #374151;
  margin-bottom: 0.5rem;
}

.route-stat:last-child {
  margin-bottom: 0;
}

.clear-route-btn {
  width: 100%;
  padding: 0.75rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
}

.clear-route-btn:hover {
  background: #dc2626;
}

/* Search Results Panel */
.results-panel {
  position: absolute;
  top: 6rem;
  right: 1.5rem;
  background: white;
  padding: 1.25rem;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  max-width: 340px;
  max-height: 450px;
  overflow-y: auto;
  z-index: 10;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.results-header h3 {
  font-size: 1.1rem;
  margin: 0;
  color: #212529;
  font-weight: 600;
}

.result-item {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
}

.result-item:last-child {
  border-bottom: none;
}

.result-item:hover {
  background: #f8f9fa;
}

.result-name {
  font-weight: 600;
  color: #212529;
  margin-bottom: 0.3rem;
  font-size: 0.95rem;
}

.result-address {
  font-size: 0.8rem;
  color: #6c757d;
  margin-bottom: 0.75rem;
}

.result-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.4rem 0.75rem;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 5px;
  font-size: 0.8rem;
  cursor: pointer;
  color: #374151;
  font-weight: 500;
}

.action-btn:hover {
  background: #0066cc;
  color: white;
  border-color: #0066cc;
}
</style>
