import _get from "lodash/get";
import _map from "lodash/map";
import _join from "lodash/join";
import _mapKeys from "lodash/mapKeys";
import _slice from "lodash/slice";
import _flow from "lodash/flow";

const removeNumbersFromKeys = (data) =>
  _map(data, (item) => {
    return _mapKeys(item, (value, key) => _join(_slice(key, 3), ""));
  });

const parseOptionsForSelect = (data) =>
  _map(data, (stock) => {
    const { symbol, name } = stock;
    return {
      label: name,
      value: symbol,
    };
  });

const getSelectOptions = (data) =>
  _flow([removeNumbersFromKeys, parseOptionsForSelect])(data);

export const getStocksQueryOptions = () => {
  return {
    select: (data) => {
      const bestMatches = _get(data, "bestMatches", []);
      return {
        options: getSelectOptions(bestMatches),
      };
    },
  };
};
