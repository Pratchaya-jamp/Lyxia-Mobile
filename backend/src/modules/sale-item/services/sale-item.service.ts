import { SaleItemRepository, SaleItemQueryResult, CreateSaleItemData, UpdateSaleItemData } from '../repositories/sale-item.repository';
import { BrandRepository } from '../repositories/brand.repository';

export class SaleItemService {
    constructor(
        private saleItemRepository: SaleItemRepository,
        private brandRepository: BrandRepository
    ) {}

    async getSaleItems(): Promise<SaleItemQueryResult[]> {
        return await this.saleItemRepository.findAll();
    }

    async getSaleItemById(id: number): Promise<SaleItemQueryResult | null> {
        return await this.saleItemRepository.findById(id);
    }

    async createSaleItem(data: CreateSaleItemData): Promise<SaleItemQueryResult> {
        const insertId = await this.saleItemRepository.create(data);
        const newItem = await this.saleItemRepository.findById(insertId);
        if (!newItem) {
            throw new Error('Failed to retrieve newly created item.');
        }
        return newItem;
    }

    async updateSaleItem(id: number, data: UpdateSaleItemData): Promise<SaleItemQueryResult> {
        const brand = await this.brandRepository.findById(data.brandId);
        if (!brand) {
            throw new Error('Brand not found.');
        }

        const itemExists = await this.saleItemRepository.findById(id);
        if (!itemExists) {
            throw new Error('Sale item not found.');
        }

        const success = await this.saleItemRepository.update(id, data);
        if (!success) {
            throw new Error('Failed to update sale item.');
        }

        const updatedItem = await this.saleItemRepository.findById(id);
        if (!updatedItem) {
            throw new Error('Failed to retrieve updated item.');
        }
        return updatedItem;
    }

    async deleteSaleItem(id: number): Promise<boolean> {
        const itemExists = await this.saleItemRepository.findById(id);
        if (!itemExists) {
            throw new Error('Sale item not found.');
        }
        return await this.saleItemRepository.remove(id);
    }
}