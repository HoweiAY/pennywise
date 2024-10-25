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

export const formatAmountPercentageChange = (percentageChange: number) => {
  return `${percentageChange.toFixed(2)}%`;
};

export const formatDateTime = (isoDateTimeString: string, shorten?: boolean) => {
  const localDateTime = new Date(isoDateTimeString);
  return shorten 
    ? `${localDateTime.getDate()}/${localDateTime.getMonth() + 1}/${localDateTime.getFullYear()}` 
    : localDateTime.toLocaleString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).replace(",", " at ").replace("24:", "00:");
};
