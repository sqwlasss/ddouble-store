import { useQuery } from "@tanstack/react-query";
import { shopifyFetch } from "@/lib/shopify/client";
import { ALL_PRODUCTS, PRODUCT_BY_HANDLE, ALL_COLLECTIONS, COLLECTION_BY_HANDLE } from "@/lib/shopify/queries";

function normalizeProduct(node) {
  const sizeOption = node.options?.find((o) => o.name === "Size");
  const paperOption = node.options?.find((o) => o.name === "Paper");

  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description || "",
    descriptionHtml: node.descriptionHtml || "",
    tags: node.tags || [],
    productType: node.productType,
    price: parseFloat(node.priceRange.minVariantPrice.amount),
    currency: node.priceRange.minVariantPrice.currencyCode,
    image: node.images.edges[0]?.node.url || null,
    imageAlt: node.images.edges[0]?.node.altText || node.title,
    images: node.images.edges.map(({ node: img }) => ({
      url: img.url,
      altText: img.altText || node.title,
      width: img.width,
      height: img.height,
    })),
    sizes: sizeOption
      ? sizeOption.values.map((v) => ({ label: v, value: v }))
      : [],
    papers: paperOption
      ? paperOption.values.map((v) => ({ label: v, value: v }))
      : [],
    compareAtPrice: node.variants.edges[0]?.node.compareAtPrice?.amount
      ? parseFloat(node.variants.edges[0].node.compareAtPrice.amount)
      : null,
    variants: node.variants.edges.map(({ node: v }) => ({
      id: v.id,
      title: v.title,
      price: parseFloat(v.price.amount),
      currency: v.price.currencyCode,
      compareAtPrice: v.compareAtPrice?.amount
        ? parseFloat(v.compareAtPrice.amount)
        : null,
      availableForSale: v.availableForSale,
      quantityAvailable: v.quantityAvailable,
      selectedOptions: v.selectedOptions,
    })),
    options: node.options || [],
  };
}

function normalizeCollection(node) {
  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    description: node.description || "",
    image: node.image?.url || null,
  };
}

export function useAllProducts(country) {
  return useQuery({
    queryKey: ["products", "all-posters", country],
    queryFn: async () => {
      const allProducts = [];
      let cursor = null;
      let hasNext = true;

      while (hasNext) {
        const data = await shopifyFetch(ALL_PRODUCTS(country), {
          first: 50,
          after: cursor,
        });
        const edges = data.products.edges;
        allProducts.push(...edges.map(({ node }) => normalizeProduct(node)));
        hasNext = data.products.pageInfo.hasNextPage;
        cursor = data.products.pageInfo.endCursor;
      }

      return allProducts;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useProduct(handle, country) {
  return useQuery({
    queryKey: ["product", handle, country],
    queryFn: async () => {
      const data = await shopifyFetch(PRODUCT_BY_HANDLE(country), { handle });
      if (!data.productByHandle) return null;
      return normalizeProduct(data.productByHandle);
    },
    enabled: !!handle,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCollections() {
  return useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const data = await shopifyFetch(ALL_COLLECTIONS, { first: 20 });
      return data.collections.edges.map(({ node }) => normalizeCollection(node));
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useCollectionProducts(handle, country) {
  return useQuery({
    queryKey: ["collection", handle, country],
    queryFn: async () => {
      const data = await shopifyFetch(COLLECTION_BY_HANDLE(country), {
        handle,
        first: 50,
      });
      if (!data.collection) return null;
      return {
        ...normalizeCollection(data.collection),
        products: data.collection.products.edges.map(({ node }) =>
          normalizeProduct(node)
        ),
      };
    },
    enabled: !!handle,
    staleTime: 5 * 60 * 1000,
  });
}