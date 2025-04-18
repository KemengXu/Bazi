<template>
  <div class="analysis-container" v-if="baziData">
    <h3>Your Bazi Analysis</h3>
    
    <div class="analysis-section">
      <h4>Elemental Balance</h4>
      <div class="element-distribution">
        <div 
          v-for="(count, element) in elementCounts" 
          :key="element" 
          class="element-bar"
        >
          <div class="element-label">{{ capitalize(element) }}</div>
          <div class="bar-container">
            <div 
              class="bar" 
              :class="element" 
              :style="{ width: `${(count / totalElements) * 100}%` }"
            ></div>
            <span class="count">{{ count }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="analysis-section">
      <h4>Day Master(your core self)</h4>
      <div class="day-master">
        <div class="day-char-container">
          <span class="day-char" :class="getDayElementClass()">{{ getDayMaster() }}</span>
        </div>
        <span class="day-emoji">{{ elementEmojis[getDayElementClass() as ElementType] }}</span>
        <span class="element-text">({{ getDayMasterPinyin() }} {{getDayElementClass() }} Element)</span>
      </div>
      <p>{{ getDayMasterDescription() }}</p>
    </div>

    
    <div class="analysis-section">
      <h4>Dominant Element</h4>
      <div class="dominant-element" :class="dominantElement">
        <span class="element-name">{{ capitalize(dominantElement) }} ({{ elementSymbols[dominantElement as ElementType] }})</span>
        <span class="dominant-emoji">{{ elementEmojis[dominantElement as ElementType] }}</span>
      </div>
      <p>{{ getElementDescription(dominantElement) }}</p>
    </div>
    
    
    <div class="analysis-section">
      <h4>Yin-Yang Balance</h4>
      <div class="balance-bar">
        <div class="yin-side" :style="{ width: `${yinPercentage}%` }">
          <span v-if="yinPercentage > 20">Yin {{ yinCount }}</span>
        </div>
        <div class="yang-side" :style="{ width: `${yangPercentage}%` }">
          <span v-if="yangPercentage > 20">Yang {{ yangCount }}</span>
        </div>
      </div>
      <p>{{ getYinYangAnalysis() }}</p>
    </div>
    
    <div class="analysis-section">
      <h4>Pillar Meaning</h4>
      <p>{{ getPillarInteractions() }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';

type ElementType = 'wood' | 'fire' | 'earth' | 'metal' | 'water';
type ElementCounts = Record<ElementType, number>;
type ElementSymbols = Record<ElementType, string>;
type ElementDescriptions = Record<ElementType, string>;

const props = defineProps<{
  baziData: Record<string, string> | null
}>();

// Five Elements (Wu Xing) mappings for Heavenly Stems (Tian Gan)
const tianGanElement: Record<string, ElementType> = {
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

// Yin-Yang properties of Heavenly Stems
const tianGanYinYang: Record<string, string> = {
  '甲': 'yang',
  '乙': 'yin',
  '丙': 'yang',
  '丁': 'yin',
  '戊': 'yang',
  '己': 'yin',
  '庚': 'yang',
  '辛': 'yin',
  '壬': 'yang',
  '癸': 'yin'
};

// Yin-Yang properties of Earthly Branches
const diZhiYinYang: Record<string, string> = {
  '子': 'yang',
  '丑': 'yin',
  '寅': 'yang',
  '卯': 'yin',
  '辰': 'yang',
  '巳': 'yin',
  '午': 'yang',
  '未': 'yin',
  '申': 'yang',
  '酉': 'yin',
  '戌': 'yang',
  '亥': 'yin'
};

// Five Elements (Wu Xing) mappings for Earthly Branches (Di Zhi)
const diZhiElement: Record<string, ElementType> = {
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

// Element symbols
const elementSymbols: ElementSymbols = {
  'wood': '木',
  'fire': '火',
  'earth': '土',
  'metal': '金',
  'water': '水'
};

// Element emojis
const elementEmojis: Record<ElementType, string> = {
  'wood': '🌳',
  'fire': '🔥',
  'earth': 'ᨒ',
  'metal': '🔱',
  'water': '💧'
};

// Pinyin for Heavenly Stems
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

// Element descriptions with more detailed Chinese metaphysics perspectives
const elementDescriptions: ElementDescriptions = {
  'wood': 'Wood represents growth, upward movement, and expansion. Wood governs benevolence; those with strong Wood energy are compassionate, upright, and idealistic with a desire to help others. Wood-dominant individuals are typically creative with a strong sense of justice, excel at planning and pioneering but may be stubborn and inflexible. Wood energy is suitable for careers in education, healthcare, law, and environmental fields.',
  'fire': 'Fire represents passion, expansion, and outward energy. Fire governs propriety; those with strong Fire energy are lively, enthusiastic, expressive, and naturally attractive to others. Fire-dominant individuals typically have leadership charisma, social skills, and quick responses, but may experience emotional fluctuations and lack patience. Fire energy is suitable for careers in entertainment, sales, public relations, and food service.',
  'earth': 'Earth represents stability, nurturing, and balance. Earth governs trustworthiness; those with strong Earth energy are steady, reliable, patient, and practical. Earth-dominant individuals are typically hardworking, service-oriented, and trustworthy, but may be conservative, stubborn, and inflexible. Earth energy is suitable for careers in agriculture, real estate, food service, and service industries.',
  'metal': 'Metal represents firmness, contraction, and inward strength. Metal governs righteousness; those with strong Metal energy are determined, methodical, detail-oriented, and have a strong sense of justice. Metal-dominant individuals typically have organizational abilities, value discipline and rules, and strive for perfection, but may be overly strict and inflexible. Metal energy is suitable for careers in finance, military/police, engineering, and manufacturing.',
  'water': 'Water represents wisdom, flexibility, and downward flow. Water governs wisdom; those with strong Water energy are intelligent, thoughtful, adaptable, and insightful. Water-dominant individuals typically have philosophical tendencies, keen intuition, and excellent communication and understanding of others, but may be suspicious, restless, and indecisive. Water energy is suitable for careers in philosophy, research, media, and trade.'
};

// Day Master detailed descriptions based on traditional Chinese metaphysics
const dayMasterDescriptions: Record<string, string> = {
  '甲': 'Jia Wood is like a tree trunk: upright, strong, with leadership ability, creativity, and ambition. Those with Jia Wood Day Master seek growth and breakthroughs, refusing mediocrity, but may be overly rigid and inflexible.',
  '乙': 'Yi Wood is like flowers and grass: flexible, artistic, and accommodating. Those with Yi Wood Day Master are gentle, courteous, understanding, and adaptable, but may lack personal opinions and be easily influenced by others.',
  '丙': 'Bing Fire is like the blazing sun: bright, passionate, energetic, and creative. Those with Bing Fire Day Master are optimistic, charismatic leaders, but may be impatient and lack persistence.',
  '丁': 'Ding Fire is like candlelight: warm, subtle, inspiring, and approachable. Those with Ding Fire Day Master are gentle, communicative, and empathetic, but may be indecisive with fluctuating emotions.',
  '戊': 'Wu Earth is like a mountain: solid, reliable, stable, and inclusive. Those with Wu Earth Day Master are honest, responsible, and fair, but may be conservative, stubborn, and inflexible.',
  '己': 'Ji Earth is like farmland: gentle, fertile, nurturing, and receptive. Those with Ji Earth Day Master are accommodating, friendly, and caring for others, but may lack decisiveness and be overly dependent.',
  '庚': 'Geng Metal is like a sword: sharp, hard, righteous, and decisive. Those with Geng Metal Day Master are resolute, fair, and organized, but may be severe and lack empathy.',
  '辛': 'Xin Metal is like jewelry: elegant, refined, beautiful, and meaningful. Those with Xin Metal Day Master are capable, detail-oriented, and perfectionistic, but may be oversensitive and emotionally fragile.',
  '壬': 'Ren Water is like a river: flowing, wise, and energetic. Those with Ren Water Day Master are intelligent, open-minded, and independent, but may be restless and overly changeable.',
  '癸': 'Gui Water is like dew: moistening, gentle, subtle, and wise. Those with Gui Water Day Master are thoughtful, intuitive, and adaptable, but may be indecisive and lack practicality.'
};

// Get the Day Master (first character of day pillar)
const getDayMaster = () => {
  if (!props.baziData || !props.baziData.day) return '';
  return Array.from(props.baziData.day)[0];
};

// Get the element of the Day Master
const getDayElementClass = (): ElementType | '' => {
  const dayMaster = getDayMaster();
  return tianGanElement[dayMaster] || '';
};

// Count elements in the chart
const elementCounts = computed((): ElementCounts => {
  const counts: ElementCounts = {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0
  };
  
  if (!props.baziData) return counts;
  
  // Process each pillar
  Object.values(props.baziData).forEach(pillar => {
    const chars = Array.from(pillar);
    chars.forEach(char => {
      // Check if it's a Heavenly Stem
      if (tianGanElement[char]) {
        counts[tianGanElement[char]]++;
      }
      // Check if it's an Earthly Branch
      else if (diZhiElement[char]) {
        counts[diZhiElement[char]]++;
      }
    });
  });
  
  return counts;
});

// Calculate total elements
const totalElements = computed(() => {
  return Object.values(elementCounts.value).reduce((sum, count) => sum + count, 0);
});

// Determine dominant element
const dominantElement = computed((): ElementType => {
  if (!props.baziData) return 'earth'; // Default
  
  const counts = elementCounts.value;
  let max = 0;
  let dominant: ElementType = 'earth';
  
  for (const [element, count] of Object.entries(counts) as [ElementType, number][]) {
    if (count > max) {
      max = count;
      dominant = element;
    }
  }
  
  return dominant;
});

// Calculate Yin-Yang balance
const yinYangCounts = computed(() => {
  let yinCount = 0;
  let yangCount = 0;
  
  if (!props.baziData) return { yinCount, yangCount };
  
  // Process each pillar
  Object.values(props.baziData).forEach(pillar => {
    const chars = Array.from(pillar);
    chars.forEach((char, index) => {
      // First character is Heavenly Stem, second is Earthly Branch
      if (index === 0 && tianGanYinYang[char]) {
        tianGanYinYang[char] === 'yin' ? yinCount++ : yangCount++;
      } else if (index === 1 && diZhiYinYang[char]) {
        diZhiYinYang[char] === 'yin' ? yinCount++ : yangCount++;
      }
    });
  });
  
  return { yinCount, yangCount };
});

const yinCount = computed(() => yinYangCounts.value.yinCount);
const yangCount = computed(() => yinYangCounts.value.yangCount);
const totalYinYang = computed(() => yinCount.value + yangCount.value);
const yinPercentage = computed(() => Math.round((yinCount.value / totalYinYang.value) * 100));
const yangPercentage = computed(() => Math.round((yangCount.value / totalYinYang.value) * 100));

// Get Yin-Yang analysis
const getYinYangAnalysis = () => {
  const yin = yinCount.value;
  const yang = yangCount.value;
  
  if (yin > yang + 2) {
    return 'Your chart has strong Yin energy. You may be more introspective, receptive, and adaptable. You excel in thoughtful planning and quiet persistence.';
  } else if (yang > yin + 2) {
    return 'Your chart has strong Yang energy. You may be more assertive, active, and expressive. You excel in taking initiative and direct action.';
  } else {
    return 'Your chart has balanced Yin and Yang energies. You can effectively alternate between action and reflection, strength and flexibility, as circumstances require.';
  }
};

// Get pillar interactions analysis
const getPillarInteractions = () => {
  if (!props.baziData) return '';
  
  const pillars = {
    year: props.baziData.year || '',
    month: props.baziData.month || '',
    day: props.baziData.day || '',
    time: props.baziData.time || ''
  };
  
  if (!pillars.year || !pillars.month || !pillars.day || !pillars.time) {
    return 'Incomplete chart data to analyze pillar interactions.';
  }
  
  // Simple analysis based on pillar positions
  const analysis = [];
  
  // Year pillar represents ancestry, parents, early childhood
  analysis.push('Your Year Pillar reflects your family background and early influences.');
  
  // Month pillar represents education, career, middle age
  analysis.push('Your Month Pillar indicates career tendencies and educational influences.');
  
  // Day pillar represents self, marriage, relationships
  analysis.push('Your Day Pillar represents your core self and relationship dynamics.');
  
  // Time pillar represents children, later life, legacy
  analysis.push('Your Time Pillar indicates potential developments in later life.');
  
  return analysis.join(' ');
};

// Get Day Master description
const getDayMasterDescription = () => {
  const dayMaster = getDayMaster();
  if (!dayMaster) return 'The Day Master is the core of your Bazi chart, representing your true nature and spiritual state.';
  
  return dayMasterDescriptions[dayMaster] || 'The Day Master is the core of your Bazi chart, representing your true nature and spiritual state.';
};

// Get description for an element
const getElementDescription = (element: ElementType): string => {
  return elementDescriptions[element];
};

// Add a method to get the pinyin for the Day Master
const getDayMasterPinyin = (): string => {
  const dayMaster = getDayMaster();
  return tianGanPinyin[dayMaster] || '';
};

// Helper function to capitalize first letter
const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
</script>

<style scoped>
.analysis-container {
  margin-top: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h3 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

h4 {
  color: #2c3e50;
  margin: 1rem 0;
  font-size: 1.2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.analysis-section {
  margin-bottom: 2rem;
}

.element-distribution {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1rem 0;
}

.element-bar {
  display: flex;
  align-items: center;
}

.element-label {
  width: 60px;
  font-weight: bold;
  text-align: right;
  margin-right: 1rem;
}

.bar-container {
  flex: 1;
  background: rgba(245, 245, 245, 0.5);
  height: 25px;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(3px);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.bar {
  height: 100%;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  transition: width 0.8s ease;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.bar.wood {
  background: linear-gradient(135deg, #4CAF50, #2E7D32);
}

.bar.fire {
  background: linear-gradient(135deg, #F44336, #C62828);
}

.bar.earth {
  background: linear-gradient(135deg, #8b6d03, #5D4C02);
}

.bar.metal {
  background: linear-gradient(135deg, #ef9104, #E65100);
}

.bar.water {
  background: linear-gradient(135deg, #2196F3, #1565C0);
}

.count {
  position: absolute;
  right: 10px;
  color: #333;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.7);
}

.dominant-element {
  display: inline-flex;
  align-items: center;
  padding: 0.7rem 1.2rem;
  border-radius: 8px;
  font-weight: bold;
  margin: 0.5rem 0;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dominant-element:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.dominant-element.wood {
  background: rgba(76, 175, 80, 0.15);
  color: #2e7d32;
  border: 2px solid #4CAF50;
}

.dominant-element.fire {
  background: rgba(244, 67, 54, 0.15);
  color: #c62828;
  border: 2px solid #F44336;
}

.dominant-element.earth {
  background: rgba(139, 109, 3, 0.15);
  color: #6d4c02;
  border: 2px solid #8b6d03;
}

.dominant-element.metal {
  background: rgba(239, 145, 4, 0.15);
  color: #e65100;
  border: 2px solid #ef9104;
}

.dominant-element.water {
  background: rgba(33, 150, 243, 0.15);
  color: #1565c0;
  border: 2px solid #2196F3;
}

.dominant-emoji {
  font-size: 1.5rem;
  margin-left: 0.8rem;
  filter: drop-shadow(0 2px 3px rgba(0,0,0,0.1));
  transition: transform 0.3s ease;
}

.dominant-element:hover .dominant-emoji {
  transform: scale(1.2);
}

.day-master {
  display: flex;
  align-items: center;
  margin: 1rem 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1.2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.day-master:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.day-char-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 1.5rem;
}

.day-char {
  font-size: 3rem;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.day-emoji {
  font-size: 1.5rem;
  margin-top: 0.3rem;
  filter: drop-shadow(0 2px 3px rgba(0,0,0,0.1));
  transition: transform 0.3s ease;
}

.day-master:hover .day-char {
  transform: scale(1.1);
}

.day-master:hover .day-emoji {
  transform: scale(1.2);
}

.element-text {
  font-size: 1.1rem;
  color: #444;
  font-weight: 500;
}

.day-char.wood { color: #4CAF50; }
.day-char.fire { color: #F44336; }
.day-char.earth { color: #8b6d03; }
.day-char.metal { color: #ef9104; }
.day-char.water { color: #2196F3; }

/* Yin-Yang Balance bar */
.balance-bar {
  height: 40px;
  display: flex;
  border-radius: 20px;
  overflow: hidden;
  margin: 1.5rem 0;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  position: relative;
}

.yin-side {
  background: linear-gradient(to right, #000000, #333333);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.95rem;
  transition: width 0.8s ease;
}

.yang-side {
  background: linear-gradient(to left, #ffffff, #f5f5f5);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  font-weight: bold;
  font-size: 0.95rem;
  transition: width 0.8s ease;
}

.pinyin-annotation {
  font-size: 1rem;
  font-weight: 400;
  margin-top: 0.3rem;
  color: rgba(68, 68, 68, 0.8);
  font-style: italic;
  text-shadow: none;
  display: block;
  text-align: center;
}

@media (max-width: 768px) {
  .analysis-container {
    padding: 1.2rem;
    margin-top: 1.5rem;
  }
  
  h3 {
    font-size: 1.3rem;
    margin-bottom: 1.2rem;
  }
  
  h4 {
    font-size: 1.1rem;
  }
  
  .analysis-section {
    margin-bottom: 1.5rem;
  }
  
  .element-label {
    width: 50px;
    margin-right: 0.5rem;
  }
  
  .bar-container {
    height: 22px;
  }
  
  .day-master {
    padding: 1rem;
  }
  
  .day-char {
    font-size: 2.5rem;
    margin-right: 1rem;
  }
  
  .element-text {
    font-size: 1rem;
  }
  
  .balance-bar {
    height: 35px;
  }
  
  .pinyin-annotation {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .analysis-container {
    padding: 1rem;
    margin-top: 1rem;
    border-radius: 10px;
  }
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
  
  h4 {
    font-size: 1rem;
    margin: 0.8rem 0;
    padding-bottom: 0.3rem;
  }
  
  .analysis-section {
    margin-bottom: 1.2rem;
  }
  
  .element-distribution {
    gap: 0.7rem;
  }
  
  .element-bar {
    font-size: 0.9rem;
  }
  
  .element-label {
    width: 45px;
    font-size: 0.85rem;
  }
  
  .bar-container {
    height: 20px;
  }
  
  .count {
    font-size: 0.8rem;
    right: 5px;
  }
  
  .day-master {
    padding: 0.8rem;
  }
  
  .day-char {
    font-size: 2rem;
    margin-right: 0.8rem;
  }
  
  .element-text {
    font-size: 0.9rem;
  }
  
  .balance-bar {
    height: 30px;
    margin: 1rem 0;
  }
  
  .yin-side, .yang-side {
    font-size: 0.8rem;
  }
  
  .dominant-element {
    padding: 0.5rem 0.8rem;
    font-size: 0.9rem;
  }
  
  .pinyin-annotation {
    font-size: 0.8rem;
    margin-top: 0.2rem;
  }
}
</style> 