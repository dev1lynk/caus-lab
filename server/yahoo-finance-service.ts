import axios from 'axios';

export interface StockPrice {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  volume: number;
  marketCap?: number;
  timestamp: number;
}

export interface StockHistory {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketInsights {
  priceChange: number;
  priceChangePercent: number;
  volatility: number;
  volume: number;
  trend: 'bullish' | 'bearish' | 'neutral';
  technicalIndicators: {
    rsi?: number;
    ma50?: number;
    ma200?: number;
    support?: number;
    resistance?: number;
  };
  summary: string;
  marketSentiment: string;
}

export class YahooFinanceService {
  private readonly baseUrl = 'https://query1.finance.yahoo.com/v8/finance/chart';
  private readonly newsUrl = 'https://query2.finance.yahoo.com/v1/finance/search';
  
  async getCurrentPrice(symbol: string): Promise<StockPrice> {
    try {
      const response = await axios.get(`${this.baseUrl}/${symbol}`, {
        params: {
          interval: '1m',
          range: '1d'
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const result = response.data.chart.result[0];
      const meta = result.meta;
      const currentPrice = meta.regularMarketPrice || meta.previousClose;
      const previousClose = meta.previousClose;
      const change = currentPrice - previousClose;
      const changePercent = (change / previousClose) * 100;

      return {
        symbol: symbol.toUpperCase(),
        price: currentPrice,
        change: change,
        changePercent: changePercent,
        previousClose: previousClose,
        volume: meta.regularMarketVolume || 0,
        marketCap: meta.marketCap,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error(`Error fetching current price for ${symbol}:`, error);
      throw new Error(`Failed to fetch current price for ${symbol}`);
    }
  }

  async getHistoricalData(symbol: string, period: string): Promise<StockHistory[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/${symbol}`, {
        params: {
          interval: '1d',
          range: period
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const result = response.data.chart.result[0];
      const timestamps = result.timestamp;
      const quotes = result.indicators.quote[0];
      
      return timestamps.map((timestamp: number, index: number) => ({
        date: new Date(timestamp * 1000).toISOString().split('T')[0],
        open: quotes.open[index] || 0,
        high: quotes.high[index] || 0,
        low: quotes.low[index] || 0,
        close: quotes.close[index] || 0,
        volume: quotes.volume[index] || 0
      })).filter((item: any) => item.close > 0);
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error);
      throw new Error(`Failed to fetch historical data for ${symbol}`);
    }
  }

  async getMarketInsights(symbol: string, period: string): Promise<MarketInsights> {
    try {
      const [currentPrice, historicalData] = await Promise.all([
        this.getCurrentPrice(symbol),
        this.getHistoricalData(symbol, this.getPeriodRange(period))
      ]);

      const prices = historicalData.map(d => d.close);
      const volumes = historicalData.map(d => d.volume);
      
      // Calculate technical indicators
      const ma50 = this.calculateMovingAverage(prices.slice(-50), 50);
      const ma200 = this.calculateMovingAverage(prices.slice(-200), 200);
      const rsi = this.calculateRSI(prices.slice(-14));
      const volatility = this.calculateVolatility(prices);
      
      // Determine trend
      const recentPrices = prices.slice(-5);
      const trend = this.determineTrend(recentPrices, ma50, ma200);
      
      // Generate summary
      const summary = this.generateSummary(currentPrice, period, trend, volatility);
      const marketSentiment = this.generateMarketSentiment(currentPrice, trend, rsi);

      return {
        priceChange: currentPrice.change,
        priceChangePercent: currentPrice.changePercent,
        volatility: volatility,
        volume: currentPrice.volume,
        trend: trend,
        technicalIndicators: {
          rsi: rsi,
          ma50: ma50,
          ma200: ma200,
          support: Math.min(...prices.slice(-20)),
          resistance: Math.max(...prices.slice(-20))
        },
        summary: summary,
        marketSentiment: marketSentiment
      };
    } catch (error) {
      console.error(`Error generating market insights for ${symbol}:`, error);
      throw new Error(`Failed to generate market insights for ${symbol}`);
    }
  }

  private getPeriodRange(period: string): string {
    const periodMap: { [key: string]: string } = {
      '1d': '5d',
      '7d': '1mo',
      '30d': '3mo',
      '90d': '6mo',
      '6m': '1y'
    };
    return periodMap[period] || '1mo';
  }

  private calculateMovingAverage(prices: number[], period: number): number {
    if (prices.length < period) return prices[prices.length - 1] || 0;
    const sum = prices.slice(-period).reduce((a, b) => a + b, 0);
    return sum / period;
  }

  private calculateRSI(prices: number[]): number {
    if (prices.length < 14) return 50;
    
    let gains = 0;
    let losses = 0;
    
    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      if (change > 0) gains += change;
      else losses -= change;
    }
    
    const avgGain = gains / (prices.length - 1);
    const avgLoss = losses / (prices.length - 1);
    
    if (avgLoss === 0) return 100;
    
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  private calculateVolatility(prices: number[]): number {
    if (prices.length < 2) return 0;
    
    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
    }
    
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
    
    return Math.sqrt(variance) * Math.sqrt(252) * 100; // Annualized volatility as percentage
  }

  private determineTrend(recentPrices: number[], ma50: number, ma200: number): 'bullish' | 'bearish' | 'neutral' {
    const currentPrice = recentPrices[recentPrices.length - 1];
    const priceChange = recentPrices[recentPrices.length - 1] - recentPrices[0];
    
    if (currentPrice > ma50 && ma50 > ma200 && priceChange > 0) return 'bullish';
    if (currentPrice < ma50 && ma50 < ma200 && priceChange < 0) return 'bearish';
    return 'neutral';
  }

  private generateSummary(currentPrice: StockPrice, period: string, trend: string, volatility: number): string {
    const changeDirection = currentPrice.changePercent >= 0 ? 'up' : 'down';
    const volatilityLevel = volatility > 30 ? 'high' : volatility > 15 ? 'moderate' : 'low';
    
    return `ST stock is ${changeDirection} ${Math.abs(currentPrice.changePercent).toFixed(2)}% over the ${period} period. ` +
           `Current trend is ${trend} with ${volatilityLevel} volatility (${volatility.toFixed(1)}%). ` +
           `Trading volume is ${(currentPrice.volume / 1000000).toFixed(1)}M shares.`;
  }

  private generateMarketSentiment(currentPrice: StockPrice, trend: string, rsi: number): string {
    let sentiment = 'neutral';
    
    if (trend === 'bullish' && rsi < 70) sentiment = 'positive';
    else if (trend === 'bearish' && rsi > 30) sentiment = 'negative';
    else if (rsi > 70) sentiment = 'overbought';
    else if (rsi < 30) sentiment = 'oversold';
    
    const sentimentMessages = {
      positive: 'Market sentiment is positive with good momentum and room for growth.',
      negative: 'Market sentiment is negative with downward pressure.',
      overbought: 'Stock may be overbought - consider potential pullback.',
      oversold: 'Stock may be oversold - potential buying opportunity.',
      neutral: 'Market sentiment is neutral with mixed signals.'
    };
    
    return sentimentMessages[sentiment as keyof typeof sentimentMessages];
  }
}

export const yahooFinanceService = new YahooFinanceService();