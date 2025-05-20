import { PrismaClient } from '@/prisma/generated';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// Enhanced Unsplash image URLs with more variety
const UNSLASH_IMAGES = {
  women: [
    'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=800&auto=format&fit=crop', // Floral dress
    'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800&auto=format&fit=crop', // Dress side
    'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop', // Winter coat
    'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&auto=format&fit=crop', // Blouse
  ],
  men: [
    'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&auto=format&fit=crop', // White tee
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop', // Black tee
    'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop', // Formal shirt
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop', // Jeans
  ],
  kids: [
    'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800&auto=format&fit=crop', // Blocks
    'https://images.unsplash.com/photo-1604917621956-10dfa7cce2e7?w=800&auto=format&fit=crop', // Stuffed animal
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop', // Kids shoes
    'https://images.unsplash.com/photo-1594782914871-a2ec36a53c9a?w=800&auto=format&fit=crop', // Kids dress
  ],
  subcategoryIcons: {
    dresses: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=200&auto=format&fit=crop',
    tshirts: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=200&auto=format&fit=crop',
    jeans: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=200&auto=format&fit=crop',
    toys: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=200&auto=format&fit=crop',
    outerwear: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=200&auto=format&fit=crop',
    shoes: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&auto=format&fit=crop',
  },
  categoryBanners: {
    women: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=1200&auto=format&fit=crop',
    men: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=1200&auto=format&fit=crop',
    kids: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=1200&auto=format&fit=crop',
  }
};

