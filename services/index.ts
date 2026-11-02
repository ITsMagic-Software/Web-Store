import { getAsset, getAssets, getCatalog } from "@/services/storeService";
import type { AssetCatalogPage, AssetCatalogResult, AssetLookupResult, CatalogParams } from "@/services/storeService";
import type { Asset } from "@/domain/models";

export interface StoreRepository {
  getSnapshot(): Promise<AssetCatalogResult>;
  listAssets(params?: CatalogParams): Promise<AssetCatalogPage>;
  getAsset(id: string): Promise<AssetLookupResult>;
}

const githubManifestRepository: StoreRepository = {
  getSnapshot: getAssets,
  listAssets: getCatalog,
  getAsset,
};

export const storeRepository = githubManifestRepository;
export type { Asset, AssetCatalogPage, AssetCatalogResult, AssetLookupResult, CatalogParams };
