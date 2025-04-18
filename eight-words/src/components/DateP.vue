<template>
  <div class="date-picker-container">
    <h2>Select Your Birth Date and Time</h2>
    <div class="custom-date-picker">
      <div class="select-group">
        <label for="year">Year</label>
        <select id="year" v-model="selectedYear" class="date-select">
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>
      
      <div class="select-group">
        <label for="month">Month</label>
        <select id="month" v-model="selectedMonth" class="date-select">
          <option v-for="(month, index) in months" :key="index" :value="index">{{ month }}</option>
        </select>
      </div>
      
      <div class="select-group">
        <label for="day">Day</label>
        <select id="day" v-model="selectedDay" class="date-select">
          <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
        </select>
      </div>
      
      <div class="select-group">
        <label for="hour">Hour</label>
        <select id="hour" v-model="selectedHour" class="date-select">
          <option v-for="hour in hours" :key="hour" :value="hour">{{ hour }}:00</option>
        </select>
      </div>
    </div>
    
    <div class="submit-container">
      <button @click="submitDate" class="submit-button" :disabled="isLoading">
        {{ isLoading ? 'Calculating...' : 'Calculate Ba-Zi' }}
      </button>
    </div>
    
    <div class="output-container" v-if="baziResult">
      <h3>Your Ba-Zi (Four Pillars):</h3>
      <div class="bazi-result-horizontal">
        <div class="pillar" v-for="(value, key) in sortedBaziResult" :key="key">
          <span class="pillar-label">{{ key }}</span>
          <div class="chinese-characters">
            <span 
              v-for="(char, index) in splitChineseCharacters(value)" 
              :key="index"
              class="character"
              :class="getElementClass(char)"
            >
              <small class="pinyin-annotation">{{ getPinyin(char) }}</small>
              {{ char }} 
              <small class="element-emoji">{{ getElementEmoji(char) }}</small>
            </span>
          </div>
        </div>
      </div>
      
      <div class="element-legend">
        <div class="legend-row">
          <div class="legend-item">
            <span class="legend-color wood"></span>
            <span class="legend-text">Wood (木)</span>
          </div>
          <div class="legend-item">
            <span class="legend-color fire"></span>
            <span class="legend-text">Fire (火)</span>
          </div>
          <div class="legend-item">
            <span class="legend-color earth"></span>
            <span class="legend-text">Earth (土)</span>
          </div>
          <div class="legend-item">
            <span class="legend-color metal"></span>
            <span class="legend-text">Metal (金)</span>
          </div>
          <div class="legend-item">
            <span class="legend-color water"></span>
            <span class="legend-text">Water (水)</span>
          </div>
        </div>
      </div>
      
      <!-- Add the BaziAnalysis component -->
      <BaziAnalysis :bazi-data="baziResult" />
    </div>
    
    <div class="error-container" v-if="errorMessage">
      <p class="error-message">{{ errorMessage }}</p>
    </div>
  </div>
</template>
  
