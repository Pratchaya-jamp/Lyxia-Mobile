<template>
  <div class="container">
    <div class="header">
      <h2>Brand List</h2>
      <button class="add-btn" @click="goToAddBrand">Add Brand</button>
    </div>

    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>

    <div v-if="isLoading" class="loading">Loading brands...</div>

    <table v-else-if="brands.length > 0">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Created On</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="brand in brands" :key="brand.id">
          <td>{{ brand.id }}</td>
          <td>{{ brand.name }}</td>
          <td>{{ new Date(brand.createdOn).toLocaleDateString() }}</td>
          <td>
            <button class="edit-btn" @click="editBrand(brand.id)">Edit</button>
            <button class="delete-btn" @click="deleteBrand(brand.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    
    <div v-else class="no-data">No brands found.</div>
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

// Function to fetch brands from the backend API
const fetchBrands = async () => {
  isLoading.value = true;
  try {
    const response = await fetch('http://localhost:3000/v1/brands');
    if (response.status === 200) {
      const data = await response.json();
      brands.value = data.data; // Assuming your API response has a 'data' key
    } else {
      showMessage('Failed to retrieve brand list.', 'error');
    }
  } catch (error) {
    console.error('Network Error:', error);
    showMessage('Failed to connect to the server.', 'error');
  } finally {
    isLoading.value = false;
  }
};

// Function to handle navigation to Add Brand form
const goToAddBrand = () => {
  router.push('/brands/add');
};

// Placeholder functions for Edit and Delete
const editBrand = (id) => {
  console.log('Edit brand with ID:', id);
  // Future implementation: router.push(`/brands/edit/${id}`);
};

const deleteBrand = (id) => {
  console.log('Delete brand with ID:', id);
  // Future implementation: Logic to call DELETE API
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
  }, 5000); // Hide message after 5 seconds
};

// Lifecycle hook to fetch data when the component is mounted
onMounted(() => {
  fetchBrands();
  // Check for success message from Add Brand form
  if (route.query.message) {
    showMessage(route.query.message, route.query.type);
  }
});
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.header h2 {
  margin: 0;
}
.add-btn {
  padding: 10px 15px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
th, td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}
th {
  background-color: #f2f2f2;
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
.loading, .no-data {
  text-align: center;
  margin-top: 20px;
  color: #555;
}
.edit-btn, .delete-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 5px;
}
.edit-btn {
  background-color: #ffc107;
  color: #333;
}
.delete-btn {
  background-color: #dc3545;
  color: #fff;
}
</style>