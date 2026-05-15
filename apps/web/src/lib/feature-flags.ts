import { z } from "zod";

const featureFlagsSchema = z.object({
  checkoutEnabled: z.boolean().default(false),
  paymentEnabled: z.boolean().default(false),
  adminActionsEnabled: z.boolean().default(false),
});

export type FeatureFlags = z.infer<typeof featureFlagsSchema>;

const defaultFeatureFlagsInput: FeatureFlags = {
  checkoutEnabled: false,
  paymentEnabled: false,
  adminActionsEnabled: false,
};

export const featureFlags = featureFlagsSchema.parse(defaultFeatureFlagsInput);
