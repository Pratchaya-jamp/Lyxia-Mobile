import { pool } from '../../../db/db';
import { RowDataPacket } from 'mysql2/promise';

export interface SaleItemQueryResult extends RowDataPacket {
    id: number;
    model: string;
    brandId: number;
    price: number;
    description: string;
    ramGb: number;
    screenSizeInch: number;
    quantity: number;
    storageGb: number;
    color: string;
    createdOn: Date;
    updatedOn: Date;
}

export interface CreateSaleItemData {
    brandId: number;
    model: string;
    price: number;
    description: string;
    ramGb: number;
    screenSizeInch: number;
    quantity: number;
    storageGb: number;
    color: string;
}

// Corrected interface: All fields are optional.
export interface UpdateSaleItemData {
    brandId?: number;
    model?: string;
    price?: number;
    description?: string;
    ramGb?: number;
    screenSizeInch?: number;
    quantity?: number;
    storageGb?: number;
    color?: string;
}

export class SaleItemRepository {
    async findAll(): Promise<SaleItemQueryResult[]> {
        const query = `
            SELECT 
                id, model, brand_id AS brandId, price, description, ram_gb AS ramGb, 
                screen_size_inch AS screenSizeInch, quantity, storage_gb AS storageGb, 
                color, created_on AS createdOn, updated_on AS updatedOn
            FROM sale_item_base;
        `;
        const [rows] = await pool.query<SaleItemQueryResult[]>(query);
        return rows;
    }

    async findById(id: number): Promise<SaleItemQueryResult | null> {
        const query = `
            SELECT 
                id, model, brand_id AS brandId, price, description, ram_gb AS ramGb, 
                screen_size_inch AS screenSizeInch, quantity, storage_gb AS storageGb, 
                color, created_on AS createdOn, updated_on AS updatedOn
            FROM sale_item_base
            WHERE id = ?;
        `;
        const [rows] = await pool.query<SaleItemQueryResult[]>(query, [id]);
        return rows[0] || null;
    }

    async create(data: CreateSaleItemData): Promise<number> {
        const query = `
            INSERT INTO sale_item_base 
            (model, brand_id, price, description, ram_gb, screen_size_inch, quantity, storage_gb, color)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        const [result] = await pool.query(query, [
            data.model, data.brandId, data.price, data.description, data.ramGb,
            data.screenSizeInch, data.quantity, data.storageGb, data.color
        ]);
        return (result as any).insertId;
    }

    async update(id: number, data: UpdateSaleItemData): Promise<boolean> {
        const fields = Object.keys(data).map(key => `${this.camelToSnakeCase(key)} = ?`).join(', ');
        const values = Object.values(data);
    
        if (values.length === 0) {
            return false;
        }

        const query = `
            UPDATE sale_item_base
            SET ${fields}, updated_on = NOW()
            WHERE id = ?;
        `;
        const [result] = await pool.query(query, [...values, id]);
    
        return (result as any).affectedRows > 0;
    }

    async remove(id: number): Promise<boolean> {
        const query = `DELETE FROM sale_item_base WHERE id = ?;`;
        const [result] = await pool.query(query, [id]);
        return (result as any).affectedRows > 0;
    }

    private camelToSnakeCase(str: string): string {
        return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    }
}