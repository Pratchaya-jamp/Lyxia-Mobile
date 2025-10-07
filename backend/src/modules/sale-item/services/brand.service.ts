// src/services/brand.service.ts

import {
    BrandRepository,
    BrandQueryResult,
    UpdateBrandData,
    CreateBrandData,
    // Note: DuplicateEntryError and ForeignKeyConstraintError are needed if you use them here
} from '../repositories/brand.repository';

// Note: Ensure all interfaces (BrandQueryResult, UpdateBrandData, CreateBrandData)
// are correctly imported from the repository file.

export class BrandService {
    constructor(private brandRepository: BrandRepository) {}

    async getBrands(): Promise<BrandQueryResult[]> {
        return await this.brandRepository.findAll();
    }

    async createBrand(data: CreateBrandData): Promise<BrandQueryResult> {
        // Validation: Brand name is required
        if (!data.name || data.name.trim() === '') {
            throw new Error('Brand name is required.');
        }

        // Set default for isActive และจัดการค่าที่เป็น null/undefined ก่อนส่งให้ Repository
        const brandData: CreateBrandData = {
            ...data,
            name: data.name.trim(),

            // ✅ แก้ไข: ใช้ ternary operator เพื่อจัดการค่าที่เป็น null/undefined ก่อน trim
            websiteUrl: data.websiteUrl ? data.websiteUrl.trim() : null,
            countryOfOrigin: data.countryOfOrigin ? data.countryOfOrigin.trim() : null,

            isActive: data.isActive !== undefined ? data.isActive : true
        };

        return await this.brandRepository.create(brandData);
    }

    async updateBrand(id: number, data: UpdateBrandData): Promise<BrandQueryResult | null> {
        const existing = await this.brandRepository.findById(id);
        if (!existing) {
            return null; // 404: Id not found
        }

        // Trim fields before sending to repository
        const updateData: UpdateBrandData = {};

        // ✅ แก้ไข: ตรวจสอบและจัดการค่าที่เป็น null/undefined ใน Update
        if (data.name !== undefined) {
            updateData.name = data.name.trim();
        }

        if (data.websiteUrl !== undefined) {
            // หากส่งมา ให้ trim หากไม่เป็น null มิฉะนั้นตั้งค่าเป็น null
            updateData.websiteUrl = data.websiteUrl ? data.websiteUrl.trim() : null;
        }

        if (data.isActive !== undefined) {
            updateData.isActive = data.isActive;
        }

        if (data.countryOfOrigin !== undefined) {
            // หากส่งมา ให้ trim หากไม่เป็น null มิฉะนั้นตั้งค่าเป็น null
            updateData.countryOfOrigin = data.countryOfOrigin ? data.countryOfOrigin.trim() : null;
        }

        // If no fields were provided for update
        if (Object.keys(updateData).length === 0) {
            return existing;
        }

        const success = await this.brandRepository.update(id, updateData);
        if (!success) {
            // 500: Update failed for non-404 reasons
            throw new Error('Update failed.');
        }

        return await this.brandRepository.findById(id);
    }

    async deleteBrand(id: number): Promise<boolean> {
        const existing = await this.brandRepository.findById(id);
        if (!existing) {
            return false; // 404: Id not found
        }

        return await this.brandRepository.remove(id);
    }
}