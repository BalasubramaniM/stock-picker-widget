import { memo, useCallback, useMemo, useState } from "react";
import Select, { components } from "react-select";

import _get from "lodash/get";
import _toUpper from "lodash/toUpper";
import _debounce from "lodash/debounce";

import SearchSVG from "../../search-solid.svg";

import "./stockPickerSelectBox.styles.css";

import StockDetails from "../StockDetails";

import { useStocksQuery } from "../../queries/stocks";

import { getStocksQueryOptions } from "./stockPickerSelectBox.helpers";

function StockPickerSelectBox() {
  const [value, setValue] = useState("");

  const Placeholder = (props) => <components.Placeholder {...props} />;

  const onSearchClick = () => {
    console.log(true);
  };

  const SearchIcon = useCallback(
    () => (
      <div class="mx-4" onClick={onSearchClick}>
        <img className="searchIcon" src={SearchSVG} alt="Search" />
      </div>
    ),
    []
  );

  const queryOptions = useMemo(() => getStocksQueryOptions(), []);
  const { data, isLoading } = useStocksQuery(value, queryOptions);
  const options = _get(data, "options", []);

  const DropdownIndicator = () => null;
  const IndicatorSeparator = () => null;

  const onInputChange = useCallback((str) => {
    setValue(_toUpper(str));
  }, []);

  const formatOptionLabel = ({ value, label }) => {
    return (
      <div className="flex">
        <span>{`${label} - ${value}`}</span>
      </div>
    );
  };

  const onBlur = () => setValue(value);
  const onKeyPress = _debounce(onInputChange, 300);

  return (
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
          isLoading={isLoading}
          formatOptionLabel={formatOptionLabel}
          // menuIsOpen
          onBlur={onBlur}
          placeholder={"Search for companies ..."}
        />
        <SearchIcon />
      </div>
      <StockDetails />
    </div>
  );
}

export default memo(StockPickerSelectBox);
