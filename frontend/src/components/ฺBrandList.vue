<template>
  <div class="font-sans text-gray-800 min-h-screen bg-gray-50">
    <!-- Header Section -->
    <section class="bg-gradient-to-br from-indigo-500 to-purple-600 text-white py-16">
      <div class="container mx-auto px-4 max-w-6xl">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 class="text-4xl md:text-5xl font-bold mb-2">🏢 Brand Management</h1>
            <p class="text-lg opacity-90">Manage all your mobile brands</p>
          </div>
          <button 
            @click="goToAddBrand" 
            class="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            ➕ Add Brand
          </button>
        </div>

        <!-- Stats Card -->
        <div class="mt-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 max-w-xs">
          <div class="flex items-center gap-3">
            <span class="text-2xl">📊</span>
            <div>
              <div class="text-xl font-bold">{{ brands.length }}</div>
              <div class="text-sm opacity-80">Total Brands</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Message Alert -->
    <div v-if="message" class="container mx-auto px-4 max-w-6xl pt-8">
      <div 
        class="rounded-xl p-4 mb-4 flex items-center gap-3 animate-fade-in"
        :class="messageType === 'success' 
          ? 'bg-green-50 border-2 border-green-200 text-green-800' 
          : 'bg-red-50 border-2 border-red-200 text-red-800'"
      >
        <span class="text-2xl">{{ messageType === 'success' ? '✅' : '❌' }}</span>
        <span class="font-semibold">{{ message }}</span>
      </div>
    </div>

    <!-- Content Section -->
    <div class="container mx-auto px-4 py-8 max-w-6xl">
      
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-500 mb-4"></div>
        <p class="text-xl text-gray-600">Loading brands...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="brands.length === 0" class="text-center py-20">
        <div class="text-8xl mb-6">🏢</div>
        <h2 class="text-2xl font-bold text-gray-700 mb-2">No brands found</h2>
        <p class="text-gray-500 mb-8">Start by adding your first brand</p>
        <button 
          @click="goToAddBrand" 
          class="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          ➕ Add First Brand
        </button>
      </div>

      <!-- Brand Table -->
      <div v-else class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <th class="py-4 px-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">ID</th>
                <th class="py-4 px-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Brand Name</th>
                <th class="py-4 px-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Created On</th>
                <th class="py-4 px-6 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr 
                v-for="brand in brands" 
                :key="brand.id" 
                class="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200"
              >
                <td class="py-4 px-6 text-sm font-medium text-gray-800">
                  <span class="bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold">{{ brand.id }}</span>
                </td>
                <td class="py-4 px-6">
                  <div class="flex items-center gap-2">
                    <span class="text-xl">🏢</span>
                    <span class="text-sm font-semibold text-gray-900">{{ brand.name }}</span>
                  </div>
                </td>
                <td class="py-4 px-6 text-sm text-gray-600">
                  <div class="flex items-center gap-2">
                    <span class="text-sm">📅</span>
                    <span>{{ new Date(brand.createdOn).toLocaleDateString('en-GB', { 
                      day: '2-digit', 
                      month: 'short', 
                      year: 'numeric' 
                    }) }}</span>
                  </div>
                </td>
                <td class="py-4 px-6">
                  <div class="flex justify-center gap-2">
                    <button 
                      @click="editBrand(brand.id)" 
                      class="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      @click="openDeleteModal(brand)" 
                      class="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scale">
        <div class="text-center mb-6">
          <div class="text-6xl mb-4">⚠️</div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Confirm Delete</h3>
          <p class="text-gray-600 mb-4">Are you sure you want to delete this brand?</p>
          <div class="bg-gray-100 rounded-lg p-4">
            <div class="flex items-center justify-center gap-2">
              <span class="text-xl">🏢</span>
              <span class="font-bold text-lg">{{ brandToDelete?.name }}</span>
            </div>
          </div>
        </div>
        
        <div class="flex gap-4">
          <button 
            @click="closeDeleteModal" 
            class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button 
            @click="confirmDelete" 
            class="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
            :disabled="isDeleting"
          >
            <span v-if="isDeleting">Deleting...</span>
            <span v-else>Delete</span>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const brands = ref([]);
const isLoading = ref(true);
const message = ref('');
const messageType = ref('');
const showDeleteModal = ref(false);
const brandToDelete = ref(null);
const isDeleting = ref(false);

// Function to fetch brands from the backend API
const fetchBrands = async () => {
  isLoading.value = true;
  brands.value = []; 
  
  try {
    const response = await fetch('https://lyxia-mobile.onrender.com/v1/brands');
    const data = await response.json();

    if (response.status === 200) {
      let brandList = [];

      // 1. ตรวจสอบว่า Response มีคีย์ 'data' ห่อหุ้มหรือไม่
      if (data && Array.isArray(data.data)) {
        brandList = data.data;
      // 2. ถ้าไม่มี 'data' ห่อหุ้ม ให้ถือว่า Array คือ Response โดยตรง
      } else if (Array.isArray(data)) {
        brandList = data;
      } else {
        console.error('API returned 200 but unexpected data structure:', data);
        showMessage('Failed to retrieve brand list due to unexpected data format.', 'error');
        isLoading.value = false;
        return;
      }
      
      brands.value = brandList;
    } else {
      showMessage('Failed to load brands', 'error');
    }
  } catch (error) {
    console.error('Error fetching brands:', error);
    showMessage('Network error: Failed to load brands', 'error');
  } finally {
    isLoading.value = false;
  }
};

const goToAddBrand = () => {
  router.push('/brands/add');
};

const editBrand = (id) => {
  console.log('Edit brand with ID:', id);
  router.push(`/brands/${id}/edit`);
};

const openDeleteModal = (brand) => {
  brandToDelete.value = brand;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  brandToDelete.value = null;
};

const confirmDelete = async () => {
  if (!brandToDelete.value) return;
  
  isDeleting.value = true;
  
  try {
    const response = await fetch(`https://lyxia-mobile.onrender.com/v1/brands/${brandToDelete.value.id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      showMessage(`Brand "${brandToDelete.value.name}" has been successfully deleted.`, 'success');
      await fetchBrands(); // Refresh the list
    } else {
      throw new Error('Failed to delete brand');
    }
  } catch (error) {
    console.error('Delete error:', error);
    showMessage('Error: Failed to delete brand', 'error');
  } finally {
    isDeleting.value = false;
    closeDeleteModal();
  }
};

// Helper function to show messages
const showMessage = (msg, type) => {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => {
    message.value = '';
    // Clear message from URL query after showing
    if (router.currentRoute.value.query.message) {
      router.replace({ query: null });
    }
  }, 5000);
};

onMounted(() => {
  fetchBrands();
  // Check for success message from Add Brand form
  if (route.query.message) {
    showMessage(route.query.message, route.query.type);
  }
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

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-scale {
  animation: scale 0.2s ease-out;
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>