import { memo, useMemo, useState } from "react";
import cogoToast from "cogo-toast";

import _isNil from "lodash/isNil";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import {
  useStockDetailQuery,
  useStockDetailChartQuery,
} from "../../queries/stocks";

import {
  getStockDetailQueryOptions,
  getStockDetailChartQueryOptions,
} from "../StockPickerSelectBox/stockPickerSelectBox.helpers";

function Content({ name, value }) {
  return (
    <div className="flex flex-col mt-4">
      <span className="font-light text-sm text-gray-400">{name}</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}

function StockDetails({ symbol }) {
  const [intervalDuration, setIntervalDuration] = useState(1);
  const queryOptions = useMemo(() => getStockDetailQueryOptions(), []);
  const queryOptionsForChart = useMemo(
    () => getStockDetailChartQueryOptions(intervalDuration),
    [intervalDuration]
  );

  const { data: chartDetails = {} } = useStockDetailChartQuery(
    symbol,
    queryOptionsForChart
  );

  const { data, isLoading, ...rest } = useStockDetailQuery(
    symbol,
    queryOptions
  );

  const onChangeInterval = (e) => {
    const value = e.target.value;
    if (value < 1) {
      cogoToast.error("Interval duration cannot be null.");
      return;
    }
    setIntervalDuration(e.target.value);
  };

  const {
    Name,
    Symbol,
    Description,
    PriceToBookRatio,
    RevenuePerShareTTM,
    Industry,
    PERatio,
    MarketCapitalization,
  } = data || {};

  console.log(symbol, chartDetails);

  if (_isNil(chartDetails)) {
    cogoToast.error("Unable to find Company stock details");
    return (
      <div className="flex justify-center items-center flex-col mt-8 mb-8 h-full border overflow-y-auto">
        Unable to find company details.
      </div>
    );
  }

  if (_isNil(symbol)) {
    return (
      <div className="flex justify-center items-center flex-col mt-8 mb-8 h-full border overflow-y-auto">
        Please select any company to view it's stock details.
      </div>
    );
  }

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
      <div className="flex flex-col mt-8 mb-8 h-full border overflow-y-auto">
        <div>
          <HighchartsReact highcharts={Highcharts} options={chartDetails} />
          {/* <div id="chartcontainer"></div> */}
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
    </div>
  );
}

export default memo(StockDetails);
