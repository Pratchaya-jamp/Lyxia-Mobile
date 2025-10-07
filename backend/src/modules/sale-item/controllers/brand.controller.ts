// src/controllers/brand.controller.ts

import { Elysia, t } from 'elysia';
import { BrandService } from '../services/brand.service';
import { BrandRepository, DuplicateEntryError, ForeignKeyConstraintError } from '../repositories/brand.repository';

// Initialize the repository and service layers
const brandRepository = new BrandRepository();
const brandService = new BrandService(brandRepository);

export const brandController = new Elysia({ prefix: '/v1/brands' })

    // GET /v1/brands/{id}
    .get('/:id', async ({ params, set }) => {
        const id = parseInt(params.id as unknown as string);
        const brand = await brandRepository.findById(id);

        if (!brand) {
            set.status = 404;
            return { status: 404, message: 'Brand not found.' };
        }

        set.status = 200;
        return { status: 200, data: brand };
    }, { params: t.Object({ id: t.Numeric() }) })

    // GET /v1/brands
    .get('/', async ({ set }) => {
        try {
            const brands = await brandService.getBrands();
            set.status = 200;
            return { status: 200, data: brands };
        } catch (error) {
            console.error('Error fetching brands:', error);
            set.status = 500;
            return { status: 500, message: 'Failed to retrieve brands.' };
        }
    })

    // POST /v1/brands: Creates a new brand
    .post('/', async ({ body, set }) => {
        try {
            // 💡 แก้ไข: แปลง undefined ให้เป็นค่าที่ถูกต้องตาม Type และ Business Rule
            const dataForService = {
                name: body.name,
                websiteUrl: body.websiteUrl ?? null,
                // ✅ แก้ไข: กำหนดค่าเริ่มต้นเป็น true (boolean) ก่อนส่งให้ Service
                isActive: body.isActive ?? true,
                countryOfOrigin: body.countryOfOrigin ?? null,
            };

            const newBrand = await brandService.createBrand(dataForService);

            set.status = 201;
            return { status: 201, message: 'Brand created successfully.', data: newBrand };
        } catch (error) {
            console.error('Error in POST /v1/brands:', error);

            if (error instanceof DuplicateEntryError) {
                set.status = 400;
                return { status: 400, message: 'Brand name already exists.' };
            }
            if (error instanceof Error && error.message.includes('required')) {
                set.status = 400;
                return { status: 400, message: error.message };
            }

            set.status = 500;
            return { status: 500, message: 'The brand could not be added.' };
        }
    }, {
        body: t.Object({
            name: t.String({ minLength: 1 }),
            websiteUrl: t.Optional(t.String()),
            isActive: t.Optional(t.Boolean()),
            countryOfOrigin: t.Optional(t.String()),
        }),
    })

    // PUT /v1/brands/{id}: Update brand by id
    .put('/:id', async ({ params, body, set }) => {
        const id = parseInt(params.id as unknown as string);
        try {
            // แปลง undefined ให้เป็น null หรือคงค่า undefined ไว้หากไม่ได้ถูกส่งมา
            const dataForService = {
                ...body,
                websiteUrl: body.websiteUrl === undefined ? undefined : body.websiteUrl ?? null,
                countryOfOrigin: body.countryOfOrigin === undefined ? undefined : body.countryOfOrigin ?? null,
            };

            const updatedBrand = await brandService.updateBrand(id, dataForService);

            if (!updatedBrand) {
                set.status = 404;
                return { status: 404, message: 'Brand not found.' };
            }

            set.status = 200;
            return { status: 200, message: 'Brand updated successfully.', data: updatedBrand };
        } catch (error) {
            console.error('Error in PUT /v1/brands/:id:', error);

            if (error instanceof DuplicateEntryError) {
                set.status = 400;
                return { status: 400, message: 'Brand name already exists.' };
            }
            if (error instanceof Error && error.message.includes('Update failed')) {
                set.status = 500;
                return { status: 500, message: 'Update failed.' };
            }

            set.status = 500;
            return { status: 500, message: 'Failed to update brand.' };
        }
    }, {
        params: t.Object({ id: t.Numeric() }),
        body: t.Object({
            name: t.Optional(t.String({ minLength: 1 })),
            websiteUrl: t.Optional(t.String()),
            isActive: t.Optional(t.Boolean()),
            countryOfOrigin: t.Optional(t.String()),
        }),
    })

    // DELETE /v1/brands/{id}: Delete brand by id
    .delete('/:id', async ({ params, set }) => {
        const id = parseInt(params.id as unknown as string);
        try {
            const success = await brandService.deleteBrand(id);

            if (!success) {
                set.status = 404;
                return { status: 404, message: 'Brand not found.' };
            }

            set.status = 204;
            return;
        } catch (error) {
            console.error('Error in DELETE /v1/brands/:id:', error);

            if (error instanceof ForeignKeyConstraintError) {
                set.status = 400;
                return { status: 400, message: 'Cannot delete brand because it has associated sale items.' };
            }

            set.status = 500;
            return { status: 500, message: 'Failed to delete brand.' };
        }
    }, {
        params: t.Object({ id: t.Numeric() }),
    });