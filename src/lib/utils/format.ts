export const formatCurrency = (amount: number, currency?: string) => {
  return (amount / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

export const formatCurrencySymbol = (currency: string) => {
  return (0).toLocaleString(
    "en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }
  ).replace(/\d/g, "").trim();
};