// src/controllers/brand.controller.ts
import { Elysia, t } from 'elysia';
import { BrandService } from '../services/brand.service';
import { BrandRepository } from '../repositories/brand.repository';

// Initialize the repository and service layers
const brandRepository = new BrandRepository();
const brandService = new BrandService(brandRepository);

export const brandController = new Elysia({ prefix: '/v1/brands' })
    // GET /v1/brands: Retrieves all brands, sorted by creation time.
    .get('/', async () => {
        try {
            const brands = await brandService.getBrands();
            return brands;
        } catch (error) {
            console.error('Error fetching brands:', error);
            return {
                status: 500,
                message: error instanceof Error ? error.message : 'Failed to retrieve brands.',
            };
        }
    })

    // POST /v1/brands: Adds a new brand.
    .post('/', async ({ body, set }) => {
        try {
            const newBrand = await brandService.createBrand(body);
            set.status = 201; // HTTP 201 Created
            return newBrand;
        } catch (error) {
            set.status = 500;
            return {
                status: 500,
                message: error instanceof Error ? error.message : 'Failed to add new brand.',
            };
        }
    }, {
        body: t.Object({
            name: t.String({ minLength: 1 }),
            websiteUrl: t.Optional(t.String()),
            isActive: t.Optional(t.Boolean()),
            countryOfOrigin: t.Optional(t.String()),
        }),
    })

    // PUT /v1/brands/:id: Updates an existing brand.
    .put('/:id', async ({ params, body, set }) => {
        try {
            // Convert 'params.id' to 'unknown' first, then to 'string', to satisfy TypeScript.
            const id = parseInt(params.id as unknown as string);
            const updatedBrand = await brandService.updateBrand(id, body);
            if (!updatedBrand) {
                set.status = 404;
                return { status: 404, message: 'Brand not found.' };
            }
            return updatedBrand;
        } catch (error) {
            set.status = 500;
            return {
                status: 500,
                message: error instanceof Error ? error.message : 'Failed to update brand.',
            };
        }
    }, {
        params: t.Object({
            id: t.Numeric(),
        }),
        body: t.Object({
            name: t.Optional(t.String()),
            websiteUrl: t.Optional(t.String()),
            isActive: t.Optional(t.Boolean()),
            countryOfOrigin: t.Optional(t.String()),
        }),
    })

    // DELETE /v1/brands/:id: Deletes a brand.
    .delete('/:id', async ({ params, set }) => {
        try {
            // Convert 'params.id' to 'unknown' first, then to 'string', to satisfy TypeScript.
            const id = parseInt(params.id as unknown as string);
            const deleted = await brandService.deleteBrand(id);
            if (!deleted) {
                set.status = 404;
                return { status: 404, message: 'Brand not found.' };
            }
            set.status = 204
            return;
        } catch (error) {
            set.status = 500;
            return {
                status: 500,
                message: error instanceof Error ? error.message : 'Failed to delete brand.',
            };
        }
    }, {
        params: t.Object({
            id: t.Numeric(),
        }),
    });