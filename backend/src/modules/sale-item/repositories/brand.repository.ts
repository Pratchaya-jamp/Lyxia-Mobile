import { pool } from '../../../db/db';
import { RowDataPacket } from 'mysql2/promise';

export interface BrandQueryResult extends RowDataPacket {
    id: number;
    name: string;
}

export class BrandRepository {
    async findAll(): Promise<BrandQueryResult[]> {
        const query = `
            SELECT
                id,
                name
            FROM
                brand_base
            ORDER BY
                name ASC;
        `;
        const [rows] = await pool.query<BrandQueryResult[]>(query);
        return rows;
    }

    async findById(id: number): Promise<BrandQueryResult | null> {
        const query = `
            SELECT
                id,
                name
            FROM
                brand_base
            WHERE id = ?;
        `;
        const [rows] = await pool.query<BrandQueryResult[]>(query, [id]);
        return rows[0] || null;
    }
}