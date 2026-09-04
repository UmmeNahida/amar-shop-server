export enum BrandStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IBrand {
  name: string;
  slug: string;
  description?: string;

  logo?: {
    public_id: string;
    url: string;
  };

  status: BrandStatus;

  createdAt?: Date;
  updatedAt?: Date;
}