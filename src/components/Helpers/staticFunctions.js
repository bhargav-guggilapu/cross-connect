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
