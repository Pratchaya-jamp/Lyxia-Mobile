<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">{{ isEditMode ? 'Edit Sale Item' : 'Add New Sale Item' }}</h1>
    <form @submit.prevent="handleSubmit" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      
      <div class="md:flex md:space-x-8">
        
        <div class="md:w-1/3 flex flex-col items-center justify-center p-4">
          <img 
            class="w-full h-auto object-contain max-h-96" 
            src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" 
            alt="Product Placeholder" 
          />
          <div class="mt-4 flex space-x-2">
            <img class="w-16 h-16 object-cover rounded-md" src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" alt="Thumbnail" />
            <img class="w-16 h-16 object-cover rounded-md" src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" alt="Thumbnail" />
            <img class="w-16 h-16 object-cover rounded-md" src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" alt="Thumbnail" />
            <img class="w-16 h-16 object-cover rounded-md" src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" alt="Thumbnail" />
          </div>
        </div>

        <div class="md:w-2/3">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="brand">Brand</label>
            <select id="brand" v-model="form.brandId" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="model">Model</label>
            <input id="model" type="text" v-model.trim="form.model" @blur="trimField('model')" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="price">Price</label>
            <input id="price" type="number" v-model.number="form.price" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="description">Description</label>
            <textarea id="description" v-model.trim="form.description" @blur="trimField('description')" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="ram">RAM (GB)</label>
            <input id="ram" type="number" v-model.number="form.ramGb" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="screenSize">Screen Size (inch)</label>
            <input id="screenSize" type="number" step="0.1" v-model.number="form.screenSizeInch" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="storage">Storage (GB)</label>
            <input id="storage" type="number" v-model.number="form.storageGb" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="color">Color</label>
            <input id="color" type="text" v-model.trim="form.color" @blur="trimField('color')" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="quantity">Quantity</label>
            <input id="quantity" type="number" v-model.number="form.quantity" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between mt-6">
        <button type="submit" :disabled="!isFormValid || isSubmitting" :class="{'bg-blue-500 hover:bg-blue-700': isFormValid, 'bg-gray-400 cursor-not-allowed': !isFormValid}" class="text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          <span v-if="isSubmitting">Saving...</span>
          <span v-else>Save</span>
        </button>
        <button @click="handleCancel" type="button" class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const isEditMode = computed(() => !!route.params.id);
const brands = ref([]);
const isSubmitting = ref(false);

const initialFormState = {
    brandId: null,
    model: '',
    price: null,
    description: '',
    ramGb: null,
    screenSizeInch: null,
    storageGb: null,
    color: '',
    quantity: 1,
};

const form = ref({ ...initialFormState });
const originalForm = ref({});

const isFormModified = computed(() => {
    return JSON.stringify(form.value) !== JSON.stringify(originalForm.value);
});

const isFormValid = computed(() => {
    const isRequiredFilled = form.value.brandId && form.value.model && form.value.price && form.value.quantity >= 0;
    return isRequiredFilled && (isEditMode.value ? isFormModified.value : true);
});

const fetchBrands = async () => {
    try {
        const response = await fetch('http://localhost:3000/v1/brands');
        brands.value = await response.json();
        if (!isEditMode.value && brands.value.length > 0) {
            form.value.brandId = brands.value[0].id;
        }
    } catch (error) {
        console.error('Error fetching brands:', error);
    }
};

const fetchItemDetail = async (id) => {
    try {
        const response = await fetch(`http://localhost:3000/v1/sale-items/${id}`);
        if (!response.ok) throw new Error('Failed to fetch item details.');
        const item = await response.json();
        
        form.value = {
            brandId: brands.value.find(b => b.name === item.brandName)?.id,
            model: item.model,
            price: item.price,
            description: item.description || '',
            ramGb: item.ramGb,
            screenSizeInch: item.screenSizeInch,
            storageGb: item.storageGb,
            color: item.color || '',
            quantity: item.quantity,
        };
        originalForm.value = { ...form.value };

    } catch (error) {
        console.error('Error fetching item details:', error);
    }
};

const handleSubmit = async () => {
    isSubmitting.value = true;
    const method = isEditMode.value ? 'PUT' : 'POST';
    const url = isEditMode.value ? `http://localhost:3000/v1/sale-items/${route.params.id}` : 'http://localhost:3000/v1/sale-items';

    const payload = Object.fromEntries(
        Object.entries(form.value).filter(([_, v]) => v !== null)
    );

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`Failed to ${isEditMode.value ? 'update' : 'add'} sale item.`);

        const message = `The sale item has been successfully ${isEditMode.value ? 'updated' : 'added'}.`;
        alert(message);
        router.push({ name: 'SaleItems' });

    } catch (error) {
        console.error('Submission error:', error);
        alert(`Error: ${error.message}`);
    } finally {
        isSubmitting.value = false;
    }
};

const handleCancel = () => {
    router.back();
};

const trimField = (field) => {
  if (typeof form.value[field] === 'string') {
    form.value[field] = form.value[field].trim();
  }
};

onMounted(async () => {
    await fetchBrands();
    if (isEditMode.value) {
        await fetchItemDetail(route.params.id);
    }
});
</script>