<template>
  <header class="backdrop-blur-md bg-white/70 dark:bg-gray-900/70 shadow-lg sticky top-0 z-50 border-b border-white/20">
    <nav class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo / Brand -->
        <router-link 
          to="/" 
          class="flex items-center gap-3 text-gray-800 dark:text-white hover:opacity-80 transition-opacity duration-200"
        >
          <div class="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-md">
            <span class="text-2xl">📱</span>
          </div>
          <div>
            <div class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Lyxia Mobile</div>
            <div class="text-xs text-gray-600 dark:text-gray-400">Your Mobile Store</div>
          </div>
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-2">
          <router-link 
            to="/" 
            class="px-4 py-2 rounded-lg font-semibold transition-all duration-200"
            :class="isActive('/') 
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
          >
            🏠 Home
          </router-link>
          
          <router-link 
            to="/sale-items" 
            class="px-4 py-2 rounded-lg font-semibold transition-all duration-200"
            :class="isActive('/sale-items') 
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
          >
            🛍️ Sale Items
          </router-link>
          
          <!-- <router-link 
            to="/brands" 
            class="px-4 py-2 rounded-lg font-semibold transition-all duration-200"
            :class="isActive('/brands') 
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
          >
            🏢 Brands
          </router-link> -->

          <!-- Add Button -->
          <!-- <router-link 
            :to="{ name: 'AddSaleItem' }" 
            class="ml-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          >
            ➕ Add Item
          </router-link> -->
        </div>

        <!-- Mobile Menu Button -->
        <button 
          @click="toggleMobileMenu" 
          class="md:hidden text-gray-700 dark:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
        >
          <svg v-if="!isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <transition name="slide-fade">
        <div v-if="isMobileMenuOpen" class="md:hidden mt-4 pb-2">
          <div class="flex flex-col gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl p-3 border border-white/30 shadow-xl">
            <router-link 
              to="/" 
              @click="closeMobileMenu"
              class="px-4 py-3 rounded-lg font-semibold transition-all duration-200"
              :class="isActive('/') 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
            >
              🏠 Home
            </router-link>
            
            <router-link 
              to="/sale-items" 
              @click="closeMobileMenu"
              class="px-4 py-3 rounded-lg font-semibold transition-all duration-200"
              :class="isActive('/sale-items') 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
            >
              🛍️ Sale Items
            </router-link>
            
            <!-- <router-link 
              to="/brands" 
              @click="closeMobileMenu"
              class="px-4 py-3 rounded-lg font-semibold transition-all duration-200"
              :class="isActive('/brands') 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
            >
              🏢 Brands
            </router-link>

            <div class="border-t border-gray-300 dark:border-gray-600 my-2"></div>

            <router-link 
              :to="{ name: 'AddSaleItem' }" 
              @click="closeMobileMenu"
              class="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold px-4 py-3 rounded-lg transition-all duration-200 text-center shadow-md"
            >
              ➕ Add New Item
            </router-link> -->
          </div>
        </div>
      </transition>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isMobileMenuOpen = ref(false);

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(path);
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};
</script>

<style scoped>
/* Slide fade transition for mobile menu */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>