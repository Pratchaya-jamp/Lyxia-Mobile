// src/repositories/sale-item.repository.v2.ts

import { pool } from '../../../db/db';
import { RowDataPacket } from 'mysql2/promise';
import { SaleItemQuery, SaleItemQueryResult, PagedResponse } from '../interfaces/sale-item-v2.interface';

// Error สำหรับ Bad Request ในกรณี Sort Field ไม่ถูกต้อง
export class InvalidSortFieldError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidSortFieldError';
    }
}

// Map frontend sort field to database column name
const SORT_FIELD_MAP: { [key: string]: string } = {
    'createdOn': 'si.createdOn',
    'brandName': 'b.name',
};

// Column names used in SELECT query (assuming brandName is derived from join)
const SELECT_COLUMNS = `
    si.id,
    si.model,
    b.name as brandName,
    si.description,
    si.price,
    si.ramGb,
    si.screenSizeInch,
    si.storageGb,
    si.quantity,
    si.color,
    si.createdOn,
    si.updatedOn
`;

export class SaleItemRepositoryV2 {

    /**
     * Fetches a paginated list of sale items based on query parameters.
     */
    async findPaged(query: SaleItemQuery): Promise<PagedResponse<SaleItemQueryResult>> {
        const { page, size, sortField, sortDirection, filterBrands } = query;
        const offset = page * size;

        // 1. Validate Sort Field
        const dbSortField = SORT_FIELD_MAP[sortField];
        if (!dbSortField) {
            if (sortField && sortField !== 'createdOn') {
                throw new InvalidSortFieldError(`Invalid sort field: ${sortField}`);
            }
        }

        const sortColumn = dbSortField || 'si.createdOn';
        const sortDir = sortDirection.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';


        // 2. Build WHERE clause for Filtering
        const whereClauses: string[] = [];
        // 💡 แก้ไข: ใช้ Array แยกสำหรับ queryParams ที่ใช้ใน WHERE (สำหรับ Count และ Content)
        let filterParams: (string | number)[] = [];

        if (filterBrands && filterBrands.length > 0) {
            const brandPlaceholders = filterBrands.map(() => '?').join(', ');
            whereClauses.push(`b.name IN (${brandPlaceholders})`);
            filterParams.push(...filterBrands);
        }

        const whereCondition = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';


        // 3. Query for Total Count (ใช้ filterParams เท่านั้น)
        const countQuery = `
            SELECT
                COUNT(si.id) AS totalElements
            FROM
                sale_item_base si
                    JOIN
                brand_base b ON si.brand_id = b.id
                ${whereCondition};
        `;

        // Console Log สำหรับ Debug SQL Syntax
        console.log('SQL Count Query:', countQuery);
        console.log('SQL Count Params:', filterParams);

        const [countRows] = await pool.query<RowDataPacket[]>(countQuery, filterParams);
        const totalElements = countRows[0].totalElements as number;
        const totalPages = Math.ceil(totalElements / size);


        // 4. Query for Paginated Content
        const contentQuery = `
            SELECT 
                ${SELECT_COLUMNS}
            FROM 
                sale_item_base si
            JOIN 
                brand_base b ON si.brand_id = b.id
            ${whereCondition}
            ORDER BY
                ${sortColumn} ${sortDir}
            LIMIT ? OFFSET ?;
        `;

        // 💡 แก้ไข: สร้าง Content Params โดยนำ filterParams + Limit + Offset
        const contentQueryParams = [...filterParams, size, offset];

        console.log('SQL Content Query:', contentQuery);
        console.log('SQL Content Params:', contentQueryParams);

        // ใช้ RowDataPacket[] ในการ Query
        const [contentRows] = await pool.query<RowDataPacket[]>(contentQuery, contentQueryParams);

        // แปลงประเภท (Type Assertion)
        const content: SaleItemQueryResult[] = contentRows as SaleItemQueryResult[];


        // 5. Construct PagedResponse
        return {
            content: content,
            last: page >= totalPages - 1,
            first: page === 0,
            totalPages: totalPages,
            totalElements: totalElements,
            size: size,
            sort: `${sortField},${sortDirection}`,
            page: page,
        };
    }
}