async function main() {
  // Clear existing data
  await prisma.stock.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();

  // Create categories
  const womenCategory = await prisma.category.create({
    data: {
      id: uuidv4(),
      name: 'Women',
      slug: 'women',
      description: 'Trendy fashion for women',
      imageUrl: UNSLASH_IMAGES.categoryBanners.women,
    }
  });

  const menCategory = await prisma.category.create({
    data: {
      id: uuidv4(),
      name: 'Men',
      slug: 'men',
      description: 'Stylish apparel for men',
      imageUrl: UNSLASH_IMAGES.categoryBanners.men,
    }
  });

  const kidsCategory = await prisma.category.create({
    data: {
      id: uuidv4(),
      name: 'Kids',
      slug: 'kids',
      description: 'Cute outfits for children',
      imageUrl: UNSLASH_IMAGES.categoryBanners.kids,
    }
  });

  // Create subcategories
  const subcategories = await prisma.subcategory.createMany({
    data: [
      // Women's subcategories
      {
        id: uuidv4(),
        name: 'Dresses',
        slug: 'dresses',
        description: 'Beautiful dresses for all occasions',
        iconUrl: UNSLASH_IMAGES.subcategoryIcons.dresses,
        categoryId: womenCategory.id,
      },
      {
        id: uuidv4(),
        name: 'Outerwear',
        slug: 'outerwear',
        description: 'Jackets and coats for every season',
        iconUrl: UNSLASH_IMAGES.subcategoryIcons.outerwear,
        categoryId: womenCategory.id,
      },
      // Men's subcategories
      {
        id: uuidv4(),
        name: 'T-Shirts',
        slug: 't-shirts',
        description: 'Comfortable cotton t-shirts',
        iconUrl: UNSLASH_IMAGES.subcategoryIcons.tshirts,
        categoryId: menCategory.id,
      },
      {
        id: uuidv4(),
        name: 'Jeans',
        slug: 'jeans',
        description: 'Durable and stylish jeans',
        iconUrl: UNSLASH_IMAGES.subcategoryIcons.jeans,
        categoryId: menCategory.id,
      },
      // Kids' subcategories
      {
        id: uuidv4(),
        name: 'Toys',
        slug: 'toys',
        description: 'Fun and educational toys',
        iconUrl: UNSLASH_IMAGES.subcategoryIcons.toys,
        categoryId: kidsCategory.id,
      },
      {
        id: uuidv4(),
        name: 'Shoes',
        slug: 'shoes',
        description: 'Comfortable shoes for growing feet',
        iconUrl: UNSLASH_IMAGES.subcategoryIcons.shoes,
        categoryId: kidsCategory.id,
      },
    ],
  });

  // Get subcategory references
  const womenDresses = await prisma.subcategory.findUnique({ where: { slug: 'dresses' } });
  const womenOuterwear = await prisma.subcategory.findUnique({ where: { slug: 'outerwear' } });
  const menTshirts = await prisma.subcategory.findUnique({ where: { slug: 't-shirts' } });
  const menJeans = await prisma.subcategory.findUnique({ where: { slug: 'jeans' } });
  const kidsToys = await prisma.subcategory.findUnique({ where: { slug: 'toys' } });
  const kidsShoes = await prisma.subcategory.findUnique({ where: { slug: 'shoes' } });

  // WOMEN'S PRODUCTS
  const summerDress = await prisma.product.create({
    data: {
      id: uuidv4(),
      name: 'Summer Floral Dress',
      slug: 'summer-floral-dress',
      description: 'Lightweight dress with beautiful floral pattern, perfect for summer',
      basePrice: 59.99,
      categoryId: womenCategory.id,
      subcategoryId: womenDresses?.id,
      images: {
        create: [
          { id: uuidv4(), url: UNSLASH_IMAGES.women[0], altText: 'Front view', isPrimary: true },
          { id: uuidv4(), url: UNSLASH_IMAGES.women[1], altText: 'Side view', isPrimary: false },
        ],
      },
      variants: {
        create: ['XS', 'S', 'M', 'L', 'XL'].map(size => ({
          id: uuidv4(),
          name: size,
          priceOffset: size === 'XL' ? 7.0 : size === 'L' ? 5.0 : 0,
        })),
      },
    },
    include: { variants: true },
  });

  const winterCoat = await prisma.product.create({
    data: {
      id: uuidv4(),
      name: 'Winter Warm Coat',
      slug: 'winter-warm-coat',
      description: 'Insulated coat for cold weather with faux fur trim',
      basePrice: 149.99,
      categoryId: womenCategory.id,
      subcategoryId: womenOuterwear?.id,
      images: {
        create: [
          { id: uuidv4(), url: UNSLASH_IMAGES.women[2], altText: 'Winter coat front', isPrimary: true },
        ],
      },
      variants: {
        create: ['S', 'M', 'L'].map(size => ({
          id: uuidv4(),
          name: size,
          priceOffset: 0,
        })),
      },
    },
    include: { variants: true },
  });

  // MEN'S PRODUCTS
  const classicTee = await prisma.product.create({
    data: {
      id: uuidv4(),
      name: 'Classic White T-Shirt',
      slug: 'classic-white-t-shirt',
      description: '100% organic cotton t-shirt, unisex fit',
      basePrice: 29.99,
      categoryId: menCategory.id,
      subcategoryId: menTshirts?.id,
      images: {
        create: [
          { id: uuidv4(), url: UNSLASH_IMAGES.men[0], altText: 'White t-shirt front', isPrimary: true },
        ],
      },
      variants: {
        create: ['S', 'M', 'L', 'XL'].map(size => ({
          id: uuidv4(),
          name: size,
          priceOffset: size === 'XL' ? 2.0 : 0,
        })),
      },
    },
    include: { variants: true },
  });

  const blackTee = await prisma.product.create({
    data: {
      id: uuidv4(),
      name: 'Premium Black T-Shirt',
      slug: 'premium-black-t-shirt',
      description: 'High-quality black t-shirt with reinforced stitching',
      basePrice: 34.99,
      categoryId: menCategory.id,
      subcategoryId: menTshirts?.id,
      images: {
        create: [
          { id: uuidv4(), url: UNSLASH_IMAGES.men[1], altText: 'Black t-shirt front', isPrimary: true },
        ],
      },
      variants: {
        create: ['XS', 'S', 'M', 'L', 'XL'].map(size => ({
          id: uuidv4(),
          name: size,
          priceOffset: 0,
        })),
      },
    },
    include: { variants: true },
  });

  const slimJeans = await prisma.product.create({
    data: {
      id: uuidv4(),
      name: 'Slim Fit Jeans',
      slug: 'slim-fit-jeans',
      description: 'Stretch denim jeans with modern slim fit',
      basePrice: 79.99,
      categoryId: menCategory.id,
      subcategoryId: menJeans?.id,
      images: {
        create: [
          { id: uuidv4(), url: UNSLASH_IMAGES.men[3], altText: 'Jeans front view', isPrimary: true },
        ],
      },
      variants: {
        create: [
          { id: uuidv4(), name: '28/32', priceOffset: 0 },
          { id: uuidv4(), name: '30/32', priceOffset: 0 },
          { id: uuidv4(), name: '32/32', priceOffset: 0 },
          { id: uuidv4(), name: '34/32', priceOffset: 0 },
        ],
      },
    },
    include: { variants: true },
  });

  // KIDS' PRODUCTS
  const kidsBlocks = await prisma.product.create({
    data: {
      id: uuidv4(),
      name: 'Educational Building Blocks',
      slug: 'educational-building-blocks',
      description: '100-piece colorful building blocks set for creative play',
      basePrice: 39.99,
      categoryId: kidsCategory.id,
      subcategoryId: kidsToys?.id,
      images: {
        create: [
          { id: uuidv4(), url: UNSLASH_IMAGES.kids[0], altText: 'Blocks set', isPrimary: true },
        ],
      },
      variants: {
        create: [
          { id: uuidv4(), name: 'N/A', priceOffset: 0 },
        ],
      },
    },
    include: { variants: true },
  });

  const stuffedAnimal = await prisma.product.create({
    data: {
      id: uuidv4(),
      name: 'Plush Teddy Bear',
      slug: 'plush-teddy-bear',
      description: 'Soft and cuddly teddy bear for bedtime',
      basePrice: 24.99,
      categoryId: kidsCategory.id,
      subcategoryId: kidsToys?.id,
      images: {
        create: [
          { id: uuidv4(), url: UNSLASH_IMAGES.kids[1], altText: 'Teddy bear', isPrimary: true },
        ],
      },
      variants: {
        create: [
          { id: uuidv4(), name: 'Small (12")', priceOffset: 0 },
          { id: uuidv4(), name: 'Medium (18")', priceOffset: 5.0 },
          { id: uuidv4(), name: 'Large (24")', priceOffset: 10.0 },
        ],
      },
    },
    include: { variants: true },
  });

  const kidsSneakers = await prisma.product.create({
    data: {
      id: uuidv4(),
      name: 'Kids Running Shoes',
      slug: 'kids-running-shoes',
      description: 'Lightweight sneakers with velcro straps for easy wear',
      basePrice: 49.99,
      categoryId: kidsCategory.id,
      subcategoryId: kidsShoes?.id,
      images: {
        create: [
          { id: uuidv4(), url: UNSLASH_IMAGES.kids[2], altText: 'Kids shoes', isPrimary: true },
        ],
      },
      variants: {
        create: [
          { id: uuidv4(), name: 'Size 10', priceOffset: 0 },
          { id: uuidv4(), name: 'Size 11', priceOffset: 0 },
          { id: uuidv4(), name: 'Size 12', priceOffset: 0 },
          { id: uuidv4(), name: 'Size 13', priceOffset: 0 },
        ],
      },
    },
    include: { variants: true },
  });

  // Create stock entries for all products
  const stockData = [
    // Summer Dress
    ...summerDress.variants.map((v, i) => ({
      id: uuidv4(),
      productId: summerDress.id,
      variantId: v.id,
      quantity: [10, 25, 30, 20, 15][i] || 10,
      barcode: `DRES${v.name.toUpperCase().replace('/', '')}${i+1}`,
      sku: `SFDR-${v.name}`,
      location: `WH-A1-${10+i}`,
    })),
    
    // Winter Coat
    ...winterCoat.variants.map((v, i) => ({
      id: uuidv4(),
      productId: winterCoat.id,
      variantId: v.id,
      quantity: [8, 12, 10][i] || 5,
      barcode: `COAT${v.name.toUpperCase().replace('/', '')}${i+1}`,
      sku: `WWC-${v.name}`,
      location: `WH-A2-${10+i}`,
    })),
    
    // Classic Tee
    ...classicTee.variants.map((v, i) => ({
      id: uuidv4(),
      productId: classicTee.id,
      variantId: v.id,
      quantity: [20, 35, 30, 25][i] || 15,
      barcode: `WTEE${v.name.toUpperCase().replace('/', '')}${i+1}`,
      sku: `CWTS-${v.name}`,
      location: `WH-B1-${10+i}`,
    })),
    
    // Black Tee
    ...blackTee.variants.map((v, i) => ({
      id: uuidv4(),
      productId: blackTee.id,
      variantId: v.id,
      quantity: [15, 25, 30, 20, 15][i] || 10,
      barcode: `BTEE${v.name.toUpperCase().replace('/', '')}${i+1}`,
      sku: `PBTS-${v.name}`,
      location: `WH-B2-${10+i}`,
    })),
    
    // Slim Jeans
    ...slimJeans.variants.map((v, i) => ({
      id: uuidv4(),
      productId: slimJeans.id,
      variantId: v.id,
      quantity: [12, 18, 15, 10][i] || 8,
      barcode: `JEAN${v.name.replace('/', '')}${i+1}`,
      sku: `SFJ-${v.name.replace('/', '-')}`,
      location: `WH-B3-${10+i}`,
    })),
    
    // Kids Blocks
    ...kidsBlocks.variants.map((v, i) => ({
      id: uuidv4(),
      productId: kidsBlocks.id,
      variantId: v.id,
      quantity: 30,
      barcode: `BLOK${i+1}`,
      sku: `EBB-100`,
      location: `WH-C1-10`,
    })),
    
    // Teddy Bear
    ...stuffedAnimal.variants.map((v, i) => ({
      id: uuidv4(),
      productId: stuffedAnimal.id,
      variantId: v.id,
      quantity: [25, 15, 10][i] || 5,
      barcode: `TEDY${i+1}`,
      sku: `PTB-${v.name.split(' ')[0]}`,
      location: `WH-C2-${10+i}`,
    })),
    
    // Kids Shoes
    ...kidsSneakers.variants.map((v, i) => ({
      id: uuidv4(),
      productId: kidsSneakers.id,
      variantId: v.id,
      quantity: [15, 12, 10, 8][i] || 5,
      barcode: `SHOE${v.name.replace(' ', '')}${i+1}`,
      sku: `KRS-${v.name.split(' ')[1]}`,
      location: `WH-C3-${10+i}`,
    })),
  ];

  await prisma.stock.createMany({ data: stockData });

  console.log('Database seeded successfully with:');
  console.log(`- 3 categories`);
  console.log(`- 6 subcategories`);
  console.log(`- 8 products`);
  console.log(`- ${stockData.length} stock entries`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });