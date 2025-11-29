export interface InventoryDto {
  id: number;
  assetId: number;
  checkerId: number;
  kondisi: string;
  photoUrl: string | null;
  note: string | null;
  createdAt: Date;
  asset?: {
    id: number;
    kode: string;
    nama: string;
    category: {
      id: number;
      name: string;
    };
  };
  checker?: {
    id: number;
    name: string;
    username: string;
  };
}

export interface InventoryListDto {
  checks: InventoryDto[];
  meta: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
