import requests
import pandas as pd

def get_treasury_issuance(start_date, end_date):
    base_url = "https://api.fiscaldata.treasury.gov/services/api/fiscal_service"
    endpoint = "/v1/accounting/od/auctions_query"

    fields = "?fields=security_type,auction_date,offering_amt"
    filters = f"&filter=auction_date:gte:{start_date},auction_date:lte:{end_date}"
    sort = "&sort=-auction_date"
    fmt = "&format=json"
    pagination = "&page[size]=1000"

    url = f"{base_url}{endpoint}{fields}{filters}{sort}{fmt}{pagination}"

    response = requests.get(url)

    if response.status_code != 200:
        print("❌ API Error:", response.status_code)
        print("Response:", response.text)
        return pd.DataFrame()

    data = response.json().get("data", [])
    if not data:
        print("⚠️ No data returned.")
        return pd.DataFrame()

    df = pd.DataFrame(data)
    df["auction_date"] = pd.to_datetime(df["auction_date"], errors="coerce", utc=True)
    df["offering_amt"] = pd.to_numeric(df["offering_amt"], errors="coerce")
    df.dropna(subset=["auction_date", "offering_amt", "security_type"], inplace=True)
    df.rename(columns={"offering_amt": "issuance"}, inplace=True)

    return df









