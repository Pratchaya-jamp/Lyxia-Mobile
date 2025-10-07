import { pool } from '../../../db/db';
import { RowDataPacket } from 'mysql2/promise';

export interface SaleItemQueryResult extends RowDataPacket {
    id: number;
    model: string;
    brandId: number;
    brandName: string;  // เพิ่ม brandName
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
                si.id, si.model, si.brand_id, b.name AS brandName, si.price, si.description,
                si.ramGb, si.screenSizeInch, si.quantity, si.storageGb, si.color, si.createdOn, si.updatedOn
            FROM sale_item_base si
                     LEFT JOIN brand_base b ON si.brand_id = b.id;
        `;
        const [rows] = await pool.query<SaleItemQueryResult[]>(query);
        return rows;
    }

    async findById(id: number): Promise<SaleItemQueryResult | null> {
        const query = `
            SELECT
                si.id, si.model, si.brand_id, b.name AS brandName, si.price, si.description,
                si.ramGb, si.screenSizeInch, si.quantity, si.storageGb, si.color, si.createdOn, si.updatedOn
            FROM sale_item_base si
                     LEFT JOIN brand_base b ON si.brand_id = b.id
            WHERE si.id = ?;
        `;
        const [rows] = await pool.query<SaleItemQueryResult[]>(query, [id]);
        return rows[0] || null;
    }

    async create(data: CreateSaleItemData): Promise<number> {
        const query = `
            INSERT INTO sale_item_base
            (model, brand_id, price, description, ramGb, screenSizeInch, quantity, storageGb, color)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        const [result] = await pool.query(query, [
            data.model, data.brandId, data.price, data.description, data.ramGb,
            data.screenSizeInch, data.quantity, data.storageGb, data.color
        ]);
        return (result as any).insertId;
    }

    async update(id: number, data: UpdateSaleItemData): Promise<boolean> {
        const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data);

        if (values.length === 0) {
            return false;
        }

        const query = `
            UPDATE sale_item_base
            SET ${fields}, updatedOn = NOW()
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
}
