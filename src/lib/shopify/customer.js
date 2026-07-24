import { shopifyFetch } from "./client";

const CUSTOMER_ACCESS_TOKEN_CREATE = `
  mutation CustomerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_ACCESS_TOKEN_DELETE = `
  mutation CustomerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken
      deletedCustomerAccessTokenId
      userErrors {
        field
        message
      }
    }
  }
`;

const CUSTOMER_CREATE = `
  mutation CustomerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
        acceptsMarketing
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_QUERY = `
  query CustomerQuery($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      email
      firstName
      lastName
      phone
      acceptsMarketing
      createdAt
      defaultAddress {
        id
        address1
        address2
        city
        province
        zip
        country
        phone
        firstName
        lastName
      }
      addresses(first: 10) {
        edges {
          node {
            id
            address1
            address2
            city
            province
            zip
            country
            phone
            firstName
            lastName
          }
        }
      }
      orders(first: 20) {
        edges {
          node {
            id
            name
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice {
              amount
              currencyCode
            }
            lineItems(first: 10) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    id
                    title
                    image {
                      url
                    }
                  }
                  originalTotalPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
            statusUrl
          }
        }
      }
    }
  }
`;

const CUSTOMER_UPDATE = `
  mutation CustomerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        id
        email
        firstName
        lastName
        phone
        acceptsMarketing
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_ADDRESS_CREATE = `
  mutation CustomerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
    customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
      customerAddress {
        id
        address1
        address2
        city
        province
        zip
        country
        phone
        firstName
        lastName
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_ADDRESS_UPDATE = `
  mutation CustomerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
    customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
      customerAddress {
        id
        address1
        address2
        city
        province
        zip
        country
        phone
        firstName
        lastName
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_ADDRESS_DELETE = `
  mutation CustomerAddressDelete($customerAccessToken: String!, $id: ID!) {
    customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
      deletedCustomerAddressId
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_DEFAULT_ADDRESS_UPDATE = `
  mutation CustomerDefaultAddressUpdate($customerAccessToken: String!, $addressId: ID!) {
    customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
      customer {
        id
        defaultAddress {
          id
          address1
          city
          province
          zip
          country
        }
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_RECOVER = `
  mutation CustomerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_RESET = `
  mutation CustomerResetByUrl($resetUrl: URL!, $password: String!) {
    customerResetByUrl(resetUrl: $resetUrl, password: $password) {
      customer {
        id
        email
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_ORDERS = `
  query CustomerOrders($customerAccessToken: String!, $first: Int!) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: $first) {
        edges {
          node {
            id
            name
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            currentTotalPrice {
              amount
              currencyCode
            }
            totalPrice {
              amount
              currencyCode
            }
            lineItems(first: 20) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    id
                    title
                    image {
                      url
                    }
                  }
                  originalTotalPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
            statusUrl
          }
        }
      }
    }
  }
