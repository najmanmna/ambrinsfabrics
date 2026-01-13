// lib/queries.ts
import { defineQuery } from "next-sanity";

// 🔹 Banner (unchanged)
export const BANNER_QUERY = `*[_type == "banner"]{
  showOn,
  desktop { image, buttonTheme },
  mobile { image, buttonTheme }
}`;

// 🔹 Page content (unchanged)
export const PAGE_QUERY = `*[_type == "page" && slug.current == $slug][0]{
  title,
  content
}`;

// 🔹 Shipping settings (unchanged)
export const SHIPPING_QUERY = `*[_type == "settings"][0]{
  deliveryCharges {
    colombo,
    suburbs,
    others
  }
}`;

// 🔹 Featured Categories (main or sub doesn’t matter)
export const FEATURED_CATEGORY_QUERY = defineQuery(`
  *[_type == "category" && defined(featured) && featured == true] | order(name asc){
    _id,
    name,
    slug,
    parent->{
      name
    }
  }
`);

// 🔹 All Products (with variants, category, subcategory)


export const ALL_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product"] | order(name asc){
    _id,
    name,
    slug,
    price,
    discount,
    isFeatured,
    "category": category->{ _id, name, slug },
    "subcategory": subcategory->{ _id, name, slug },
    "collections": collections[]->{ _id, title, slug },
    variants[]{
      _key,
      variantName,
      openingStock,
      stockOut,
      // 👇 Keeps your stock logic accurate (Opening - Sold)
      "availableStock": openingStock - coalesce(stockOut, 0),
      
      // 👇 This is perfect for the image builder
      images[]
    }
  }
`);
// 🔹 Featured Products
export const FEATURE_PRODUCTS = defineQuery(`
  *[_type == "product" && isFeatured == true] | order(name asc){
    _id,
    name,
    slug,
    price,
    discount,
    "category": category->{
      name,
      slug
    },
    "subcategory": subcategory->{
      name,
      slug
    },
    variants[]{
      _key,
      variantName,
      openingStock,
      stockOut,
      "availableStock": openingStock - coalesce(stockOut, 0),
      images[]{asset->{url}}
    }
  }
`);

// 🔹 New Arrivals (Optional - if you want to tag new products manually, add a boolean field in schema later)
export const NEW_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product"] | order(_createdAt desc)[0...8]{
    _id,
    name,
    slug,
    price,
    discount,
    "category": category->{
      name,
      slug
    },
    "subcategory": subcategory->{
      name,
      slug
    },
    variants[]{
      variantName,
      openingStock,
      stockOut,
      "availableStock": openingStock - coalesce(stockOut, 0),
      images[]{asset->{url}}
    }
  }
`);

// 🔹 Single Product by Slug (with variants, category, subcategory)
export const PRODUCT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "product" && slug.current == $slug][0]{
    _id,
    name,
    slug,
    price,
    discount,
    isFeatured,
    
    // --- UPDATED SPECS ---
    material,
    width,
    handFeel,
    drape,
    translucency,
    useCases,
    description,
    // ---------------------

    "category": category->{
      _id,
      name,
      slug
    },
    "subcategory": subcategory->{
      _id,
      name,
      slug
    },
    variants[]{
      _key,
      variantName,
      openingStock,
      stockOut,
      "availableStock": openingStock - coalesce(stockOut, 0),
      images[]{asset->{url}}
    }
  }
`);

// 🔹 Address (unchanged)
export const ADDRESS_QUERY = defineQuery(`
  *[_type == "address"] | order(publishedAt desc)
`);

// 🔹 All Categories (for menus, etc.)


// 🔹 Subscribers (unchanged)
export const SUBSCRIBERS_QUERY = `*[_type == "subscribers"]{
  _id,
  email,
  createdAt
} | order(createdAt desc)`;

