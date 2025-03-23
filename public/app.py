# from flask import Flask, send_file, jsonify
# import alpaca_trade_api as tradeapi
# import matplotlib
# matplotlib.use('Agg')  # Set the backend to Agg before importing pyplot
# import matplotlib.pyplot as plt
# from matplotlib.widgets import Button
# import io
# import datetime

# app = Flask(__name__)

# @app.route('/chart')
# def chart():
#     # --- Alpaca API Setup ---
#     ALPACA_API_KEY = 'PKJZ113M10RMIAP9C9QW'
#     ALPACA_API_SECRET = 'BUrHgl6MdhYlnVHbciq94HEg5YVy8XQREnA7Tc1C'
#     BASE_URL = 'https://paper-api.alpaca.markets'
    
#     # Create the API client
#     api = tradeapi.REST(ALPACA_API_KEY, ALPACA_API_SECRET, BASE_URL, api_version='v2')
    
#     # --- Data Retrieval ---
#     symbol = 'NVDA'
#     timeframe = '1D'
    
#     # Use last 30 days of data
#     endDate = (datetime.datetime.now() - datetime.timedelta(days=2)).strftime('%Y-%m-%d')
#     startDate = (datetime.datetime.now() - datetime.timedelta(days=30)).strftime('%Y-%m-%d')
    
#     try:
#         # bars = api.get_bars(symbol, timeframe, startDate, endDate)

#         # # Extract data from the bars
#         # dates = [bar.t.strftime('%Y-%m-%d') for bar in bars]
#         # closing_prices = [bar.c for bar in bars]

#         # # --- Chart Generation ---
#         # plt.figure(figsize=(12, 6))
#         # plt.plot(range(len(dates)), closing_prices, label='Closing Price', color='blue')
        
#         # # Display only a subset of dates on the x-axis
#         # skip = max(1, len(dates) // 10)
#         # plt.xticks(
#         #     ticks=range(0, len(dates), skip),
#         #     labels=[dates[i] for i in range(0, len(dates), skip)],
#         #     rotation=45
#         # )
        
#         # plt.title(f'{symbol} Stock Closing Prices ({startDate} to {endDate})')
#         # plt.xlabel('Trading Dates')
#         # plt.ylabel('Price')
#         # plt.grid(True)
#         # plt.legend()
#         # plt.tight_layout()
        
#         # # --- Convert Plot to Image ---
#         # img = io.BytesIO()
#         # plt.savefig(img, format='png')
#         # plt.close()  # Close the plot to free up memory
#         # img.seek(0)
        
#         # return send_file(img, mimetype='image/png')


#         bars = api.get_bars(symbol, timeframe, startDate, endDate)

#         # Extract trading day data
#         dates = [bar.t for bar in bars]
#         closing_prices = [bar.c for bar in bars]

#         # Create the figure and axis
#         fig, ax = plt.subplots(figsize=(12, 6))
#         line, = ax.plot(range(len(dates)), closing_prices, label='Closing Price', color='blue')

#         # Show only a subset of the dates on the x-axis
#         skip = max(1, len(dates) // 10)
#         ax.set_xticks(range(0, len(dates), skip))
#         ax.set_xticklabels([dates[i].strftime('%Y-%m-%d') for i in range(0, len(dates), skip)], rotation=45)

#         ax.set_title(f'{symbol} Stock Closing Prices ({startDate} to {endDate})')
#         ax.set_xlabel('Trading Dates')
#         ax.set_ylabel('Price')
#         ax.grid(True)

#         # Add interactivity to hover over points
#         tooltip = ax.annotate(
#             "",
#             xy=(0, 0),
#             xytext=(15, 15),
#             textcoords="offset points",
#             bbox=dict(boxstyle="round", fc="w"),
#             arrowprops=dict(arrowstyle="->"),
#         )
#         tooltip.set_visible(False)
        
#     except Exception as e:
#         # Generate a simple error chart
#         plt.figure(figsize=(12, 6))
#         plt.text(0.5, 0.5, f"Error retrieving data: {str(e)}", 
#                  horizontalalignment='center', verticalalignment='center', 
#                  transform=plt.gca().transAxes)
#         plt.axis('off')
#         img = io.BytesIO()
#         plt.savefig(img, format='png')
#         plt.close()
#         img.seek(0)
#         return send_file(img, mimetype='image/png')
    

