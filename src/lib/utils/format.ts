export const formatCurrency = (amount: number, currency: string | null) => {
  return (amount / 100).toLocaleString("en-US", {
    style: "currency",
    currency: currency || "USD",
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

export const formatCurrencyAmount = (amount?: number | null) => {
  return amount ? (amount / 100).toFixed(2) : "";
};