<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import BaziAnalysis from './BaziAnalysis.vue';
  
  // Data
  const selectedYear = ref<number>(1990);
  const selectedMonth = ref<number>(0); // 0-11 for Jan-Dec
  const selectedDay = ref<number>(1);
  const selectedHour = ref<number>(12);
  const baziResult = ref<Record<string, string> | null>(null);
  const isLoading = ref<boolean>(false);
  const errorMessage = ref<string>('');
  
  // Generate years from 1901 to 2024
  const years = Array.from({ length: 2024 - 1901 + 1 }, (_, i) => i + 1901);
  
  // Months
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Hours (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Computed days based on selected year and month
  const days = computed(() => {
    const daysInMonth = new Date(selectedYear.value, selectedMonth.value + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  });
  
  // Five Elements (Wu Xing) mappings for Heavenly Stems (Tian Gan)
  const tianGanElement: Record<string, string> = {
    '甲': 'wood', // Wood
    '乙': 'wood', // Wood
    '丙': 'fire', // Fire
    '丁': 'fire', // Fire
    '戊': 'earth', // Earth
    '己': 'earth', // Earth
    '庚': 'metal', // Metal
    '辛': 'metal', // Metal
    '壬': 'water', // Water
    '癸': 'water'  // Water
  };
  
  // Five Elements (Wu Xing) mappings for Earthly Branches (Di Zhi)
  const diZhiElement: Record<string, string> = {
    '子': 'water', // Water (Rat)
    '丑': 'earth', // Earth (Ox)
    '寅': 'wood',  // Wood (Tiger)
    '卯': 'wood',  // Wood (Rabbit)
    '辰': 'earth', // Earth (Dragon)
    '巳': 'fire',  // Fire (Snake)
    '午': 'fire',  // Fire (Horse)
    '未': 'earth', // Earth (Goat)
    '申': 'metal', // Metal (Monkey)
    '酉': 'metal', // Metal (Rooster)
    '戌': 'earth', // Earth (Dog)
    '亥': 'water'  // Water (Pig)
  };
  
  // Five Elements with emoji symbols
  const elementEmojis: Record<string, string> = {
    'wood': '🌳',
    'fire': '🔥',
    'earth': 'ᨒ',
    'metal': '🔱',
    'water': '💧'
  };
  
  // Add pinyin mappings for the Heavenly Stems and Earthly Branches
  const tianGanPinyin: Record<string, string> = {
    '甲': 'jiǎ',
    '乙': 'yǐ',
    '丙': 'bǐng',
    '丁': 'dīng',
    '戊': 'wù',
    '己': 'jǐ',
    '庚': 'gēng',
    '辛': 'xīn',
    '壬': 'rén',
    '癸': 'guǐ'
  };

  const diZhiPinyin: Record<string, string> = {
    '子': 'zǐ',
    '丑': 'chǒu',
    '寅': 'yín',
    '卯': 'mǎo',
    '辰': 'chén',
    '巳': 'sì',
    '午': 'wǔ',
    '未': 'wèi',
    '申': 'shēn',
    '酉': 'yǒu',
    '戌': 'xū',
    '亥': 'hài'
  };
  
  // Get element class based on Chinese character
  const getElementClass = (char: string): string => {
    if (tianGanElement[char]) {
      return tianGanElement[char];
    }
    if (diZhiElement[char]) {
      return diZhiElement[char];
    }
    return '';
  };
  
  // Get element emoji based on Chinese character
  const getElementEmoji = (char: string): string => {
    if (tianGanElement[char]) {
      return elementEmojis[tianGanElement[char]];
    }
    if (diZhiElement[char]) {
      return elementEmojis[diZhiElement[char]];
    }
    return '';
  };
  
  // Get pinyin for Chinese character
  const getPinyin = (char: string): string => {
    if (tianGanPinyin[char]) {
      return tianGanPinyin[char];
    }
    if (diZhiPinyin[char]) {
      return diZhiPinyin[char];
    }
    return '';
  };
  
  // Sorted bazi result to ensure correct order: year, month, day, time
  const sortedBaziResult = computed(() => {
    if (!baziResult.value) return {};
    
    const order = ['year', 'month', 'day', 'time'];
    const sortedResult: Record<string, string> = {};
    
    // First add the items in our preferred order
    order.forEach(key => {
      if (key in baziResult.value!) {
        sortedResult[key] = baziResult.value![key];
      }
    });
    
    // Then add any other items that might be in the result
    Object.keys(baziResult.value).forEach(key => {
      if (!order.includes(key)) {
        sortedResult[key] = baziResult.value![key];
      }
    });
    
    return sortedResult;
  });
  
  // Split Chinese characters from a string
  const splitChineseCharacters = (value: string): string[] => {
    // Use Array.from to properly handle Unicode characters
    return Array.from(value);
  };
  
  // Submit date and fetch data
  const submitDate = () => {
    // Clear previous results and errors
    errorMessage.value = '';
    isLoading.value = true;
    
    // Ensure day is valid for the selected month
    const maxDays = new Date(selectedYear.value, selectedMonth.value + 1, 0).getDate();
    if (selectedDay.value > maxDays) {
      selectedDay.value = maxDays;
    }
    
    // Create Date object
    const date = new Date(
      selectedYear.value,
      selectedMonth.value,
      selectedDay.value,
      selectedHour.value
    );
    
    fetchBaziData(date);
  };
  
  // Fetch Bazi data from API
  const fetchBaziData = (date: Date) => {
    // Define the API base URL from environment variables
    const apiBaseUrl = import.meta.env.VITE_APP_API_URL || 'http://localhost:8080';
      
    const apiUrl = apiBaseUrl + '/' + 
      date.getFullYear() + "/" + 
      (date.getMonth() + 1) + "/" + 
      date.getDate() + "/" + 
      date.getHours();
    
    console.log('Fetching from URL:', apiUrl);
    
    fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
        console.log('Received data:', data);
        if (data && Object.keys(data).length > 0) {
          baziResult.value = data;
        } else {
          errorMessage.value = 'No Ba-Zi data returned. Please try a different date.';
        }
        isLoading.value = false;
    })
    .catch(error => {
      console.error('Error:', error);
        errorMessage.value = 'Error fetching data: ' + error.message;
        baziResult.value = null;
        isLoading.value = false;
      });
  };
  
  // Initialize with current date on mount
  onMounted(() => {
    const now = new Date();
    selectedYear.value = 2000;
    selectedMonth.value = now.getMonth();
    selectedDay.value = now.getDate();
    selectedHour.value = now.getHours();
  });
