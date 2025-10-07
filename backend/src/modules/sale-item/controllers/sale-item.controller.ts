// src/controllers/sale-item.controller.ts

import { Elysia, NotFoundError, t } from 'elysia';
import { SaleItemService } from '../services/sale-item.service';
import { SaleItemRepository } from '../repositories/sale-item.repository';
import { BrandRepository } from '../repositories/brand.repository';

// Initialize repositories and services
const saleItemRepository = new SaleItemRepository();
const brandRepository = new BrandRepository();

const saleItemService = new SaleItemService(saleItemRepository, brandRepository);

export const saleItemController = new Elysia({ prefix: '/v1/sale-items' })
    // GET /v1/sale-items: Retrieves all sale items.
    .get('/', async () => {
        try {
            return await saleItemService.getSaleItems();
        } catch (error) {
            console.error('Error in /v1/sale-items:', error);
            throw new Error('Failed to retrieve sale items.');
        }
    })
    
    // GET /v1/sale-items/:id: Retrieves a single sale item by ID.
    .get('/:id', async ({ params, set }) => {
        const item = await saleItemService.getSaleItemById(params.id);
        if (!item) {
            set.status = 404;
            return { error: 'Sale item not found.' };
        }
        return item;
    }, {
        params: t.Object({
            id: t.Numeric(),
        }),
    })

    // POST /v1/sale-items: Creates a new sale item.
    .post('/', async ({ body, set }) => {
        try {
            const newItem = await saleItemService.createSaleItem(body);
            set.status = 201;
            return newItem;
        } catch (error) {
            console.error('Error in POST /v1/sale-items:', error);
            set.status = 500;
            return { error: 'Failed to create sale item.' };
        }
    }, {
        body: t.Object({
            brandId: t.Numeric(),
            model: t.String(),
            price: t.Number({ minimum: 0 }),
            description: t.String(),
            ramGb: t.Number({ minimum: 1 }),
            screenSizeInch: t.Number({ minimum: 0.1 }),
            quantity: t.Number({ minimum: 0 }),
            storageGb: t.Number({ minimum: 1 }),
            color: t.String(),
        }),
    })

    // PUT /v1/sale-items/:id: Updates an existing sale item.
    .put('/:id', async ({ params, body, set }) => {
        try {
            const parsedBody = {
                ...body,
                brandId: body.brandId ? Number(body.brandId) : undefined,
                price: body.price ? Number(body.price) : undefined,
                ramGb: body.ramGb ? Number(body.ramGb) : undefined,
                screenSizeInch: body.screenSizeInch ? Number(body.screenSizeInch) : undefined,
                quantity: body.quantity ? Number(body.quantity) : undefined,
                storageGb: body.storageGb ? Number(body.storageGb) : undefined
            };

            const updatedItem = await saleItemService.updateSaleItem(params.id, parsedBody);
            if (!updatedItem) {
                set.status = 404;
                return { error: 'Sale item not found.' };
            }
            set.status = 200;
            return updatedItem;
        } catch (error) {
            console.error('Error in PUT /v1/sale-items/:id:', error);
            set.status = 500;
            return { error: 'Failed to update sale item.' };
        }
    }, {
        params: t.Object({
            id: t.Numeric(),
        }),
        body: t.Object({
            brandId: t.Optional(t.Union([t.Numeric(), t.String()])),
            model: t.Optional(t.String()),
            price: t.Optional(t.Union([t.Number(), t.String()])),
            description: t.Optional(t.String()),
            ramGb: t.Optional(t.Union([t.Number(), t.String()])),
            screenSizeInch: t.Optional(t.Union([t.Number(), t.String()])),
            quantity: t.Optional(t.Union([t.Number(), t.String()])),
            storageGb: t.Optional(t.Union([t.Number(), t.String()])),
            color: t.Optional(t.String()),
        }),
    })
    
    // DELETE /v1/sale-items/:id: Deletes a sale item.
    .delete('/:id', async ({ params, set }) => {
        try {
            const success = await saleItemService.deleteSaleItem(params.id);
            if (!success) {
                set.status = 404;
                return { error: 'Sale item not found.' };
            }
            set.status = 204;
            return;
        } catch (error) {
            console.error('Error in DELETE /v1/sale-items/:id:', error);
            set.status = 500;
            return { error: 'Failed to delete sale item.' };
        }
    }, {
        params: t.Object({
            id: t.Numeric(),
        }),
    });