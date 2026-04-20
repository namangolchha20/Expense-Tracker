import { useEffect, useState } from "react";
import { fetchExchangeRates } from "../services/api";

let globalRates = null;
let globalFetchPromise = null;

export function useCurrency(baseCurrency = "INR") {
  const [rates, setRates] = useState(globalRates);
  const [loading, setLoading] = useState(!globalRates);

  useEffect(() => {
    let isMounted = true;

    if (globalRates) {
      if (isMounted) {
        setRates(globalRates);
        setLoading(false);
      }
      return;
    }

    if (globalFetchPromise) {
      globalFetchPromise.then((data) => {
        if (isMounted && data?.rates) {
          globalRates = data.rates;
          setRates(globalRates);
          setLoading(false);
        }
      });
      return;
    }

    setLoading(true);
    globalFetchPromise = fetchExchangeRates(baseCurrency);
    globalFetchPromise.then((data) => {
      if (isMounted) {
        if (data?.rates) {
          globalRates = data.rates;
          setRates(globalRates);
        } else {
          globalRates = { INR: 1 };
          setRates(globalRates);
        }
        setLoading(false);
      }
    }).catch(() => {
      if (isMounted) {
        globalRates = { INR: 1 };
        setRates(globalRates);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [baseCurrency]);

  const convert = (amountInINR, targetCurrency) => {
    if (!rates || !targetCurrency || targetCurrency === "INR") return amountInINR;
    const rate = rates[targetCurrency];
    return rate ? amountInINR * rate : amountInINR;
  };

  const format = (amountInINR, targetCurrency) => {
    const converted = convert(amountInINR, targetCurrency);
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: targetCurrency,
      minimumFractionDigits: 2,
    }).format(converted);
  };

  return { rates, loading, convert, format };
}