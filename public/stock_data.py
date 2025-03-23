# stock_data.py
import alpaca_trade_api as tradeapi
import pandas as pd

def get_stock_data(symbol: str, timeframe: str, start_date: str, end_date: str, key: str, secret: str, base_url: str):
    api = tradeapi.REST(key, secret, base_url, api_version='v2')
    bars = api.get_bars(symbol, timeframe, start_date, end_date)

    stock_df = pd.DataFrame({
        'time': [bar.t for bar in bars],
        'close': [bar.c for bar in bars]
    })
    stock_df['time'] = pd.to_datetime(stock_df['time'])
    stock_df.set_index('time', inplace=True)

    return stock_df

