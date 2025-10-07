// src/controllers/sale-item.controller.v2.ts

import { Elysia, t } from 'elysia';
import { SaleItemRepositoryV2, InvalidSortFieldError } from '../repositories/sale-item.repository.v2';
import { SaleItemServiceV2 } from '../services/sale-item.service.v2';
import { PagedResponse, SaleItemQueryResult } from '../interfaces/sale-item-v2.interface';

// Initialize the repository and service layers
const saleItemRepositoryV2 = new SaleItemRepositoryV2();
const saleItemServiceV2 = new SaleItemServiceV2(saleItemRepositoryV2);

// Schema for a single Sale Item (Content of the PagedResponse)
const SaleItemSchema = t.Object({
    id: t.Numeric(),
    model: t.String(),
    brandName: t.String(),
    description: t.Union([t.String(), t.Null()]),
    price: t.Numeric(),
    ramGb: t.Union([t.Numeric(), t.Null()]),
    screenSizeInch: t.Union([t.Numeric(), t.Null()]),
    storageGb: t.Union([t.Numeric(), t.Null()]),
    quantity: t.Numeric(),
    color: t.Union([t.String(), t.Null()]),
    createdOn: t.Date(),
    updatedOn: t.Date(),
});

// Schema for the Paged Response (ตาม API Spec)
const PagedResponseSchema = t.Object({
    content: t.Array(SaleItemSchema),
    last: t.Boolean(),
    first: t.Boolean(),
    totalPages: t.Numeric(),
    totalElements: t.Numeric(),
    size: t.Numeric(),
    sort: t.String(),
    page: t.Numeric(),
});

export const saleItemControllerV2 = new Elysia({ prefix: '/v2/sale-items' })

    // GET /v2/sale-items: Get all sale items with pagination, brand filter, sorting
    .get('/', async ({ query, set }) => {
        try {
            const pagedData = await saleItemServiceV2.getSaleItemsPaged(query);

            set.status = 200;
            return pagedData;

        } catch (error) {
            console.error('Error fetching paged sale items:', error);

            // 💡 ตอบสนอง 400 Bad Request เมื่อ Sort Field ไม่ถูกต้อง
            if (error instanceof InvalidSortFieldError) {
                set.status = 400;
                // ตอบกลับในรูปแบบที่กำหนดใน Response Schema (status: 400, message: string)
                return {
                    status: 400,
                    message: error.message
                };
            }

            // การจัดการ Error ทั่วไป (Internal Server Error)
            set.status = 500;
            return {
                status: 500,
                message: 'Failed to retrieve sale items due to an internal server error.'
            };
        }
    }, {
        // Validation Schema for Query Parameters (ตาม API Spec)
        query: t.Object({
            page: t.Optional(t.Numeric({ default: 0 })),
            size: t.Optional(t.Numeric({ default: 10 })),
            sortField: t.Optional(t.String({ default: 'createdOn' })),
            sortDirection: t.Optional(t.Union([t.Literal('asc'), t.Literal('desc')], { default: 'asc' })),
            // filterBrands อาจมาเป็น single string หรือ array of string
            filterBrands: t.Optional(t.Union([t.String(), t.Array(t.String())])),
        }),
        response: {
            200: PagedResponseSchema,
            400: t.Object({
                status: t.Numeric(),
                message: t.String()
            }),
            500: t.Object({
                status: t.Numeric(),
                message: t.String()
            }),
            // Note: 404 Not Found ถูกจัดการโดย Elysia Router โดยอัตโนมัติหากไม่พบ Path
        }
    });