#     def on_hover(event):
#         if event.inaxes == ax:  # Check if the mouse is over the plot
#             for i, (x, y) in enumerate(zip(range(len(dates)), closing_prices)):
#                 if abs(event.xdata - x) < 0.5 and abs(event.ydata - y) < 2:  # Sensitivity range
#                     tooltip.xy = (x, y)
#                     tooltip.set_text(f"Date: {dates[i].strftime('%Y-%m-%d')}\nPrice: {y:.2f}")
#                     tooltip.set_visible(True)
#                     fig.canvas.draw_idle()
#                     return
#         tooltip.set_visible(False)
#         fig.canvas.draw_idle()

#     fig.canvas.mpl_connect("motion_notify_event", on_hover)

#     # Add button to toggle graph
#     graph_visible = True

#     def toggle_graph(event):
#         global graph_visible
#         if graph_visible:
#             line.set_visible(False)  # Hide the graph
#         else:
#             line.set_visible(True)  # Show the graph
#         graph_visible = not graph_visible
#         fig.canvas.draw_idle()

#         # Add button at the legend's location
#     button_ax = ax.figure.add_axes([0.75, 0.9, 0.1, 0.05])  # Position above the plot area (replace legend area)
#     toggle_button = Button(button_ax, 'Toggle Graph')
#     toggle_button.on_clicked(toggle_graph)

#     plt.tight_layout()
#     plt.show()
# # @app.route('/chartdata')
# # def chartdata():
# #     # --- Alpaca API Setup ---
# #     ALPACA_API_KEY = 'PKJZ113M10RMIAP9C9QW'
# #     ALPACA_API_SECRET = 'BUrHgl6MdhYlnVHbciq94HEg5YVy8XQREnA7Tc1C'
# #     BASE_URL = 'https://paper-api.alpaca.markets'
    
# #     # Create the API client
# #     api = tradeapi.REST(ALPACA_API_KEY, ALPACA_API_SECRET, BASE_URL, api_version='v2')
    
# #     # --- Data Retrieval ---
# #     symbol = 'NVDA'
# #     timeframe = '1D'
    
# #     # Use last 30 days of data
# #     endDate = datetime.datetime.now().strftime('%Y-%m-%d')
# #     startDate = (datetime.datetime.now() - datetime.timedelta(days=30)).strftime('%Y-%m-%d')
    
# #     try:
# #         bars = api.get_bars(symbol, timeframe, startDate, endDate)

# #         # Extract data in a format suitable for interactive charts
# #         chart_data = {
# #             'symbol': symbol,
# #             'dates': [bar.t.strftime('%Y-%m-%d') for bar in bars],
# #             'closing': [bar.c for bar in bars],
# #             'opening': [bar.o for bar in bars],
# #             'high': [bar.h for bar in bars],
# #             'low': [bar.l for bar in bars],
# #             'volume': [bar.v for bar in bars]
# #         }
        
# #         return jsonify(chart_data)
# #     except Exception as e:
# #         return jsonify({
# #             'error': str(e),
# #             'symbol': symbol,
# #             'dates': ['2023-06-01', '2023-06-02', '2023-06-03', '2023-06-04', '2023-06-05'],
# #             'closing': [100, 102, 98, 103, 105],
# #             'opening': [99, 100, 102, 98, 103],
# #             'high': [103, 104, 102, 104, 106],
# #             'low': [98, 99, 97, 98, 102],
# #             'volume': [1000, 1200, 900, 1100, 1300]
# #         })

# # @app.route('/chartdata/<symbol>')
# # def chartdata_by_symbol(symbol):
# #     # --- Alpaca API Setup ---
# #     ALPACA_API_KEY = 'PKJZ113M10RMIAP9C9QW'
# #     ALPACA_API_SECRET = 'BUrHgl6MdhYlnVHbciq94HEg5YVy8XQREnA7Tc1C'
# #     BASE_URL = 'https://paper-api.alpaca.markets'
    
# #     # Create the API client
# #     api = tradeapi.REST(ALPACA_API_KEY, ALPACA_API_SECRET, BASE_URL, api_version='v2')
    
# #     # --- Data Retrieval ---
# #     timeframe = '1D'
    
# #     # Use last 30 days of data
# #     endDate = datetime.datetime.now().strftime('%Y-%m-%d')
# #     startDate = (datetime.datetime.now() - datetime.timedelta(days=30)).strftime('%Y-%m-%d')
    
# #     try:
# #         bars = api.get_bars(symbol, timeframe, startDate, endDate)

# #         # Extract data in a format suitable for interactive charts
# #         chart_data = {
# #             'symbol': symbol,
# #             'dates': [bar.t.strftime('%Y-%m-%d') for bar in bars],
# #             'closing': [bar.c for bar in bars],
# #             'opening': [bar.o for bar in bars],
# #             'high': [bar.h for bar in bars],
# #             'low': [bar.l for bar in bars],
# #             'volume': [bar.v for bar in bars]
# #         }
        