`;

const CART_CREATE_WITH_BUYER_IDENTITY = `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    handle
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CUSTOMER_ACCESS_TOKEN_RENEW = `
  mutation CustomerAccessTokenRenew($customerAccessToken: String!) {
    customerAccessTokenRenew(customerAccessToken: $customerAccessToken) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const TOKEN_KEY = "shopify_customer_token";
const TOKEN_EXPIRY_KEY = "shopify_customer_token_expires";

export function getStoredCustomerToken() {
  const token = localStorage.getItem(TOKEN_KEY);
  const expires = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!token || !expires) return null;
  if (new Date(expires) < new Date()) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    return null;
  }
  return token;
}

export function storeCustomerToken(token, expiresAt) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiresAt);
}

export function clearCustomerToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
}

export async function createCustomerToken(email, password) {
  const data = await shopifyFetch(CUSTOMER_ACCESS_TOKEN_CREATE, {
    input: { email, password },
  });
  const errors = data.customerAccessTokenCreate.customerUserErrors;
  if (errors.length > 0) {
    throw new Error(errors.map((e) => e.message).join("\n"));
  }
  const { accessToken, expiresAt } = data.customerAccessTokenCreate.customerAccessToken;
  storeCustomerToken(accessToken, expiresAt);
  return { accessToken, expiresAt };
}

export async function deleteCustomerToken(token) {
  const data = await shopifyFetch(CUSTOMER_ACCESS_TOKEN_DELETE, {
    customerAccessToken: token,
  });
  clearCustomerToken();
  return data.customerAccessTokenDelete;
}

export async function renewCustomerToken(token) {
  const data = await shopifyFetch(CUSTOMER_ACCESS_TOKEN_RENEW, {
    customerAccessToken: token,
  });
  if (data.customerAccessTokenRenew.userErrors.length > 0) {
    clearCustomerToken();
    return null;
  }
  const { accessToken, expiresAt } = data.customerAccessTokenRenew.customerAccessToken;
  storeCustomerToken(accessToken, expiresAt);
  return { accessToken, expiresAt };
}

export async function createCustomer({ email, password, firstName, lastName }) {
  const data = await shopifyFetch(CUSTOMER_CREATE, {
    input: { email, password, firstName, lastName },
  });
  const errors = data.customerCreate.customerUserErrors;
  if (errors.length > 0) {
    throw new Error(errors.map((e) => e.message).join("\n"));
  }
  return data.customerCreate.customer;
}

export async function getCustomer(token) {
  const data = await shopifyFetch(CUSTOMER_QUERY, {
    customerAccessToken: token,
  });
  return parseCustomer(data.customer);
}

export async function getCustomerOrders(token, first = 20) {
  const data = await shopifyFetch(CUSTOMER_ORDERS, {
    customerAccessToken: token,
    first,
  });
  return parseOrders(data.customer.orders.edges);
}

export async function updateCustomer(token, customerInput) {
  const data = await shopifyFetch(CUSTOMER_UPDATE, {
    customerAccessToken: token,
    customer: customerInput,
  });
  const errors = data.customerUpdate.customerUserErrors;
  if (errors.length > 0) {
    throw new Error(errors.map((e) => e.message).join("\n"));
  }
  return data.customerUpdate.customer;
}

export async function createAddress(token, address) {
  const data = await shopifyFetch(CUSTOMER_ADDRESS_CREATE, {
    customerAccessToken: token,
    address,
  });
  const errors = data.customerAddressCreate.customerUserErrors;
  if (errors.length > 0) {
    throw new Error(errors.map((e) => e.message).join("\n"));
  }
  return data.customerAddressCreate.customerAddress;
}

export async function updateAddress(token, id, address) {
  const data = await shopifyFetch(CUSTOMER_ADDRESS_UPDATE, {
    customerAccessToken: token,
    id,
    address,
  });
  const errors = data.customerAddressUpdate.customerUserErrors;
  if (errors.length > 0) {
    throw new Error(errors.map((e) => e.message).join("\n"));
  }
  return data.customerAddressUpdate.customerAddress;
}

export async function deleteAddress(token, id) {
  const data = await shopifyFetch(CUSTOMER_ADDRESS_DELETE, {
    customerAccessToken: token,
    id,
  });
  const errors = data.customerAddressDelete.customerUserErrors;
  if (errors.length > 0) {
    throw new Error(errors.map((e) => e.message).join("\n"));
  }
  return data.customerAddressDelete;
}

export async function setDefaultAddress(token, addressId) {
  const data = await shopifyFetch(CUSTOMER_DEFAULT_ADDRESS_UPDATE, {
    customerAccessToken: token,
    addressId,
  });
  const errors = data.customerDefaultAddressUpdate.customerUserErrors;
  if (errors.length > 0) {
    throw new Error(errors.map((e) => e.message).join("\n"));
  }
  return data.customerDefaultAddressUpdate.customer;
}

export async function recoverPassword(email) {
  const data = await shopifyFetch(CUSTOMER_RECOVER, { email });
  return data.customerRecover;
}

export async function resetPassword(resetUrl, password) {
  const data = await shopifyFetch(CUSTOMER_RESET, { resetUrl, password });
  const errors = data.customerResetByUrl.customerUserErrors;
  if (errors.length > 0) {
    throw new Error(errors.map((e) => e.message).join("\n"));
  }
  const { accessToken, expiresAt } = data.customerResetByUrl.customerAccessToken;
  storeCustomerToken(accessToken, expiresAt);
  return data.customerResetByUrl.customer;
}

function parseAddress(node) {
  return {
    id: node.id,
    address1: node.address1 || "",
    address2: node.address2 || "",
    city: node.city || "",
    province: node.province || "",
    zip: node.zip || "",
    country: node.country || "",
    phone: node.phone || "",
    firstName: node.firstName || "",
    lastName: node.lastName || "",
    fullName: [node.firstName, node.lastName].filter(Boolean).join(" "),
    fullAddress: [node.address1, node.address2, node.city, node.province, node.zip, node.country]
      .filter(Boolean)
      .join(", "),
  };
}

function parseOrder(node) {
  return {
    id: node.id,
    name: node.name,
    orderNumber: node.orderNumber,
    processedAt: node.processedAt,
    financialStatus: node.financialStatus,
    fulfillmentStatus: node.fulfillmentStatus,
    totalPrice: parseFloat(node.totalPrice?.amount || node.currentTotalPrice?.amount || 0),
    currency: node.totalPrice?.currencyCode || node.currentTotalPrice?.currencyCode || "USD",
    statusUrl: node.statusUrl,
    lineItems: (node.lineItems?.edges || []).map(({ node: item }) => ({
      title: item.title,
      quantity: item.quantity,
      variantId: item.variant?.id || null,
      variantTitle: item.variant?.title || "",
      image: item.variant?.image?.url || null,
      price: parseFloat(item.originalTotalPrice?.amount || 0),
    })),
  };
}

function parseOrders(edges) {
  return edges.map(({ node }) => parseOrder(node));
}

function parseCustomer(customer) {
  if (!customer) return null;
  return {
    id: customer.id,
    email: customer.email,
    firstName: customer.firstName || "",
    lastName: customer.lastName || "",
    phone: customer.phone || "",
    acceptsMarketing: customer.acceptsMarketing || false,
    createdAt: customer.createdAt,
    defaultAddress: customer.defaultAddress ? parseAddress(customer.defaultAddress) : null,
    addresses: (customer.addresses?.edges || []).map(({ node }) => parseAddress(node)),
    orders: parseOrders(customer.orders?.edges || []),
  };
}
