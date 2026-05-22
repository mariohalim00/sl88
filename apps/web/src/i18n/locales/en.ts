export const en = {
  common: {
    languageSelection: 'Language selection',
    languages: {
      en: 'English',
      id: 'Bahasa',
    },
    actions: {
      contactUs: 'Contact Us',
      prev: 'Prev',
      next: 'Next',
      addToBag: 'Add to Bag',
    },
    labels: {
      cartItems: 'Cart Items',
    },
  },
  header: {
    nav: {
      aboutUs: 'About Us',
      collection: 'Collection',
      visitUs: 'Visit Us',
      catalogue: 'Catalogue',
    },
    aria: {
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      bag: 'Bag',
      favorites: 'Favorites',
      account: 'Account',
    },
  },
  footer: {
    rightsReserved: 'All Rights Reserved.',
    shippingReturns: 'Shipping & Returns',
    carpetCareGuide: 'Carpet Care Guide',
  },
  landing: {
    hero: {
      wovenForYou: 'Woven for You.',
      description:
        'Experience handcrafted carpets that blend timeless tradition with contemporary calm. Each piece is designed to transform daily spaces into warm, tactile galleries.',
      exploreCollections: 'Explore Collections',
      viewSignature: 'View Signature',
      slideAlt1: 'Luxury living room with handcrafted carpet',
      slideAlt2: 'Bespoke carpet collection in a curated interior',
      slideAlt3: 'Artisan weaving process with traditional techniques',
      goToSlide: 'Go to slide {{count}}',
    },
    collections: {
      title: 'Curated Collections',
      description:
        'Explore categories designed for modern homes, refined entrances, and high-comfort interiors.',
      kitchenCarpetsTitle: 'Kitchen Carpets',
      kitchenCarpetsDescription: 'Durable elegance for culinary spaces.',
      welcomeMatsTitle: 'Welcome Mats',
      welcomeMatsDescription: 'The first impression.',
      carCarpetsTitle: 'Car Carpets',
      carCarpetsDescription: 'Luxury in motion.',
      bespokeCollectionTitle: 'Bespoke Collection',
      bespokeCollectionDescription:
        'Commission a masterpiece tailored to your vision and space.',
    },
    about: {
      imageAlt: 'Artisan weaving process',
      title: 'About Us',
      description:
        'Based in {{city}}, our master artisans preserve traditional weaving methods with ethically sourced materials. Every knot reflects patience, precision, and enduring beauty.',
    },
    contact: {
      title: 'Visit the Shop!',
      description:
        'Visit our ecommerce links or schedule a visit to the shop in {{city}}.',
      marketplace: {
        tokopedia: 'Tokopedia',
        tiktokShop: 'TikTok Shop',
        shopee: 'Shopee',
      },
      alt: {
        tokopedia: 'Tokopedia logo',
        tiktok: 'TikTok logo',
        shopee: 'Shopee logo',
      },
    },
  },
  shopAll: {
    categoriesTitle: 'Categories',
    priceRangeTitle: 'Price Range',
    materialTitle: 'Material',
    title: 'Shop All',
    loadMoreArtifacts: 'Load More Artifacts',
    categories: {
      kitchen: 'Kitchen',
      welcomeMats: 'Welcome Mats',
      car: 'Car',
      office: 'Office',
      outdoor: 'Outdoor',
    },
    materials: {
      wool: 'Wool',
      silk: 'Silk',
      cotton: 'Cotton',
      jute: 'Jute',
    },
  },
  shopAllFilter: {
    quickFilters: {
      kitchen: 'Kitchen',
      welcomeMats: 'Welcome Mats',
      outdoor: 'Outdoor',
      wool: 'Wool',
      silk: 'Silk',
      jute: 'Jute',
    },
    searchPlaceholder: 'Search by style, room, or product name',
    searchAria: 'Search products',
    itemsInBag_one: '{{count}} item in bag',
    itemsInBag_other: '{{count}} items in bag',
    sort: {
      recommended: 'Recommended',
      newestArrivals: 'Newest Arrivals',
      priceLowToHigh: 'Price: Low to High',
      priceHighToLow: 'Price: High to Low',
    },
  },
  mockNotice: {
    title: 'Preview Notice',
    description:
      'Cart interactions are available for preview. Orders and payment are not processed in this build.',
  },
  storefront: {
    loadingCatalog: 'Loading catalog...',
    loadError: 'Could not load catalog data.',
  },
  storeHeader: {
    badge: 'SL88 MVP Catalog',
    title: 'Find carpets that match your space',
    description:
      'Browse our starter collection with mock inventory, realistic pricing, and a testable cart workflow ready for future API integration.',
    searchPlaceholder: 'Search by style, room, or product name',
    searchAria: 'Search products',
  },
  cartSummary: {
    title: 'Your Bag',
    description: 'Review selected pieces before checkout becomes available.',
    empty: 'No items yet. Add products from the collection.',
    qtyLine: 'Qty {{quantity}} • {{amount}}',
    removeAria: 'Remove {{name}}',
    subtotal: 'Subtotal',
  },
  productCard: {
    saveAria: 'Save {{name}}',
    inStock: 'In stock: {{count}}',
    rating: 'Rating {{value}} / 5',
  },
  productGrid: {
    noMatchesTitle: 'No matches found',
    noMatchesDescription: 'Try searching by room type, style, or material.',
  },
  productDetails: {
    notFoundTitle: 'Product not found',
    notFoundDescription: 'The selected piece is not available in this collection.',
    returnToShopAll: 'Return to Shop All',
    handcraftedCategory: 'Handcrafted {{category}}',
    inStockReadyToShip: 'In stock and ready to ship',
    descriptionSuffix:
      'Crafted for comfort and visual clarity, this piece adds quiet luxury to everyday spaces.',
    inquireNow: 'Inquire Now',
    specs: {
      origin: 'Origin:',
      originValue: 'Indonesia',
      material: 'Material:',
      materialBlend: '{{category}} blend',
      stock: 'Stock:',
      stockAvailable: '{{count}} available',
      rating: 'Rating:',
    },
    galleryView: '{{name}} view {{index}}',
    relatedTitle: 'You May Also Like',
  },
  admin: {
    pageTitle: 'Admin Panel',
    pageDescription:
      'Inventory snapshot for MVP preview. Non-priority operations remain disabled by default.',
    actions: {
      publishInventoryUpdate: 'Publish Inventory Update',
      triggerCheckoutSmokeTest: 'Trigger Checkout Smoke Test',
    },
    table: {
      headers: {
        product: 'Product',
        category: 'Category',
        stock: 'Stock',
        status: 'Status',
        lastUpdate: 'Last Update',
      },
      status: {
        inStock: 'In Stock',
        lowStock: 'Low Stock',
        outOfStock: 'Out of Stock',
        unknown: 'Unknown',
      },
    },
  },
} as const;
