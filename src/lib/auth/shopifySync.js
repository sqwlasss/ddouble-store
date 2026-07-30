import {
  createCustomer,
  createCustomerToken,
  getCustomer,
  clearCustomerToken,
} from "@/lib/shopify/customer";

function derivePassword(firebaseUid) {
  const seed = "ddouble-v1|" + firebaseUid;
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) - h) + seed.charCodeAt(i);
    h |= 0;
  }
  const str = Math.abs(h).toString(36);
  return "Dd!" + str.padStart(12, "0") + "X1!";
}

export async function syncShopifyCustomer(firebaseUser) {
  if (!firebaseUser?.email) return null;

  const password = derivePassword(firebaseUser.id);

  try {
    const { accessToken } = await createCustomerToken(firebaseUser.email, password);
    return await getCustomer(accessToken);
  } catch {}

  try {
    const names = (firebaseUser.displayName || "").split(" ");
    await createCustomer({
      email: firebaseUser.email,
      password,
      firstName: names[0] || "",
      lastName: names.slice(1).join(" ") || "",
    });
    const { accessToken } = await createCustomerToken(firebaseUser.email, password);
    return await getCustomer(accessToken);
  } catch {
    clearCustomerToken();
    return null;
  }
}
