import { z } from 'zod';

export const productSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.enum(['living-room', 'bedroom', 'outdoor', 'hallway']),
  price: z.number().positive(),
  description: z.string().min(1),
  imageUrl: z.url(),
  stock: z.number().int().nonnegative(),
  rating: z.number().min(0).max(5),
});

export const productListSchema = z.array(productSchema);

export type Product = z.infer<typeof productSchema>;

export type CartItem = {
  productId: Product['id'];
  quantity: number;
};
