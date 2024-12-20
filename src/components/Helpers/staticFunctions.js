import { IN_PROGRESS_STATUS } from "../Constants/Constants";

export const formatQuantityUnit = (quantity, unit) => {
  switch (unit) {
    case "KG(s)":
      return `${quantity} ${quantity > 1 ? "KGs" : "KG"}`;
    case "Liter(s)":
      return `${quantity} ${quantity > 1 ? "LTs" : "LT"}`;
    case "Piece(s)":
      return `${quantity} ${quantity > 1 ? "PCs" : "PC"}`;
    default:
      return `${quantity} ${unit}`;
  }
};

export const getInProgressStep = (inProgressStatus) => {
  switch (inProgressStatus) {
    case IN_PROGRESS_STATUS.ORDER_PLACED:
      return 1;
    case IN_PROGRESS_STATUS.COST_ESTIMATE:
      return 2;
    case IN_PROGRESS_STATUS.ITEMS_GATHERING:
      return 3;
    case IN_PROGRESS_STATUS.SHIPPING_ESTIMATE:
      return 4;
    case IN_PROGRESS_STATUS.ORDER_SHIPPED:
      return 5;
    case IN_PROGRESS_STATUS.SHIPPED:
      return 6;
    default:
      return 0;
  }
};

export const fetchExchangeRate = () => {
  const exchangeRate = sessionStorage.getItem("exchangeRate");

  if (exchangeRate) {
    return;
  }

  fetch("https://open.er-api.com/v6/latest/USD")
    .then((response) => response.json())
    .then((result) => {
      sessionStorage.setItem("exchangeRate", result.rates["INR"]);
    })
    .catch((error) => console.error("error", error));
};

export const convertCurrency = (currency, amount) => {
  const exchangeRate = sessionStorage.getItem("exchangeRate");
  if (!exchangeRate) {
    return "-";
  }
  return currency === "USD" ? (amount / exchangeRate).toFixed(2) : amount;
};

export const getCurrencySymbol = (currency) => (currency === "INR" ? "₹" : "$");

export const getCurrentDate = () => {
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const yyyy = today.getFullYear();

  return `${mm}-${dd}-${yyyy}`;
};

export const getProfitAmount = (amount) => {
  return (amount * 1.1).toFixed(2);
}
