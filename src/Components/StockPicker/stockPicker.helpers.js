import _get from "lodash/get";
import _map from "lodash/map";
import _join from "lodash/join";
import _mapKeys from "lodash/mapKeys";
import _slice from "lodash/slice";
import _flow from "lodash/flow";
import _last from "lodash/last";
import _split from "lodash/split";
import _toNumber from "lodash/toNumber";
import _reduce from "lodash/reduce";
import _reverse from "lodash/reverse";
import _isNil from "lodash/isNil";
import _isEmpty from "lodash/isEmpty";

const removeNumbers = (obj) =>
  _mapKeys(obj, (_, key) => _join(_slice(key, 3), ""));

export const removeNumbersFromKeys = (data) => _map(data, removeNumbers);

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

export const getStockDetailQueryOptions = (intervalDuration) => {
  return {
    select: (response) => {
      const errMsg = _get(response, "Error Message", null);
      const noteMsg = _get(response, "Note", null);
      if (!_isNil(errMsg) || !_isNil(noteMsg)) {
        return null;
      }
      return response;
    },
    refetchInterval: 1000 * 60 * intervalDuration, // 1 minute
    keepPreviousData: true,
  };
};

export const getStockDetailChartQueryOptions = (intervalDuration) => {
  return {
    select: (response) => {
      const errMsg = _get(response, "Error Message", null);
      const noteMsg = _get(response, "Note", null);
      if (!_isNil(errMsg) || !_isNil(noteMsg)) {
        return null;
      }
      if (_isEmpty(response)) return response;
      const timeSeries = _get(response, "Time Series (1min)", {});
      const { categories, data } = _reduce(
        timeSeries,
        (acc, value, key) => {
          const { categories, data } = acc;
          const time = _last(_split(key, " "));
          const parsedValue = removeNumbers(value);

          return {
            categories: [...categories, time],
            data: [...data, parsedValue],
          };
        },
        {
          categories: [],
          data: [],
        }
      );

      return {
        title: {
          text: "My chart",
        },
        series: [
          {
            name: "Open",
            data: _reverse(_map(data, (d) => _toNumber(d.open))),
          },
          {
            name: "Close",
            data: _reverse(_map(data, (d) => _toNumber(d.close))),
          },
          {
            name: "High",
            data: _reverse(_map(data, (d) => _toNumber(d.high))),
          },
          {
            name: "Low",
            data: _reverse(_map(data, (d) => _toNumber(d.low))),
          },
        ],
        xAxis: {
          categories: _reverse(categories),
        },
      };
    },
    refetchInterval: 1000 * 60 * intervalDuration, // 1 minute
    keepPreviousData: true,
  };
};
