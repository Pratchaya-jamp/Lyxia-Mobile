<template>
  <div class="font-sans text-gray-800">
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-indigo-500 to-purple-600 text-white min-h-screen flex items-center py-20">
      <div class="container mx-auto px-5 max-w-6xl">
        <div class="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div class="text-center md:text-left">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Welcome to Our Amazing Store
            </h1>
            <p class="text-lg md:text-xl mb-10 opacity-90 max-w-lg">
              Discover incredible deals and premium products at unbeatable prices
            </p>
            <div class="flex flex-col sm:flex-row gap-5 justify-center md:justify-start">
              <button 
                @click="goToSaleItems" 
                class="bg-red-500 hover:bg-red-600 px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                Shop Sale Items
              </button>
              <button 
                @click="scrollToFeatures" 
                class="bg-transparent border-2 border-white hover:bg-white hover:text-indigo-600 px-8 py-4 rounded-lg font-semibold transition-all duration-300"
              >
                Learn More
              </button>
            </div>
          </div>
          
          <div class="flex justify-center">
            <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-16 md:p-20 text-center max-w-sm w-full aspect-square flex items-center justify-center">
              <span class="text-7xl md:text-8xl">🛍️</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-24 bg-gray-50">
      <div class="container mx-auto px-5 max-w-6xl">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">
          Why Choose Us?
        </h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center">
            <div class="text-5xl mb-5">🚚</div>
            <h3 class="text-xl font-semibold mb-4 text-gray-800">Fast Delivery</h3>
            <p class="text-gray-600">Get your orders delivered within 24-48 hours nationwide</p>
          </div>
          
          <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center">
            <div class="text-5xl mb-5">💎</div>
            <h3 class="text-xl font-semibold mb-4 text-gray-800">Premium Quality</h3>
            <p class="text-gray-600">All products are carefully selected for the highest quality standards</p>
          </div>
          
          <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center">
            <div class="text-5xl mb-5">🔒</div>
            <h3 class="text-xl font-semibold mb-4 text-gray-800">Secure Payment</h3>
            <p class="text-gray-600">Your transactions are protected with bank-level security</p>
          </div>
          
          <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center">
            <div class="text-5xl mb-5">💰</div>
            <h3 class="text-xl font-semibold mb-4 text-gray-800">Best Prices</h3>
            <p class="text-gray-600">Competitive pricing with regular sales and discounts</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="bg-gradient-to-r from-red-500 to-orange-500 text-white py-20">
      <div class="container mx-auto px-5 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">Ready to Start Shopping?</h2>
        <p class="text-lg md:text-xl mb-10 opacity-90">
          Join thousands of satisfied customers and discover amazing deals today!
        </p>
        <button 
          @click="goToSaleItems" 
          class="bg-white text-red-500 hover:bg-gray-100 px-10 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          Browse Sale Items Now
        </button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-16">
      <div class="container mx-auto px-5 max-w-6xl">
        <div class="grid md:grid-cols-3 gap-10 mb-10">
          <div class="text-center md:text-left">
            <h4 class="text-lg font-semibold mb-5 text-gray-200">Quick Links</h4>
            <ul class="space-y-3">
              <li><a href="#" @click.prevent="goToSaleItems" class="text-gray-400 hover:text-gray-200 transition-colors">Sale Items</a></li>
              <li><a href="#features" @click.prevent="scrollToFeatures" class="text-gray-400 hover:text-gray-200 transition-colors">Features</a></li>
              <li><a href="#" class="text-gray-400 hover:text-gray-200 transition-colors">About Us</a></li>
              <li><a href="#" class="text-gray-400 hover:text-gray-200 transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div class="text-center md:text-left">
            <h4 class="text-lg font-semibold mb-5 text-gray-200">Customer Service</h4>
            <ul class="space-y-3">
              <li><a href="#" class="text-gray-400 hover:text-gray-200 transition-colors">Help Center</a></li>
              <li><a href="#" class="text-gray-400 hover:text-gray-200 transition-colors">Returns</a></li>
              <li><a href="#" class="text-gray-400 hover:text-gray-200 transition-colors">Shipping Info</a></li>
              <li><a href="#" class="text-gray-400 hover:text-gray-200 transition-colors">Track Order</a></li>
            </ul>
          </div>
          
          <div class="text-center md:text-left">
            <h4 class="text-lg font-semibold mb-5 text-gray-200">Connect With Us</h4>
            <div class="flex gap-4 justify-center md:justify-start">
              <a href="#" class="text-2xl hover:scale-110 transition-transform">📧</a>
              <a href="#" class="text-2xl hover:scale-110 transition-transform">📱</a>
              <a href="#" class="text-2xl hover:scale-110 transition-transform">🐦</a>
              <a href="#" class="text-2xl hover:scale-110 transition-transform">📘</a>
            </div>
          </div>
        </div>
        
        <div class="border-t border-gray-700 pt-8 text-center">
          <p class="text-gray-400">&copy; 2024 Your Store Name. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const goToSaleItems = () => {
    router.push('/sale-items');
}

const scrollToFeatures = () => {
  const element = document.getElementById('features');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}
</script>

<style scoped>
/* Custom styles only if needed for specific effects not available in Tailwind */
</style>