# #         return jsonify(chart_data)
# #     except Exception as e:
# #         return jsonify({
# #             'error': str(e),
# #             'symbol': symbol,
# #             'dates': ['2023-06-01', '2023-06-02', '2023-06-03', '2023-06-04', '2023-06-05'],
# #             'closing': [100, 102, 98, 103, 105],
# #             'opening': [99, 100, 102, 98, 103],
# #             'high': [103, 104, 102, 104, 106],
# #             'low': [98, 99, 97, 98, 102],
# #             'volume': [1000, 1200, 900, 1100, 1300]
# #         })

# if __name__ == '__main__':
#     # Run in debug mode for development. Use a production WSGI server for deployment.
#     app.run(debug=True)
    

import streamlit as st
import alpaca_trade_api as tradeapi
import matplotlib.pyplot as plt
import datetime
from urllib.parse import parse_qs
import os

# --- Alpaca API Setup ---
ALPACA_API_KEY = 'PKJZ113M10RMIAP9C9QW'
ALPACA_API_SECRET = 'BUrHgl6MdhYlnVHbciq94HEg5YVy8XQREnA7Tc1C'
BASE_URL = 'https://paper-api.alpaca.markets'

# Create the API client - moved outside conditionals so it's always available
api = tradeapi.REST(ALPACA_API_KEY, ALPACA_API_SECRET, BASE_URL, api_version='v2')

# Initialize db with None to ensure it's always defined
db = None

# Make Firebase optional - wrap in try/except
try:
    import firebase_admin
    from firebase_admin import credentials, firestore
    
    try:
        firebase_admin.get_app()  # If this doesn't raise, app is already initialized
    except ValueError:
        # Use a relative path that works from the current directory
        credential_path = "stocky-cdd1f-firebase-adminsdk-fbsvc-a2838f662e.json"
        if os.path.exists(credential_path):
            cred = credentials.Certificate(credential_path)
            firebase_admin.initialize_app(cred)
            db = firestore.client()
        else:
            print(f"Warning: Firebase credential file not found at {credential_path}")
except ImportError:
    print("Firebase admin SDK not installed, proceeding without Firebase")
    firebase_admin = None
    
# Get query parameters
query_params = st.query_params

# Handle the symbol parameter properly with a default
default_symbol = 'NVDA'  # Set default first

# Try to get from Firebase if available
if db is not None:
    try:
        default_symbol = db.collection('Company').doc('UbpbfMDhDcvlcRyVkW14').get().to_dict()['name']
    except Exception as e:
        print(f"Error getting symbol from Firebase: {e}")

# Override with URL parameter if present
if 'symbol' in query_params:
    symbol_param = query_params.get('symbol')
    if isinstance(symbol_param, list):
        default_symbol = symbol_param[0] if symbol_param else 'NVDA'
    else:
        default_symbol = symbol_param
    
def fetch_stock_data(symbol='NVDA', days=30):
    """Fetch 'days' days of daily bars from Alpaca for a given symbol."""
    end_date = (datetime.datetime.now() - datetime.timedelta(days=2)).strftime('%Y-%m-%d')
    start_date = (datetime.datetime.now() - datetime.timedelta(days=days)).strftime('%Y-%m-%d')
    
    try:
        bars = api.get_bars(symbol, '15Min', start_date, end_date)
        if len(bars) == 0:
            st.warning(f"No data returned for {symbol}. Check symbol or date range.")
            return [], []
        
        dates = [bar.t for bar in bars]
        closes = [bar.c for bar in bars]
        return dates, closes
    except Exception as e:
        st.error(f"Error fetching data: {e}")
        return [], []

def extract_balance_sheet_data_from_params():
    """Extract balance sheet years and equity values from URL parameters."""
    has_overlay = query_params.get('overlay') == 'true'
    
    if not has_overlay:
        return None
    
    years = []
    equity_values = []
    
    # Look for year and equity parameters
    index = 0
    while f'year{index}' in query_params and f'equity{index}' in query_params:
        year_param = query_params.get(f'year{index}')
        equity_param = query_params.get(f'equity{index}')
        
        # Convert to appropriate types
        try:
            year = int(year_param) if isinstance(year_param, str) else int(year_param[0])
            equity = float(equity_param) if isinstance(equity_param, str) else float(equity_param[0])
            
            years.append(year)
            equity_values.append(equity)
        except (ValueError, TypeError) as e:
            st.warning(f"Error parsing balance sheet parameter at index {index}: {e}")
        
        index += 1
    
    if years and equity_values:
        return {'years': years, 'equity': equity_values}
    return None

