import { memo, useEffect, useMemo, useReducer, useState, useRef } from "react";
import cogoToast from "cogo-toast";

import _isNil from "lodash/isNil";
import _map from "lodash/map";
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import _findIndex from "lodash/findIndex";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import Slider from "react-slick";

import {
  useStockDetailQuery,
  useStockDetailChartQuery,
} from "../../queries/stocks";

import {
  getStockDetailQueryOptions,
  getStockDetailChartQueryOptions,
} from "../StockPicker/stockPicker.helpers";

import { SLIDER_SETTINGS } from "./stockDetails.constants";

function Content({ name, value }) {
  return (
    <div className="flex flex-col mt-4">
      <span className="font-light text-sm text-gray-400">{name}</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}

function init() {
  return {
    allData: [],
    allCharts: [],
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "ADD":
      return {
        ...state,
        allData: [...state.allData, action.payload],
      };
    case "ADD_CHART":
      return {
        ...state,
        allCharts: [...state.allCharts, action.payload],
      };
    default:
      throw new Error();
  }
}

function StockDetails({ symbol }) {
  const slickEl = useRef(null);
  const [state, dispatch] = useReducer(reducer, null, init);
  const [intervalDuration, setIntervalDuration] = useState(1);

  const stockDetailsQueryOptions = useMemo(
    () => getStockDetailQueryOptions(intervalDuration),
    [intervalDuration]
  );
  const stockDetailsChartQueryOptions = useMemo(
    () => getStockDetailChartQueryOptions(intervalDuration),
    [intervalDuration]
  );

  const {
    data: chartDetails = {},
    isLoading: isChartDetailsLoading,
    isPreviousData: isChartDetailsPreviousData,
  } = useStockDetailChartQuery(symbol, stockDetailsChartQueryOptions);

  const {
    data = {},
    isLoading,
    isPreviousData,
  } = useStockDetailQuery(symbol, stockDetailsQueryOptions);

  const onChangeInterval = (e) => {
    const value = e.target.value;
    if (value < 1) {
      cogoToast.error("Interval duration cannot be null.");
      return;
    }
    setIntervalDuration(e.target.value);
  };

  useEffect(() => {
    if (
      !_isEmpty(data) &&
      !isLoading &&
      !isChartDetailsLoading &&
      !isPreviousData &&
      !isChartDetailsPreviousData &&
      !_isEmpty(chartDetails)
    ) {
      const dataIndex = _findIndex(
        state.allData,
        (d) => d.Symbol === data.Symbol
      );
      if (dataIndex >= 0) {
        slickEl.current.slickGoTo(dataIndex);
      } else {
        dispatch({ type: "ADD", payload: data });
        dispatch({ type: "ADD_CHART", payload: chartDetails });
      }
    }
  }, [
    data,
    isPreviousData,
    isLoading,
    isChartDetailsLoading,
    chartDetails,
    isChartDetailsPreviousData,
    state,
    symbol,
  ]);

  if (_isNil(chartDetails) || _isNil(data)) {
    cogoToast.error("API timeout error or Company profile not found.");
  }

  if (_isNil(symbol)) {
    return (
      <div className="flex justify-center items-center flex-col mt-8 mb-8 h-full border overflow-y-auto">
        Please select any company to view it's stock details.
      </div>
    );
  }

  const slides = _map(state.allData, (item, index) => {
    const {
      Name,
      Symbol,
      Description,
      PriceToBookRatio,
      RevenuePerShareTTM,
      Industry,
      PERatio,
      MarketCapitalization,
    } = item;
    const currentChartDetails = _get(state, `allCharts.${index}`);
    return (
      <div
        key={Symbol}
        className="flex flex-col mt-8 mb-8 h-full border overflow-y-auto"
      >
        <div>
          <HighchartsReact
            highcharts={Highcharts}
            options={currentChartDetails}
          />
        </div>
        <div className="flex flex-1 flex-col px-4">
          <Content name="Name" value={Name} />
          <Content name="Symbol" value={Symbol} />
          <Content name="PriceToBookRatio" value={PriceToBookRatio} />
          <Content name="RevenuePerShareTTM" value={RevenuePerShareTTM} />
          <Content name="Industry" value={Industry} />
          <Content name="PERatio" value={PERatio} />
          <Content name="MarketCapitalization" value={MarketCapitalization} />
          <Content name="Description" value={Description} />
        </div>
      </div>
    );
  });

  return (
    <div>
      <div className="flex flex-row mt-8 items-center">
        <p className="">Please provide interval to sync (in minutes):</p>
        <input
          className="ml-2"
          name="interval"
          type="number"
          min="1"
          value={intervalDuration}
          onChange={onChangeInterval}
          placeholder="in minutes"
        />
      </div>
      <Slider ref={slickEl} {...SLIDER_SETTINGS}>
        {slides}
      </Slider>
    </div>
  );
}

export default memo(StockDetails);
