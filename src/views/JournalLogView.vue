<template>
  <div class="journal-container">
    <MainHeader />
    
    <main id="main-content" class="content" role="main">
      <div class="journal-header">
        <div class="header-icon" aria-hidden="true">📔</div>
        <h1>Journal Log</h1>
        <p class="header-subtitle">Track your daily wellbeing and thoughts</p>
      </div>

      <div class="journal-content">
        <!-- New Entry Form -->
        <div class="entry-form-container">
          <h2>New Entry</h2>
          <form @submit.prevent="addEntry" aria-label="Create new journal entry">
            <div class="form-group">
              <label for="entry-date">Date <span class="required-indicator" aria-label="required">*</span></label>
              <input 
                type="date" 
                id="entry-date"
                v-model="newEntry.date" 
                required
                aria-required="true"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="mood-rating">Mood Rating (1-10) <span class="required-indicator" aria-label="required">*</span></label>
              <div class="mood-selector">
                <input 
                  type="range" 
                  id="mood-rating"
                  v-model="newEntry.mood" 
                  min="1" 
                  max="10" 
                  required
                  aria-required="true"
                  aria-valuemin="1"
                  aria-valuemax="10"
                  :aria-valuenow="newEntry.mood"
                  class="mood-slider"
                />
                <span class="mood-value" :class="getMoodClass(newEntry.mood)">{{ newEntry.mood }}</span>
              </div>
              <div class="mood-labels">
                <span>😢 Low</span>
                <span>😐 Moderate</span>
                <span>😊 High</span>
              </div>
            </div>

            <div class="form-group">
              <label for="gratitude">What are you grateful for today?</label>
              <textarea 
                id="gratitude"
                v-model="newEntry.gratitude" 
                placeholder="Express your gratitude..."
                rows="3"
                class="form-textarea"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="thoughts">Thoughts & Reflections</label>
              <textarea 
                id="thoughts"
                v-model="newEntry.thoughts" 
                placeholder="Write about your day, feelings, or anything on your mind..."
                rows="5"
                class="form-textarea"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="activities">Activities Today</label>
              <input 
                type="text" 
                id="activities"
                v-model="newEntry.activities" 
                placeholder="e.g., Exercise, Reading, Meditation"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label>
                <input 
                  type="checkbox" 
                  v-model="newEntry.needsSupport"
                  class="form-checkbox"
                />
                I might need additional support
              </label>
            </div>

            <button type="submit" class="btn btn-primary" aria-label="Save journal entry">
              Save Entry
            </button>
          </form>
        </div>

        <!-- Export Options -->
        <div class="export-section">
          <h2>Export Journal</h2>
          <p class="export-description">Download your journal entries in your preferred format</p>
          <div class="export-buttons">
            <button 
              @click="exportAsCSV" 
              class="btn btn-export"
              :disabled="entries.length === 0"
              aria-label="Export journal as CSV file"
            >
              📊 Export as CSV
            </button>
            <button 
              @click="exportAsPDF" 
              class="btn btn-export"
              :disabled="entries.length === 0"
              aria-label="Export journal as PDF file"
            >
              📄 Export as PDF
            </button>
            <button 
              @click="exportAsJSON" 
              class="btn btn-export"
              :disabled="entries.length === 0"
              aria-label="Export journal as JSON file"
            >
              💾 Export as JSON
            </button>
          </div>
        </div>

        <!-- Journal Entries List -->
        <div class="entries-section" role="region" aria-label="Journal entries list">
          <div class="entries-header">
            <h2>Your Entries ({{ entries.length }})</h2>
            <button 
              v-if="entries.length > 0"
              @click="clearAllEntries" 
              class="btn btn-danger-outline"
              aria-label="Clear all journal entries"
            >
              Clear All
            </button>
          </div>

          <div v-if="entries.length === 0" class="empty-state">
            <p>No entries yet. Start journaling to track your wellbeing journey! ✨</p>
          </div>

          <div v-else class="entries-list">
            <div 
              v-for="entry in sortedEntries" 
              :key="entry.id"
              class="entry-card"
              role="article"
              :aria-label="`Journal entry from ${formatDate(entry.date)}`"
            >
              <div class="entry-header">
                <div class="entry-date">{{ formatDate(entry.date) }}</div>
                <div class="entry-mood" :class="getMoodClass(entry.mood)">
                  {{ getMoodEmoji(entry.mood) }} {{ entry.mood }}/10
                </div>
              </div>

              <div class="entry-content">
                <div v-if="entry.gratitude" class="entry-section">
                  <strong>Grateful for:</strong>
                  <p>{{ entry.gratitude }}</p>
                </div>

                <div v-if="entry.thoughts" class="entry-section">
                  <strong>Thoughts:</strong>
                  <p>{{ entry.thoughts }}</p>
                </div>

                <div v-if="entry.activities" class="entry-section">
                  <strong>Activities:</strong>
                  <p>{{ entry.activities }}</p>
                </div>

                <div v-if="entry.needsSupport" class="entry-alert">
                  ⚠️ Marked as needing support
                </div>
              </div>

              <div class="entry-actions">
                <button 
                  @click="deleteEntry(entry.id)" 
                  class="btn-delete"
                  :aria-label="`Delete entry from ${formatDate(entry.date)}`"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import MainHeader from '../components/MainHeader.vue'

