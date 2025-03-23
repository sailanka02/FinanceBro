import alpaca_trade_api as tradeapi
import matplotlib.pyplot as plt
from matplotlib.dates import DateFormatter
import requests
from flask import Flask, jsonify
import os

app = Flask(__name__)

ALPACA_API_KEY = 'PKJZ113M10RMIAP9C9QW'
ALPACA_API_SECRET = 'BUrHgl6MdhYlnVHbciq94HEg5YVy8XQREnA7Tc1C'
BASE_URL = 'https://paper-api.alpaca.markets'
api = tradeapi.REST(ALPACA_API_KEY, ALPACA_API_SECRET, BASE_URL, api_version='v2')

# Initialize Firebase admin only if we need it
try:
    import firebase_admin
    from firebase_admin import credentials, firestore
    
    try:
        firebase_admin.get_app()  # If this doesn't raise, app is already initialized
    except ValueError:
        # Use a relative path from where we're running the script
        credential_path = "stocky-cdd1f-firebase-adminsdk-fbsvc-a2838f662e.json"
        if os.path.exists(credential_path):
            cred = credentials.Certificate(credential_path)
            firebase_admin.initialize_app(cred)
            db = firestore.client()
        else:
            print(f"Warning: Firebase credential file not found at {credential_path}")
            db = None
except ImportError:
    firebase_admin = None
    db = None

# Polygon.io API details
POLGYON_API_KEY = 'XJ4CLEhc8EvjePyblMI5wxfVXYhyw4zo'

def calculate_eps(net_income, outstanding_shares):
    """
    EPS = Net Income / Number of Outstanding Shares
    """
    if outstanding_shares == 0:
        return 0
    return net_income / outstanding_shares


def calculate_pe_ratio(current_share_price, eps):
    """
    P/E Ratio = Current Share Price / Earnings per Share
    """
    if eps == 0:
        return float('inf')
    return current_share_price / eps


def calculate_ps_ratio(market_cap, total_revenue):
    """
    P/S Ratio = Market Capitalization / Total Revenue
    """
    if total_revenue == 0:
        return float('inf')
    return market_cap / total_revenue


def calculate_roe(net_income, shareholder_equity):
    """
    ROE = Net Income / Shareholders' Equity
    """
    if shareholder_equity == 0:
        return float('inf')
    return net_income / shareholder_equity *100


def calculate_roe_avg(net_income, equity_begin, equity_end):
    """
    ROE with average equity over the period
    """
    avg_equity = (equity_begin + equity_end) / 2
    if avg_equity == 0:
        return float('inf')
    return net_income / avg_equity


def calculate_de_ratio(total_liabilities, shareholder_equity):
    """
    D/E Ratio = Total Liabilities / Shareholders' Equity
    """
    if shareholder_equity == 0:
        return float('inf')
    return total_liabilities / shareholder_equity


def calculate_fcf(cash_flow_operations, capital_expenditures):
    """
    FCF = Cash Flow from Operations - Capital Expenditures
    """
    return cash_flow_operations - capital_expenditures


def calculate_revenue_growth(current_revenue, previous_revenue):
    """
    Revenue Growth (%) = ((Current - Previous) / Previous) * 100
    """
    if previous_revenue == 0:
        return float('inf')
    return ((current_revenue - previous_revenue) / previous_revenue) * 100


