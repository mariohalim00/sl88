import {
  mockCatalogDatasetSchema,
  type AdminInventoryRow,
  type MockCollection,
  type MockProduct,
} from "@/features/catalog/model/schemas";

const productsSeed: MockProduct[] = [
  {
    id: "c1",
    slug: "atlas-handwoven-wool",
    name: "Atlas Handwoven Wool",
    category: "wool",
    price: 2990000,
    currency: "IDR",
    description: "Dense wool carpet with tonal geometry for heavy-use family spaces.",
    imageUrl:
      "https://images.unsplash.com/photo-1582582621959-48d27397dc69?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1582582621959-48d27397dc69?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1616594039964-7f7f1334f1f7?auto=format&fit=crop&w=900&q=80",
    ],
    stock: 11,
    rating: 4.8,
  },
  {
    id: "c2",
    slug: "sahara-flatweave-runner",
    name: "Sahara Flatweave Runner",
    category: "modern",
    price: 1390000,
    currency: "IDR",
    description: "Low-profile runner designed for narrow hall transitions and easy cleaning.",
    imageUrl:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80",
    ],
    stock: 18,
    rating: 4.5,
  },
  {
    id: "c3",
    slug: "aria-bedroom-plush",
    name: "Aria Bedroom Plush",
    category: "silk",
    price: 2490000,
    currency: "IDR",
    description: "Soft-touch plush weave that reduces foot fatigue in calm bedroom settings.",
    imageUrl:
      "https://images.unsplash.com/photo-1616594039964-7f7f1334f1f7?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1616594039964-7f7f1334f1f7?auto=format&fit=crop&w=900&q=80",
    ],
    stock: 7,
    rating: 4.7,
  },
];

const collectionsSeed: MockCollection[] = [
  {
    id: "featured",
    title: "Featured Pieces",
    description: "Artisan-picked pieces for the current season.",
    productIds: ["c1", "c2"],
    featured: true,
  },
  {
    id: "restful-spaces",
    title: "Restful Spaces",
    description: "Calm textures and soft tones for bedrooms and lounge corners.",
    productIds: ["c3"],
    featured: false,
  },
];

const adminInventorySeed: AdminInventoryRow[] = productsSeed.map((product) => ({
  productId: product.id,
  name: product.name,
  category: product.category,
  stock: product.stock,
  status: product.stock === 0 ? "out_of_stock" : product.stock < 8 ? "low_stock" : "in_stock",
  lastUpdatedAt: "2026-05-16T09:30:00.000Z",
}));

const parsed = mockCatalogDatasetSchema.parse({
  products: productsSeed,
  collections: collectionsSeed,
  adminInventory: adminInventorySeed,
});

export const mockCatalog = parsed;
