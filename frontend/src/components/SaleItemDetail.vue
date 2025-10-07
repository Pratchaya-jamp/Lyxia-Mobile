<template>
  <div class="font-sans text-gray-800 min-h-screen bg-gray-50">
    <!-- Header Section -->
    <section class="bg-gradient-to-br from-indigo-500 to-purple-600 text-white py-12">
      <div class="container mx-auto px-4 max-w-4xl">
        <router-link 
          :to="{ name: 'SaleItems' }" 
          class="inline-flex items-center gap-2 text-white hover:text-gray-200 font-semibold mb-4 transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to Sale Items
        </router-link>
        
        <div class="text-center">
          <h1 class="text-3xl md:text-4xl font-bold mb-2">
            📱 Product Details
          </h1>
          <p class="text-lg opacity-90">
            View complete information about this mobile device
          </p>
        </div>
      </div>
    </section>

    <!-- Loading State -->
    <div v-if="loading" class="container mx-auto px-4 py-20 max-w-4xl">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-500 mb-4"></div>
        <p class="text-xl text-gray-600">Loading product details...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container mx-auto px-4 py-20 max-w-4xl">
      <div class="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
        <div class="text-6xl mb-4">❌</div>
        <h2 class="text-2xl font-bold text-red-600 mb-2">Error</h2>
        <p class="text-red-700 mb-6">{{ error }}</p>
        <router-link 
          :to="{ name: 'SaleItems' }" 
          class="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          Back to Sale Items
        </router-link>
      </div>
    </div>

    <!-- Product Detail -->
    <div v-else-if="item" class="container mx-auto px-4 py-8 max-w-6xl">
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        
        <div class="md:flex">
          <!-- Image Section -->
          <div class="md:w-2/5 bg-gradient-to-br from-gray-50 to-gray-100 p-8">
            <div class="sticky top-8">
              <!-- Main Image -->
              <div class="bg-white rounded-2xl shadow-md p-6 mb-6">
                <div class="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden flex items-center justify-center" style="height: 400px;">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-32 h-32 text-gray-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                </div>
              </div>

              <!-- Thumbnail Grid -->
              <div class="grid grid-cols-4 gap-2">
                <div v-for="n in 4" :key="n" class="bg-white rounded-lg shadow-sm p-2 hover:shadow-md transition-shadow duration-200 cursor-pointer">
                  <div class="bg-gradient-to-br from-gray-100 to-gray-200 rounded-md h-16 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-gray-400">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0L14.25 12m-4.5 4.5 5.159-5.159a2.25 2.25 0 0 1 3.182 0L21.75 15.75m-4.5-6m-4.5 0a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Info Section -->
          <div class="md:w-3/5 p-8 md:p-12">
            <!-- Brand Badge -->
            <div class="inline-block bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              🏢 {{ item.brandName }}
            </div>

            <!-- Product Name -->
            <h2 class="text-4xl font-bold text-gray-900 mb-6">{{ item.model }}</h2>

            <!-- Price -->
            <div class="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-6 mb-8">
              <div class="text-sm text-gray-600 mb-1">Price</div>
              <div class="text-4xl font-bold text-red-500">
                ฿{{ item.price ? item.price.toLocaleString() : 'N/A' }}
              </div>
            </div>

            <!-- Specifications -->
            <div class="mb-8">
              <h3 class="text-xl font-bold text-gray-900 mb-4">📋 Specifications</h3>
              <div class="grid sm:grid-cols-2 gap-4">
                
                <div class="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200">
                  <div class="flex items-center gap-3">
                    <div class="bg-blue-100 text-blue-600 w-10 h-10 rounded-lg flex items-center justify-center text-xl">
                      💾
                    </div>
                    <div>
                      <div class="text-xs text-gray-500 font-medium">RAM</div>
                      <div class="text-lg font-bold text-gray-900">{{ item.ramGb ? item.ramGb + ' GB' : 'N/A' }}</div>
                    </div>
                  </div>
                </div>

                <div class="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200">
                  <div class="flex items-center gap-3">
                    <div class="bg-green-100 text-green-600 w-10 h-10 rounded-lg flex items-center justify-center text-xl">
                      💽
                    </div>
                    <div>
                      <div class="text-xs text-gray-500 font-medium">Storage</div>
                      <div class="text-lg font-bold text-gray-900">{{ item.storageGb ? item.storageGb + ' GB' : 'N/A' }}</div>
                    </div>
                  </div>
                </div>

                <div class="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200">
                  <div class="flex items-center gap-3">
                    <div class="bg-purple-100 text-purple-600 w-10 h-10 rounded-lg flex items-center justify-center text-xl">
                      📺
                    </div>
                    <div>
                      <div class="text-xs text-gray-500 font-medium">Screen Size</div>
                      <div class="text-lg font-bold text-gray-900">{{ item.screenSizeInch ? item.screenSizeInch + '"' : 'N/A' }}</div>
                    </div>
                  </div>
                </div>

                <div class="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200">
                  <div class="flex items-center gap-3">
                    <div class="bg-pink-100 text-pink-600 w-10 h-10 rounded-lg flex items-center justify-center text-xl">
                      🎨
                    </div>
                    <div>
                      <div class="text-xs text-gray-500 font-medium">Color</div>
                      <div class="text-lg font-bold text-gray-900">{{ item.color || 'N/A' }}</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <!-- Description -->
            <div v-if="item.description" class="mb-8">
              <h3 class="text-xl font-bold text-gray-900 mb-4">📝 Description</h3>
              <div class="bg-gray-50 rounded-xl p-4 text-gray-700 leading-relaxed">
                {{ item.description }}
              </div>
            </div>

            <!-- Stock Info -->
            <div class="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-xl p-4 mb-8">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="bg-green-500 text-white w-10 h-10 rounded-lg flex items-center justify-center text-xl">
                    📦
                  </div>
                  <div>
                    <div class="text-xs text-gray-600 font-medium">Available Stock</div>
                    <div class="text-2xl font-bold text-gray-900">{{ item.quantity || 'N/A' }} units</div>
                  </div>
                </div>
                <div v-if="item.quantity > 0" class="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  In Stock
                </div>
                <div v-else class="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Out of Stock
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4">
              <router-link 
                :to="{ name: 'EditSaleItem', params: { id: item.id } }" 
                class="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-6 py-4 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg text-center"
              >
                ✏️ Edit Product
              </router-link>
              
              <button 
                @click="handleDelete" 
                class="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold px-6 py-4 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                🗑️ Delete Product
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scale">
        <div class="text-center mb-6">
          <div class="text-6xl mb-4">⚠️</div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Confirm Delete</h3>
          <p class="text-gray-600">Are you sure you want to delete this sale item? This action cannot be undone.</p>
        </div>
        
        <div class="flex gap-4">
          <button 
            @click="showDeleteModal = false" 
            class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button 
            @click="confirmDelete" 
            class="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const item = ref(null);
const loading = ref(true);
const error = ref(null);
const showDeleteModal = ref(false);

const fetchItemDetail = async () => {
  try {
    const response = await fetch(`http://localhost:3000/v1/sale-items/${route.params.id}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('The requested sale item does not exist.');
      }
      throw new Error('Failed to fetch item details.');
    }
    item.value = await response.json();
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
};

const handleDelete = () => {
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  try {
    const response = await fetch(`http://localhost:3000/v1/sale-items/${item.value.id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      if (response.status === 404) {
          throw new Error('The requested sale item does not exist.');
      }
      throw new Error('Failed to delete sale item.');
    }

    alert('The sale item has been successfully deleted.');
    router.push({ name: 'SaleItems' });
    
  } catch (e) {
    console.error('Delete error:', e);
    alert('Error: ' + e.message);
    showDeleteModal.value = false;
  }
};

onMounted(() => {
  fetchItemDetail();
});
</script>

<style scoped>
@keyframes scale {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-scale {
  animation: scale 0.2s ease-out;
}
</style>