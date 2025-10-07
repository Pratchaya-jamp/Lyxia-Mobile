// src/interfaces/sale-item-v2.interface.ts

// ใช้สำหรับรับ Query Parameters จาก Controller
export interface SaleItemQuery {
    page: number; // Page number (default: 0)
    size: number; // Page size (default: 10)
    sortField: string; // Field to sort by (e.g., 'createdOn', 'brandName')
    sortDirection: 'asc' | 'desc'; // Sorting direction
    filterBrands: string[]; // Array of brand names to filter
}

// ใช้สำหรับโครงสร้างข้อมูล Sale Item ใน DB (ถ้า DB ใช้ snake_case ต้องแปลง)
// ถ้าเราตัดสินใจใช้ camelCase ใน TS และแปลงใน Repository/Service
export interface SaleItemQueryResult {
    id: number;
    model: string;
    brandName: string;
    description: string | null;
    price: number;
    ramGb: number | null;
    screenSizeInch: number | null;
    storageGb: number | null;
    quantity: number;
    color: string | null;
    createdOn: Date;
    updatedOn: Date;
}

// ใช้สำหรับโครงสร้าง Response แบบ Pagination
export interface PagedResponse<T> {
    content: T[]; // The list of sale items for the current page
    last: boolean; // True if this is the last page
    first: boolean; // True if this is the first page
    totalPages: number; // Total number of pages
    totalElements: number; // Total number of elements across all pages
    size: number; // Number of elements per page
    sort: string; // Sorting string (e.g., 'brand_name,asc')
    page: number; // Current page number (0-based)
}