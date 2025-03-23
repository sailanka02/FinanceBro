from fredapi import Fred
import pandas as pd
from config.constants import *


def get_fred_client():
    return Fred(api_key=FRED_API_KEY)


def get_yield_curve_data(start_date: str, end_date: str):
    fred = get_fred_client()
    data = {label: fred.get_series(code, start_date, end_date) for label, code in TREASURY_SERIES.items()}
    df = pd.DataFrame(data)
    df.dropna(inplace=True)
    return df


def get_individual_rate(maturity: str, start_date: str, end_date: str):
    fred = get_fred_client()
    maturity = maturity.strip().upper()
    if maturity not in TREASURY_SERIES:
        raise ValueError(f"Invalid maturity selected: {maturity}")

    series_id = TREASURY_SERIES[maturity]
    series = fred.get_series(series_id, start_date, end_date)

    df = pd.DataFrame(series, columns=['rate'])
    df.index = pd.to_datetime(df.index)
    df.index = df.index.tz_localize('UTC')
    df = df.resample('15min').ffill()

    return df
