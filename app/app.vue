<template>
  <div class="bg-white min-h-screen">
    <!-- Preview Badge -->
    <div v-if="isPreview" class="text-center py-2 bg-yellow-500">
      <span class="text-white text-xs font-bold uppercase">Preview Mode</span>
    </div>

    <!-- Main Content -->
    <div class="max-w-xl mx-auto px-4 py-8">
      
      <!-- Kalenderblatt Container -->
      <div class="calendar-container relative">
        
        <!-- Nächstes Blatt (sichtbar darunter) -->
        <div 
          v-if="currentDay < maxDay"
          class="next-sheet-visible"
        >
          <div class="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <!-- Next sheet header -->
            <div class="bg-white px-4 py-4 shadow-md">
              <h1 class="text-[18px] md:text-3xl font-black tracking-tight text-gray-900 text-center">
                <span>Rein's</span> ABRISSKALENDER 2026
              </h1>
            </div>
            <div class="border-b-2 border-dashed border-gray-300 w-full"></div>
            <div class="relative">
              <img 
                :src="currentDay === 1 ? `/images/2.jpg` : `/images/${currentDay + 1}.jpg`" 
                :alt="`Bild des Tages ${currentDay + 1}`" 
                class="w-full h-auto"
                @error="handleImageError"
              >

            </div>
          </div>
        </div>

        <!-- Card Container (Current Day - on top) -->
        <div 
          ref="currentSheet"
          :class="['current-sheet bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200', tearAnimation]"
        >
          
          <!-- Fixed Header with Title (NOT part of animation) -->
          <div class="bg-white px-4 py-4 shadow-md relative z-10">
            <h1 class="text-[18px] md:text-3xl font-black tracking-tight text-gray-900 text-center">
              <span>Rein's</span> ABRISSKALENDER 2026
            </h1>
          </div>
          
          <!-- Dashed tear line (full width) -->
          <div class="border-b-2 border-dashed border-gray-300 w-full"></div>

          <!-- Image with Stamp -->
            <div class="relative">
              <!-- Cover Image -->
              <template v-if="currentDay === 1">
                <img 
                  src="/images/index.png" 
                  alt="Abriss-Kalender 2026 Cover" 
                  class="w-full h-auto"
                >
              </template>
              <!-- Regular Day Image -->
              <template v-else>
                <img 
                  :src="`/images/${currentDay}.jpg`" 
                  :alt="`Bild des Tages ${currentDay}`" 
                  class="w-full h-auto"
                  @error="handleImageError"
                >

              </template>
            </div>

            <!-- Bottom Area -->
            <div class="p-6 bg-white border-t border-gray-100">
              <!-- Date Display -->
              <div class="text-center mb-6">
                <p v-if="dayData.description" class="text-gray-600 text-xl mt-2">{{ dayData.description }}</p>
            </div>

            <!-- Abreiß-Button -->
            <button 
              class="w-full py-4 bg-gray-700 text-white rounded-lg font-bold text-lg hover:bg-gray-800 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              :disabled="currentDay >= maxDay"
              @click="tearOffSheet('left')"
            >
              {{ currentDay === 1 ? '🎉 Kalender starten' : `${getStampDate(currentDay)}` }}
            </button>
            
            <!-- Message when tearing not allowed -->
            <Transition name="fade">
              <div v-if="showTearMessage" class="mt-4 text-center text-red-500 font-medium">
                Abreißen noch nicht möglich
              </div>
            </Transition>

            <!-- Back Button (hidden on index) -->
            <div v-if="currentDay > 1" class="mt-4 text-center">
              <button 
                class="text-gray-500 hover:text-gray-900 transition-colors text-sm"
                @click="prevDay"
              >
                ← Zurück
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Info Text -->
      <div class="text-center text-gray-400 text-sm mt-8">
        <p>365 Tage · 365 Häuser · Eine Reise durch das Jahr</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getDayData } from '~/data/calendar'

const maxDay = 365
const calendarYear = 2026
const STORAGE_KEY = 'abrisskalender_position'

// Get stamp date in format "DI 19.09.2026"
// Day 1 = cover, Day 2 = January 1st, so we use dayNumber - 1
function getStampDate(dayNumber: number): string {
  const date = new Date(2026, 0, dayNumber - 1)
  const weekday = date.toLocaleDateString('de-DE', { weekday: 'short' }).toUpperCase()
  const dateStr = date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }).toUpperCase()
  return `${weekday} ${dateStr}`
}

