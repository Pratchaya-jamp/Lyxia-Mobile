<template>
  <div class="container">
    <div class="nav-link">
      <router-link to="/brands">Brand List</router-link> | 
      <router-link to="/sale-items">Sale Item List</router-link>
    </div>

    <h2>{{ isEditMode ? 'Edit Brand' : 'Add Brand' }}</h2>

    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>
    
    <div v-if="isLoading" class="loading">
      {{ isEditMode ? 'Loading brand details...' : 'Initializing form...' }}
    </div>

    <form v-else @submit.prevent="saveBrand">
      <div class="form-group">
        <label for="name">Brand Name <span class="required">*</span></label>
        <input type="text" id="name" v-model="formData.name" required />
      </div>

      <div class="form-group">
        <label for="websiteUrl">Website URL</label>
        <input type="text" id="websiteUrl" v-model="formData.websiteUrl" />
      </div>

      <div class="form-group checkbox-group">
        <input type="checkbox" id="isActive" v-model="formData.isActive" />
        <label for="isActive">Is Active</label>
      </div>

      <div class="form-group">
        <label for="countryOfOrigin">Country of Origin</label>
        <input type="text" id="countryOfOrigin" v-model="formData.countryOfOrigin" />
      </div>

      <div class="button-group">
        <button type="button" @click="cancel">Cancel</button>
        <button 
          type="submit" 
          :disabled="isEditMode && !isDataChanged"
        >
          {{ isEditMode ? 'Update' : 'Save' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// --- State Variables ---
const brandId = route.params.id;
const isEditMode = computed(() => !!brandId);
const isLoading = ref(false);

const initialFormData = {
  name: '',
  websiteUrl: '',
  isActive: true, 
  countryOfOrigin: '',
  createdOn: null,
  updatedOn: null,
};

const formData = ref({ ...initialFormData });
const initialData = ref(null); // เก็บข้อมูลเดิมจาก API
const message = ref('');
const messageType = ref('');

// --- Helper Functions ---

/**
 * Normalizes field value for comparison (trims strings, converts empty/null/undefined to null).
 */
const normalizeValue = (value) => {
    // Return boolean directly
    if (value === true || value === false) return value; 
    
    // Handle null, undefined, and empty string after trimming
    if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
      return null;
    }
    
    // Return trimmed string
    return String(value).trim();
};

/**
 * Computed Property: ตรวจสอบว่าข้อมูลในฟอร์มมีการเปลี่ยนแปลงจากค่าเริ่มต้นหรือไม่
 */
const isDataChanged = computed(() => {
  if (!isEditMode.value || !initialData.value) return false;

  const current = formData.value;
  const initial = initialData.value;
  
  // เปรียบเทียบทีละ field หลัง Normalize (Trim)
  if (normalizeValue(current.name) !== normalizeValue(initial.name)) return true;
  if (normalizeValue(current.websiteUrl) !== normalizeValue(initial.websiteUrl)) return true;
  if (current.isActive !== initial.isActive) return true; // Boolean comparison
  if (normalizeValue(current.countryOfOrigin) !== normalizeValue(initial.countryOfOrigin)) return true;

  return false;
});


// --- Methods ---

// 1. Fetch data for Edit Mode
const fetchBrandDetails = async () => {
  isLoading.value = true;
  initialData.value = null; 
  try {
    const response = await fetch(`http://localhost:3000/v1/brands/${brandId}`);
    const data = await response.json();

    if (response.status === 200 && data.data) {
      const brand = data.data;
      
      // 💡 การแก้ไข: แปลงค่า isActive (ซึ่งอาจเป็น 1 หรือ 0) ให้เป็น Boolean แท้ๆ
      const isActiveBoolean = brand.isActive === 1 || brand.isActive === true;
      
      // 1. นำข้อมูลมาใส่ใน formData 
      formData.value.name = brand.name;
      formData.value.websiteUrl = brand.websiteUrl || ''; 
      formData.value.isActive = isActiveBoolean; // <--- ใช้ค่า Boolean ที่แปลงแล้ว
      formData.value.countryOfOrigin = brand.countryOfOrigin || '';
      formData.value.createdOn = brand.createdOn;
      formData.value.updatedOn = brand.updatedOn;
      
      // 2. เก็บข้อมูลเริ่มต้นไว้ใน initialData (ต้องเก็บเป็น Boolean เช่นกัน)
      initialData.value = { 
        name: brand.name,
        websiteUrl: brand.websiteUrl, 
        isActive: isActiveBoolean, // <--- ใช้ค่า Boolean ที่แปลงแล้ว
        countryOfOrigin: brand.countryOfOrigin, 
      };
      
    } else {
      showMessage('Brand not found or failed to load details.', 'error');
    }
  } catch (error) {
    console.error('Fetch Error:', error);
    showMessage('Failed to connect to the server.', 'error');
  } finally {
    isLoading.value = false;
  }
};

/**
 * ฟังก์ชันสำหรับสร้าง Object ที่มีเฉพาะข้อมูลที่เปลี่ยนแปลงและถูก Trim
 */
const getChangedDataAndTrim = () => {
    const current = formData.value;
    const initial = initialData.value;
    const changed = {};

    // Name (Required field)
    const currentName = current.name.trim();
    if (normalizeValue(currentName) !== normalizeValue(initial.name)) {
        changed.name = currentName;
    }

    // WebsiteUrl
    const currentWebsiteUrl = current.websiteUrl ? current.websiteUrl.trim() : null;
    if (normalizeValue(currentWebsiteUrl) !== normalizeValue(initial.websiteUrl)) {
        changed.websiteUrl = currentWebsiteUrl;
    }

    // IsActive
    if (current.isActive !== initial.isActive) {
        changed.isActive = current.isActive;
    }

    // CountryOfOrigin
    const currentCountryOfOrigin = current.countryOfOrigin ? current.countryOfOrigin.trim() : null;
    if (normalizeValue(currentCountryOfOrigin) !== normalizeValue(initial.countryOfOrigin)) {
        changed.countryOfOrigin = currentCountryOfOrigin;
    }
    
    return changed;
}

// 2. Handle Save/Update logic
const saveBrand = async () => {
  message.value = ''; 

  // 1. Client-side validation for required field
  if (formData.value.name.trim() === '') {
    showMessage('Brand Name is required.', 'error');
    return;
  }
  
  let url = `http://localhost:3000/v1/brands`;
  let method = 'POST';
  let successMessage = 'The brand has been added.';
  let dataToSend = null;

  if (isEditMode.value) {
    // 2. โหมด Edit: ตรวจสอบการเปลี่ยนแปลงอีกครั้ง (เผื่อกรณีปุ่มถูก enable จากภายนอก)
    if (!isDataChanged.value) {
      showMessage('No changes detected. Update button is currently disabled.', 'info');
      return;
    }
    
    url = `${url}/${brandId}`;
    method = 'PUT';
    successMessage = 'The brand has been updated.';
    
    // ส่งเฉพาะข้อมูลที่มีการเปลี่ยนแปลงและถูก trim แล้ว
    dataToSend = getChangedDataAndTrim(); 
    
    // ตรวจสอบชื่อแบรนด์ที่ถูก trim แล้ว ถ้ามีการเปลี่ยนชื่อแล้วกลายเป็นช่องว่าง ต้องหยุด
    if (dataToSend.name === '') {
        showMessage('Brand Name cannot be empty.', 'error');
        return;
    }

  } else {
    // 3. โหมด Add: ส่งข้อมูลทั้งหมดที่ถูก trim
    dataToSend = {
        name: formData.value.name.trim(),
        websiteUrl: formData.value.websiteUrl ? formData.value.websiteUrl.trim() : null,
        isActive: formData.value.isActive,
        countryOfOrigin: formData.value.countryOfOrigin ? formData.value.countryOfOrigin.trim() : null,
    };
  }

  try {
    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
    });

    if (response.status === 201 || response.status === 200) {
      // On success, FE redirects and shows message
      router.push({ 
        path: '/brands', 
        query: { message: successMessage, type: 'success' }
      });
    } else if (response.status === 400 || response.status === 404 || response.status === 500) {
      const errorData = await response.json(); 
      console.error('API Error:', errorData);
      showMessage(errorData.message || `Operation failed. (Status ${response.status})`, 'error');
      
      // If updating fails (e.g., duplicated name), re-fetch data to refresh metadata
      if (isEditMode.value) {
          fetchBrandDetails();
      }
    } else {
      showMessage(`Operation failed. (Status ${response.status})`, 'error');
    }
  } catch (error) {
    console.error('Network Error:', error);
    showMessage('Failed to connect to the server. Please try again later.', 'error');
  }
};

