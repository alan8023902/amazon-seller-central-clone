import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export class DataService {
  private dataDir: string;

  constructor() {
    this.dataDir = path.join(__dirname, '../../data');
    this.ensureDataDirectory();
  }

  private async ensureDataDirectory() {
    await fs.ensureDir(this.dataDir);
  }

  private getFilePath(filename: string): string {
    return path.join(this.dataDir, `${filename}.json`);
  }

  async readData<T>(filename: string): Promise<T[]> {
    try {
      const filePath = this.getFilePath(filename);
      const exists = await fs.pathExists(filePath);
      
      if (!exists) {
        await this.writeData(filename, []);
        return [];
      }
      
      const data = await fs.readJson(filePath);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error(`Error reading ${filename}:`, error);
      return [];
    }
  }

  async writeData<T>(filename: string, data: T[]): Promise<void> {
    try {
      const filePath = this.getFilePath(filename);
      await fs.writeJson(filePath, data, { spaces: 2 });
    } catch (error) {
      console.error(`Error writing ${filename}:`, error);
      throw error;
    }
  }

  async findById<T extends { id: string }>(filename: string, id: string): Promise<T | null> {
    const data = await this.readData<T>(filename);
    return data.find(item => item.id === id) || null;
  }

  async findByStoreId<T extends { store_id: string }>(filename: string, storeId: string): Promise<T[]> {
    const data = await this.readData<T>(filename);
    return data.filter(item => item.store_id === storeId);
  }

  async create<T extends { id?: string }>(filename: string, item: Omit<T, 'id'> & { id?: string }): Promise<T> {
    const data = await this.readData<T>(filename);
    const newItem = {
      ...item,
      id: item.id || uuidv4(),
    } as T;
    
    data.push(newItem);
    await this.writeData(filename, data);
    return newItem;
  }

  async update<T extends { id: string }>(filename: string, id: string, updates: Partial<T>): Promise<T | null> {
    const data = await this.readData<T>(filename);
    const index = data.findIndex(item => item.id === id);
    
    if (index === -1) {
      return null;
    }
    
    data[index] = { ...data[index], ...updates };
    await this.writeData(filename, data);
    return data[index];
  }

  async delete<T extends { id: string }>(filename: string, id: string): Promise<boolean> {
    const data = await this.readData<T>(filename);
    const index = data.findIndex(item => item.id === id);
    
    if (index === -1) {
      return false;
    }
    
    data.splice(index, 1);
    await this.writeData(filename, data);
    return true;
  }

  async paginate<T>(
    data: T[], 
    page: number = 1, 
    limit: number = 10
  ): Promise<{
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const total = data.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      data: data.slice(startIndex, endIndex),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }
}

export const dataService = new DataService();