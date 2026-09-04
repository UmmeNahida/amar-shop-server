export enum CategoryStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface ICategory {
  name: string;
  slug: string;
  description?: string;

  image?: {
    public_id: string;
    url: string;
  };

  status: CategoryStatus;
}