def get_fundamental_data(symbol='NVDA'):
    """Get the fundamental indicator data for a stock"""
    
    # Initialize result with complete fallback data
    result = {
        "symbol": symbol,
        "price": None,
        "eps": None,
        "pe": None,
        "ps": None,
        "roe": None,
        "de": None,
        "fcf": None,
        "revenue_growth": None,
        "market_cap": None,
        "fallback_metrics": []  # Track which metrics are using fallbacks
    }
    
    # Get current stock price - always try to get real price first
    try:
        last_trade = api.get_latest_trade(symbol)
        result["price"] = last_trade.price
        print(f"Successfully retrieved price for {symbol}: {result['price']}")
    except Exception as e:
        print(f"Could not fetch price for {symbol}: {str(e)}")
        # Use fallback price if lookup fails
        result["price"] = get_fallback_value(symbol, "price", 120.75)
        result["fallback_metrics"].append("price")
    
    # Initial values for calculations
    net_income = None
    outstanding_shares = None
    revenue = None
    shareholders_equity = None
    total_liabilities = None
    cash_flow_operations = None
    capital_expenditures = 0  # Default to 0 since this is often subtracted
    previous_revenue = None
    
    # Try to get financial data from Polygon
    try:
        # Annual data for some metrics
        url = f'https://api.polygon.io/vX/reference/financials'
        params = {
            'ticker': symbol,
            'timeframe': 'annual',
            'apiKey': POLGYON_API_KEY
        }
        
        response = requests.get(url, params=params)
        if response.status_code == 200:
            data = response.json()
            if 'results' in data and data['results'] and 'financials' in data['results'][0]:
                financials = data['results'][0]['financials']
                
                # Get net income
                try:
                    net_income = financials['income_statement']['net_income_loss']['value']
                    print(f"Retrieved net income: {net_income}")
                except (KeyError, TypeError):
                    print("Net income data not found")
                
                # Get outstanding shares
                try:
                    outstanding_shares = int(financials['income_statement']['basic_average_shares']['value'])
                    print(f"Retrieved outstanding shares: {outstanding_shares}")
                except (KeyError, TypeError):
                    print("Outstanding shares data not found")
                
                # Get revenue
                try:
                    revenue = financials['income_statement']['revenues']['value']
                    print(f"Retrieved revenue: {revenue}")
                except (KeyError, TypeError):
                    print("Revenue data not found")
        
        # Calculate EPS if we have the required data
        if net_income is not None and outstanding_shares is not None and outstanding_shares > 0:
            result["eps"] = net_income / outstanding_shares
            print(f"Calculated EPS: {result['eps']}")
        else:
            result["eps"] = get_fallback_value(symbol, "eps", 3.45)
            result["fallback_metrics"].append("eps")
            
        # Calculate market cap if we have price and shares
        if result["price"] is not None and outstanding_shares is not None:
            result["market_cap"] = result["price"] * outstanding_shares
            print(f"Calculated market cap: {result['market_cap']}")
        else:
            result["market_cap"] = get_fallback_value(symbol, "market_cap", 350000000000)
            result["fallback_metrics"].append("market_cap")
            
        # Get quarterly data for other metrics
        params['timeframe'] = 'quarterly'
        response = requests.get(url, params=params)
        
        if response.status_code == 200:
            data = response.json()
            if 'results' in data and len(data['results']) > 1 and 'financials' in data['results'][0]:
                # Get shareholders equity
                try:
                    shareholders_equity = data['results'][0]['financials']['balance_sheet']['equity']['value']
                    print(f"Retrieved shareholders equity: {shareholders_equity}")
                except (KeyError, TypeError):
                    print("Shareholders equity data not found")
                
                # Get total liabilities
                try:
                    total_liabilities = data['results'][0]['financials']['balance_sheet']['liabilities']['value']
                    print(f"Retrieved total liabilities: {total_liabilities}")
                except (KeyError, TypeError):
                    print("Total liabilities data not found")
                
                # Get cash flow from operations
                try:
                    cash_flow_operations = data['results'][0]['financials']['cash_flow_statement']['cash_flow_from_operations']['value']
                    print(f"Retrieved cash flow from operations: {cash_flow_operations}")
                except (KeyError, TypeError):
                    print("Cash flow data not found")
                
                # Get capital expenditures if available
                try:
                    capital_expenditures = abs(data['results'][0]['financials']['cash_flow_statement']['capital_expenditure']['value'])
                    print(f"Retrieved capital expenditures: {capital_expenditures}")
                except (KeyError, TypeError):
                    print("Capital expenditures not found, using 0")
                
                # Get current and previous revenues for growth calculation
                try:
                    current_revenue = data['results'][0]['financials']['income_statement']['revenues']['value']
                    previous_revenue = data['results'][1]['financials']['income_statement']['revenues']['value']
                    print(f"Retrieved current revenue: {current_revenue}, previous: {previous_revenue}")
                except (KeyError, TypeError, IndexError):
                    print("Revenue growth data not found")
        
        # Calculate PE ratio if we have price and EPS
        if result["price"] is not None and result["eps"] is not None and result["eps"] != 0:
            result["pe"] = result["price"] / result["eps"]
            print(f"Calculated P/E ratio: {result['pe']}")
        else:
            result["pe"] = get_fallback_value(symbol, "pe", 24.8)
            result["fallback_metrics"].append("pe")
        
        # Calculate P/S ratio if we have market cap and revenue
        if result["market_cap"] is not None and revenue is not None and revenue > 0:
            result["ps"] = result["market_cap"] / revenue
            print(f"Calculated P/S ratio: {result['ps']}")
        else:
            result["ps"] = get_fallback_value(symbol, "ps", 8.2)
            result["fallback_metrics"].append("ps")
        
        # Calculate ROE if we have net income and shareholder equity
        if net_income is not None and shareholders_equity is not None and shareholders_equity > 0:
            result["roe"] = (net_income / shareholders_equity) * 100
            print(f"Calculated ROE: {result['roe']}%")
        else:
            result["roe"] = get_fallback_value(symbol, "roe", 15.4)
            result["fallback_metrics"].append("roe")
        
        # Calculate D/E ratio if we have liabilities and equity
        if total_liabilities is not None and shareholders_equity is not None and shareholders_equity > 0:
            result["de"] = total_liabilities / shareholders_equity
            print(f"Calculated D/E ratio: {result['de']}")
        else:
            result["de"] = get_fallback_value(symbol, "de", 0.42)
            result["fallback_metrics"].append("de")
        
        # Calculate FCF if we have cash flow and capex
        if cash_flow_operations is not None:
            result["fcf"] = cash_flow_operations - capital_expenditures
            print(f"Calculated FCF: {result['fcf']}")
        else:
            result["fcf"] = get_fallback_value(symbol, "fcf", 12500)
            result["fallback_metrics"].append("fcf")
        
        # Calculate revenue growth if we have current and previous revenue
        if current_revenue is not None and previous_revenue is not None and previous_revenue > 0:
            result["revenue_growth"] = ((current_revenue - previous_revenue) / previous_revenue) * 100
            print(f"Calculated revenue growth: {result['revenue_growth']}%")
        else:
            result["revenue_growth"] = get_fallback_value(symbol, "revenue_growth", 18.7)
            result["fallback_metrics"].append("revenue_growth")
    
    except Exception as e:
        print(f"Error retrieving financial data: {str(e)}")
    
    # Check if we need to fill in missing values with fallbacks
    for key in result:
        if key != "fallback_metrics" and result[key] is None:
            result[key] = get_fallback_value(symbol, key, get_default_fallback(key))
            if key not in result["fallback_metrics"]:
                result["fallback_metrics"].append(key)
    
    print(f"Final data for {symbol}: {result}")
    return result

