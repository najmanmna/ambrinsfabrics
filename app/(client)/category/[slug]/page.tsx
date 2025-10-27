import Container from "@/components/Container";
import CategoryProducts from "@/components/CategoryProducts";
import Title from "@/components/Title";
import { client } from "@/sanity/lib/client"; // Import the Sanity client
// import { ALLCATEGORIES_QUERY } from "@/sanity/queries"; // <-- REMOVED this line
import { ExpandedCategory } from "@/components/header/MobileMenu"; // Import the shared type
import React from "react";
import { groq } from "next-sanity"; // Import groq to define the query

// --- FIX: Defined the query directly in this file ---
const ALLCATEGORIES_QUERY = groq`
  *[_type == "category"] | order(_createdAt asc){
    ...,
    parent->{
      _id,
      name,
      slug
    }
  }
`;

const CategoryPage = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const { slug } = params;
  
  // Fetch ALL categories, not just the 2-level ones
  const categories = await client.fetch<ExpandedCategory[]>(ALLCATEGORIES_QUERY);

  return (
    <div>
      <Container className="py-0">
        {/* Pass the complete list of categories to the client component */}
        <CategoryProducts categories={categories} slug={slug} />
      </Container>
    </div>
  );
};

export default CategoryPage;

