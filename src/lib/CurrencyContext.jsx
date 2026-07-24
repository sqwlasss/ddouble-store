import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';

const CURRENCY_KEY = 'shopify_currency';

const SUPPORTED_CURRENCIES = [
  { code: 'USD', symbol: '$', locale: 'en-US', label: 'USD', country: 'US' },
  { code: 'GBP', symbol: '£', locale: 'en-GB', label: 'GBP', country: 'GB' },
  { code: 'EUR', symbol: '€', locale: 'de-DE', label: 'EUR', country: 'DE' },
  { code: 'CAD', symbol: 'C$', locale: 'en-CA', label: 'CAD', country: 'CA' },
  { code: 'AUD', symbol: 'A$', locale: 'en-AU', label: 'AUD', country: 'AU' },
  { code: 'RON', symbol: 'lei', locale: 'ro-RO', label: 'RON', country: 'RO' },
  { code: 'DKK', symbol: 'kr', locale: 'da-DK', label: 'DKK', country: 'DK' },
];

const COUNTRY_TO_CURRENCY = {
  US: 'USD', GB: 'GBP', DE: 'EUR', FR: 'EUR', ES: 'EUR', IT: 'EUR',
  NL: 'EUR', BE: 'EUR', AT: 'EUR', PT: 'EUR', IE: 'EUR', FI: 'EUR',
  CA: 'CAD', AU: 'AUD', RO: 'RON', DK: 'DKK',
};

function detectCountry() {
  try {
    const locale = navigator.language || navigator.languages?.[0] || 'en-US';
    const parts = locale.split('-');
    return parts.length > 1 ? parts[1].toUpperCase() : 'US';
  } catch {
    return 'US';
  }
}

function detectCurrency() {
  const country = detectCountry();
  return COUNTRY_TO_CURRENCY[country] || 'USD';
}

function loadCurrency() {
  try {
    const raw = localStorage.getItem(CURRENCY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (SUPPORTED_CURRENCIES.some((c) => c.code === parsed)) return parsed;
    }
  } catch {}
  return null;
}

function saveCurrency(code) {
  try {
    localStorage.setItem(CURRENCY_KEY, JSON.stringify(code));
  } catch {}
}

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currencyCode, setCurrencyCode] = useState(() => loadCurrency() || detectCurrency());

  useEffect(() => {
    saveCurrency(currencyCode);
  }, [currencyCode]);

  const currencyInfo = useMemo(
    () => SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode) || SUPPORTED_CURRENCIES[0],
    [currencyCode]
  );

  const setCurrency = useCallback((code) => {
    if (SUPPORTED_CURRENCIES.some((c) => c.code === code)) {
      setCurrencyCode(code);
    }
  }, []);

  const formatPrice = useCallback(
    (amount) => {
      if (amount == null || isNaN(amount)) return '';
      try {
        return new Intl.NumberFormat(currencyInfo.locale, {
          style: 'currency',
          currency: currencyCode,
        }).format(amount);
      } catch {
        return `${currencyInfo.symbol}${Number(amount).toFixed(2)}`;
      }
    },
    [currencyCode, currencyInfo]
  );

  const value = useMemo(
    () => ({
      currencyCode,
      currencyInfo,
      setCurrency,
      formatPrice,
      supportedCurrencies: SUPPORTED_CURRENCIES,
      country: currencyInfo.country,
    }),
    [currencyCode, currencyInfo, setCurrency, formatPrice]
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}