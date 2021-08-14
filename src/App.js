import { QueryClient, QueryClientProvider } from "react-query";

import "./App.css";

import StockPicker from "./Components/StockPicker";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto px-4 h-screen">
        <StockPicker />
      </div>
    </QueryClientProvider>
  );
}

export default App;
