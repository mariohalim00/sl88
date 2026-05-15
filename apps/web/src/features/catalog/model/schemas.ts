import { z } from "zod";

export const mockProductSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  category: z.enum(["wool", "silk", "modern", "persian", "outdoor", "other"]),
  price: z.number().positive(),
  currency: z.enum(["IDR", "USD"]),
  description: z.string().min(1),
  imageUrl: z.url(),
  gallery: z.array(z.url()).min(1),
  stock: z.number().int().nonnegative(),
  rating: z.number().min(0).max(5),
});

export const mockCollectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  productIds: z.array(z.string().min(1)),
  featured: z.boolean(),
});

export const adminInventoryRowSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  stock: z.number().int().nonnegative(),
  status: z.enum(["in_stock", "low_stock", "out_of_stock"]),
  lastUpdatedAt: z.iso.datetime(),
});

export const mockCatalogDatasetSchema = z.object({
  products: z.array(mockProductSchema),
  collections: z.array(mockCollectionSchema),
  adminInventory: z.array(adminInventoryRowSchema),
});

export type MockProduct = z.infer<typeof mockProductSchema>;
export type MockCollection = z.infer<typeof mockCollectionSchema>;
export type AdminInventoryRow = z.infer<typeof adminInventoryRowSchema>;
export type MockCatalogDataset = z.infer<typeof mockCatalogDatasetSchema>;
