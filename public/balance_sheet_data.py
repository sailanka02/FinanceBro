# fred_balance_sheet.py
from fredapi import Fred
import pandas as pd
from config.constants import FRED_API_KEY

def get_balance_sheet(start_date, end_date):
    fred = Fred(api_key=FRED_API_KEY)

    # Get weekly balance sheet series (WALCL)
    series = fred.get_series('WALCL', start_date, end_date)

    df = pd.DataFrame(series, columns=['balance_sheet'])
    df.index = pd.to_datetime(df.index)
    df.index = df.index.tz_localize('UTC')

    # Calculate delta only on update days
    df['balance_sheet'] = df['balance_sheet'].diff()

    # Resample to daily and fill non-update days with 0
    daily_index = pd.date_range(start=df.index.min(), end=df.index.max(), freq='D', tz='UTC')
    daily_df = pd.DataFrame(index=daily_index)
    daily_df['balance_sheet'] = df['balance_sheet']
    daily_df['balance_sheet'] = daily_df['balance_sheet'].fillna(0)

    # ⬇️ NEW: Resample to 15min to match NVDA data
    resampled_df = daily_df.resample('15min').ffill()

    return resampled_df