const cancel = () => {
  // Navigate back to the Brand List page
  router.push('/brands');
};

const showMessage = (msg, type) => {
  message.value = msg;
  messageType.value = type;
};

// --- Lifecycle Hook ---
onMounted(() => {
  if (isEditMode.value) {
    fetchBrandDetails();
  }
});
</script>

<style scoped>
/* Scoped styles remain the same as previous form components for consistency */
.container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.nav-link {
  text-align: right;
  margin-bottom: 20px;
}
h2 {
  text-align: center;
  color: #333;
}
.message {
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  text-align: center;
  font-weight: bold;
}
.success {
  background-color: #d4edda;
  color: #155724;
}
.error {
  background-color: #f8d7da;
  color: #721c24;
}
.info {
  background-color: #f1f1f1;
  color: #555;
}
.form-group {
  margin-bottom: 15px;
}
.form-group p {
    margin: 5px 0;
    font-size: 0.9em;
    color: #666;
}
label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}
input[type="text"] {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.checkbox-group {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}
.checkbox-group input {
  margin-right: 8px;
}
.required {
  color: red;
}
.button-group {
  text-align: right;
  margin-top: 20px;
}
.button-group button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-left: 10px;
  transition: opacity 0.3s;
}
.button-group button[type="submit"] {
  background-color: #007bff;
  color: #fff;
}
.button-group button[type="submit"]:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.button-group button[type="button"] {
  background-color: #6c757d;
  color: #fff;
}
.loading {
    text-align: center;
    padding: 20px;
    font-style: italic;
    color: #555;
}
</style>