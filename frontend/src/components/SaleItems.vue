<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Lyxia Mobile - Sale Items</h1>
      <router-link :to="{ name: 'AddSaleItem' }" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add Sale Item
      </router-link>
    </div>
    <h1 class="text-3xl font-bold text-center mb-8">Lyxia Mobile - Sale Items</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <div v-for="item in saleItems" :key="item.id" class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="bg-gray-200 h-48 w-full flex items-center justify-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16">
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0L14.25 12m-4.5 4.5 5.159-5.159a2.25 2.25 0 0 1 3.182 0L21.75 15.75m-4.5-6m-4.5 0a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
            </svg>
        </div>
        <div class="p-4">
          <h2 class="text-xl font-semibold text-gray-800">{{ item.brandName }}</h2>
          <router-link :to="{ name: 'SaleItemDetail', params: { id: item.id } }" class="text-blue-600 font-medium mt-2 hover:underline cursor-pointer">
            {{ item.model }}
          </router-link>
          <p class="text-lg font-bold text-gray-900 mt-2">฿{{ item.price.toLocaleString() }}</p>
          <div class="mt-4 text-sm text-gray-600">
            <p v-if="item.ramGb">RAM: {{ item.ramGb }} GB</p>
            <p v-if="item.storageGb">Storage: {{ item.storageGb }} GB</p>
            <p v-if="item.color">Color: {{ item.color }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const saleItems = ref([]);

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

onMounted(() => {
  fetchSaleItems();
});
</script>