</script>

<style scoped>
.date-picker-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2.5rem;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.4s ease;
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.date-picker-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}

h2 {
  color: #2c3e50;
  margin-bottom: 1.8rem;
  text-align: center;
  font-size: 1.7rem;
  font-weight: 700;
  position: relative;
  padding-bottom: 0.8rem;
}

.custom-date-picker {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1.2rem;
  margin-bottom: 2rem;
}

.select-group {
  display: flex;
  flex-direction: column;
  position: relative;
}

.select-group::after {
  content: '▼';
  font-size: 0.8rem;
  color: rgba(44, 62, 80, 0.6);
  position: absolute;
  right: 12px;
  top: calc(50% + 8px);
  pointer-events: none;
  transition: transform 0.3s ease;
}

.select-group:hover::after {
  transform: translateY(2px);
  color: #3498db;
}

label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-size: 0.95rem;
  letter-spacing: 0.03em;
}

.date-select {
  padding: 0.85rem 1rem;
  border: 1px solid rgba(226, 232, 240, 0.7);
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.6);
  font-size: 1.1rem;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-weight: 500;
  color: #2c3e50;
  appearance: none;
  width: 100%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
}

.date-select:hover {
  background-color: rgba(255, 255, 255, 0.8);
  border-color: rgba(52, 152, 219, 0.5);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.date-select:focus {
  border-color: #3498db;
  background-color: rgba(255, 255, 255, 0.9);
  outline: none;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.25);
}

.date-select option {
  font-weight: 500;
  padding: 10px;
  background-color: white;
  color: #2c3e50;
}

.submit-container {
  text-align: center;
  margin: 2rem 0 1.5rem;
}

.submit-button {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  padding: 0.9rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  position: relative;
  letter-spacing: 0.02em;
}

.submit-button::before {
  content: '';
  position: absolute;
  left: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #2980b9, #1f6da5);
}

