// src/repositories/brand.repository.ts

import { pool } from '../../../db/db';
import { RowDataPacket } from 'mysql2/promise';

export interface BrandQueryResult extends RowDataPacket {
    id: number;
    name: string;
    websiteUrl: string | null;
    isActive: boolean;
    countryOfOrigin: string | null;
    createdOn: Date;
}

export interface UpdateBrandData {
    name?: string;
    websiteUrl?: string | null;
    isActive?: boolean;
    countryOfOrigin?: string | null;
}

export class BrandRepository {
    async findAll(): Promise<BrandQueryResult[]> {
        const query = `
            SELECT
                id,
                name,
                websiteUrl,
                isActive,
                countryOfOrigin,
                createdOn
            FROM
                brand_base
            ORDER BY
                createdOn ASC;
        `;
        const [rows] = await pool.query<BrandQueryResult[]>(query);
        return rows;
    }

    async findById(id: number): Promise<BrandQueryResult | null> {
        const query = `
            SELECT
                id,
                name,
                websiteUrl,
                isActive,
                countryOfOrigin,
                createdOn
            FROM
                brand_base
            WHERE id = ?;
        `;
        const [rows] = await pool.query<BrandQueryResult[]>(query, [id]);
        return rows[0] || null;
    }

    async create(brandData: { name: string, websiteUrl?: string | null, isActive?: boolean, countryOfOrigin?: string | null }): Promise<BrandQueryResult> {
        const { name, websiteUrl, isActive, countryOfOrigin } = brandData;
        const query = `
            INSERT INTO brand_base (name, websiteUrl, isActive, countryOfOrigin, createdOn)
            VALUES (?, ?, ?, ?, NOW());
        `;
        const [result] = await pool.query(query, [name, websiteUrl, isActive, countryOfOrigin]);
        
        const newBrandId = (result as any).insertId;
        const newBrand = await this.findById(newBrandId);
        
        if (!newBrand) {
            throw new Error('Failed to retrieve the newly created brand.');
        }

        return newBrand;
    }

    async update(id: number, updateData: UpdateBrandData): Promise<boolean> {
        const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
        const values = Object.values(updateData);

        if (values.length === 0) {
            return false;
        }

        const query = `
            UPDATE brand_base
            SET ${fields}
            WHERE id = ?;
        `;
        const [result] = await pool.query(query, [...values, id]);
        
        return (result as any).affectedRows > 0;
    }

    async delete(id: number): Promise<boolean> {
        const query = `
            DELETE FROM brand_base
            WHERE id = ?;
        `;
        const [result] = await pool.query(query, [id]);

        return (result as any).affectedRows > 0;
    }
}