export interface Category {
  id: string;
  name: string;
  slug: string;
  iconUrl?: string | null;
  description?: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}
