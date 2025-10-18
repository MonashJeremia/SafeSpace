<template>
  <div class="calendar-container">
    <MainHeader />
    
    <main id="main-content" class="content" role="main">
      <div class="calendar-header">
        <h1>My Wellness Calendar</h1>
        <p class="subtitle">Track your wellness journey and schedule activities</p>
      </div>

      <div class="calendar-content">
        <div class="calendar-actions">
          <button class="btn primary-btn" @click="openEventModal">
            <span class="icon">+</span> Add Event
          </button>
        </div>

        <!-- Calendar Component -->
        <div class="calendar-wrapper">
          <FullCalendar 
            ref="fullCalendar"
            :options="calendarOptions"
          />
        </div>

        <!-- Event Modal -->
        <div v-if="showEventModal" class="modal-overlay" @click="closeEventModal">
          <div class="modal-content" @click.stop>
            <h2>{{ isEditing ? 'Edit Event' : 'Add New Event' }}</h2>
            <form @submit.prevent="saveEvent" class="event-form">
              <div class="form-group">
                <label for="eventTitle">Event Title</label>
                <input 
                  type="text" 
                  id="eventTitle" 
                  v-model="eventForm.title"
                  required
                  class="form-control"
                  placeholder="Enter event title"
                />
              </div>

              <div class="form-group">
                <label for="eventDate">Date</label>
                <input 
                  type="date" 
                  id="eventDate" 
                  v-model="eventForm.date"
                  required
                  class="form-control"
                />
              </div>

              <div class="form-group">
                <label for="eventType">Event Type</label>
                <select 
                  id="eventType" 
                  v-model="eventForm.type"
                  required
                  class="form-control"
                >
                  <option value="wellness">Wellness Activity</option>
                  <option value="therapy">Therapy Session</option>
                  <option value="exercise">Exercise</option>
                  <option value="meditation">Meditation</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div class="form-group">
                <label for="eventNotes">Notes (Optional)</label>
                <textarea 
                  id="eventNotes" 
                  v-model="eventForm.notes"
                  class="form-control"
                  rows="3"
                  placeholder="Add any notes or details"
                ></textarea>
              </div>

              <div class="modal-actions">
                <button type="button" class="btn secondary-btn" @click="closeEventModal">
                  Cancel
                </button>
                <button type="submit" class="btn primary-btn">
                  {{ isEditing ? 'Update Event' : 'Save Event' }}
                </button>
                <button 
                  v-if="isEditing" 
                  type="button" 
                  class="btn danger-btn" 
                  @click="deleteEvent"
                >
                  Delete Event
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import MainHeader from '../components/MainHeader.vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

