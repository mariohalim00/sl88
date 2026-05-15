---
name: Artisan Loom
colors:
  surface: '#fcf9ee'
  surface-dim: '#dddacf'
  surface-bright: '#fcf9ee'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f4e9'
  surface-container: '#f1eee3'
  surface-container-high: '#ebe8dd'
  surface-container-highest: '#e5e2d8'
  on-surface: '#1c1c15'
  on-surface-variant: '#504533'
  inverse-surface: '#31312a'
  inverse-on-surface: '#f4f1e6'
  outline: '#827560'
  outline-variant: '#d4c4ac'
  surface-tint: '#7a5900'
  primary: '#7a5900'
  on-primary: '#ffffff'
  primary-container: '#f4b400'
  on-primary-container: '#654800'
  inverse-primary: '#fdbc13'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfde'
  on-secondary-container: '#636262'
  tertiary: '#a8381a'
  on-tertiary: '#ffffff'
  tertiary-container: '#ffa993'
  on-tertiary-container: '#902709'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdea3'
  primary-fixed-dim: '#fdbc13'
  on-primary-fixed: '#261900'
  on-primary-fixed-variant: '#5d4200'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#ffdbd2'
  tertiary-fixed-dim: '#ffb4a1'
  on-tertiary-fixed: '#3c0800'
  on-tertiary-fixed-variant: '#872103'
  background: '#fcf9ee'
  on-background: '#1c1c15'
  surface-variant: '#e5e2d8'
typography:
  display-lg:
    fontFamily: notoSerif
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: notoSerif
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: notoSerif
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-lg:
    fontFamily: manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-md:
    fontFamily: manrope
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  section-padding: 80px
---

## Brand & Style

This design system is built on the pillars of **craftsmanship, tradition, and modern luxury**. It caters to a discerning audience that values the tactile heritage of fine carpets while expecting a seamless, high-end digital shopping experience.

The visual direction follows a **Minimalist Corporate** aesthetic. It prioritizes clarity and whitespace to allow the intricate patterns and textures of the carpets to remain the focal point. By blending traditional editorial layouts with modern UI precision, the design system evokes a sense of "digital atelier"—where professional reliability meets artistic excellence.

The emotional response should be one of quiet confidence and trustworthiness. Every interaction is designed to feel intentional and spacious, avoiding the cluttered "discount" feel often found in retail, and instead leaning into a curated, gallery-like presentation.

## Colors

The color palette is anchored by **Golden Yellow**, used sparingly for high-impact calls to action and to signify premium quality. The primary background is a **Soft Off-White (#F7F4E9)**, which provides a warmer, more sophisticated canvas than pure white, echoing the natural fibers of wool and silk.

**Deep Charcoal (#1A1A1A)** and **Slate (#2D3436)** are utilized for typography and structural elements to ensure high contrast and legibility. **Grey (#9E9E9E)** serves as a functional neutral for borders, secondary icons, and disabled states. A deep **Terracotta (#B64223)** is included as a tertiary accent color for seasonal highlights or specific product categories (e.g., Persian/Oriental), maintaining a connection to traditional dye palettes found in the reference inspiration.

## Typography

This design system employs a sophisticated typographic pairing to balance tradition and utility. 

**Noto Serif** is the headline face. Its classic proportions and elegant serifs communicate the craftsmanship and heritage inherent in the carpet-making industry. It should be used for large page titles, section headers, and product names.

**Manrope** is used for all UI elements, body text, and labels. Its modern, geometric construction ensures maximum legibility across different screen sizes. For buttons and navigational labels, a semi-bold weight with increased letter-spacing is used to create a professional, architectural feel. 

Large-scale "Display" type should be set with slightly tighter letter-spacing to maintain a premium editorial look, while body text should have generous line-height to ensure a comfortable reading experience on long-form content pages.

## Layout & Spacing

The layout utilizes a **Fixed Grid** system for desktop (1280px max width) to maintain a curated, boutique feel, while remaining fully fluid for mobile and tablet devices. 

A 12-column grid is standard, with generous **64px side margins** on desktop to create the "spacious" feeling requested. Inter-section spacing is intentionally high (80px+) to allow the eye to rest and to separate different carpet collections or content blocks clearly.

Vertical rhythm is based on an **8px base unit**. All padding and margins should be multiples of 8 (8, 16, 24, 32, 48, 64). Gutters are fixed at 24px to ensure product cards in a grid have enough breathing room to be viewed as individual artworks.

## Elevation & Depth

To maintain a clean and modern aesthetic, depth is primarily conveyed through **Tonal Layering** rather than heavy shadows.

- **Level 0 (Surface):** The Soft Off-White background.
- **Level 1 (Cards/Containers):** Pure White (#FFFFFF) surfaces with a subtle, low-contrast 1px border (#E0E0E0).
- **Level 2 (Popovers/Dropdowns):** Pure White with an "Ambient Shadow"—a soft, diffused shadow with a large blur radius (20px) and very low opacity (5-8%) using a Slate tint.

This "low-contrast outline" approach ensures the UI feels light and airy. Interactive elements may use a subtle lift effect on hover (lifting 2px with a slightly more pronounced shadow) to indicate clickability without breaking the minimalist aesthetic.

## Shapes

The shape language is **Soft and Precise**. A consistent **4px radius (0.25rem)** is applied to standard UI components like buttons, input fields, and product cards. This small radius softens the "industrial" feel of sharp corners while maintaining the professional, serious tone of a premium retailer.

Larger containers, such as promotional banners or hero images, may utilize an 8px radius to feel slightly more approachable, but pill-shaped elements should be avoided to stay within the "professional" and "modern" brand guardrails.

## Components

### Product Cards
Refined and minimal. The image occupies the top 75% of the card. Below the image, the product name is set in Noto Serif (Headline-md) with the price and material type in Manrope (Body-md). On hover, a "Quick View" button or a secondary image (detail shot of the carpet weave) may fade in.

### Buttons
- **Primary:** Solid Golden Yellow (#F4B400) with Slate text. Rectangular with a 4px radius.
- **Secondary:** Outlined Slate (#1A1A1A) with 1px border.
- **Tertiary/Ghost:** Text-only with a Slate bottom-border on hover, used for "Read More" or "View All" actions.

### Data Tables (Admin Panel)
Clean, high-legibility tables with no vertical lines. Horizontal lines should be thin and light grey (#E0E0E0). Header rows use a Slate background with White text and Manrope Semi-bold labels for maximum clarity. Generous 16px cell padding ensures data is easy to parse.

### Input Fields
Soft Off-White background with a 1px Grey (#9E9E9E) border that transitions to Golden Yellow on focus. Labels are always positioned above the field in Manrope Semi-bold (Label-md).

### Filter Chips
Used for carpet categories (e.g., "Wool," "Silk," "Modern," "Persian"). These are light grey with Slate text, becoming Golden Yellow with a Slate border when selected.

### Image Gallery
High-quality zoom functionality is critical. Use a "lightbox" style with a blurred backdrop and minimalist navigation arrows to keep the focus on the carpet's intricate details.