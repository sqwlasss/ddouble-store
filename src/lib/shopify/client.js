import { createStorefrontApiClient } from "@shopify/storefront-api-client";

const shopifyClient = createStorefrontApiClient({
  storeDomain: `https://${import.meta.env.VITE_SHOPIFY_STORE_DOMAIN}`,
  apiVersion: import.meta.env.VITE_SHOPIFY_API_VERSION,
  publicAccessToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
});

export async function shopifyFetch(query, variables = {}) {
  const response = await shopifyClient.request(query, { variables });
  if (response.errors) {
    const errors = Array.isArray(response.errors) ? response.errors : [response.errors];
    throw new Error(errors.map((e) => e.message).join("\n"));
  }
  return response.data;
}

export default shopifyClient;
