import { Elysia } from 'elysia';
import { BrandService } from '../services/brand.service';
import { BrandRepository } from '../repositories/brand.repository';

const brandRepository = new BrandRepository();
const brandService = new BrandService(brandRepository);

export const brandController = new Elysia({ prefix: '/v1' })
    .get('/brands', async () => {
        try {
            return await brandService.getBrands();
        } catch (error) {
            console.error('Error in /v1/brands:', error);
            throw new Error('Failed to retrieve brands.');
        }
    });