export default {
  name: 'JournalLogView',
  components: {
    MainHeader
  },
  setup() {
    const entries = ref([])
    const newEntry = ref({
      date: new Date().toISOString().split('T')[0],
      mood: 5,
      gratitude: '',
      thoughts: '',
      activities: '',
      needsSupport: false
    })

    // Load entries from localStorage on mount
    onMounted(() => {
      const saved = localStorage.getItem('journalEntries')
      if (saved) {
        entries.value = JSON.parse(saved)
      }
    })

    const saveToLocalStorage = () => {
      localStorage.setItem('journalEntries', JSON.stringify(entries.value))
    }

    const addEntry = () => {
      const entry = {
        id: Date.now(),
        ...newEntry.value,
        timestamp: new Date().toISOString()
      }
      
      entries.value.unshift(entry)
      saveToLocalStorage()

      // Reset form
      newEntry.value = {
        date: new Date().toISOString().split('T')[0],
        mood: 5,
        gratitude: '',
        thoughts: '',
        activities: '',
        needsSupport: false
      }

      // Show success message
      alert('✅ Journal entry saved successfully!')
    }

    const deleteEntry = (id) => {
      if (confirm('Are you sure you want to delete this entry?')) {
        entries.value = entries.value.filter(e => e.id !== id)
        saveToLocalStorage()
      }
    }

    const clearAllEntries = () => {
      if (confirm('Are you sure you want to delete ALL entries? This cannot be undone.')) {
        entries.value = []
        saveToLocalStorage()
      }
    }

    const sortedEntries = computed(() => {
      return [...entries.value].sort((a, b) => new Date(b.date) - new Date(a.date))
    })

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    }

    const getMoodClass = (mood) => {
      const m = parseInt(mood)
      if (m <= 3) return 'mood-low'
      if (m <= 6) return 'mood-medium'
      return 'mood-high'
    }

    const getMoodEmoji = (mood) => {
      const m = parseInt(mood)
      if (m <= 3) return '😢'
      if (m <= 6) return '😐'
      return '😊'
    }

    // Export Functions
    const exportAsCSV = () => {
      if (entries.value.length === 0) return

      const headers = ['Date', 'Mood', 'Gratitude', 'Thoughts', 'Activities', 'Needs Support']
      const rows = entries.value.map(entry => [
        entry.date,
        entry.mood,
        `"${(entry.gratitude || '').replace(/"/g, '""')}"`,
        `"${(entry.thoughts || '').replace(/"/g, '""')}"`,
        `"${(entry.activities || '').replace(/"/g, '""')}"`,
        entry.needsSupport ? 'Yes' : 'No'
      ])

      const csv = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n')

      downloadFile(csv, 'journal-log.csv', 'text/csv')
    }

    const exportAsJSON = () => {
      if (entries.value.length === 0) return

      const json = JSON.stringify(entries.value, null, 2)
      downloadFile(json, 'journal-log.json', 'application/json')
    }

    const exportAsPDF = () => {
      if (entries.value.length === 0) return

      // Create HTML content for PDF
      let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Journal Log</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    h1 { color: #333; border-bottom: 3px solid #007bff; padding-bottom: 10px; }
    .entry { margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
    .entry-header { display: flex; justify-content: space-between; margin-bottom: 15px; }
    .date { font-weight: bold; font-size: 16px; }
    .mood { padding: 5px 10px; border-radius: 5px; }
    .mood-low { background-color: #fee; color: #c00; }
    .mood-medium { background-color: #ffe; color: #880; }
    .mood-high { background-color: #efe; color: #080; }
    .section { margin-bottom: 10px; }
    .section strong { color: #555; }
    .alert { background-color: #fff3cd; padding: 10px; border-radius: 5px; margin-top: 10px; }
  </style>
</head>
<body>
  <h1>📔 Journal Log</h1>
  <p>Exported on ${new Date().toLocaleDateString()}</p>
  <p>Total Entries: ${entries.value.length}</p>
  <hr>
`

      sortedEntries.value.forEach(entry => {
        html += `
  <div class="entry">
    <div class="entry-header">
      <span class="date">${formatDate(entry.date)}</span>
      <span class="mood ${getMoodClass(entry.mood)}">${getMoodEmoji(entry.mood)} Mood: ${entry.mood}/10</span>
    </div>
`
        if (entry.gratitude) {
          html += `
    <div class="section">
      <strong>Grateful for:</strong>
      <p>${escapeHtml(entry.gratitude)}</p>
    </div>
`
        }
        if (entry.thoughts) {
          html += `
    <div class="section">
      <strong>Thoughts:</strong>
      <p>${escapeHtml(entry.thoughts)}</p>
    </div>
`
        }
        if (entry.activities) {
          html += `
    <div class="section">
      <strong>Activities:</strong>
      <p>${escapeHtml(entry.activities)}</p>
    </div>
`
        }
        if (entry.needsSupport) {
          html += `
    <div class="alert">⚠️ Marked as needing support</div>
`
        }
        html += `
  </div>
`
      })

      html += `
</body>
</html>
`

      // Open in new window for printing
      const printWindow = window.open('', '_blank')
      printWindow.document.write(html)
      printWindow.document.close()
      
      // Trigger print dialog
      setTimeout(() => {
        printWindow.print()
      }, 250)
    }

    const escapeHtml = (text) => {
      const div = document.createElement('div')
      div.textContent = text
      return div.innerHTML
    }

    const downloadFile = (content, filename, contentType) => {
      const blob = new Blob([content], { type: contentType })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }

    return {
      entries,
      newEntry,
      sortedEntries,
      addEntry,
      deleteEntry,
      clearAllEntries,
      formatDate,
      getMoodClass,
      getMoodEmoji,
      exportAsCSV,
      exportAsJSON,
      exportAsPDF
    }
  }
}
</script>

<style scoped>
.journal-container {
  min-height: 100vh;
  background: #f8f9fa;
}

.content {
  padding: 0;
}

.journal-header {
  background: white;
  padding: 2.5rem 2rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.journal-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #212529;
  margin: 0 0 0.5rem 0;
}

.header-subtitle {
  font-size: 1.1rem;
  color: #6c757d;
  margin: 0;
}

.journal-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

/* Form Styles */
.entry-form-container {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.entry-form-container h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  color: #212529;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
  font-size: 0.95rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #007bff;
}

.form-textarea {
  resize: vertical;
}

.mood-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mood-slider {
  flex: 1;
  height: 8px;
  border-radius: 5px;
  outline: none;
  background: linear-gradient(to right, #ef4444, #f59e0b, #22c55e);
}

.mood-slider::-webkit-slider-thumb {
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  border: 3px solid #007bff;
  cursor: pointer;
}

.mood-slider::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  border: 3px solid #007bff;
  cursor: pointer;
}

.mood-value {
  font-size: 1.5rem;
  font-weight: 700;
  min-width: 50px;
  text-align: center;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
}

.mood-low { color: #dc2626; background: #fee2e2; }
.mood-medium { color: #d97706; background: #fef3c7; }
.mood-high { color: #16a34a; background: #dcfce7; }

.mood-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #6c757d;
}

.form-checkbox {
  margin-right: 0.5rem;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-primary:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

/* Export Section */
.export-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.export-section h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: #212529;
}

.export-description {
  color: #6c757d;
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
}

.export-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn-export {
  background: #f3f4f6;
  color: #374151;
  border: 2px solid #e5e7eb;
  padding: 0.6rem 1.25rem;
  font-size: 0.9rem;
}

.btn-export:hover:not(:disabled) {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.btn-export:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Entries Section */
.entries-section {
  margin-top: 2rem;
}

.entries-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.entries-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #212529;
}

.btn-danger-outline {
  background: white;
  color: #dc2626;
  border: 2px solid #dc2626;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.btn-danger-outline:hover {
  background: #dc2626;
  color: white;
}

.empty-state {
  background: white;
  padding: 3rem 2rem;
  border-radius: 12px;
  text-align: center;
  color: #6c757d;
  font-size: 1.1rem;
}

.entries-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.entry-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #007bff;
}

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.entry-date {
  font-weight: 600;
  color: #212529;
  font-size: 1.05rem;
}

.entry-mood {
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
}

.entry-content {
  margin-bottom: 1rem;
}

.entry-section {
  margin-bottom: 1rem;
}

.entry-section strong {
  display: block;
  margin-bottom: 0.25rem;
  color: #374151;
  font-size: 0.9rem;
}

.entry-section p {
  margin: 0;
  color: #6c757d;
  line-height: 1.6;
}

.entry-alert {
  background: #fff3cd;
  color: #856404;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
}

.entry-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
}

.btn-delete {
  background: none;
  border: 1px solid #e5e7eb;
  color: #6c757d;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-delete:hover {
  background: #dc2626;
  color: white;
  border-color: #dc2626;
}

@media (max-width: 768px) {
  .journal-header {
    padding: 2rem 1rem;
  }

  .journal-header h1 {
    font-size: 2rem;
  }

  .entry-form-container {
    padding: 1.5rem;
  }

  .export-buttons {
    flex-direction: column;
  }

  .btn-export {
    width: 100%;
  }

  .entries-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .entry-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
