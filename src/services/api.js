import axios from "axios";

const EXCHANGE_API = "https://api.exchangerate-api.com/v4/latest";

export const fetchExchangeRates = async (base = "INR") => {
  try {
    const response = await axios.get(`${EXCHANGE_API}/${base}`);
    return response.data;
  } catch (error) {
    console.error("Exchange rate API error:", error);
    return null;
  }
};