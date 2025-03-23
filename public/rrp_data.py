# data/rrp_data.py

from fredapi import Fred
import pandas as pd
from config.constants import FRED_API_KEY

def get_rrp_data(start_date: str, end_date: str):
    fred = Fred(api_key=FRED_API_KEY)
    rrp_series = fred.get_series('RRPONTSYD', start_date=start_date, end_date=end_date)

    rrp_df = pd.DataFrame(rrp_series, columns=['rrp'])
    rrp_df.index = pd.to_datetime(rrp_df.index)
    rrp_df = rrp_df.tz_localize('UTC')  # For consistency

    return rrp_df
