import axios from "axios";
import _last from "lodash/last";
import _isEmpty from "lodash/isEmpty";
import _defaults from "lodash/defaults";

import { useQuery } from "react-query";

const API_KEY = "FHEG974OQN7RL0D7";
const INTERVAL_DURATION = "1min";
const BASE_URL = "https://www.alphavantage.co/";

const queryKeys = {
  all: ["stocks"],
  detail: ["all", "detail"],
  detailChart: ["all", "detail", "chart"],
};

const defaultQueryOptions = {
  cacheTime: 1000 * 60 * 5, // 5 minutes
  staleTime: 1000 * 60 * 5,
  retry: 0,
};

const getData = (response) => response?.data;

const getStocks = ({ queryKey }) => {
  const keywords = _last(queryKey);
  if (_isEmpty(keywords)) return Promise.resolve({});
  const URL = `${BASE_URL}query?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${API_KEY}`;
  return axios.get(URL).then(getData);
};

const getStockDetail = ({ queryKey }) => {
  const symbol = _last(queryKey);
  if (_isEmpty(symbol)) return Promise.resolve({});
  const URL = `${BASE_URL}query?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`;
  return axios.get(URL).then(getData);
};

const getStockDetailChart = ({ queryKey }) => {
  const symbol = _last(queryKey);
  if (_isEmpty(symbol)) return Promise.resolve({});
  const URL = `${BASE_URL}query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${INTERVAL_DURATION}&apikey=${API_KEY}`;
  return axios.get(URL).then(getData);
};

export function useStocksQuery(keywords, queryOptions) {
  return useQuery(
    [queryKeys.all, keywords],
    getStocks,
    _defaults(queryOptions, defaultQueryOptions)
  );
}

export function useStockDetailQuery(symbol, queryOptions) {
  return useQuery(
    [queryKeys.detail, symbol],
    getStockDetail,
    _defaults(queryOptions, defaultQueryOptions)
  );
}

export function useStockDetailChartQuery(symbol, queryOptions) {
  return useQuery(
    [queryKeys.detailChart, symbol],
    getStockDetailChart,
    _defaults(queryOptions, defaultQueryOptions)
  );
}
