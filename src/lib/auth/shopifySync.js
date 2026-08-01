import { getCustomer, storeCustomerToken } from "@/lib/shopify/customer";

const SYNC_ENDPOINT = import.meta.env.VITE_SHOPIFY_CUSTOMER_SYNC_ENDPOINT;

export async function syncShopifyCustomer(firebaseUser) {
  if (!firebaseUser?.email) return null;
  // Opt-in: no backend sync endpoint configured → skip client-side sync entirely.
  if (!SYNC_ENDPOINT) return null;

  try {
    const res = await fetch(SYNC_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || "",
        firebaseUid: firebaseUser.id,
        token: await firebaseUser.getIdToken(),
      }),
    });
    if (!res.ok) return null;
    const { accessToken, expiresAt } = await res.json();
    storeCustomerToken(accessToken, expiresAt);
    return await getCustomer(accessToken);
  } catch {
    return null;
  }
}
