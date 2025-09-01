import { Elysia, NotFoundError, t } from 'elysia';
import { SaleItemService } from '../services/sale-item.service';
import { SaleItemRepository, CreateSaleItemData, UpdateSaleItemData } from '../repositories/sale-item.repository';
import { BrandRepository } from '../repositories/brand.repository';

const saleItemRepository = new SaleItemRepository();
const brandRepository = new BrandRepository();

const saleItemService = new SaleItemService(saleItemRepository, brandRepository);

export const saleItemController = new Elysia({ prefix: '/v1' })
    .get('/sale-items', async () => {
        try {
            return await saleItemService.getSaleItems();
        } catch (error) {
            console.error('Error in /v1/sale-items:', error);
            throw new Error('Failed to retrieve sale items.');
        }
    })
    .get('/sale-items/:id', async ({ params }) => {
        try {
            const id = parseInt(params.id);
            if (isNaN(id)) {
                throw new NotFoundError('Invalid ID format.');
            }
            const item = await saleItemService.getSaleItemById(id);
            if (!item) {
                throw new NotFoundError('Sale item not found.');
            }
            return item;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            console.error('Error in /v1/sale-items/:id:', error);
            throw new Error('Failed to retrieve sale item.');
        }
    })
    .post('/sale-items', async ({ body, set }) => {
        try {
            const newItem = await saleItemService.createSaleItem(body as CreateSaleItemData);
            set.status = 201;
            return newItem;
        } catch (error) {
            console.error('Error in POST /v1/sale-items:', error);
            set.status = 500;
            return { error: 'Failed to create sale item.' };
        }
    }, {
        body: t.Object({
            brandId: t.Number(),
            model: t.String(),
            price: t.Number(),
            description: t.String(),
            ramGb: t.Union([t.Number(), t.Null()]),
            screenSizeInch: t.Union([t.Number(), t.Null()]),
            storageGb: t.Union([t.Number(), t.Null()]),
            color: t.Union([t.String(), t.Null()]),
            quantity: t.Number(),
        })
    })
    .put('/sale-items/:id', async ({ params, body, set }) => {
        try {
            const id = parseInt(params.id);
            if (isNaN(id)) {
                throw new NotFoundError('Invalid ID format.');
            }
            const updatedItem = await saleItemService.updateSaleItem(id, body as UpdateSaleItemData);
            set.status = 200;
            return updatedItem;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            if (error instanceof Error && error.message.includes('not found')) {
                throw new NotFoundError(error.message);
            }
            console.error('Error in PUT /v1/sale-items/:id:', error);
            set.status = 500;
            return { error: 'Failed to update sale item.' };
        }
    }, {
        body: t.Object({
            brandId: t.Number(),
            model: t.String(),
            price: t.Number(),
            description: t.String(),
            ramGb: t.Union([t.Number(), t.Null()]),
            screenSizeInch: t.Union([t.Number(), t.Null()]),
            storageGb: t.Union([t.Number(), t.Null()]),
            color: t.Union([t.String(), t.Null()]),
            quantity: t.Number(),
        })
    })
    .delete('/sale-items/:id', async ({ params, set }) => {
        try {
            const id = parseInt(params.id);
            if (isNaN(id)) {
                throw new NotFoundError('Invalid ID format.');
            }
            const success = await saleItemService.deleteSaleItem(id);
            if (!success) {
                throw new NotFoundError('Sale item not found.');
            }
            set.status = 204;
            return;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            if (error instanceof Error && error.message.includes('not found')) {
                throw new NotFoundError(error.message);
            }
            console.error('Error in DELETE /v1/sale-items/:id:', error);
            set.status = 500;
            return { error: 'Failed to delete sale item.' };
        }
    });