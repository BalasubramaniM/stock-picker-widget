import axios from "axios";
import _last from "lodash/last";
import _isEmpty from "lodash/isEmpty";
import _defaults from "lodash/defaults";

import { useQuery } from "react-query";

// https://www.alphavantage.co/query?function=SYMBOL_SEARCH&apikey=UACERV9VXGG5M0P2

// const API_KEY = "UACERV9VXGG5M0P2";
const API_KEY = "XFF1N97R0NRDAFUC";
const BASE_URL = "https://www.alphavantage.co/";

const queryKeys = {
  all: ["stocks"],
  list: (payload) => [queryKeys.all, "list", payload],
};

const defaultQueryOptions = {
  cacheTime: 1000 * 60 * 2, // 2 minutes
  staleTime: 1000 * 60 * 2,
  retry: 0,
};

const getData = (response) => response?.data;

const getStocks = ({ queryKey }) => {
  const keywords = _last(queryKey);
  if (_isEmpty(keywords)) return Promise.resolve({});
  const URL = `${BASE_URL}query?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${API_KEY}`;
  return axios.get(URL).then(getData);
};

export function useStocksQuery(keywords, queryOptions) {
  return useQuery(
    ["stocks", keywords],
    getStocks,
    _defaults(queryOptions, defaultQueryOptions)
  );
}
