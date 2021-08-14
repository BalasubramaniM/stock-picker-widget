import { memo, useCallback, useMemo, useState } from "react";
import Select, { components } from "react-select";

import _get from "lodash/get";
import _toUpper from "lodash/toUpper";
import _debounce from "lodash/debounce";

import StockDetails from "../StockDetails";
import SearchSVG from "../../search-solid.svg";
import { useStocksQuery } from "../../queries/stocks";

import { getStocksQueryOptions } from "./stockPicker.helpers";

const DEBOUNCE_DELAY = 300;

function StockPickerSelectBox() {
  const [value, setValue] = useState("");
  const [stockSymbol, setStockSymbol] = useState(null);

  const SearchIcon = useCallback(
    () => (
      <div class="mx-4" onClick={() => setStockSymbol(value)}>
        <img className="w-5 h-5" src={SearchSVG} alt="Search" />
      </div>
    ),
    [value]
  );

  const onInputChange = useCallback((str) => {
    setValue(_toUpper(str));
  }, []);

  const queryOptions = useMemo(() => getStocksQueryOptions(), []);
  const { data, isLoading } = useStocksQuery(value, queryOptions);
  const options = _get(data, "options", []);

  // Dropdown components
  const DropdownIndicator = () => null;
  const IndicatorSeparator = () => null;
  const Placeholder = (props) => <components.Placeholder {...props} />;

  const formatOptionLabel = ({ value, label }) => {
    return (
      <div className="flex">
        <span>{`${label} - ${value}`}</span>
      </div>
    );
  };

  const onChangeSymbol = ({ value: symbol }) => {
    setStockSymbol(symbol);
  };

  const onEnter = (e) => {
    const keyCode = _get(e, "keyCode");
    if (keyCode === 13) {
      setStockSymbol(value);
    }
  };

  const onBlur = () => setValue(value);
  const onKeyPress = _debounce(onInputChange, DEBOUNCE_DELAY);

  return (
    <div>
      <div className="flex flex-col h-screen">
        <div className="mt-8 flex justify-between items-center">
          <Select
            className="flex-1"
            components={{
              Placeholder,
              DropdownIndicator,
              IndicatorSeparator,
            }}
            options={options}
            onInputChange={onKeyPress}
            onChange={onChangeSymbol}
            isLoading={isLoading}
            onKeyDown={onEnter}
            formatOptionLabel={formatOptionLabel}
            onBlur={onBlur}
            placeholder={"Search for companies ..."}
          />
          <SearchIcon />
        </div>
        <StockDetails symbol={stockSymbol} />
      </div>
    </div>
  );
}

export default memo(StockPickerSelectBox);
