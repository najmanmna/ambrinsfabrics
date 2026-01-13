import Container from "@/components/Container";
import CategoryProducts from "@/components/CategoryProducts";
import { client } from "@/sanity/lib/client";
import { ExpandedCategory } from "@/components/header/MobileMenu";
import React from "react";
import { groq } from "next-sanity";
import { Metadata } from "next";

// --- QUERIES ---

// 1. Fetch all categories for the Sidebar navigation
const ALL_CATEGORIES_QUERY = groq`
  *[_type == "category"] | order(name asc){
    _id,
    name,
    slug,
    parent->{
      _id,
      name,
      slug
    }
  }
`;

// 2. Fetch just the name for SEO Metadata
const CATEGORY_NAME_QUERY = groq`
  *[_type == "category" && slug.current == $slug][0].name
`;

// --- SEO METADATA ---
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  // Fetch category name dynamically
  const categoryName = await client.fetch(CATEGORY_NAME_QUERY, { slug: params.slug });

  return {
    title: categoryName ? `${categoryName} | Ambrins Fabrics` : "Collection | Ambrins Fabrics",
    description: `Browse our exclusive collection of ${categoryName || "fabrics"} at Ambrins.`,
  };
}

// --- MAIN COMPONENT ---
const CategoryPage = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const { slug } = params;
  
  // Fetch ALL categories to pass down to the client component (for Sidebar/Filtering)
  const categories = await client.fetch<ExpandedCategory[]>(ALL_CATEGORIES_QUERY);

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <Container className="py-0 px-0 max-w-full">
        {/* Render the Client Component */}
        <CategoryProducts categories={categories} slug={slug} />
      </Container>
    </div>
  );
};

export default CategoryPage;