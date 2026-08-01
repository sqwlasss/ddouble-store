import { getCustomer, storeCustomerToken } from "@/lib/shopify/customer";
import { getCurrentUser } from "@/lib/firebaseAuth";

const SYNC_ENDPOINT = import.meta.env.VITE_SHOPIFY_CUSTOMER_SYNC_ENDPOINT;

export async function syncShopifyCustomer(firebaseUser) {
  if (!firebaseUser?.email) return null;
  // Opt-in: no backend sync endpoint configured → skip client-side sync entirely.
  if (!SYNC_ENDPOINT) return null;

  try {
    // firebaseUser is the serialized user object from AuthContext (no methods) —
    // get the raw Firebase user to obtain a real ID token.
    const raw = getCurrentUser();
    const token = raw ? await raw.getIdToken() : null;
    if (!token) return null;

    const res = await fetch(SYNC_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || "",
        firebaseUid: firebaseUser.id,
        token,
      }),
    });
    if (!res.ok) return null;
    const { accessToken, expiresAt } = await res.json();
    // Only persist the token when the backend provided a real expiry; the sync
    // endpoint still returns customer data each session if it omits expiresAt.
    if (typeof expiresAt === "string" && !isNaN(Date.parse(expiresAt))) {
      storeCustomerToken(accessToken, expiresAt);
    }
    return await getCustomer(accessToken);
  } catch {
    return null;
  }
}
