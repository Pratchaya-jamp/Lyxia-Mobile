// src/repositories/brand.repository.ts

import { pool } from '../../../db/db'; // สมมติว่า pool ถูก import จากตำแหน่งนี้
import { RowDataPacket, OkPacket } from 'mysql2/promise';

// --- Interfaces for Data Consistency ---

export interface BrandQueryResult extends RowDataPacket {
    id: number;
    name: string;
    websiteUrl: string | null;
    isActive: boolean;
    countryOfOrigin: string | null;
    createdOn: Date;
    updatedOn: Date;
    // noOfSaleItems: number; // หากต้องการรวมจำนวน Sale Item ใน Query
}

export interface CreateBrandData {
    name: string;
    websiteUrl: string | null;
    isActive: boolean;
    countryOfOrigin: string | null;
}

export interface UpdateBrandData {
    name?: string;
    websiteUrl?: string | null;
    isActive?: boolean;
    countryOfOrigin?: string | null;
}

// --- Custom Error Classes ---

export class DuplicateEntryError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DuplicateEntryError';
    }
}

export class ForeignKeyConstraintError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ForeignKeyConstraintError';
    }
}

// --- Repository Class ---

export class BrandRepository {

    // ❌ ลบ: ลบเมธอด private camelToSnakeCase(str: string) ออก
    // private camelToSnakeCase(str: string): string {
    //     return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    // }

    async findAll(): Promise<BrandQueryResult[]> {
        const query = `
            SELECT
                id,
                name,
                websiteUrl,
                isActive,
                countryOfOrigin,
                createdOn,
                updatedOn
            FROM
                brand_base
            ORDER BY
                createdOn ASC;
        `;
        // หมายเหตุ: โค้ดนี้สมมติว่าชื่อคอลัมน์ใน DB คือ websiteUrl, isActive, etc.
        const [rows] = await pool.query<BrandQueryResult[]>(query);
        return rows;
    }

    async findById(id: number): Promise<BrandQueryResult | null> {
        const query = `
            SELECT
                id, name, websiteUrl, isActive,
                countryOfOrigin, createdOn, updatedOn
            FROM brand_base
            WHERE id = ?;
        `;
        const [rows] = await pool.query<BrandQueryResult[]>(query, [id]);
        return rows[0] || null;
    }

    async create(data: CreateBrandData): Promise<BrandQueryResult> {
        const query = `
            INSERT INTO brand_base
                (name, websiteUrl, isActive, countryOfOrigin)
            VALUES (?, ?, ?, ?);
        `;
        try {
            const [result] = await pool.query<OkPacket>(query, [
                data.name,
                data.websiteUrl,
                data.isActive,
                data.countryOfOrigin
            ]);

            const newBrand = await this.findById(result.insertId);
            if (!newBrand) {
                throw new Error('Failed to retrieve newly created brand.');
            }
            return newBrand;

        } catch (error: any) {
            // MySQL Duplicate entry error code
            if (error.errno === 1062) {
                throw new DuplicateEntryError('Brand with this name already exists.');
            }
            throw error;
        }
    }

    async update(id: number, data: UpdateBrandData): Promise<boolean> {
        // ✅ แก้ไข: สร้าง fields โดยใช้ key (Camel Case) โดยตรง
        const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data);

        if (values.length === 0) {
            return false;
        }

        const query = `
            UPDATE brand_base
            SET ${fields}, updatedOn = NOW()
            WHERE id = ?;
        `;

        try {
            const [result] = await pool.query<OkPacket>(query, [...values, id]);
            return result.affectedRows > 0;
        } catch (error: any) {
            // MySQL Duplicate entry error code
            if (error.errno === 1062) {
                throw new DuplicateEntryError('Brand with this name already exists.');
            }
            throw error;
        }
    }

    async remove(id: number): Promise<boolean> {
        const query = `DELETE FROM brand_base WHERE id = ?;`;
        try {
            const [result] = await pool.query<OkPacket>(query, [id]);
            return result.affectedRows > 0;
        } catch (error: any) {
            // MySQL Foreign key constraint failure (e.g., brand_id in sale_item_base)
            if (error.errno === 1451) {
                throw new ForeignKeyConstraintError('Cannot delete brand because it has associated sale items.');
            }
            throw error;
        }
    }
}