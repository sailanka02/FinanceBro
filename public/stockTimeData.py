import alpaca_trade_api as tradeapi
import streamlit as st
# make this env later
API_KEY = 'PKJZ113M10RMIAP9C9QW'
API_SECRET = 'BUrHgl6MdhYlnVHbciq94HEg5YVy8XQREnA7Tc1C'
BASE_URL = 'https://paper-api.alpaca.markets'
api = tradeapi.REST(API_KEY, API_SECRET, BASE_URL, api_version='v2')
import firebase_admin
from firebase_admin import credentials, firestore


try:
    firebase_admin.get_app()  # If this doesn't raise, app is already initialized
except ValueError:
    cred = credentials.Certificate("public/stocky-cdd1f-firebase-adminsdk-fbsvc-a2838f662e.json")
    firebase_admin.initialize_app(cred)
db = firestore.client()
# Get query parameters
query_params = st.query_params

# Handle the symbol parameter properly with a default
try:
    # First try to get it as a direct value (newer Streamlit versions)
    default_symbol = query_params.get('symbol', [db.collection('Company').doc('UbpbfMDhDcvlcRyVkW14').get().to_dict()['name']])
    print(default_symbol)
except:
    # If it's an older Streamlit version that returns lists for query params
    param_list = query_params.get('symbol', ['NVDA'])
    default_symbol = param_list[0] if param_list else 'NVDA'
symbol = default_symbol
timeframe = '5Min'  # '1Min', '5Min', '15Min', '1Day'
startDate = '2023-01-01'
endDate = '2023-01-31'
bars = api.get_bars(symbol, timeframe, startDate, endDate)

#test
for bar in bars:
    print(f"Date: {bar.t}, Open: {bar.o}, High: {bar.h}, Low: {bar.l}, Close: {bar.c}, Volume: {bar.v}")

