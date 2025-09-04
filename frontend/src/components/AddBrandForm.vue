<template>
  <div class="container">
    <div class="nav-link">
      <router-link to="/sale-items">Sale Item List</router-link>
    </div>

    <h2>Add Brand</h2>

    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>

    <form @submit.prevent="saveBrand">
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
        <button type="submit">Save</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Initialize Vue Router
const router = useRouter();

// Form data state
const formData = ref({
  name: '',
  websiteUrl: '',
  isActive: true, // Default value as required
  countryOfOrigin: '',
});

// Message state for feedback
const message = ref('');
const messageType = ref('');

// Function to handle form submission
const saveBrand = async () => {
  // Trim all string fields before sending
  const trimmedData = {
    name: formData.value.name.trim(),
    websiteUrl: formData.value.websiteUrl.trim(),
    isActive: formData.value.isActive,
    countryOfOrigin: formData.value.countryOfOrigin.trim(),
  };

  // Basic validation for required field
  if (!trimmedData.name) {
    showMessage('Brand Name is required.', 'error');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/v1/brands', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trimmedData),
    });

    if (response.status === 201) {
      // Success: Redirect to the brand list page and set a success message
      // Note: We'll use a simple in-memory state or URL query for the message
      router.push({ 
        path: '/brands', 
        query: { message: 'The brand has been added.', type: 'success' }
      });
    } else {
      // Failure: Show error message
      showMessage('The brand could not be added.', 'error');
    }
  } catch (error) {
    // Network error
    console.error('Network Error:', error);
    showMessage('Failed to connect to the server. Please try again later.', 'error');
  }
};

// Function to handle cancel button click
const cancel = () => {
  router.push('/brands');
};

// Helper function to show messages
const showMessage = (msg, type) => {
  message.value = msg;
  messageType.value = type;
};
</script>

<style scoped>
/* Scoped styles to keep them local to this component */
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
}
.success {
  background-color: #d4edda;
  color: #155724;
}
.error {
  background-color: #f8d7da;
  color: #721c24;
}
.form-group {
  margin-bottom: 15px;
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
}
.button-group button[type="submit"] {
  background-color: #28a745;
  color: #fff;
}
.button-group button[type="button"] {
  background-color: #6c757d;
  color: #fff;
}
</style>