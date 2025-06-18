#!/usr/bin/env python3
"""
Stock Price Data Normalization Demo
Demonstrates Min-Max scaling (0-1 range) and Z-score normalization
using both manual calculations and sklearn preprocessing
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler, StandardScaler
import yfinance as yf
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

def fetch_stock_data(symbol='STM', period='6mo'):
    """Fetch real stock data from Yahoo Finance"""
    try:
        stock = yf.Ticker(symbol)
        data = stock.history(period=period)
        return data
    except Exception as e:
        print(f"Error fetching data: {e}")
        return None

def manual_minmax_normalization(data):
    """
    Manual Min-Max Normalization: X_normalized = (X - X_min) / (X_max - X_min)
    Scales values to [0, 1] range
    """
    X_min = data.min()
    X_max = data.max()
    X_range = X_max - X_min
    
    if X_range == 0:
        return np.zeros_like(data), X_min, X_max
    
    normalized = (data - X_min) / X_range
    return normalized, X_min, X_max

def manual_zscore_normalization(data):
    """
    Manual Z-score Normalization: Z = (X - μ) / σ
    Results in mean≈0, std≈1
    """
    mean = data.mean()
    std = data.std()
    
    if std == 0:
        return np.zeros_like(data), mean, std
    
    zscore = (data - mean) / std
    return zscore, mean, std

def inverse_minmax_transform(normalized_data, X_min, X_max):
    """Inverse Min-Max transformation back to original scale"""
    return normalized_data * (X_max - X_min) + X_min

def inverse_zscore_transform(zscore_data, mean, std):
    """Inverse Z-score transformation back to original scale"""
    return zscore_data * std + mean

def display_statistics(data, name):
    """Display comprehensive statistics for a dataset"""
    print(f"\n{name} Statistics:")
    print(f"  Mean: {data.mean():.6f}")
    print(f"  Std:  {data.std():.6f}")
    print(f"  Min:  {data.min():.6f}")
    print(f"  Max:  {data.max():.6f}")
    print(f"  Range: {data.max() - data.min():.6f}")

def main():
    print("=== Stock Price Data Normalization Demo ===\n")
    
    # Fetch real STM stock data
    print("Fetching STMicroelectronics (STM) stock data...")
    stock_data = fetch_stock_data('STM', '6mo')
    
    if stock_data is None or stock_data.empty:
        print("Failed to fetch stock data. Creating sample data...")
        # Create sample data as fallback
        dates = pd.date_range(start='2024-01-01', end='2024-06-18', freq='D')
        np.random.seed(42)
        prices = 25 + np.cumsum(np.random.randn(len(dates)) * 0.5)
        stock_data = pd.DataFrame({
            'Open': prices + np.random.randn(len(dates)) * 0.2,
            'High': prices + np.abs(np.random.randn(len(dates))) * 0.3,
            'Low': prices - np.abs(np.random.randn(len(dates))) * 0.3,
            'Close': prices,
            'Volume': np.random.randint(1000000, 5000000, len(dates))
        }, index=dates)
    
    # Focus on Close prices for normalization
    close_prices = stock_data['Close'].dropna()
    print(f"Using {len(close_prices)} data points for analysis\n")
    
    # Display original data statistics
    display_statistics(close_prices, "Original Close Prices")
    
    print("\n" + "="*60)
    print("MANUAL NORMALIZATION CALCULATIONS")
    print("="*60)
    
    # 1. Manual Min-Max Normalization
    print("\n1. MIN-MAX NORMALIZATION (Manual)")
    print("   Formula: X_normalized = (X - X_min) / (X_max - X_min)")
    
    minmax_manual, min_val, max_val = manual_minmax_normalization(close_prices)
    display_statistics(minmax_manual, "Min-Max Normalized (Manual)")
    print(f"   Normalization Parameters:")
    print(f"     X_min = ${min_val:.2f}")
    print(f"     X_max = ${max_val:.2f}")
    print(f"     Range = ${max_val - min_val:.2f}")
    
    # Verify inverse transformation
    recovered_minmax = inverse_minmax_transform(minmax_manual, min_val, max_val)
    reconstruction_error = np.mean(np.abs(close_prices - recovered_minmax))
    print(f"   Inverse Transform Error: {reconstruction_error:.8f}")
    
    # 2. Manual Z-score Normalization
    print("\n2. Z-SCORE NORMALIZATION (Manual)")
    print("   Formula: Z = (X - μ) / σ")
    
    zscore_manual, mean_val, std_val = manual_zscore_normalization(close_prices)
    display_statistics(zscore_manual, "Z-score Normalized (Manual)")
    print(f"   Normalization Parameters:")
    print(f"     μ (mean) = ${mean_val:.2f}")
    print(f"     σ (std)  = ${std_val:.2f}")
    print(f"     Variance = ${std_val**2:.2f}")
    
    # Verify inverse transformation
    recovered_zscore = inverse_zscore_transform(zscore_manual, mean_val, std_val)
    reconstruction_error = np.mean(np.abs(close_prices - recovered_zscore))
    print(f"   Inverse Transform Error: {reconstruction_error:.8f}")
    
    print("\n" + "="*60)
    print("SKLEARN PREPROCESSING VALIDATION")
    print("="*60)
    
    # 3. Sklearn MinMaxScaler validation
    print("\n3. SKLEARN MINMAXSCALER VALIDATION")
    scaler_minmax = MinMaxScaler()
    close_prices_reshaped = close_prices.values.reshape(-1, 1)
    minmax_sklearn = scaler_minmax.fit_transform(close_prices_reshaped).flatten()
    display_statistics(pd.Series(minmax_sklearn), "Min-Max (sklearn)")
    
    # Compare with manual calculation
    difference_minmax = np.mean(np.abs(minmax_manual - minmax_sklearn))
    print(f"   Difference from Manual: {difference_minmax:.10f}")
    
    # 4. Sklearn StandardScaler validation
    print("\n4. SKLEARN STANDARDSCALER VALIDATION")
    scaler_standard = StandardScaler()
    zscore_sklearn = scaler_standard.fit_transform(close_prices_reshaped).flatten()
    display_statistics(pd.Series(zscore_sklearn), "Z-score (sklearn)")
    
    # Compare with manual calculation
    difference_zscore = np.mean(np.abs(zscore_manual - zscore_sklearn))
    print(f"   Difference from Manual: {difference_zscore:.10f}")
    
    print("\n" + "="*60)
    print("ERROR HANDLING & EDGE CASES")
    print("="*60)
    
    # 5. Edge case testing
    print("\n5. EDGE CASE TESTING")
    
    # Constant values (no variance)
    constant_data = pd.Series([25.0] * 10)
    print(f"\nConstant Data Test (all values = 25.0):")
    
    try:
        const_minmax, const_min, const_max = manual_minmax_normalization(constant_data)
        print(f"  Min-Max: All values = {const_minmax[0]:.1f} (range = 0)")
    except Exception as e:
        print(f"  Min-Max Error: {e}")
    
    try:
        const_zscore, const_mean, const_std = manual_zscore_normalization(constant_data)
        print(f"  Z-score: All values = {const_zscore[0]:.1f} (std = 0)")
    except Exception as e:
        print(f"  Z-score Error: {e}")
    
    # Single value
    single_data = pd.Series([30.0])
    print(f"\nSingle Value Test (value = 30.0):")
    single_minmax, _, _ = manual_minmax_normalization(single_data)
    single_zscore, _, _ = manual_zscore_normalization(single_data)
    print(f"  Min-Max: {single_minmax[0]:.1f}")
    print(f"  Z-score: {single_zscore[0]:.1f}")
    
    print("\n" + "="*60)
    print("VISUALIZATION & COMPARISON")
    print("="*60)
    
    # Create visualization
    fig, axes = plt.subplots(2, 2, figsize=(15, 10))
    fig.suptitle('Stock Price Normalization Comparison', fontsize=16)
    
    # Original data
    axes[0,0].plot(close_prices.index, close_prices.values, 'b-', linewidth=1)
    axes[0,0].set_title('Original Close Prices')
    axes[0,0].set_ylabel('Price ($)')
    axes[0,0].grid(True, alpha=0.3)
    
    # Min-Max normalized
    axes[0,1].plot(close_prices.index, minmax_manual.values, 'g-', linewidth=1)
    axes[0,1].set_title('Min-Max Normalized [0,1]')
    axes[0,1].set_ylabel('Normalized Value')
    axes[0,1].grid(True, alpha=0.3)
    
    # Z-score normalized
    axes[1,0].plot(close_prices.index, zscore_manual.values, 'r-', linewidth=1)
    axes[1,0].set_title('Z-score Normalized (μ=0, σ=1)')
    axes[1,0].set_ylabel('Standard Deviations')
    axes[1,0].grid(True, alpha=0.3)
    
    # Comparison histogram
    axes[1,1].hist(close_prices.values, bins=30, alpha=0.5, label='Original', density=True)
    axes[1,1].hist(minmax_manual.values, bins=30, alpha=0.5, label='Min-Max', density=True)
    axes[1,1].hist(zscore_manual.values, bins=30, alpha=0.5, label='Z-score', density=True)
    axes[1,1].set_title('Distribution Comparison')
    axes[1,1].set_xlabel('Value')
    axes[1,1].set_ylabel('Density')
    axes[1,1].legend()
    axes[1,1].grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig('stock_normalization_comparison.png', dpi=300, bbox_inches='tight')
    print("\n📊 Visualization saved as 'stock_normalization_comparison.png'")
    
    print("\n" + "="*60)
    print("SUMMARY & RECOMMENDATIONS")
    print("="*60)
    
    print(f"""
📈 NORMALIZATION ANALYSIS COMPLETE

Original Data Range: ${min_val:.2f} - ${max_val:.2f} (Range: ${max_val-min_val:.2f})

✓ Min-Max Normalization (0-1 scale):
  • Perfect for neural networks requiring bounded inputs
  • Preserves original data distribution shape
  • Sensitive to outliers
  • Range: [{minmax_manual.min():.6f}, {minmax_manual.max():.6f}]

✓ Z-score Normalization (standardization):
  • Centers data around mean=0, std=1
  • Less sensitive to outliers
  • Preferred for algorithms assuming normal distribution
  • Range: [{zscore_manual.min():.6f}, {zscore_manual.max():.6f}]

🎯 RECOMMENDATIONS:
  • Use Min-Max for neural networks, image processing
  • Use Z-score for linear regression, SVM, clustering
  • Always store normalization parameters for inverse transforms
  • Handle edge cases (constant values, single points)
  • Validate with sklearn preprocessing for production use
""")

if __name__ == "__main__":
    main()