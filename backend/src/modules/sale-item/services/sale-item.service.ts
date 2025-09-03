import { SaleItemRepository, SaleItemQueryResult, CreateSaleItemData, UpdateSaleItemData } from '../repositories/sale-item.repository';
import { BrandRepository } from '../repositories/brand.repository';

export class SaleItemService {
    constructor(
        private saleItemRepository: SaleItemRepository,
        private brandRepository: BrandRepository
    ) {}

    async getSaleItems(): Promise<SaleItemQueryResult[]> {
        // Assuming findAll() in the repository handles sorting
        return await this.saleItemRepository.findAll();
    }

    async getSaleItemById(id: number): Promise<SaleItemQueryResult | null> {
        return await this.saleItemRepository.findById(id);
    }

    async createSaleItem(data: CreateSaleItemData): Promise<SaleItemQueryResult> {
        // We can add a check for the brand here if we want the service to validate it.
        // The controller should already handle this with t.Numeric().
        const insertId = await this.saleItemRepository.create(data);
        const newItem = await this.saleItemRepository.findById(insertId);
        if (!newItem) {
            throw new Error('Failed to retrieve newly created item.');
        }
        return newItem;
    }

    async updateSaleItem(id: number, data: UpdateSaleItemData): Promise<SaleItemQueryResult> {
        if (data.brandId) {
            const brand = await this.brandRepository.findById(data.brandId);
            if (!brand) {
                throw new Error('Brand not found.');
            }
        }

        const success = await this.saleItemRepository.update(id, data);
        if (!success) {
            throw new Error('Sale item not found or failed to update.');
        }

        const updatedItem = await this.saleItemRepository.findById(id);
        if (!updatedItem) {
            throw new Error('Failed to retrieve updated item.');
        }
        return updatedItem;
    }

    async deleteSaleItem(id: number): Promise<boolean> {
        const success = await this.saleItemRepository.remove(id);
        if (!success) {
            throw new Error('Sale item not found.');
        }
        return true;
    }
}