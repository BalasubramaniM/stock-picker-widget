import { memo } from "react";

function StockDetails(props) {
  return (
    <div className="flex flex-col mt-8 mb-8 h-full border border-indigo-600">
      <div className="flex-1"></div>
      <div className="flex flex-col px-4">
        <div className="flex justify-around mb-4 mt-4">
          <div className="flex flex-col items-center">
            <span className="font-light text-sm text-gray-400">
              Name & Symbol
            </span>
            <span className="text-gray-800">
              Industrias Bachoco S.A.B. DE C.V.
            </span>
          </div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
        </div>
        <div className="flex justify-around mb-4 mt-4">
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
        </div>
      </div>
    </div>
  );
}

export default memo(StockDetails);
