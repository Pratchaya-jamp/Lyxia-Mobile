// src/services/brand.service.ts
import { BrandRepository, BrandQueryResult } from '../repositories/brand.repository';

export class BrandService {
    constructor(private brandRepository: BrandRepository) {}

    async getBrands(): Promise<BrandQueryResult[]> {
        const allBrands = await this.brandRepository.findAll();
        // Sort brands by createdOn ascending, as per PBI requirement
        const sortedBrands = [...allBrands].sort((a, b) => a.createdOn.getTime() - b.createdOn.getTime());
        return sortedBrands;
    }

    async createBrand(brandData: { name: string, websiteUrl?: string, isActive?: boolean, countryOfOrigin?: string }): Promise<BrandQueryResult> {
        const brandToCreate = {
            ...brandData,
            isActive: brandData.isActive !== undefined ? brandData.isActive : true,
        };
        return this.brandRepository.create(brandToCreate);
    }

    async updateBrand(id: number, updateData: { name?: string, websiteUrl?: string, isActive?: boolean, countryOfOrigin?: string }): Promise<BrandQueryResult | null> {
        // First, perform the update and check the result directly from the repository.
        const updateWasSuccessful = await this.brandRepository.update(id, updateData);

        if (!updateWasSuccessful) {
            // If the update was not successful, it means the brand with that ID was not found.
            // In this case, we return null to the controller.
            return null;
        }
        
        // If the update succeeded, we fetch and return the complete updated brand object.
        return this.brandRepository.findById(id);
    }

    async deleteBrand(id: number): Promise<boolean> {
        // The repository's delete method already returns a boolean indicating success.
        // We can just return that result directly.
        const deleted = await this.brandRepository.delete(id);
        
        // The service layer might add more complex logic here, like deleting related records.
        // But for now, we just pass the boolean result.
        return deleted;
    }
}