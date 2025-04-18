<script setup lang="ts">
defineProps<{ msg: string }>()
const elementEmojis: Record<string, string> = {
    'wood': '🌳',
    'fire': '🔥',
    'earth': 'ᨒ',
    'metal': '🔱',
    'water': '💧'
  };

</script>

<template>
  <div class="title-container">
    <h1>{{ msg }}</h1>
    <p class="subtitle">
      <div>The nature is made of five basic elements:</div>
      <div>metal {{ elementEmojis.metal }}, wood {{ elementEmojis.wood }}, water {{ elementEmojis.water }}, fire {{ elementEmojis.fire }}, and earth {{ elementEmojis.earth }}.</div>
      <div>Which elements are you made of? Which element represents the real you?</div>
      <div>Discover the ancient wisdom of Chinese metaphysics</div>
    </p>
  </div>

  <!-- <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a
      href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
      target="_blank"
      >Vue Docs Scaling up Guide</a
    >.
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p> -->
</template>

<style scoped>
.title-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 16px;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.title-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

h1 {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #fff, #ccc);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0;
  letter-spacing: 1px;
  font-weight: bold;
}

@media (max-width: 768px) {
  .title-container {
    max-width: 95%;
    padding: 1.5rem;
    margin: 1rem auto;
  }
  
  h1 {
    font-size: 2.2rem;
  }
  
  .subtitle {
    font-size: 0.95rem;
    letter-spacing: 0.5px;
  }
}

@media (max-width: 480px) {
  .title-container {
    max-width: 100%;
    padding: 1.2rem;
    border-radius: 15px;
  }
  
  h1 {
    font-size: 1.8rem;
  }
  
  .subtitle {
    font-size: 0.9rem;
    letter-spacing: 0;
  }
}

.read-the-docs {
  color: #888;
}
</style>