def main():
    st.title(default_symbol)

    # Extract balance sheet data if available
    balance_sheet_data = extract_balance_sheet_data_from_params()
    
    if balance_sheet_data:
        st.subheader("Balance Sheet Overlay Enabled")
        
        # Display balance sheet data in a sidebar
        with st.sidebar:
            st.subheader("Balance Sheet Data")
            balance_df = {
                'Year': balance_sheet_data['years'],
                'Shareholder Equity': [f"${equity:,.2f}" for equity in balance_sheet_data['equity']]
            }
            st.dataframe(balance_df)
    
    # How many days of history?
    days = st.slider("Days of data to fetch:", 5, 60, 30)

    # Fetch data
    dates, closes = fetch_stock_data(default_symbol, days)

    if not dates:
        st.error(f"No data available for {default_symbol}")
        return  # Exit if no data

    # Toggle display with a checkbox
    show_balance_sheet = st.checkbox("Show balance sheet data (if available)", value=True) if balance_sheet_data else False

    # Create figure and plot
    fig, ax = plt.subplots(figsize=(10, 5))
    
    # Plot stock price line
    ax.plot(range(len(dates)), closes, label='Closing Price', color='blue')

    # Add balance sheet data as vertical lines if available and enabled
    if balance_sheet_data and show_balance_sheet:
        # Create a twin y-axis for equity values
        ax2 = ax.twinx()
        
        # Format equity values with proper scale
        def format_equity(equity):
            if equity >= 1e12:
                return f"${equity/1e12:.2f}T"
            elif equity >= 1e9:
                return f"${equity/1e9:.2f}B"
            elif equity >= 1e6:
                return f"${equity/1e6:.2f}M"
            else:
                return f"${equity:.2f}"
        
        # Add equity points as a separate line
        years = balance_sheet_data['years']
        equity_values = balance_sheet_data['equity']
        
        # Convert years to x-coordinates spanning the date range
        # This is approximate since we don't know exact dates for each year
        date_range = max(dates) - min(dates)
        min_year = min(years)
        max_year = max(years)
        year_span = max_year - min_year if max_year > min_year else 1
        
        # Map each year to an x-coordinate
        x_coords = []
        for year in years:
            # Position proportionally within the date range
            position = (year - min_year) / year_span if year_span > 0 else 0.5
            x_idx = int(position * (len(dates) - 1))
            x_coords.append(x_idx)
        
        # Plot equity values as points and connect with line
        ax2.plot(x_coords, equity_values, 'ro-', label='Shareholder Equity')
        
        # Add vertical lines and annotations for balance sheet years
        colors = ['red', 'orange', 'green', 'purple']
        
        for i, (year, equity, x_coord) in enumerate(zip(years, equity_values, x_coords)):
            color = colors[i % len(colors)]
            ax.axvline(x=x_coord, color=color, linestyle='--', alpha=0.5)
            
            # Add annotation for the year and equity value
            ax.annotate(
                f"{year}: {format_equity(equity)}",
                xy=(x_coord, closes[min(x_coord, len(closes)-1)] * 0.9),
                xytext=(10, -30),
                textcoords="offset points",
                bbox=dict(boxstyle="round,pad=0.3", fc="black", alpha=0.8),
                color=color,
                fontsize=8,
                arrowprops=dict(arrowstyle="->", color=color)
            )
        
        # Set up the second y-axis
        ax2.set_ylabel('Shareholder Equity')
        ax2.tick_params(axis='y', colors='red')
        ax2.set_ylim(min(equity_values) * 0.8, max(equity_values) * 1.2)
        
        # Create combined legend
        lines1, labels1 = ax.get_legend_handles_labels()
        lines2, labels2 = ax2.get_legend_handles_labels()
        ax.legend(lines1 + lines2, labels1 + labels2, loc='upper left')
    else:
        # Only add stock price legend if no balance sheet
        ax.legend()

    # Only label some x-ticks
    skip = max(1, len(dates) // 10)
    ax.set_xticks(range(0, len(dates), skip))
    ax.set_xticklabels([dates[i].strftime('%Y-%m-%d') for i in range(0, len(dates), skip)], rotation=45)

    ax.set_title(f"{default_symbol} Closing Prices (last {days} days)")
    ax.set_xlabel("Trading Days")
    ax.set_ylabel("Price")
    ax.grid(True)
    
    plt.tight_layout()
    st.pyplot(fig)

if __name__ == "__main__":
    main()