.submit-button:active:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.submit-button:disabled {
  background: linear-gradient(135deg, #95a5a6, #7f8c8d);
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  opacity: 0.8;
}

.output-container {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(248, 249, 250, 0.7);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.bazi-result-horizontal {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  margin: 0 auto;
  max-width: 100%;
  overflow-x: auto;
}

.pillar {
  flex: 1;
  margin: 0 0.5rem;
  padding: 1.5rem 1rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 80px;
  transition: all 0.3s ease;
  backdrop-filter: blur(3px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.pillar:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.85);
}

.pillar:first-child {
  margin-left: 0;
}

.pillar:last-child {
  margin-right: 0;
}

.pillar-label {
  font-weight: bold;
  color: #666;
  margin-bottom: 1rem;
  text-transform: capitalize;
}

.chinese-characters {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.character {
  font-size: 2.2rem;
  line-height: 1.2;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.character:hover {
  transform: scale(1.1);
}

.element-emoji {
  font-size: 1.2rem;
  margin-top: 0.3rem;
  display: block;
  transform: translateY(-0.2rem);
  filter: drop-shadow(0 2px 3px rgba(0,0,0,0.1));
  transition: transform 0.3s ease;
}

.character:hover .element-emoji {
  transform: translateY(0) scale(1.2);
}

/* Five Element Colors */
.wood {
  color: #4CAF50; /* Green for Wood */
}

.fire {
  color: #F44336; /* Red for Fire */
}

.earth {
  color: #8b6d03; /* Brown/Orange for Earth */
}

.metal {
  color: #ef9104; /* Gray/Silver for Metal */
}

.water {
  color: #2196F3; /* Blue for Water */
}

.element-legend {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
}

.legend-row {
  display: flex;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  margin: 0 1rem;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(3px);
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.legend-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.8);
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 3px;
  margin-right: 0.5rem;
}

.legend-color.wood {
  background-color: #4CAF50;
}

.legend-color.fire {
  background-color: #F44336;
}

.legend-color.earth {
  background-color: #8b6d03;
}

.legend-color.metal {
  background-color: #ef9104;
}

.legend-color.water {
  background-color: #2196F3;
}

.legend-text {
  font-size: 0.9rem;
  font-weight: 500;
}

.error-container {
  margin-top: 2rem;
  padding: 1rem;
  background: #ffebee;
  border-radius: 8px;
  text-align: center;
}

.error-message {
  color: #e74c3c;
  margin: 0;
}

h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  text-align: center;
}

@media (max-width: 768px) {
  .date-picker-container {
    max-width: 95%;
    padding: 1.5rem;
    margin: 1rem auto;
  }
  
  h2 {
    font-size: 1.4rem;
    margin-bottom: 1.2rem;
  }
  
  .custom-date-picker {
    gap: 0.8rem;
  }
  
  .date-select {
    padding: 0.7rem;
    font-size: 1rem;
  }
  
  .submit-button {
    padding: 0.7rem 1.5rem;
    font-size: 1rem;
  }
  
  .bazi-result-horizontal {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .pillar {
    min-width: 70px;
    margin: 0.3rem;
    padding: 1rem 0.8rem;
  }
  
  .character {
    font-size: 1.8rem;
  }
  
  .element-emoji {
    font-size: 1rem;
  }
  
  .pinyin-annotation {
    font-size: 0.8rem;
    margin-top: 0.1rem;
  }
  
  .element-legend {
    flex-wrap: wrap;
  }
  
  .legend-item {
    margin: 0.3rem;
    padding: 0.4rem 0.6rem;
  }
}

@media (max-width: 480px) {
  .date-picker-container {
    max-width: 100%;
    padding: 1.2rem;
    border-radius: 15px;
  }
  
  .custom-date-picker {
    grid-template-columns: 1fr;
  }
  
  .legend-row {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .character {
    font-size: 1.5rem;
  }
  
  .element-emoji {
    font-size: 0.9rem;
  }
  
  .pinyin-annotation {
    font-size: 0.7rem;
  }
}

/* Add CSS for the pinyin annotations */
.pinyin-annotation {
  font-size: 0.9rem;
  font-weight: 400;
  margin-top: 1rem;
  color: rgba(44, 62, 80, 0.7);
  font-style: italic;
  text-shadow: none;
  display: block;
}
</style>