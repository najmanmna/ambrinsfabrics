import { sanityFetch } from "../lib/live";
import {
  ADDRESS_QUERY,
  ALL_PRODUCTS_QUERY,

  BANNER_QUERY,
  FEATURE_PRODUCTS,
  FEATURED_CATEGORY_QUERY,
  PRODUCT_BY_SLUG_QUERY,

  NEW_PRODUCTS_QUERY,
} from "./query";

// 🔹 Banner
const getBanner = async () => {
  try {
    const { data } = await sanityFetch({ query: BANNER_QUERY });
    return data ?? [];
  } catch (error) {
    console.error("Error fetching sale banner:", error);
    return [];
  }
};

// 🔹 Featured Categories
const getFeaturedCategory = async (quantity: number) => {
  try {
    const { data } = await sanityFetch({
      query: FEATURED_CATEGORY_QUERY,
      params: { quantity },
    });
    return data ?? [];
  } catch (error) {
    console.error("Error fetching featured category:", error);
    return [];
  }
};



// 🔹 All Products
const getAllProducts = async () => {
  try {
    const { data } = await sanityFetch({ query: ALL_PRODUCTS_QUERY });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching all products:", error);
    return [];
  }
};

// 🔹 Featured Products
const getFeaturedProducts = async () => {
  try {
    const { data } = await sanityFetch({ query: FEATURE_PRODUCTS });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching featured products:", error);
    return [];
  }
};

// 🔹 Hot Products
// const getHotProducts = async () => {
//   try {
//     const { data } = await sanityFetch({ query: HOT_PRODUCTS_QUERY });
//     return data ?? [];
//   } catch (error) {
//     console.log("Error fetching hot products:", error);
//     return [];
//   }
// };

// 🔹 Deal Products
// const getDealProducts = async () => {
//   try {
//     const { data } = await sanityFetch({ query: DEAL_PRODUCTS_QUERY });
//     return data ?? [];
//   } catch (error) {
//     console.log("Error fetching deal products:", error);
//     return [];
//   }
// };

// 🔹 New Products
const getNewProducts = async () => {
  try {
    const { data } = await sanityFetch({ query: NEW_PRODUCTS_QUERY });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching new products:", error);
    return [];
  }
};

// 🔹 Addresses
const getAddresses = async () => {
  try {
    const { data } = await sanityFetch({ query: ADDRESS_QUERY });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching address:", error);
    return [];
  }
};

// 🔹 Categories with Product Count
const getCategories = async (quantity?: number) => {
  try {
    const query = quantity
      ? `*[_type == 'category' && !defined(parent)] | order(name asc)[0...$quantity]{
          ...,
          "subcategories": *[_type == "category" && references(^._id)]{
            _id,
            name,
            slug
          },
          "productCount": count(*[_type == "product" && references(^._id)])
        }`
      : `*[_type == 'category' && !defined(parent)] | order(name asc){
          ...,
          "subcategories": *[_type == "category" && references(^._id)]{
            _id,
            name,
            slug
          },
          "productCount": count(*[_type == "product" && references(^._id)])
        }`;

    const { data } = await sanityFetch({
      query,
      params: quantity ? { quantity } : {},
    });

    return data ?? [];
  } catch (error) {
    console.log("Error fetching categories with product count:", error);
    return [];
  }
};


// 🔹 Product by Slug (single)
const getProductBySlug = async (slug: string) => {
  try {
    const { data } = await sanityFetch({
      query: PRODUCT_BY_SLUG_QUERY,
      params: { slug },
    });
    return data || null;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
};



export {
  getBanner,
  getFeaturedCategory,
  getAllProducts,
  getFeaturedProducts,

  getNewProducts,
  getAddresses,
  getCategories,
  getProductBySlug,
};
