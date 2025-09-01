import { BrandRepository, BrandQueryResult } from '../repositories/brand.repository';

export class BrandService {
    constructor(private brandRepository: BrandRepository) {}

    async getBrands(): Promise<BrandQueryResult[]> {
        return await this.brandRepository.findAll();
    }
}