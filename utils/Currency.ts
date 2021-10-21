const Currency = (currency: string) => {
  if (currency === "NGN") {
    return "\u20A6";
  } else if (currency === "USD") {
    return "\u0024";
  } else if (currency === "EUR") {
    return "\u20AC";
  } else if (currency === "GBP") {
    return "\u00A3";
  } else if (currency === "JPY") {
    return "\u00A5";
  } else if (currency === "AUD") {
    return "\u0024";
  } else if (currency === "CAD") {
    return "\u0024";
  } else if (currency === "CHF") {
    return "CHF";
  } else if (currency === "CNY") {
    return "\u5143";
  } else if (currency === "DKK") {
    return "Kr";
  } else if (currency === "GHS") {
    return "GH₵";
  } else if (currency === "ZAR") {
    return "R";
  }
};

export default Currency;
