<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Header -->
    <header class="flex items-center justify-between border-b border-gray-700 px-6 py-4 bg-gray-800">
      <h1 class="text-base font-semibold text-white">
        Abriss-Kalender <time>{{ currentYear }}</time>
      </h1>
      <div class="flex items-center gap-4">
        <div class="relative flex items-center rounded-md bg-gray-700 shadow-sm border border-gray-600">
          <button 
            type="button" 
            class="flex h-9 w-12 items-center justify-center rounded-l-md text-gray-300 hover:text-white hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="currentDay === 1"
            @click="prevDay"
          >
            <span class="sr-only">Vorheriger Tag</span>
            <svg viewBox="0 0 20 20" fill="currentColor" class="size-5">
              <path d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" fill-rule="evenodd" />
            </svg>
          </button>
          <button 
            type="button" 
            class="hidden px-3.5 text-sm font-semibold text-white hover:bg-gray-600 md:block"
            @click="goToToday"
          >
            Heute
          </button>
          <span class="relative -mx-px h-5 w-px bg-gray-600 md:hidden"></span>
          <button 
            type="button" 
            class="flex h-9 w-12 items-center justify-center rounded-r-md text-gray-300 hover:text-white hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="currentDay === maxDay"
            @click="nextDay"
          >
            <span class="sr-only">Nächster Tag</span>
            <svg viewBox="0 0 20 20" fill="currentColor" class="size-5">
              <path d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" fill-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      
      <!-- Kalenderblatt Container -->
      <div class="relative" style="min-height: 700px;">
        
        <!-- Nächstes Blatt (Bild darunter) -->
        <div 
          v-if="currentDay < maxDay"
          class="next-sheet bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <img 
            :src="`/images/${currentDay + 1}.png`" 
            :alt="`Bild des Tages ${currentDay + 1}`" 
            class="w-full h-full object-cover"
            style="height: 600px;"
            @error="handleImageError"
          >
        </div>

        <!-- Aktuelles Kalenderblatt (Deckel) -->
        <div 
          ref="currentSheet"
          class="relative bg-white rounded-lg shadow-2xl overflow-hidden paper-sheet"
          :class="tearAnimation"
        >
          
          <!-- Abreißbare Perforation (Drag-Bereich) -->
          <div 
            class="tear-handle absolute top-0 left-0 right-0 h-20 z-20 flex items-center justify-center"
            @mousedown="startDrag"
            @touchstart="startDragTouch"
          >
            <div class="text-gray-400 text-xs flex flex-col items-center gap-1 pointer-events-none">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
              <span>Zum Abreißen ziehen</span>
            </div>
          </div>

          <!-- Kalenderblatt Design -->
          <div class="calendar-day pt-20">
            <!-- Großer Tag -->
            <div class="day-number-large">{{ currentDay }}</div>
            
            <!-- Datum -->
            <div class="text-center mt-8 px-4">
              <div class="text-2xl font-bold mb-2">{{ formattedDate }}</div>
              <div class="text-lg opacity-80">Tag {{ currentDay }} von {{ maxDay }}</div>
            </div>

            <!-- Beschreibung -->
            <div v-if="dayData.title || dayData.description" class="mt-6 px-6 text-center max-w-md">
              <div v-if="dayData.title" class="text-xl font-bold mb-2">{{ dayData.title }}</div>
              <p v-if="dayData.description" class="text-gray-300 text-sm">{{ dayData.description }}</p>
            </div>
          </div>

          <!-- Unterer Bereich mit Buttons -->
          <div class="p-6 bg-gray-800">
            <!-- Abreiß-Button -->
            <button 
              class="w-full py-4 bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-lg font-bold text-lg hover:from-gray-600 hover:to-gray-500 transition-all transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              :disabled="currentDay >= maxDay"
              @click="tearOffSheet('left')"
            >
              📅 Tag abreißen
            </button>

            <!-- Navigation -->
            <div class="mt-4 flex items-center gap-2">
              <button 
                class="flex-1 py-2 bg-gray-700 border-2 border-gray-600 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                :disabled="currentDay === 1"
                @click="prevDay"
              >
                ← Zurück
              </button>
              <input 
                v-model.number="dayInputValue"
                type="number" 
                min="1" 
                :max="maxDay"
                class="w-20 px-3 py-2 bg-gray-700 border-2 border-gray-600 text-white rounded-lg text-center focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none"
                @change="goToDay"
                @keypress.enter="($event.target as HTMLInputElement).blur()"
              >
              <button 
                class="flex-1 py-2 bg-gray-700 border-2 border-gray-600 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                :disabled="currentDay === maxDay"
                @click="nextDay"
              >
                Vor →
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

// Calculate day of year for 2026
function getDayOfYear2026(): number {
  const now = new Date()
  const start = new Date(2026, 0, 1)
  
  // If we're before 2026, show day 0 (cover)
  if (now < start) return 0
  
  const diff = now.getTime() - start.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  const day = Math.floor(diff / oneDay) + 1
  
  // Cap at maxDay
  return Math.min(day, maxDay)
}

// Format date
function formatDate(dayNumber: number): string {
  if (dayNumber === 0) return 'Willkommen zum Abriss-Kalender 2026'
  const date = new Date(2026, 0, dayNumber)
  return date.toLocaleDateString('de-DE', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

// State - start at 0 for cover image
const currentDay = ref(getDayOfYear2026())
const dayInputValue = ref(currentDay.value)
const tearAnimation = ref('')
const isDragging = ref(false)
const startY = ref(0)
const currentSheet = ref<HTMLElement | null>(null)

// Computed
const formattedDate = computed(() => formatDate(currentDay.value))
const dayData = computed(() => getDayData(currentDay.value))
const isCover = computed(() => currentDay.value === 0)
const displayDay = computed(() => currentDay.value === 0 ? '' : currentDay.value)

// Watch currentDay to update input
watch(currentDay, (newVal) => {
  dayInputValue.value = newVal
})

// Navigation functions
function prevDay() {
  if (currentDay.value > 0) {
    currentDay.value--
  }
}

function nextDay() {
  if (currentDay.value < maxDay) {
    currentDay.value++
  }
}

function goToToday() {
  currentDay.value = getDayOfYear2026()
}

function goToDay() {
  if (dayInputValue.value >= 0 && dayInputValue.value <= maxDay) {
    currentDay.value = dayInputValue.value
  } else {
    alert(`Bitte gib eine Zahl zwischen 0 und ${maxDay} ein.`)
    dayInputValue.value = currentDay.value
  }
}

// Tear off animation
function tearOffSheet(direction: 'down' | 'left' = 'down') {
  if (currentDay.value >= maxDay) return
  
  const animationClass = direction === 'left' ? 'tear-off-left' : 'tear-off'
  tearAnimation.value = animationClass
  
  setTimeout(() => {
    currentDay.value++
    tearAnimation.value = ''
  }, 800)
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
  startY.value = e.touches[0].clientY
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
  
  const deltaY = e.touches[0].clientY - startY.value
  
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
  
  if (e.key === 'ArrowLeft' && currentDay.value > 0) {
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
