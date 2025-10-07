// src/modules/sale-item/services/sale-item.service.v2.ts

import { SaleItemRepositoryV2, InvalidSortFieldError } from '../repositories/sale-item.repository.v2';
import { SaleItemQuery, PagedResponse, SaleItemQueryResult } from '../interfaces/sale-item-v2.interface';

export class SaleItemServiceV2 {
    private repository: SaleItemRepositoryV2;

    constructor(repository: SaleItemRepositoryV2) {
        this.repository = repository;
    }

    /**
     * Prepares and fetches paginated sale items.
     */
    async getSaleItemsPaged(rawQuery: any): Promise<PagedResponse<SaleItemQueryResult>> {
        // 1. Apply Defaults and Type Conversion (ตาม PBI)
        const page = parseInt(rawQuery.page as string) || 0; // Default page is 0
        const size = parseInt(rawQuery.size as string) || 10; // Default size is 10
        const sortField = rawQuery.sortField || 'createdOn'; // Default sort
        const sortDirection = (rawQuery.sortDirection || 'asc').toLowerCase() as 'asc' | 'desc'; // Default asc

        // filterBrands: รับค่าเป็น Array of string (เช่น ['Apple', 'Samsung'])
        const filterBrands = Array.isArray(rawQuery.filterBrands)
            ? rawQuery.filterBrands.filter((b: string) => b && b.trim())
            : (rawQuery.filterBrands ? [rawQuery.filterBrands].filter((b: string) => b && b.trim()) : []);

        const validatedQuery: SaleItemQuery = {
            page: Math.max(0, page), // Ensure page >= 0
            size: [5, 10, 20].includes(size) ? size : 10, // Validate size (PBI 2)
            sortField,
            sortDirection,
            filterBrands,
        };

        // 2. Fetch from Repository
        try {
            return await this.repository.findPaged(validatedQuery);
        } catch (error) {
            // CRITICAL FIX: บันทึกข้อผิดพลาดดั้งเดิมก่อนโยนข้อผิดพลาดที่ไม่เฉพาะเจาะจง
            console.error('Database/Repository Error during findPaged:', error);

            // โยน InvalidSortFieldError เพื่อให้ Controller จับและตอบ 400
            if (error instanceof InvalidSortFieldError) {
                throw error;
            }
            // โยนข้อผิดพลาดใหม่ที่ระบุว่าล้มเหลว และชี้ให้ไปดูใน log
            throw new Error('Failed to retrieve paginated sale items. Check server logs for database error details.');
        }
    }
}