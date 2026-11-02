export interface Asset {
  id: string;
  title: string;
  description?: string;
  category?: string;
  creator?: string;
  tags?: string[];
  version?: string;
  publishedAt: string;
  updatedAt?: string;
  thumbnailUrl?: string;
  packageUrl?: string;
  licenseUrl?: string;
}