// Format date for display
// Day 1 = cover, Day 2 = January 1st, so we use dayNumber - 1
function formatDate(dayNumber: number): string {
  if (dayNumber === 1) return 'Willkommen zum Abriss-Kalender 2026'
  const date = new Date(2026, 0, dayNumber - 1)
  return date.toLocaleDateString('de-DE', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

// Load saved position from localStorage
function loadSavedPosition(): number {
  if (import.meta.client) {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? parseInt(saved, 10) : 1
  }
  return 1
}

// Save position to localStorage
function savPosition(day: number) {
  if (import.meta.client) {
    localStorage.setItem(STORAGE_KEY, day.toString())
  }
}

// Check if in preview mode
const route = useRoute()
const isPreview = computed(() => route.query.preview === 'true')

// State - always start at 1, restore from localStorage if not in preview
const currentDay = ref(isPreview.value ? 1 : loadSavedPosition())
const dayInputValue = ref(currentDay.value)
const tearAnimation = ref('')
const isDragging = ref(false)
const startY = ref(0)
const currentSheet = ref<HTMLElement | null>(null)

// Computed
const formattedDate = computed(() => formatDate(currentDay.value))
const dayData = computed(() => getDayData(currentDay.value))
const showTearMessage = ref(false)

// Check if tearing is allowed (not before Jan 1st for the first calendar page)
const canTear = computed(() => {
  // Cover page (day 1) can always be torn off
  if (currentDay.value === 1) return true
  // For day 2 (Jan 1st), check if we're past Jan 1st 2026
  if (currentDay.value === 2) {
    const today = new Date()
    const startDate = new Date(calendarYear, 0, 1) // 1. Januar 2026
    return today >= startDate
  }
  return true
})

// Watch currentDay to update input and save position
watch(currentDay, (newVal) => {
  dayInputValue.value = newVal
  savPosition(newVal)
})

// Navigation functions
function prevDay() {
  if (currentDay.value > 1) {
    currentDay.value--
  }
}

function nextDay() {
  if (currentDay.value < maxDay) {
    currentDay.value++
  }
}

function goToSavedDay() {
  currentDay.value = loadSavedPosition()
}

function goToDay() {
  if (dayInputValue.value >= 1 && dayInputValue.value <= maxDay) {
    currentDay.value = dayInputValue.value
  } else {
    alert(`Bitte gib eine Zahl zwischen 1 und ${maxDay} ein.`)
    dayInputValue.value = currentDay.value
  }
}

// Tear off animation
function tearOffSheet(direction: 'down' | 'left' | 'right' = 'left') {
  if (currentDay.value >= maxDay) return
  
  // Check if tearing is allowed
  if (!canTear.value) {
    alert('Abreißen noch nicht möglich')
    return
  }
  
  // Randomly choose left or right for variety
  const randomDirection = Math.random() > 0.5 ? 'left' : 'right'
  const actualDirection = direction === 'down' ? randomDirection : direction
  
  const animationClass = actualDirection === 'right' ? 'tear-off-right' : 'tear-off-left'
  tearAnimation.value = animationClass
  
  setTimeout(() => {
    currentDay.value++
    tearAnimation.value = ''
  }, 700)
}

// Drag functionality
function startDrag(e: MouseEvent) {
  if (currentDay.value >= maxDay) return
  isDragging.value = true
  startY.value = e.clientY
}

function startDragTouch(e: TouchEvent) {
  if (currentDay.value >= maxDay) return
  isDragging.value = true
  startY.value = e.touches?.[0]?.clientY ?? 0
}

function handleMouseMove(e: MouseEvent) {
  if (!isDragging.value) return
  
  const deltaY = e.clientY - startY.value
  
  if (deltaY > 100) {
    isDragging.value = false
    tearOffSheet('down')
  }
}

function handleTouchMove(e: TouchEvent) {
  if (!isDragging.value) return
  
  const deltaY = (e.touches?.[0]?.clientY ?? 0) - startY.value
  
  if (deltaY > 100) {
    isDragging.value = false
    tearOffSheet('down')
  }
}

function handleDragEnd() {
  isDragging.value = false
}

// Keyboard navigation
function handleKeydown(e: KeyboardEvent) {
  if ((e.target as HTMLElement).tagName === 'INPUT') return
  
  if (e.key === 'ArrowLeft' && currentDay.value > 1) {
    currentDay.value--
  } else if (e.key === 'ArrowRight' && currentDay.value < maxDay) {
    currentDay.value++
  } else if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault()
    tearOffSheet('down')
  }
}

// Image error handling
function handleImageError(e: Event) {
  const img = e.target as HTMLImageElement
  img.src = `https://dummyimage.com/1280x720/374151/fff&text=Tag+${currentDay.value + 1}`
}

// Lifecycle
onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleDragEnd)
  document.addEventListener('touchmove', handleTouchMove)
  document.addEventListener('touchend', handleDragEnd)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleDragEnd)
  document.removeEventListener('touchmove', handleTouchMove)
  document.removeEventListener('touchend', handleDragEnd)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
