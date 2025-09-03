// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router'
import SaleItems from '@/components/SaleItems.vue'
import LandingPage from '@/components/LandingPage.vue'
import SaleItemDetail from '@/components/SaleItemDetail.vue'
import SaleItemForm from '@/components/SaleItemForm.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: LandingPage,
    },
    {
        path: '/sale-items',
        name: 'SaleItems',
        component: SaleItems,
    },
    {
        path: '/sale-items/list',
        name: 'SaleItemsList',
        component: SaleItems,
    },
    {
        path: '/sale-items/:id',
        name: 'SaleItemDetail',
        component: SaleItemDetail,
    },
    {
        path: '/sale-items/add',
        name: 'AddSaleItem',
        component: SaleItemForm,
    },
    {
        path: '/sale-items/edit/:id',
        name: 'EditSaleItem',
        component: SaleItemForm,
    }
]

const router = createRouter({
    history: createWebHistory(''),
    routes,
})

export default router