// Chat Data Sources for SimplyStocks Dashboard
// This file contains structured data to support the chatbot functionality

// Financial Terms Dictionary
window.FINANCIAL_TERMS = {
  "p/e ratio": {
    definition: "The Price-to-Earnings ratio is a valuation ratio of a company's current share price compared to its earnings per share (EPS).",
    importance: "It helps investors determine if a stock is overvalued or undervalued compared to similar companies.",
    interpretation: "A high P/E might suggest overvaluation or expectations of high growth, while a low P/E might indicate undervaluation or concerns about the company's future.",
    example: "A P/E ratio of 15 means investors are willing to pay $15 for $1 of current earnings."
  },
  "eps": {
    definition: "Earnings Per Share (EPS) represents a company's profit divided by the outstanding shares of its common stock.",
    importance: "It indicates how much money a company makes for each share of its stock and is a widely used metric for estimating corporate value.",
    interpretation: "Higher EPS is generally better, indicating more profitability per share.",
    example: "If a company earns $1 million and has 500,000 shares outstanding, its EPS is $2."
  },
  "market cap": {
    definition: "Market Capitalization is the total market value of a company's outstanding shares of stock.",
    importance: "It's used to classify companies by size (small-cap, mid-cap, large-cap) and determine their weight in market indices.",
    interpretation: "Larger market caps typically indicate more established, less volatile companies.",
    example: "A company with 1 million shares trading at $50 per share has a market cap of $50 million."
  },
  "rsi": {
    definition: "Relative Strength Index (RSI) is a momentum oscillator that measures the speed and change of price movements on a scale from 0 to 100.",
    importance: "It helps identify overbought or oversold conditions in a trading asset.",
    interpretation: "Traditionally, RSI values of 70 or above indicate overbought conditions, while values of 30 or below suggest oversold conditions.",
    example: "If a stock's RSI reaches 80, traders might expect a potential price correction downward."
  },
  "macd": {
    definition: "Moving Average Convergence Divergence (MACD) is a trend-following momentum indicator that shows the relationship between two moving averages of a security's price.",
    importance: "It helps identify potential buy or sell signals in a trading asset.",
    interpretation: "When the MACD crosses above its signal line, it's generally considered a bullish signal. Conversely, when it crosses below, it's considered bearish.",
    example: "If the 12-day EMA crosses above the 26-day EMA, the MACD would turn positive, potentially indicating upward momentum."
  },
  "bollinger bands": {
    definition: "Bollinger Bands are a technical analysis tool that consists of a middle band (simple moving average) with an upper and lower band based on standard deviations.",
    importance: "They help identify volatility and potential overbought or oversold conditions.",
    interpretation: "When prices move close to the upper band, the market may be overbought; when they move close to the lower band, the market may be oversold.",
    example: "If a stock price touches the upper Bollinger Band during an uptrend, it might suggest the stock is becoming overvalued."
  },
  "moving average": {
    definition: "A Moving Average is a calculation used to analyze data points by creating a series of averages of different subsets of the full data set.",
    importance: "It helps smooth out price data to identify trends and support/resistance levels.",
    interpretation: "When price crosses above a moving average, it may signal an uptrend; when it crosses below, it may signal a downtrend.",
    example: "A 50-day moving average is the average closing price of a stock over the last 50 trading days."
  }
};

// Dashboard Features Information
window.DASHBOARD_FEATURES = {
  "stock values": {
    description: "Displays the basic price information for a selected stock.",
    dataDisplayed: "Open, high, low, close, volume, and price changes.",
    usage: "Click 'Add View' and select 'Stock Values', then enter a stock symbol."
  },
  "fundamental indicators": {
    description: "Shows key financial metrics about a company's performance and valuation.",
    dataDisplayed: "P/E ratio, EPS, market cap, debt-to-equity ratio, ROE, and more.",
    usage: "Click 'Add View' and select 'Fundamental Indicators', then enter a stock symbol."
  },
  "technical indicators": {
    description: "Provides technical analysis metrics calculated from historical price data.",
    dataDisplayed: "RSI, MACD, moving averages, Bollinger Bands, and other technical indicators.",
    usage: "Click 'Add View' and select 'Technical Indicators', then enter a stock symbol."
  },
  "sentiment analysis": {
    description: "Analyzes news sentiment related to a specific company or stock.",
    dataDisplayed: "Overall sentiment score and recent news articles with their sentiment classification.",
    usage: "Click 'Add View' and select 'Sentiment Analysis', then enter a stock symbol."
  },
  "treasury issuance": {
    description: "Shows data on US Treasury debt issuance over recent months.",
    dataDisplayed: "Debt issuance amounts by security type and date.",
    usage: "Click 'Add View' and select 'Treasury Issuance' to view the data."
  }
};

// Common Questions and Answers
window.COMMON_QUESTIONS = {
  "how do I add a new widget": "To add a new widget, click the 'Add View' button at the top of the dashboard. You'll see a list of available widget types. Select the one you want, then enter any required information (like a stock symbol).",
  "how do I search for a stock": "Use the search bar at the top of the dashboard to find stocks. Enter a company name or symbol and select from the results.",
  "what is a good p/e ratio": "A 'good' P/E ratio depends on the industry and market conditions. Generally, the average P/E for the S&P 500 has historically been between 13-15. Lower P/Es may indicate undervaluation, while higher ones might suggest overvaluation or high growth expectations.",
  "what does rsi mean": "RSI (Relative Strength Index) is a momentum oscillator that measures the speed and magnitude of price movements on a scale from 0 to 100. Values above 70 typically indicate overbought conditions, while values below 30 suggest oversold conditions.",
  "how to interpret bollinger bands": "Bollinger Bands consist of a middle band (usually a 20-day moving average) and upper/lower bands at standard deviations away from the middle. When prices reach the upper band, it may indicate overbought conditions. When prices touch the lower band, it may signal oversold conditions. Narrow bands suggest low volatility, while wide bands indicate high volatility."
}; 