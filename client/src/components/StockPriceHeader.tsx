import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StockPrice {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: number;
}

export default function StockPriceHeader() {
  const [stockPrice, setStockPrice] = useState<StockPrice | null>(null);

  useEffect(() => {
    loadStockPrice();
    const interval = setInterval(loadStockPrice, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const loadStockPrice = async () => {
    try {
      const response = await fetch('/api/stock/current');
      if (response.ok) {
        const data = await response.json();
        setStockPrice(data);
      }
    } catch (error) {
      console.error('Failed to load stock price:', error);
    }
  };

  if (!stockPrice) return null;

  const isPositive = stockPrice.change >= 0;

  return (
    <div className="flex items-center space-x-3 text-sm">
      <div className="flex items-center space-x-1">
        <DollarSign className="h-4 w-4 text-primary" />
        <span className="font-medium">ST</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <span className="font-bold">${stockPrice.price.toFixed(2)}</span>
        
        <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          <span className="text-xs">
            {isPositive ? '+' : ''}{stockPrice.change.toFixed(2)} ({isPositive ? '+' : ''}{stockPrice.changePercent.toFixed(2)}%)
          </span>
        </div>
      </div>
      
      <Badge variant="outline" className="text-xs">
        Live
      </Badge>
    </div>
  );
}