import { pool } from '../../../db/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export interface SaleItemQueryResult extends RowDataPacket {
    id: number;
    model: string;
    description?: string;
    brandName: string;
    price: number;
    ramGb: number | null;
    screenSizeInch?: number | null;
    storageGb: number | null;
    quantity?: number;
    color: string | null;
    createdOn?: Date;
    updatedOn?: Date;
}

export interface CreateSaleItemData {
    brandId: number;
    model: string;
    price: number;
    description: string;
    ramGb: number | null;
    screenSizeInch: number | null;
    storageGb: number | null;
    color: string | null;
    quantity: number;
}

export interface UpdateSaleItemData {
    brandId: number;
    model: string;
    price: number;
    description: string;
    ramGb: number | null;
    screenSizeInch: number | null;
    storageGb: number | null;
    color: string | null;
    quantity: number;
}

export class SaleItemRepository {
    async findAll(): Promise<SaleItemQueryResult[]> {
        const query = `
            SELECT
                si.id,
                si.model,
                bb.name AS brandName,
                si.price,
                si.ramGb,
                si.storageGb,
                si.color,
                si.createdOn
            FROM
                sale_item_base AS si
            JOIN
                brand_base AS bb ON si.brand_id = bb.id
            ORDER BY
                si.createdOn ASC;
        `;
        const [rows] = await pool.query<SaleItemQueryResult[]>(query);
        return rows;
    }

    async findById(id: number): Promise<SaleItemQueryResult | null> {
        const query = `
            SELECT
                si.id,
                si.model,
                si.description,
                bb.name AS brandName,
                si.price,
                si.ramGb,
                si.screenSizeInch,
                si.storageGb,
                si.quantity,
                si.color
            FROM
                sale_item_base AS si
            JOIN
                brand_base AS bb ON si.brand_id = bb.id
            WHERE
                si.id = ?;
        `;
        const [rows] = await pool.query<SaleItemQueryResult[]>(query, [id]);
        return rows[0] || null;
    }

    async create(data: CreateSaleItemData): Promise<number> {
        const query = `
            INSERT INTO sale_item_base (
                brand_id,
                model,
                price,
                description,
                ramGb,
                screenSizeInch,
                storageGb,
                color,
                quantity,
                createdOn,
                updatedOn
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW());
        `;
        const [result] = await pool.query<ResultSetHeader>(query, [
            data.brandId,
            data.model,
            data.price,
            data.description,
            data.ramGb,
            data.screenSizeInch,
            data.storageGb,
            data.color,
            data.quantity,
        ]);
        return result.insertId;
    }

    async update(id: number, data: UpdateSaleItemData): Promise<boolean> {
        const query = `
            UPDATE sale_item_base SET
                brand_id = ?,
                model = ?,
                price = ?,
                description = ?,
                ramGb = ?,
                screenSizeInch = ?,
                storageGb = ?,
                color = ?,
                quantity = ?,
                updatedOn = NOW()
            WHERE id = ?;
        `;
        const [result] = await pool.query<ResultSetHeader>(query, [
            data.brandId,
            data.model,
            data.price,
            data.description,
            data.ramGb,
            data.screenSizeInch,
            data.storageGb,
            data.color,
            data.quantity,
            id,
        ]);
        return result.affectedRows > 0;
    }

    async remove(id: number): Promise<boolean> {
        const query = `
            DELETE FROM sale_item_base WHERE id = ?;
        `;
        const [result] = await pool.query<ResultSetHeader>(query, [id]);
        return result.affectedRows > 0;
    }
}