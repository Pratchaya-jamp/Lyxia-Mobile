<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const showTransitionOverlay = ref(false);

const goToSaleItems = () => {
  showTransitionOverlay.value = true;
  setTimeout(() => {
    router.push('/sale-items');
  }, 500); // Match this duration with the CSS transition duration
};
</script>

<template>
  <div class="relative h-screen w-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
    <div class="absolute inset-0 z-0 overflow-hidden">
      <div class="circle-animation delay-1"></div>
      <div class="circle-animation delay-2"></div>
      <div class="circle-animation delay-3"></div>
    </div>

    <div class="relative z-10 text-center p-8 bg-black bg-opacity-40 rounded-xl shadow-2xl backdrop-blur-sm transform transition-all duration-1000 ease-out popup-card">
      <h1 class="text-5xl md:text-7xl font-extrabold mb-4 animate-fade-in-up">
        Welcome to Lyxia Mobile
      </h1>
      <p class="text-lg md:text-2xl mb-8 animate-fade-in-up delay-300">
        Discover the latest in mobile technology.
      </p>
      <button
        @click="goToSaleItems"
        class="px-8 py-3 bg-gradient-to-r from-blue-500 to-teal-400 text-white font-bold text-xl rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-fade-in-up delay-600"
      >
        Explore Devices
      </button>
    </div>

    <div v-if="showTransitionOverlay" class="transition-overlay"></div>
  </div>
</template>

<style scoped>
/* Keyframe Animations */
@keyframes fadeInFromBottom {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes rotateAndScale {
  0% {
    transform: scale(0.5) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.1) rotate(180deg);
    opacity: 0.8;
  }
  100% {
    transform: scale(1) rotate(360deg);
    opacity: 0;
  }
}

/* Apply animations using Tailwind's arbitrary values or utility classes */
.animate-fade-in-up {
  animation: fadeInFromBottom 0.8s ease-out forwards;
  opacity: 0; /* Ensure it starts hidden */
}
.animate-fade-in-up.delay-300 {
  animation-delay: 0.3s;
}
.animate-fade-in-up.delay-600 {
  animation-delay: 0.6s;
}

.popup-card {
  animation: fadeIn 1s ease-out;
}

/* Circle Background Animation */
.circle-animation {
  position: absolute;
  background: radial-gradient(circle, rgba(139,92,246,0.6) 0%, rgba(59,130,246,0) 70%); /* Tailwind purple-500, blue-500 */
  border-radius: 50%;
  animation: rotateAndScale 15s infinite ease-in-out;
  width: 300px;
  height: 300px;
  opacity: 0;
}
.circle-animation.delay-1 {
  top: 10%; left: 15%;
  animation-delay: 0s;
  width: 400px; height: 400px;
  animation-duration: 20s;
}
.circle-animation.delay-2 {
  bottom: 20%; right: 10%;
  animation-delay: 5s;
  width: 350px; height: 350px;
  animation-duration: 18s;
}
.circle-animation.delay-3 {
  top: 30%; right: 30%;
  animation-delay: 10s;
  width: 250px; height: 250px;
  animation-duration: 22s;
}

/* Smooth Transition Overlay */
.transition-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  opacity: 0;
  animation: fadeOutToBlack 0.5s forwards;
  z-index: 9999;
}

@keyframes fadeOutToBlack {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>