export default {
  name: 'CalendarView',
  components: {
    MainHeader,
    FullCalendar
  },
  setup() {
    const events = ref([])
    const showEventModal = ref(false)
    const isEditing = ref(false)
    const currentEventId = ref(null)

    const eventForm = ref({
      title: '',
      date: '',
      type: 'wellness',
      notes: ''
    })

    // Define event colors based on type
    const eventColors = {
      wellness: '#4CAF50',
      therapy: '#2196F3',
      exercise: '#FF9800',
      meditation: '#9C27B0',
      other: '#607D8B'
    }

    // Calendar configuration
const calendarOptions = computed(() => ({
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek'
      },
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      events: events.value,
      eventClick: handleEventClick,
      dateClick: handleDateClick,
      eventDrop: handleEventDrop,
      eventContent: renderEventContent
    }))

    // Load events from localStorage on mount
    onMounted(() => {
      const savedEvents = localStorage.getItem('calendar_events')
      if (savedEvents) {
        const parsedEvents = JSON.parse(savedEvents)
        events.value = parsedEvents
      }
    })

    // Save events to localStorage
    const saveEvents = () => {
      localStorage.setItem('calendar_events', JSON.stringify(events.value))
    }

    const openEventModal = () => {
      showEventModal.value = true
      isEditing.value = false
      eventForm.value = {
        title: '',
        date: new Date().toISOString().split('T')[0],
        type: 'wellness',
        notes: ''
      }
    }

    const closeEventModal = () => {
      showEventModal.value = false
      currentEventId.value = null
      eventForm.value = {
        title: '',
        date: '',
        type: 'wellness',
        notes: ''
      }
    }

    const handleDateClick = (info) => {
      eventForm.value.date = info.dateStr
      openEventModal()
    }

    const handleEventClick = (info) => {
      const event = events.value.find(e => e.id === info.event.id)
      if (event) {
        currentEventId.value = event.id
        eventForm.value = {
          title: event.title,
          date: event.date,
          type: event.type || 'wellness',
          notes: event.notes || ''
        }
        isEditing.value = true
        showEventModal.value = true
      }
    }

    const handleEventDrop = (info) => {
      const eventId = info.event.id
      const newDate = info.event.startStr
      
      const eventIndex = events.value.findIndex(e => e.id === eventId)
      if (eventIndex !== -1) {
        events.value[eventIndex] = {
          ...events.value[eventIndex],
          date: newDate
        }
        saveEvents()
      }
    }

    const renderEventContent = (eventInfo) => {
      return {
        html: `
          <div class="fc-event-main-content">
            <div class="fc-event-title" style="color: ${eventColors[eventInfo.event.extendedProps.type] || eventColors.other}">
              ${eventInfo.event.title}
            </div>
          </div>
        `
      }
    }

    const saveEvent = () => {
      const newEvent = {
        id: isEditing.value ? currentEventId.value : Date.now().toString(),
        title: eventForm.value.title,
        date: eventForm.value.date,
        type: eventForm.value.type,
        notes: eventForm.value.notes,
        backgroundColor: eventColors[eventForm.value.type],
        borderColor: eventColors[eventForm.value.type]
      }

      if (isEditing.value) {
        const index = events.value.findIndex(e => e.id === currentEventId.value)
        if (index !== -1) {
          events.value[index] = newEvent
        }
      } else {
        events.value.push(newEvent)
      }

      saveEvents()
      closeEventModal()
    }

    const deleteEvent = () => {
      if (confirm('Are you sure you want to delete this event?')) {
        events.value = events.value.filter(e => e.id !== currentEventId.value)
        saveEvents()
        closeEventModal()
      }
    }

    return {
      calendarOptions,
      showEventModal,
      eventForm,
      isEditing,
      openEventModal,
      closeEventModal,
      saveEvent,
      deleteEvent
    }
  }
}
</script>

<style scoped>
.calendar-container {
  min-height: 100vh;
  background: #f8f9fa;
}

.calendar-header {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  padding: 2.5rem 2rem;
  text-align: center;
}

.calendar-header h1 {
  font-size: 2.5rem;
  margin: 0 0 0.5rem 0;
}

.subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

.calendar-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.calendar-actions {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: flex-end;
}

.calendar-wrapper {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h2 {
  margin: 0 0 1.5rem 0;
  color: #212529;
}

/* Form Styles */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #495057;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
}

/* Button Styles */
.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.primary-btn {
  background: #007bff;
  color: white;
}

.primary-btn:hover {
  background: #0056b3;
}

.secondary-btn {
  background: #6c757d;
  color: white;
}

.secondary-btn:hover {
  background: #5a6268;
}

.danger-btn {
  background: #dc3545;
  color: white;
}

.danger-btn:hover {
  background: #c82333;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

/* Calendar Customization */
:deep(.fc) {
  font-family: inherit;
}

:deep(.fc-button) {
  background: #007bff;
  border: none;
  font-weight: 600;
  text-transform: capitalize;
  padding: 0.5rem 1rem;
}

:deep(.fc-button:hover) {
  background: #0056b3;
}

:deep(.fc-button-active) {
  background: #0056b3 !important;
}

:deep(.fc-toolbar-title) {
  font-size: 1.5rem;
  font-weight: 600;
}

:deep(.fc-event) {
  border: none;
  padding: 2px 4px;
  font-size: 0.9rem;
}

:deep(.fc-day-today) {
  background: #f8f9fa !important;
}

@media (max-width: 768px) {
  .calendar-header {
    padding: 2rem 1rem;
  }

  .calendar-header h1 {
    font-size: 2rem;
  }

  .calendar-content {
    padding: 1rem;
  }

  .modal-content {
    padding: 1.5rem;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-actions button {
    width: 100%;
  }
}
</style>
]]>