def get_fallback_value(symbol, metric, default):
    """Get a fallback value for a specific stock and metric"""
    fallbacks = {
        "NVDA": {
            "price": 950.02,
            "eps": 5.43,
            "pe": 175.0,
            "ps": 32.5,
            "roe": 58.6,
            "de": 0.12,
            "fcf": 60853,
            "revenue_growth": 265.3,
            "market_cap": 2350000000000
        },
        "AAPL": {
            "price": 187.79,
            "eps": 6.42,
            "pe": 29.25,
            "ps": 7.86,
            "roe": 45.3,
            "de": 1.25,
            "fcf": 85210,
            "revenue_growth": 8.1,
            "market_cap": 2950000000000
        },
        "MSFT": {
            "price": 415.50,
            "eps": 11.33,
            "pe": 36.7,
            "ps": 12.38,
            "roe": 38.2,
            "de": 0.38,
            "fcf": 67840,
            "revenue_growth": 15.8,
            "market_cap": 3100000000000
        },
        "AMZN": {
            "price": 182.15,
            "eps": 4.10,
            "pe": 44.5,
            "ps": 3.10,
            "roe": 22.4,
            "de": 0.79,
            "fcf": 32751,
            "revenue_growth": 12.3,
            "market_cap": 1890000000000
        },
        "TSLA": {
            "price": 172.98,
            "eps": 3.12,
            "pe": 55.4,
            "ps": 6.78,
            "roe": 15.9,
            "de": 0.17,
            "fcf": 8952,
            "revenue_growth": 25.2,
            "market_cap": 548000000000
        }
    }
    
    if symbol.upper() in fallbacks and metric in fallbacks[symbol.upper()]:
        return fallbacks[symbol.upper()][metric]
    return default

def get_default_fallback(metric):
    """Get a sensible default fallback value for a metric"""
    defaults = {
        "price": 120.75,
        "eps": 3.45,
        "pe": 24.8,
        "ps": 8.2,
        "roe": 15.4,
        "de": 0.42,
        "fcf": 12500,
        "revenue_growth": 18.7,
        "market_cap": 350000000000
    }
    return defaults.get(metric, 0)

@app.route('/fundamental_data')
def fundamental_data():
    """API endpoint to return fundamental data for a stock"""
    try:
        # Try to get symbol from Firebase if available
        symbol = 'NVDA'  # Default
        if db is not None:
            try:
                symbol = db.collection('Company').doc('UbpbfMDhDcvlcRyVkW14').get().to_dict()['name']
            except:
                pass
            
        data = get_fundamental_data(symbol)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)