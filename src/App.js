import { QueryClient, QueryClientProvider } from "react-query";

import "./App.css";

import StockPickerSelectBox from "./Components/StockPickerSelectBox";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto px-4 h-screen">
        <StockPickerSelectBox />
      </div>
    </QueryClientProvider>
  );
}

export default App;
