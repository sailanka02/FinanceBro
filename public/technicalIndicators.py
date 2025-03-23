import alpaca_trade_api as tradeapi
import numpy as np

#from dotenv import load_dotenv
import os

# Alpaca API setup
#load_dotenv()
ALPACA_API_KEY = "PKJZ113M10RMIAP9C9QW"
ALPACA_API_SECRET = "BUrHgl6MdhYlnVHbciq94HEg5YVy8XQREnA7Tc1C"
BASE_URL = 'https://paper-api.alpaca.markets'

api = tradeapi.REST(ALPACA_API_KEY, ALPACA_API_SECRET, BASE_URL, api_version='v2')

symbol = 'AAPL'  # Replace with your stock symbol
timeframe = 'day'  # Time interval (e.g., 'minute', 'hour', 'day')
start_date = '2023-01-01'
end_date = '2023-12-31'

# Retrieve historical stock data
barset = api.get_bars(symbol, timeframe, start=start_date, end=end_date).df
prices = barset['close']

# 1. Moving Averages
sma_50 = prices.rolling(window=50).mean()
sma_200 = prices.rolling(window=200).mean()
ema_12 = prices.ewm(span=12, adjust=False).mean()
ema_26 = prices.ewm(span=26, adjust=False).mean()

# 2. Moving Average Convergence Divergence (MACD)
macd_line = ema_12 - ema_26
signal_line = macd_line.ewm(span=9, adjust=False).mean()
macd_histogram = macd_line - signal_line

# 3. Relative Strength Index (RSI)
delta = prices.diff()
gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
rs = gain / loss
rsi = 100 - (100 / (1 + rs))

# 4. Bollinger Bands
moving_average = prices.rolling(window=20).mean()
std_dev = prices.rolling(window=20).std()
upper_band = moving_average + (2 * std_dev)
lower_band = moving_average - (2 * std_dev)

# 5. Stochastic Oscillator
low_14 = barset['low'].rolling(window=14).min()
high_14 = barset['high'].rolling(window=14).max()
stochastic_k = 100 * ((prices - low_14) / (high_14 - low_14))

# Print the calculated indicators
print(f"""
Technical Indicators for {symbol}:
----------------------------------
50-Day SMA: {sma_50.iloc[-1]:.2f}
200-Day SMA: {sma_200.iloc[-1]:.2f}
12-Day EMA: {ema_12.iloc[-1]:.2f}
26-Day EMA: {ema_26.iloc[-1]:.2f}
MACD Line: {macd_line.iloc[-1]:.2f}
Signal Line: {signal_line.iloc[-1]:.2f}
RSI: {rsi.iloc[-1]:.2f}
Bollinger Upper Band: {upper_band.iloc[-1]:.2f}
Bollinger Lower Band: {lower_band.iloc[-1]:.2f}
Stochastic %K: {stochastic_k.iloc[-1]:.2f}
----------------------------------
""")
