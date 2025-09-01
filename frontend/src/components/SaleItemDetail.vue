<template>
  <div class="container mx-auto px-4 py-12 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
    <div v-if="loading" class="text-center text-lg font-semibold">
      Loading...
    </div>

    <div v-else-if="error" class="text-center text-red-500 text-lg font-semibold">
      {{ error }}
    </div>

    

    <div v-else-if="item" class="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden md:flex md:max-w-4xl mx-auto animated-card">
        <div class="md:w-1/2 p-4 flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-700">
        <img class="w-full h-auto object-contain max-h-96" src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" alt="Product Image" />
        <div class="mt-4 flex space-x-2">
          <img class="w-16 h-16 object-cover rounded-md" src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" alt="Thumbnail" />
          <img class="w-16 h-16 object-cover rounded-md" src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" alt="Thumbnail" />
          <img class="w-16 h-16 object-cover rounded-md" src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" alt="Thumbnail" />
          <img class="w-16 h-16 object-cover rounded-md" src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" alt="Thumbnail" />
        </div>
    </div>
      <div class="md:w-1/2 p-8 md:p-12">
        <router-link :to="{ name: 'SaleItems' }" class="text-blue-500 hover:text-blue-700 font-bold mb-4 inline-block">
          <i class="fas fa-home"></i> Home
        </router-link>

        <h2 class="text-3xl font-extrabold mb-4">{{ item.model }}</h2>
        
        <div class="space-y-4 text-left">
          <p class="text-lg"><strong>Brand:</strong> {{ item.brandName }}</p>
          <p class="text-lg"><strong>Price:</strong> {{ item.price ? item.price.toLocaleString() : 'N/A' }} บาท</p>
          <p class="text-lg"><strong>Description:</strong> {{ item.description || 'N/A' }}</p>
          <p class="text-lg"><strong>RAM:</strong> {{ item.ramGb ? item.ramGb + ' GB' : 'N/A' }}</p>
          <p class="text-lg"><strong>Screen Size:</strong> {{ item.screenSizeInch ? item.screenSizeInch + '"' : 'N/A' }}</p>
          <p class="text-lg"><strong>Storage:</strong> {{ item.storageGb ? item.storageGb + ' GB' : 'N/A' }}</p>
          <p class="text-lg"><strong>Color:</strong> {{ item.color || 'N/A' }}</p>
          <p class="text-lg"><strong>Quantity:</strong> {{ item.quantity || 'N/A' }}</p>
        </div>

        <div class="mt-8 flex space-x-4">
          <router-link :to="{ name: 'EditSaleItem', params: { id: item.id } }" class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
            Edit
          </router-link>
          <button @click="handleDelete" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
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

const goBack = () => {
  router.back();
};

const handleDelete = async () => {
  if (!confirm('Do you want to delete this sale item?')) {
    return;
  }
  
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
  }
};

onMounted(() => {
  fetchItemDetail();
});
</script>