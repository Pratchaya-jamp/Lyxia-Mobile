<template>
  <div class="font-sans text-gray-800 min-h-screen bg-gray-50">
    <!-- Header Section -->
    <section class="bg-gradient-to-br from-indigo-500 to-purple-600 text-white py-16">
      <div class="container mx-auto px-4 max-w-6xl">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-4xl md:text-5xl font-bold mb-2">📱 Lyxia Mobile</h1>
            <p class="text-lg opacity-90">Sale Items</p>
          </div>
          <router-link 
            :to="{ name: 'AddSaleItem' }" 
            class="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            ➕ Add Sale Item
          </router-link>
        </div>

        <!-- View Toggle & Stats -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <!-- View Toggle -->
          <div class="flex gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-1">
            <router-link 
              :to="{ name: 'SaleItems' }" 
              class="px-6 py-2 rounded-md font-semibold transition-all duration-300"
              :class="!isListView ? 'bg-white text-indigo-600 shadow-md' : 'text-white hover:bg-white/20'"
            >
              🔳 Grid View
            </router-link>
            <router-link 
              :to="{ name: 'SaleItemsList' }" 
              class="px-6 py-2 rounded-md font-semibold transition-all duration-300"
              :class="isListView ? 'bg-white text-indigo-600 shadow-md' : 'text-white hover:bg-white/20'"
            >
              📋 List View
            </router-link>
          </div>

          <!-- Stats Card -->
          <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
            <div class="flex items-center gap-3">
              <span class="text-2xl">📊</span>
              <div>
                <div class="text-xl font-bold">{{ sortedSaleItems.length }}</div>
                <div class="text-sm opacity-80">Items Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <div class="container mx-auto px-4 py-8">
      <!-- Empty State -->
      <div v-if="sortedSaleItems.length === 0" class="text-center py-20">
        <div class="text-8xl mb-6">📱</div>
        <h2 class="text-2xl font-bold text-gray-700 mb-2">No sale items available</h2>
        <p class="text-gray-500 mb-8">Start by adding your first mobile device</p>
        <router-link 
          :to="{ name: 'AddSaleItem' }" 
          class="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          ➕ Add First Item
        </router-link>
      </div>

      <!-- Grid View -->
      <div v-else-if="!isListView" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <div 
          v-for="item in sortedSaleItems" 
          :key="item.id" 
          class="bg-white rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden group"
        >
          <!-- Image Placeholder -->
          <div class="bg-gradient-to-br from-gray-100 to-gray-200 h-48 w-full flex items-center justify-center text-gray-400 group-hover:from-indigo-50 group-hover:to-purple-50 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
            </svg>
          </div>
          
          <!-- Card Content -->
          <div class="p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-1">{{ item.brandName }}</h2>
            <router-link 
              :to="{ name: 'SaleItemDetail', params: { id: item.id } }" 
              class="text-indigo-600 hover:text-purple-600 font-semibold hover:underline transition-colors duration-200 block mb-3"
            >
              {{ item.model }}
            </router-link>
            
            <!-- Price -->
            <p class="text-2xl font-bold text-red-500 mb-4">฿{{ item.price.toLocaleString() }}</p>
            
            <!-- Specs -->
            <div class="space-y-2 text-sm text-gray-600">
              <div v-if="item.ramGb" class="flex items-center gap-2">
                <span class="text-blue-500">💾</span>
                <span>RAM: {{ item.ramGb }} GB</span>
              </div>
              <div v-if="item.storageGb" class="flex items-center gap-2">
                <span class="text-green-500">💽</span>
                <span>Storage: {{ item.storageGb }} GB</span>
              </div>
              <div v-if="item.color" class="flex items-center gap-2">
                <span class="text-purple-500">🎨</span>
                <span>Color: {{ item.color }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-else class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <th class="py-4 px-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">ID</th>
                <th class="py-4 px-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Brand</th>
                <th class="py-4 px-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Model</th>
                <th class="py-4 px-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">RAM</th>
                <th class="py-4 px-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Storage</th>
                <th class="py-4 px-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Color</th>
                <th class="py-4 px-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Price</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr 
                v-for="item in sortedSaleItems" 
                :key="item.id" 
                class="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200"
              >
                <td class="py-4 px-6 text-sm font-medium text-gray-800">
                  <span class="bg-gray-100 px-2 py-1 rounded text-xs">{{ item.id }}</span>
                </td>
                <td class="py-4 px-6 text-sm font-semibold text-gray-800">{{ item.brandName }}</td>
                <td class="py-4 px-6 text-sm">
                  <router-link 
                    :to="{ name: 'SaleItemDetail', params: { id: item.id } }"
                    class="text-indigo-600 hover:text-purple-600 font-semibold hover:underline transition-colors duration-200"
                  >
                    {{ item.model }}
                  </router-link>
                </td>
                <td class="py-4 px-6 text-sm text-gray-800">
                  <span v-if="item.ramGb" class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    {{ item.ramGb }} GB
                  </span>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="py-4 px-6 text-sm text-gray-800">
                  <span v-if="item.storageGb" class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    {{ item.storageGb }} GB
                  </span>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="py-4 px-6 text-sm text-gray-800">
                  <span v-if="item.color" class="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                    {{ item.color }}
                  </span>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="py-4 px-6 text-sm font-bold text-red-500">฿{{ item.price.toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Scroll to Top Button -->
    <button 
      @click="scrollToTop"
      class="fixed bottom-8 right-8 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      v-show="showScrollTop"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const saleItems = ref([]);
const showScrollTop = ref(false);

// A computed property to determine if the current route is the list view
const isListView = computed(() => route.path.includes('/list'));

// A computed property to sort items by createdOn in ascending order
const sortedSaleItems = computed(() => {
    if (!saleItems.value) return [];
    return [...saleItems.value].sort((a, b) => {
        return new Date(a.createdOn) - new Date(b.createdOn);
    });
});

const fetchSaleItems = async () => {
  try {
    const response = await fetch('http://localhost:3000/v1/sale-items');
    if (!response.ok) {
      throw new Error('Failed to fetch sale items');
    }
    saleItems.value = await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 300;
};

onMounted(() => {
  fetchSaleItems();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>