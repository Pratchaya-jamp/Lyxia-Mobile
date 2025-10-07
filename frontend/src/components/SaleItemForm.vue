<template>
  <div class="font-sans text-gray-800 min-h-screen bg-gray-50">
    <!-- Header Section -->
    <section class="bg-gradient-to-br from-indigo-500 to-purple-600 text-white py-12">
      <div class="container mx-auto px-4 max-w-4xl">
        <div class="text-center">
          <h1 class="text-3xl md:text-4xl font-bold mb-2">
            {{ isEditMode ? '✏️ Edit Sale Item' : '➕ Add New Sale Item' }}
          </h1>
          <p class="text-lg opacity-90">
            {{ isEditMode ? 'Update your mobile device information' : 'Add a new mobile device to your inventory' }}
          </p>
        </div>
      </div>
    </section>

    <!-- Form Section -->
    <div class="container mx-auto px-4 py-8 max-w-6xl">
      <form @submit.prevent="handleSubmit" class="bg-white shadow-xl rounded-2xl overflow-hidden">
        
        <div class="md:flex">
          <!-- Image Section -->
          <div class="md:w-1/3 bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex flex-col items-center justify-center">
            <div class="w-full max-w-sm">
              <!-- Main Image -->
              <div class="bg-white rounded-2xl shadow-md p-6 mb-6">
                <div class="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl h-64 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-20 h-20 text-gray-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                </div>
                <p class="text-center text-sm text-gray-500 mt-4">Product Image Preview</p>
              </div>

              <!-- Thumbnail Grid -->
              <div class="grid grid-cols-4 gap-2">
                <div v-for="n in 4" :key="n" class="bg-white rounded-lg shadow-sm p-2">
                  <div class="bg-gradient-to-br from-gray-100 to-gray-200 rounded-md h-12 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-gray-400">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0L14.25 12m-4.5 4.5 5.159-5.159a2.25 2.25 0 0 1 3.182 0L21.75 15.75m-4.5-6m-4.5 0a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Fields Section -->
          <div class="md:w-2/3 p-8">
            <div class="grid md:grid-cols-2 gap-6">
              
              <!-- Brand -->
              <div class="md:col-span-2">
                <label class="block text-gray-700 text-sm font-semibold mb-3" for="brand">
                  🏢 Brand <span class="text-red-500">*</span>
                </label>
                <select 
                  id="brand" 
                  v-model="form.brandId" 
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white"
                  required
                >
                  <option value="">Select a brand</option>
                  <option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
                </select>
              </div>

              <!-- Model -->
              <div class="md:col-span-2">
                <label class="block text-gray-700 text-sm font-semibold mb-3" for="model">
                  📱 Model <span class="text-red-500">*</span>
                </label>
                <input 
                  id="model" 
                  type="text" 
                  v-model.trim="form.model" 
                  @blur="trimField('model')" 
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="Enter model name"
                  required
                >
              </div>

              <!-- Price -->
              <div>
                <label class="block text-gray-700 text-sm font-semibold mb-3" for="price">
                  💰 Price (฿) <span class="text-red-500">*</span>
                </label>
                <input 
                  id="price" 
                  type="number" 
                  v-model.number="form.price" 
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="0.00"
                  required
                >
              </div>

              <!-- Quantity -->
              <div>
                <label class="block text-gray-700 text-sm font-semibold mb-3" for="quantity">
                  📦 Quantity <span class="text-red-500">*</span>
                </label>
                <input 
                  id="quantity" 
                  type="number" 
                  v-model.number="form.quantity" 
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="1"
                  required
                >
              </div>

              <!-- RAM -->
              <div>
                <label class="block text-gray-700 text-sm font-semibold mb-3" for="ram">
                  💾 RAM (GB)
                </label>
                <input 
                  id="ram" 
                  type="number" 
                  v-model.number="form.ramGb" 
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="8"
                >
              </div>

              <!-- Storage -->
              <div>
                <label class="block text-gray-700 text-sm font-semibold mb-3" for="storage">
                  💽 Storage (GB)
                </label>
                <input 
                  id="storage" 
                  type="number" 
                  v-model.number="form.storageGb" 
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="128"
                >
              </div>

              <!-- Screen Size -->
              <div>
                <label class="block text-gray-700 text-sm font-semibold mb-3" for="screenSize">
                  📺 Screen Size (inch)
                </label>
                <input 
                  id="screenSize" 
                  type="number" 
                  step="0.1" 
                  v-model.number="form.screenSizeInch" 
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="6.1"
                >
              </div>

              <!-- Color -->
              <div>
                <label class="block text-gray-700 text-sm font-semibold mb-3" for="color">
                  🎨 Color
                </label>
                <input 
                  id="color" 
                  type="text" 
                  v-model.trim="form.color" 
                  @blur="trimField('color')" 
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="Space Gray"
                >
              </div>

              <!-- Description -->
              <div class="md:col-span-2">
                <label class="block text-gray-700 text-sm font-semibold mb-3" for="description">
                  📝 Description
                </label>
                <textarea 
                  id="description" 
                  v-model.trim="form.description" 
                  @blur="trimField('description')" 
                  rows="4"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none"
                  placeholder="Enter product description..."
                ></textarea>
              </div>

            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="bg-gray-50 px-8 py-6 border-t border-gray-200">
          <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
            
            <!-- Form Status -->
            <div class="text-sm text-gray-600">
              <span v-if="!isFormValid" class="text-red-500">⚠️ Please fill in all required fields</span>
              <span v-else-if="isEditMode && !isFormModified" class="text-amber-500">📝 No changes made</span>
              <span v-else class="text-green-500">✅ Ready to save</span>
            </div>

            <!-- Buttons -->
            <div class="flex gap-4">
              <button 
                @click="handleCancel" 
                type="button" 
                class="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              
              <button 
                type="submit" 
                :disabled="!isFormValid || isSubmitting"
                class="px-8 py-3 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                :class="isFormValid && !isSubmitting 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white focus:ring-indigo-500 hover:-translate-y-0.5 hover:shadow-lg' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
              >
                <span v-if="isSubmitting" class="flex items-center gap-2">
                  <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
                <span v-else>
                  {{ isEditMode ? '💾 Update Item' : '➕ Add Item' }}
                </span>
              </button>
            </div>
          </div>
        </div>

      </form>
    </div>
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