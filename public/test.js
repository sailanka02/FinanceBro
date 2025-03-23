// create a dynamic widget that can be added to the grid in the index.html file

// each widget should contain a chart and a text widget

// the chart should be pulled from app.py

// currently the app.py script doesnt outpt anything but i want it to output a interactive chart 

// that should  be inside the widget
// can you help me with that?

// import { db } from "./firebase.js";
// import { doc, updateDoc } from "firebase/firestore";

document.addEventListener('DOMContentLoaded', () => {
  // Initialize GridStack with configuration
  const grid = GridStack.init({
    column: 12,
    float: true,
    removable: true,
    minRow: 1
  });

  // Add a button to create new widgets
  const addWidgetBtn = document.querySelector('.add-view-btn');
  if (addWidgetBtn) {
    addWidgetBtn.addEventListener('click', () => {
      addStockWidget(grid);
    });
  }
  
  // Set up search functionality
  const searchBar = document.querySelector('.search-bar');
  if (searchBar) {
    searchBar.addEventListener('keypress', async (e) => {
      if (e.key === 'Enter') {
        const symbol = searchBar.value.trim().toUpperCase();
        
        if (symbol) {
          try {
            // Use Firebase compat version
            const db = firebase.firestore();
            await db.collection("Company").doc("UbpbfMDhDcvlcRyVkW14").update({
              name: symbol
            });
            console.log("Firebase document updated with:", symbol);
          } catch (error) {
            console.error("Error updating Firebase:", error);
          }
          
          addStockWidgetWithSymbol(grid, symbol);
          searchBar.value = ''; // Clear the search bar
        }
      }
    });
  }
  
  // Set up chat button functionality
  const chatBtn = document.querySelector('.chat-btn');
  if (chatBtn) {
    chatBtn.addEventListener('click', () => {
      renderChatWidget(grid);
    });
  }

  // Add an initial widget when the page loads
  addStockWidgetWithSymbol(grid, 'NVDA');
});

// Function to create a new stock widget with default symbol
function addStockWidget(grid) {
  showPanelOptions(grid);
}

// Function to show panel options popup
function showPanelOptions(grid) {
  // Create modal backdrop
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.style.position = 'fixed';
  backdrop.style.top = '0';
  backdrop.style.left = '0';
  backdrop.style.width = '100%';
  backdrop.style.height = '100%';
  backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  backdrop.style.zIndex = '1000';
  backdrop.style.display = 'flex';
  backdrop.style.justifyContent = 'center';
  backdrop.style.alignItems = 'center';
  
  // Create modal content
  const modal = document.createElement('div');
  modal.className = 'panel-options-modal';
  modal.style.backgroundColor = '#1e1e1e';
  modal.style.borderRadius = '8px';
  modal.style.padding = '20px';
  modal.style.width = '500px';
  modal.style.maxWidth = '90%';
  modal.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.6)';
  
  // Add header
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.marginBottom = '20px';
  
  const title = document.createElement('h2');
  title.textContent = 'Select Panel Type';
  title.style.color = '#fff';
  title.style.margin = '0';
  
  const closeButton = document.createElement('button');
  closeButton.innerHTML = '&times;';
  closeButton.style.background = 'none';
  closeButton.style.border = 'none';
  closeButton.style.color = '#fff';
  closeButton.style.fontSize = '24px';
  closeButton.style.cursor = 'pointer';
  closeButton.addEventListener('click', () => {
    document.body.removeChild(backdrop);
  });
  
  header.appendChild(title);
  header.appendChild(closeButton);
  modal.appendChild(header);
  
  // Add panel options
  const optionHandlers = {
    'Stock Values': (symbol) => renderStockVals(grid, symbol),
    'Fundamental Indicators': () => renderFundamentalWidget(grid),
    'Technical Indicators': (symbol) => renderTechnicalWidget(grid, symbol),
    'Sentiment Analysis': () => renderSentimentWidget(grid),
    'Balance Sheet Analysis': () => renderBalanceSheetWidget(grid),
    'FRED Rates': () => renderFredRatesWidget(grid),
    'RRP Data': () => renderRrpDataWidget(grid),
    'Treasury Issuance': () => renderTreasuryIssuanceWidget(grid),
    'Chat Assistant': () => renderChatWidget(grid)
  };
  

// Your options array
const options = [
    {
        name: "Stock Values",
        description: "Shows key data points for a stock, including open, high, low, close and volume."
    },
    {
        name: "Fundamental Indicators",
        description: "Evaluate a company's intrinsic value using metrics like P/E ratio, earnings, and revenue growth."
    },
    {
        name: "Technical Indicators",
        description: "Analyze stock price trends and patterns using tools like moving averages and RSI."
    },
    {
        name: "Sentiment Analysis",
        description: "Gauge public and investor sentiment using news, social media, and analyst outlooks."
    },
    {
        name: "Balance Sheet Analysis",
        description: "Break down a company's assets, liabilities, and equity to assess financial health."
    },
    {
        name: "FRED Rates",
        description: "Explore interest rates and economic data from the Federal Reserve Economic Data (FRED) system."
    },
    {
        name: "RRP Data",
        description: "Review reverse repurchase agreement activity to understand short-term market liquidity."
    },
    {
        name: "Treasury Issuance",
        description: "Track U.S. Treasury bond and bill issuance to analyze government debt and market impact."
    },
    {
        name: "Chat Assistant",
        description: "Get real-time help and insights about market data, stocks, and using the dashboard."
    }
];

// UI rendering logic
const optionsContainer = document.createElement('div');
optionsContainer.style.display = 'grid';
optionsContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
optionsContainer.style.gap = '15px';

options.forEach(option => {
  const optionCard = document.createElement('div');
  optionCard.className = 'panel-option';
  optionCard.style.backgroundColor = 'rgba(75, 192, 192, 0.1)';
  optionCard.style.padding = '15px';
  optionCard.style.borderRadius = '5px';
  optionCard.style.cursor = 'pointer';
  optionCard.style.transition = 'all 0.2s ease';
  optionCard.style.border = '1px solid rgba(75, 192, 192, 0.3)';

  const optionName = document.createElement('h3');
  optionName.textContent = option.name;
  optionName.style.margin = '0 0 5px 0';
  optionName.style.color = '#fff';

  const optionDesc = document.createElement('p');
  optionDesc.textContent = option.description;
  optionDesc.style.margin = '0';
  optionDesc.style.color = '#ccc';
  optionDesc.style.fontSize = '14px';

  optionCard.appendChild(optionName);
  optionCard.appendChild(optionDesc);

  optionCard.addEventListener('mouseover', () => {
    optionCard.style.backgroundColor = 'rgba(75, 192, 192, 0.2)';
    optionCard.style.transform = 'translateY(-2px)';
  });

  optionCard.addEventListener('mouseout', () => {
    optionCard.style.backgroundColor = 'rgba(75, 192, 192, 0.1)';
    optionCard.style.transform = 'translateY(0)';
  });

  // 🧠 Custom logic per option
  optionCard.addEventListener('click', () => {
    const handler = optionHandlers[option.name];
    if (handler) {
      handler(option.name.split(' ')[0]); // run the custom function
    } else {
      console.warn(`No handler defined for: ${option.name}`);
    }
    document.body.removeChild(backdrop);
  });

  optionsContainer.appendChild(optionCard);
});

modal.appendChild(optionsContainer);
  // Add search input
  const searchContainer = document.createElement('div');
  searchContainer.style.marginTop = '20px';
  
  const searchLabel = document.createElement('p');
  searchLabel.textContent = 'Or enter a custom stock symbol:';
  searchLabel.style.color = '#fff';
  searchLabel.style.margin = '0 0 10px 0';
  
  const searchForm = document.createElement('form');
  searchForm.style.display = 'flex';
  searchForm.style.gap = '10px';
  
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Enter stock symbol...';
  searchInput.style.flex = '1';
  searchInput.style.padding = '8px 12px';
  searchInput.style.borderRadius = '4px';
  searchInput.style.border = 'none';
  searchInput.style.backgroundColor = '#333';
  searchInput.style.color = '#fff';
  
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Add';
  submitBtn.style.padding = '8px 16px';
  submitBtn.style.borderRadius = '4px';
  submitBtn.style.border = 'none';
  submitBtn.style.backgroundColor = 'rgb(75, 192, 192)';
  submitBtn.style.color = '#fff';
  submitBtn.style.cursor = 'pointer';
  
  searchForm.appendChild(searchInput);
  searchForm.appendChild(submitBtn);
  
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const symbol = searchInput.value.trim().toUpperCase();
    if (symbol) {
      addStockWidgetWithSymbol(grid, symbol);
      document.body.removeChild(backdrop);
    }
  });
  
  searchContainer.appendChild(searchLabel);
  searchContainer.appendChild(searchForm);
  modal.appendChild(searchContainer);
  
  // Add modal to page
  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);
  
  // Focus the search input
  setTimeout(() => searchInput.focus(), 100);
}

// Function to create a new stock widget with a specific symbol
function addStockWidgetWithSymbol(grid, symbol) {
  // Create an empty DOM element first
  const widgetElement = document.createElement('div');
  widgetElement.className = 'grid-stack-item-content';
  
  // Create the internal widget content structure
  const widgetContent = document.createElement('div');
  widgetContent.className = 'widget-content';
  
  // Add title
  const title = document.createElement('h3');
  title.textContent = `${symbol} Chart`;
  widgetContent.appendChild(title);
  
  // Add chart container
  const chartContainer = document.createElement('div');
  chartContainer.className = 'chart-container';
  chartContainer.style.height = '250px';
  widgetContent.appendChild(chartContainer);
  
  // Add text information
  const textInfo = document.createElement('div');
  textInfo.className = 'text-info';
  textInfo.innerHTML = `<p>Loading ${symbol} data...</p>`;
  widgetContent.appendChild(textInfo);
  
  // Add remove button
  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn';
  removeBtn.textContent = 'x';
  removeBtn.setAttribute('title', 'Remove widget');
  widgetContent.appendChild(removeBtn);
  
  // Append the content to the widget element
  widgetElement.appendChild(widgetContent);
  
  // Add the widget to the grid
  const widget = grid.addWidget({
    w: 4,
    h: 4,
    el: widgetElement
  });
  
  // Setup remove button functionality
  removeBtn.addEventListener('click', () => {
    grid.removeWidget(widget);
  });
  
  // Fetch and display data in the new widget
  fetchStockDataForSymbol(chartContainer, textInfo, symbol);
}

function renderStockVals(grid, symbol = 'NVDA') {
  // Create widget element
  const widgetElement = document.createElement('div');
  widgetElement.className = 'grid-stack-item-content';

  const widgetContent = document.createElement('div');
  widgetContent.className = 'widget-content';

  const title = document.createElement('h2');
  title.textContent = `${symbol} Stock Values`;
  title.style.color = '#00FFC2';
  widgetContent.appendChild(title);

  // Loading indicator
  const loadingIndicator = document.createElement('div');
  loadingIndicator.textContent = 'Loading stock data...';
  loadingIndicator.style.color = '#fff';
  loadingIndicator.style.padding = '20px 0';
  widgetContent.appendChild(loadingIndicator);

  // Create table for stock data
  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.style.color = '#fff';
  table.style.marginTop = '15px';
  table.style.display = 'none'; // Hide until data is loaded
  widgetContent.appendChild(table);

  // Add remove button
  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn';
  removeBtn.textContent = 'x';
  removeBtn.setAttribute('title', 'Remove widget');
  widgetContent.appendChild(removeBtn);

  widgetElement.appendChild(widgetContent);

  // Add to grid first so it appears immediately
  const widget = grid.addWidget({ w: 4, h: 4, el: widgetElement });
  removeBtn.addEventListener('click', () => grid.removeWidget(widget));

  // Function to fetch stock data
  const fetchStockData = async () => {
    try {
      // Similar approach to stockTimeData.py but using Fetch API
      const startDate = '2023-01-01';
      const endDate = new Date().toISOString().split('T')[0]; // Today's date
      
      // Fetch from Alpha Vantage as a fallback since we can't directly call Alpaca from browser
      const apiKey = 'KO9Q5OPB94XH9XJR'; // Free API key with limited requests
      const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      if (data['Error Message'] || !data['Time Series (Daily)']) {
        throw new Error('API error or symbol not found');
      }
      
      // Process the data
      const timeSeries = data['Time Series (Daily)'];
      const dates = Object.keys(timeSeries).slice(0, 5); // Get most recent 5 days
      
      // Create header row
      const headerRow = document.createElement('tr');
      ['Date', 'Open', 'High', 'Low', 'Close', 'Volume'].forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        th.style.padding = '8px';
        th.style.textAlign = 'left';
        th.style.borderBottom = '1px solid #444';
        headerRow.appendChild(th);
      });
      table.appendChild(headerRow);
      
      // Create data rows
      dates.forEach(date => {
        const row = document.createElement('tr');
        row.style.transition = 'background-color 0.2s';
        row.addEventListener('mouseover', () => {
          row.style.backgroundColor = 'rgba(75, 192, 192, 0.1)';
        });
        row.addEventListener('mouseout', () => {
          row.style.backgroundColor = 'transparent';
        });
        
        // Date cell
        const dateCell = document.createElement('td');
        dateCell.textContent = date;
        dateCell.style.padding = '8px';
        dateCell.style.borderBottom = '1px solid #444';
        row.appendChild(dateCell);
        
        // OHLCV cells
        const dayData = timeSeries[date];
        [
          dayData['1. open'],
          dayData['2. high'],
          dayData['3. low'],
          dayData['4. close'],
          dayData['5. volume']
        ].forEach((value, index) => {
          const td = document.createElement('td');
          // Format number based on what it is (price or volume)
          if (index < 4) {
            td.textContent = `$${parseFloat(value).toFixed(2)}`;
          } else {
            td.textContent = parseInt(value).toLocaleString();
          }
          td.style.padding = '8px';
          td.style.borderBottom = '1px solid #444';
          row.appendChild(td);
        });
        
        table.appendChild(row);
      });
      
      // Show table and remove loading indicator
      loadingIndicator.remove();
      table.style.display = 'table';
      
      // Add a "View more" button
      const viewMoreContainer = document.createElement('div');
      viewMoreContainer.style.textAlign = 'center';
      viewMoreContainer.style.marginTop = '15px';
      
      const viewMoreBtn = document.createElement('button');
      viewMoreBtn.textContent = 'View More Data';
      viewMoreBtn.style.padding = '8px 16px';
      viewMoreBtn.style.backgroundColor = 'rgba(75, 192, 192, 0.2)';
      viewMoreBtn.style.color = '#fff';
      viewMoreBtn.style.border = 'none';
      viewMoreBtn.style.borderRadius = '4px';
      viewMoreBtn.style.cursor = 'pointer';
      
      viewMoreBtn.addEventListener('mouseover', () => {
        viewMoreBtn.style.backgroundColor = 'rgba(75, 192, 192, 0.3)';
      });
      
      viewMoreBtn.addEventListener('mouseout', () => {
        viewMoreBtn.style.backgroundColor = 'rgba(75, 192, 192, 0.2)';
      });
      
      viewMoreBtn.addEventListener('click', () => {
        window.open(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&datatype=csv&apikey=${apiKey}`, '_blank');
      });
      
      viewMoreContainer.appendChild(viewMoreBtn);
      widgetContent.appendChild(viewMoreContainer);
      
    } catch (error) {
      console.error('Error fetching stock data:', error);
      
      // Show error and fallback to sample data
      loadingIndicator.textContent = 'Could not load data. Using sample values.';
      
      setTimeout(() => {
        // Create header row for sample data
        const headerRow = document.createElement('tr');
        ['Date', 'Open', 'High', 'Low', 'Close', 'Volume'].forEach(header => {
          const th = document.createElement('th');
          th.textContent = header;
          th.style.padding = '8px';
          th.style.textAlign = 'left';
          th.style.borderBottom = '1px solid #444';
          headerRow.appendChild(th);
        });
        table.appendChild(headerRow);
        
        // Sample data
        const sampleData = [
          { date: '2023-06-01', open: 102.50, high: 105.75, low: 101.25, close: 103.50, volume: 1250000 },
          { date: '2023-06-02', open: 103.75, high: 107.25, low: 103.25, close: 106.75, volume: 1420000 },
          { date: '2023-06-03', open: 106.50, high: 108.25, low: 105.75, close: 107.50, volume: 1150000 },
          { date: '2023-06-04', open: 107.75, high: 109.50, low: 106.25, close: 108.75, volume: 1325000 },
          { date: '2023-06-05', open: 108.50, high: 110.25, low: 107.75, close: 109.25, volume: 1180000 }
        ];
        
        // Create data rows for sample data
        sampleData.forEach(day => {
          const row = document.createElement('tr');
          row.style.transition = 'background-color 0.2s';
          row.addEventListener('mouseover', () => {
            row.style.backgroundColor = 'rgba(75, 192, 192, 0.1)';
          });
          row.addEventListener('mouseout', () => {
            row.style.backgroundColor = 'transparent';
          });
          
          // Date cell
          const dateCell = document.createElement('td');
          dateCell.textContent = day.date;
          dateCell.style.padding = '8px';
          dateCell.style.borderBottom = '1px solid #444';
          row.appendChild(dateCell);
          
          // OHLCV cells
          [
            `$${day.open.toFixed(2)}*`,
            `$${day.high.toFixed(2)}*`,
            `$${day.low.toFixed(2)}*`,
            `$${day.close.toFixed(2)}*`,
            `${day.volume.toLocaleString()}*`
          ].forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            td.style.padding = '8px';
            td.style.borderBottom = '1px solid #444';
            row.appendChild(td);
          });
          
          table.appendChild(row);
        });
        
        // Add note about sample data
        const noteRow = document.createElement('tr');
        const noteCell = document.createElement('td');
        noteCell.colSpan = 6;
        noteCell.textContent = '* Values are sample data';
        noteCell.style.fontSize = '12px';
        noteCell.style.fontStyle = 'italic';
        noteCell.style.color = '#999';
        noteRow.appendChild(noteCell);
        table.appendChild(noteRow);
        
        // Show table and remove loading indicator
        loadingIndicator.remove();
        table.style.display = 'table';
      }, 1000);
    }
  };

  // Fetch the data
  fetchStockData();
}

function renderFundamentalWidget(grid) {
  // Create widget element
  const widgetElement = document.createElement('div');
  widgetElement.className = 'grid-stack-item-content';

  const widgetContent = document.createElement('div');
  widgetContent.className = 'widget-content';

  const title = document.createElement('h2');
  title.textContent = 'Fundamental Indicators';
  title.style.color = '#00FFC2';
  widgetContent.appendChild(title);

  // Loading indicator
  const loadingIndicator = document.createElement('div');
  loadingIndicator.textContent = 'Loading fundamental data...';
  loadingIndicator.style.color = '#fff';
  loadingIndicator.style.padding = '20px 0';
  widgetContent.appendChild(loadingIndicator);

  // Create empty metrics list
  const list = document.createElement('ul');
  list.style.color = '#fff';
  list.style.padding = '10px 0';
  list.style.listStyle = 'none';
  list.style.display = 'none'; // Hide until data is loaded
  widgetContent.appendChild(list);

  // Add remove button
  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn';
  removeBtn.textContent = 'x';
  removeBtn.setAttribute('title', 'Remove widget');
  widgetContent.appendChild(removeBtn);

  widgetElement.appendChild(widgetContent);

  // Add to grid first so it appears immediately
  const widget = grid.addWidget({ w: 4, h: 4, el: widgetElement });
  removeBtn.addEventListener('click', () => grid.removeWidget(widget));

  // Helper function to format market cap
  const formatMarketCap = (value) => {
    if (value >= 1e12) {
      return `$${(value / 1e12).toFixed(2)}T`;
    } else if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    } else {
      return `$${value.toFixed(2)}`;
    }
  };
  
  // Helper function to format FCF
  const formatFCF = (value) => {
    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    } else {
      return `$${value.toFixed(2)}K`;
    }
  };

  // Helper to check if a value is from fallback data
  const isFallbackValue = (data, metric) => {
    return data.fallback_metrics && data.fallback_metrics.includes(metric);
  };

  // Now fetch the real data
  fetch(`http://localhost:5000/fundamental_data`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Remove loading indicator
      widgetContent.removeChild(loadingIndicator);
      
      // Update the title with the symbol
      title.textContent = `${data.symbol} Fundamentals`;
      
      // Create metrics from API data with proper formatting
      const metrics = [
        { 
          name: 'Stock Price', 
          value: `$${data.price.toFixed(2)}${isFallbackValue(data, 'price') ? '*' : ''}` 
        },
        { 
          name: 'P/E Ratio', 
          value: isFinite(data.pe) ? 
            `${data.pe.toFixed(2)}${isFallbackValue(data, 'pe') ? '*' : ''}` : 
            'N/A'
        },
        { 
          name: 'Earnings Per Share', 
          value: data.eps ? 
            `$${data.eps.toFixed(2)}${isFallbackValue(data, 'eps') ? '*' : ''}` : 
            'N/A'
        },
        { 
          name: 'Revenue Growth', 
          value: isFinite(data.revenue_growth) ? 
            `${data.revenue_growth.toFixed(2)}%${isFallbackValue(data, 'revenue_growth') ? '*' : ''}` : 
            'N/A'
        },
        { 
          name: 'Market Cap', 
          value: data.market_cap ? 
            `${formatMarketCap(data.market_cap)}${isFallbackValue(data, 'market_cap') ? '*' : ''}` : 
            'N/A'
        },
        { 
          name: 'Return on Equity', 
          value: isFinite(data.roe) ? 
            `${data.roe.toFixed(2)}%${isFallbackValue(data, 'roe') ? '*' : ''}` : 
            'N/A'
        },
        { 
          name: 'Debt to Equity', 
          value: isFinite(data.de) ? 
            `${data.de.toFixed(2)}${isFallbackValue(data, 'de') ? '*' : ''}` : 
            'N/A'
        },
        { 
          name: 'Free Cash Flow', 
          value: data.fcf ? 
            `${formatFCF(data.fcf)}${isFallbackValue(data, 'fcf') ? '*' : ''}` : 
            'N/A'
        }
      ];

      // Add a note about asterisks
      const noteItem = document.createElement('li');
      noteItem.textContent = '* Values are sample data';
      noteItem.style.fontStyle = 'italic';
      noteItem.style.fontSize = '12px';
      noteItem.style.marginTop = '10px';
      noteItem.style.color = '#999';

      // Fill the list with actual data
      list.innerHTML = '';
      metrics.forEach(metric => {
        const item = document.createElement('li');
        item.textContent = `${metric.name}: ${metric.value}`;
        item.style.padding = '4px 0';
        list.appendChild(item);
      });
      
      // Add note if we have any fallback values
      if (data.fallback_metrics && data.fallback_metrics.length > 0) {
        list.appendChild(noteItem);
      }
      
      // Show the list
      list.style.display = 'block';
    })
    .catch(error => {
      // Show error and fallback to sample data
      console.error('Error fetching fundamental data:', error);
      loadingIndicator.textContent = 'Could not load data. Using sample values.';
      
      setTimeout(() => {
        widgetContent.removeChild(loadingIndicator);
        
        // Fallback metrics
        const fallbackMetrics = [
          { name: 'Stock Price', value: '$120.75*' },
          { name: 'P/E Ratio', value: '24.5*' },
          { name: 'Earnings Per Share', value: '$3.12*' },
          { name: 'Revenue Growth', value: '15.2%*' },
          { name: 'Market Cap', value: '$520B*' },
          { name: 'Return on Equity', value: '21.3%*' },
          { name: 'Debt to Equity', value: '0.42*' },
          { name: 'Free Cash Flow', value: '$12.5B*' }
        ];
        
        // Add a note about asterisks
        const noteItem = document.createElement('li');
        noteItem.textContent = '* Values are sample data';
        noteItem.style.fontStyle = 'italic';
        noteItem.style.fontSize = '12px';
        noteItem.style.marginTop = '10px';
        noteItem.style.color = '#999';
        
        // Display fallback data
        list.innerHTML = '';
        fallbackMetrics.forEach(metric => {
          const item = document.createElement('li');
          item.textContent = `${metric.name}: ${metric.value}`;
          item.style.padding = '4px 0';
          list.appendChild(item);
        });
        
        list.appendChild(noteItem);
        list.style.display = 'block';
      }, 1000);
    });
}

function renderTechnicalWidget(grid, symbol = 'NVDA') {
  // Create widget element
  const widgetElement = document.createElement('div');
  widgetElement.className = 'grid-stack-item-content';

  const widgetContent = document.createElement('div');
  widgetContent.className = 'widget-content';

  const title = document.createElement('h2');
  title.textContent = `${symbol} Technical Indicators`;
  title.style.color = '#00FFC2';
  widgetContent.appendChild(title);

  // Loading indicator
  const loadingIndicator = document.createElement('div');
  loadingIndicator.textContent = 'Loading technical data...';
  loadingIndicator.style.color = '#fff';
  loadingIndicator.style.padding = '20px 0';
  widgetContent.appendChild(loadingIndicator);

  // Create table for technical data
  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.style.color = '#fff';
  table.style.marginTop = '15px';
  table.style.display = 'none'; // Hide until data is loaded
  widgetContent.appendChild(table);

  // Add remove button
  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn';
  removeBtn.textContent = 'x';
  removeBtn.setAttribute('title', 'Remove widget');
  widgetContent.appendChild(removeBtn);

  widgetElement.appendChild(widgetContent);

  // Add to grid first so it appears immediately
  const widget = grid.addWidget({ w: 4, h: 4, el: widgetElement });
  removeBtn.addEventListener('click', () => grid.removeWidget(widget));

  // Function to fetch technical data
  const fetchTechnicalData = async () => {
    try {
      // Similar approach to stockTimeData.py but using Fetch API
      const startDate = '2023-01-01';
      const endDate = new Date().toISOString().split('T')[0]; // Today's date
      
      // Fetch from Alpha Vantage as a fallback since we can't directly call Alpaca from browser
      const apiKey = 'KO9Q5OPB94XH9XJR'; // Free API key with limited requests
      const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      if (data['Error Message'] || !data['Time Series (Daily)']) {
        throw new Error('API error or symbol not found');
      }
      
      // Process the data
      const timeSeries = data['Time Series (Daily)'];
      const dates = Object.keys(timeSeries).slice(0, 5); // Get most recent 5 days
      
      // Create header row
      const headerRow = document.createElement('tr');
      ['Date', 'Open', 'High', 'Low', 'Close', 'Volume'].forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        th.style.padding = '8px';
        th.style.textAlign = 'left';
        th.style.borderBottom = '1px solid #444';
        headerRow.appendChild(th);
      });
      table.appendChild(headerRow);
      
      // Create data rows
      dates.forEach(date => {
        const row = document.createElement('tr');
        row.style.transition = 'background-color 0.2s';
        row.addEventListener('mouseover', () => {
          row.style.backgroundColor = 'rgba(75, 192, 192, 0.1)';
        });
        row.addEventListener('mouseout', () => {
          row.style.backgroundColor = 'transparent';
        });
        
        // Date cell
        const dateCell = document.createElement('td');
        dateCell.textContent = date;
        dateCell.style.padding = '8px';
        dateCell.style.borderBottom = '1px solid #444';
        row.appendChild(dateCell);
        
        // OHLCV cells
        const dayData = timeSeries[date];
        [
          dayData['1. open'],
          dayData['2. high'],
          dayData['3. low'],
          dayData['4. close'],
          dayData['5. volume']
        ].forEach((value, index) => {
          const td = document.createElement('td');
          // Format number based on what it is (price or volume)
          if (index < 4) {
            td.textContent = `$${parseFloat(value).toFixed(2)}`;
          } else {
            td.textContent = parseInt(value).toLocaleString();
          }
          td.style.padding = '8px';
          td.style.borderBottom = '1px solid #444';
          row.appendChild(td);
        });
        
        table.appendChild(row);
      });
      
      // Show table and remove loading indicator
      loadingIndicator.remove();
      table.style.display = 'table';
      
      // Add a "View more" button
      const viewMoreContainer = document.createElement('div');
      viewMoreContainer.style.textAlign = 'center';
      viewMoreContainer.style.marginTop = '15px';
      
      const viewMoreBtn = document.createElement('button');
      viewMoreBtn.textContent = 'View More Data';
      viewMoreBtn.style.padding = '8px 16px';
      viewMoreBtn.style.backgroundColor = 'rgba(75, 192, 192, 0.2)';
      viewMoreBtn.style.color = '#fff';
      viewMoreBtn.style.border = 'none';
      viewMoreBtn.style.borderRadius = '4px';
      viewMoreBtn.style.cursor = 'pointer';
      
      viewMoreBtn.addEventListener('mouseover', () => {
        viewMoreBtn.style.backgroundColor = 'rgba(75, 192, 192, 0.3)';
      });
      
      viewMoreBtn.addEventListener('mouseout', () => {
        viewMoreBtn.style.backgroundColor = 'rgba(75, 192, 192, 0.2)';
      });
      
      viewMoreBtn.addEventListener('click', () => {
        window.open(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&datatype=csv&apikey=${apiKey}`, '_blank');
      });
      
      viewMoreContainer.appendChild(viewMoreBtn);
      widgetContent.appendChild(viewMoreContainer);
      
    } catch (error) {
      console.error('Error fetching technical data:', error);
      
      // Show error and fallback to sample data
      loadingIndicator.textContent = 'Could not load data. Using sample values.';
      
      setTimeout(() => {
        // Create header row for sample data
        const headerRow = document.createElement('tr');
        ['Date', 'Open', 'High', 'Low', 'Close', 'Volume'].forEach(header => {
          const th = document.createElement('th');
          th.textContent = header;
          th.style.padding = '8px';
          th.style.textAlign = 'left';
          th.style.borderBottom = '1px solid #444';
          headerRow.appendChild(th);
        });
        table.appendChild(headerRow);
        
        // Sample data
        const sampleData = [
          { date: '2023-06-01', open: 102.50, high: 105.75, low: 101.25, close: 103.50, volume: 1250000 },
          { date: '2023-06-02', open: 103.75, high: 107.25, low: 103.25, close: 106.75, volume: 1420000 },
          { date: '2023-06-03', open: 106.50, high: 108.25, low: 105.75, close: 107.50, volume: 1150000 },
          { date: '2023-06-04', open: 107.75, high: 109.50, low: 106.25, close: 108.75, volume: 1325000 },
          { date: '2023-06-05', open: 108.50, high: 110.25, low: 107.75, close: 109.25, volume: 1180000 }
        ];
        
        // Create data rows for sample data
        sampleData.forEach(day => {
          const row = document.createElement('tr');
          row.style.transition = 'background-color 0.2s';
          row.addEventListener('mouseover', () => {
            row.style.backgroundColor = 'rgba(75, 192, 192, 0.1)';
          });
          row.addEventListener('mouseout', () => {
            row.style.backgroundColor = 'transparent';
          });
          
          // Date cell
          const dateCell = document.createElement('td');
          dateCell.textContent = day.date;
          dateCell.style.padding = '8px';
          dateCell.style.borderBottom = '1px solid #444';
          row.appendChild(dateCell);
          
          // OHLCV cells
          [
            `$${day.open.toFixed(2)}*`,
            `$${day.high.toFixed(2)}*`,
            `$${day.low.toFixed(2)}*`,
            `$${day.close.toFixed(2)}*`,
            `${day.volume.toLocaleString()}*`
          ].forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            td.style.padding = '8px';
            td.style.borderBottom = '1px solid #444';
            row.appendChild(td);
          });
          
          table.appendChild(row);
        });
        
        // Add note about sample data
        const noteRow = document.createElement('tr');
        const noteCell = document.createElement('td');
        noteCell.colSpan = 6;
        noteCell.textContent = '* Values are sample data';
        noteCell.style.fontSize = '12px';
        noteCell.style.fontStyle = 'italic';
        noteCell.style.color = '#999';
        noteRow.appendChild(noteCell);
        table.appendChild(noteRow);
        
        // Show table and remove loading indicator
        loadingIndicator.remove();
        table.style.display = 'table';
      }, 1000);
    }
  };

  // Fetch the data
  fetchTechnicalData();
}

function renderSentimentWidget(grid, symbol = 'NVDA') {
  console.log("Rendering Sentiment Widget for " + symbol);
  
  // Create widget element
  const widgetElement = document.createElement('div');
  widgetElement.className = 'grid-stack-item-content';

  const widgetContent = document.createElement('div');
  widgetContent.className = 'widget-content';

  const title = document.createElement('h2');
  title.textContent = `${symbol} Sentiment Analysis`;
  title.style.color = '#00FFC2';
  widgetContent.appendChild(title);

  // Loading indicator
  const loadingIndicator = document.createElement('div');
  loadingIndicator.textContent = 'Analyzing sentiment data...';
  loadingIndicator.style.color = '#fff';
  loadingIndicator.style.padding = '20px 0';
  loadingIndicator.style.textAlign = 'center';
  widgetContent.appendChild(loadingIndicator);

  // Create sentiment container
  const sentimentContainer = document.createElement('div');
  sentimentContainer.style.width = '100%';
  sentimentContainer.style.display = 'none';
  widgetContent.appendChild(sentimentContainer);

  // Add remove button
  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn';
  removeBtn.textContent = 'x';
  removeBtn.setAttribute('title', 'Remove widget');
  widgetContent.appendChild(removeBtn);

  widgetElement.appendChild(widgetContent);

  // Add to grid first so it appears immediately
  const widget = grid.addWidget({ w: 6, h: 6, el: widgetElement });
  removeBtn.addEventListener('click', () => grid.removeWidget(widget));

  // Interpret sentiment score
  const interpretSentiment = (score) => {
    if (score >= 0.5) return { text: 'Very Positive', color: '#00FF00' };
    if (score >= 0.2) return { text: 'Positive', color: '#88FF88' };
    if (score >= -0.2) return { text: 'Neutral', color: '#FFFF88' };
    if (score >= -0.5) return { text: 'Negative', color: '#FF8888' };
    return { text: 'Very Negative', color: '#FF0000' };
  };
  
  // Create a sentiment meter visualization
  const createSentimentMeter = (container, score) => {
    const interpretation = interpretSentiment(score);
    
    const meterContainer = document.createElement('div');
    meterContainer.style.textAlign = 'center';
    meterContainer.style.margin = '20px 0';
    
    // Sentiment score display
    const scoreDisplay = document.createElement('div');
    scoreDisplay.style.fontSize = '32px';
    scoreDisplay.style.fontWeight = 'bold';
    scoreDisplay.style.color = interpretation.color;
    scoreDisplay.textContent = score.toFixed(2);
    meterContainer.appendChild(scoreDisplay);
    
    // Sentiment interpretation
    const interpretationDisplay = document.createElement('div');
    interpretationDisplay.style.fontSize = '18px';
    interpretationDisplay.style.marginTop = '5px';
    interpretationDisplay.textContent = interpretation.text;
    interpretationDisplay.style.color = interpretation.color;
    meterContainer.appendChild(interpretationDisplay);
    
    // Sentiment meter (visual representation)
    const meterBackground = document.createElement('div');
    meterBackground.style.width = '100%';
    meterBackground.style.height = '15px';
    meterBackground.style.backgroundColor = '#333';
    meterBackground.style.borderRadius = '10px';
    meterBackground.style.marginTop = '15px';
    meterBackground.style.position = 'relative';
    meterBackground.style.overflow = 'hidden';
    
    // Calculate position (from -1 to 1 scale to 0 to 100%)
    const position = ((score + 1) / 2 * 100);
    
    // Create gradient background
    meterBackground.style.background = 'linear-gradient(to right, #FF0000, #FFFF00, #00FF00)';
    
    // Create indicator
    const indicator = document.createElement('div');
    indicator.style.width = '4px';
    indicator.style.height = '20px';
    indicator.style.backgroundColor = '#fff';
    indicator.style.position = 'absolute';
    indicator.style.left = `${position}%`;
    indicator.style.top = '-2px';
    indicator.style.transform = 'translateX(-2px)';
    meterBackground.appendChild(indicator);
    
    meterContainer.appendChild(meterBackground);
    
    container.appendChild(meterContainer);
  };
  
  // Create news list
  const createNewsList = (container, newsItems) => {
    const newsListContainer = document.createElement('div');
    newsListContainer.style.marginTop = '20px';
    
    const newsHeading = document.createElement('h3');
    newsHeading.textContent = 'Recent News';
    newsHeading.style.color = '#00FFC2';
    newsHeading.style.marginBottom = '10px';
    newsListContainer.appendChild(newsHeading);
    
    const newsList = document.createElement('div');
    newsList.className = 'news-list';
    newsList.style.maxHeight = '300px';
    newsList.style.overflowY = 'auto';
    
    newsItems.forEach(item => {
      const newsItem = document.createElement('div');
      newsItem.className = 'news-item';
      newsItem.style.marginBottom = '15px';
      newsItem.style.padding = '10px';
      newsItem.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
      newsItem.style.borderRadius = '5px';
      newsItem.style.borderLeft = `4px solid ${interpretSentiment(parseFloat(item.sentiment)).color}`;
      
      const newsTitle = document.createElement('div');
      newsTitle.className = 'news-title';
      newsTitle.style.fontWeight = 'bold';
      newsTitle.style.marginBottom = '5px';
      
      const titleLink = document.createElement('a');
      titleLink.href = item.url;
      titleLink.target = '_blank';
      titleLink.textContent = item.title;
      titleLink.style.color = '#fff';
      titleLink.style.textDecoration = 'none';
      titleLink.addEventListener('mouseover', () => {
        titleLink.style.textDecoration = 'underline';
      });
      titleLink.addEventListener('mouseout', () => {
        titleLink.style.textDecoration = 'none';
      });
      
      newsTitle.appendChild(titleLink);
      newsItem.appendChild(newsTitle);
      
      const newsSummary = document.createElement('div');
      newsSummary.className = 'news-summary';
      newsSummary.textContent = item.summary;
      newsSummary.style.fontSize = '14px';
      newsSummary.style.marginBottom = '5px';
      newsItem.appendChild(newsSummary);
      
      const newsFooter = document.createElement('div');
      newsFooter.className = 'news-footer';
      newsFooter.style.display = 'flex';
      newsFooter.style.justifyContent = 'space-between';
      newsFooter.style.fontSize = '12px';
      newsFooter.style.color = '#999';
      
      const newsDate = document.createElement('span');
      newsDate.textContent = `Published: ${item.time_published.substring(0, 10)}`;
      newsFooter.appendChild(newsDate);
      
      const newsSentiment = document.createElement('span');
      newsSentiment.textContent = `Sentiment: ${item.sentiment}`;
      newsSentiment.style.color = interpretSentiment(parseFloat(item.sentiment)).color;
      newsFooter.appendChild(newsSentiment);
      
      newsItem.appendChild(newsFooter);
      newsList.appendChild(newsItem);
    });
    
    newsListContainer.appendChild(newsList);
    container.appendChild(newsListContainer);
  };
  
  // Generate fake news for fallback
  const generateFakeNews = (symbol) => {
    const currentDate = new Date();
    const dateStr = currentDate.toISOString().split('T')[0];
    
    return [
      {
        title: `${symbol} Reports Better Than Expected Quarterly Results`,
        summary: `${symbol} announced earnings per share of $2.15, beating analyst expectations by 12%. Revenue also exceeded forecasts due to strong product demand.`,
        time_published: dateStr,
        url: '#',
        sentiment: '0.65'
      },
      {
        title: `New Product Launch from ${symbol} Drives Stock Higher`,
        summary: `${symbol} unveiled its next-generation platform today, with analysts expecting it to significantly impact market share in the coming quarters.`,
        time_published: dateStr,
        url: '#',
        sentiment: '0.78'
      },
      {
        title: `Market Volatility Impacts ${symbol} Performance`,
        summary: `Amid broader market fluctuations, ${symbol} experienced pressure on its share price despite solid fundamentals.`,
        time_published: dateStr,
        url: '#',
        sentiment: '-0.25'
      },
      {
        title: `${symbol} Announces Strategic Partnership`,
        summary: `A new collaboration between ${symbol} and industry leaders aims to expand product offerings and boost revenue streams.`,
        time_published: dateStr,
        url: '#',
        sentiment: '0.55'
      },
      {
        title: `Analyst Report: ${symbol} Given Neutral Rating`,
        summary: `Recent analyst coverage rates ${symbol} as neutral, citing balanced risk-reward profile in current market conditions.`,
        time_published: dateStr,
        url: '#',
        sentiment: '0.05'
      }
    ];
  };
  
  // Use fake news data for the widget
  setTimeout(() => {
    // Hide loading indicator
    loadingIndicator.style.display = 'none';
    sentimentContainer.style.display = 'block';
    
    // Generate fake news for the demo
    const newsData = generateFakeNews(symbol);
    
    // Calculate average sentiment
    const totalSentiment = newsData.reduce((sum, item) => sum + parseFloat(item.sentiment), 0);
    const averageSentiment = totalSentiment / newsData.length;
    
    // Create sentiment meter
    createSentimentMeter(sentimentContainer, averageSentiment);
    
    // Create news list
    createNewsList(sentimentContainer, newsData);
    
    // Show a notice that this is sample data
    const fallbackNotice = document.createElement('div');
    fallbackNotice.textContent = 'Note: Displaying sample data';
    fallbackNotice.style.color = '#ff9800';
    fallbackNotice.style.fontSize = '12px';
    fallbackNotice.style.fontStyle = 'italic';
    fallbackNotice.style.marginTop = '10px';
    fallbackNotice.style.textAlign = 'center';
    sentimentContainer.appendChild(fallbackNotice);
  }, 1500);
}

function renderBalanceSheetWidget(grid, symbol = 'NVDA') {
  // Create widget element
  const widgetElement = document.createElement('div');
  widgetElement.className = 'grid-stack-item-content';

  const widgetContent = document.createElement('div');
  widgetContent.className = 'widget-content';

  const title = document.createElement('h2');
  title.textContent = `${symbol} Balance Sheet`;
  title.style.color = '#00FFC2';
  widgetContent.appendChild(title);

  // Loading indicator
  const loadingIndicator = document.createElement('div');
  loadingIndicator.textContent = 'Loading balance sheet data...';
  loadingIndicator.style.color = '#fff';
  loadingIndicator.style.padding = '20px 0';
  widgetContent.appendChild(loadingIndicator);

  // Create balance sheet container
  const balanceSheetContainer = document.createElement('div');
  balanceSheetContainer.style.width = '100%';
  balanceSheetContainer.style.display = 'none';
  widgetContent.appendChild(balanceSheetContainer);

  // Create overlay button
  const overlayButton = document.createElement('button');
  overlayButton.textContent = 'Overlay on Stock Chart';
  overlayButton.style.backgroundColor = '#00FFC2';
  overlayButton.style.color = '#1E1E1E';
  overlayButton.style.border = 'none';
  overlayButton.style.borderRadius = '4px';
  overlayButton.style.padding = '8px 16px';
  overlayButton.style.margin = '15px 0';
  overlayButton.style.cursor = 'pointer';
  overlayButton.style.display = 'none';
  overlayButton.addEventListener('mouseover', () => {
    overlayButton.style.backgroundColor = '#00D1A1';
  });
  overlayButton.addEventListener('mouseout', () => {
    overlayButton.style.backgroundColor = '#00FFC2';
  });
  widgetContent.appendChild(overlayButton);

  // Add remove button
  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn';
  removeBtn.textContent = 'x';
  removeBtn.setAttribute('title', 'Remove widget');
  widgetContent.appendChild(removeBtn);

  widgetElement.appendChild(widgetContent);

  // Add to grid first so it appears immediately
  const widget = grid.addWidget({ w: 6, h: 6, el: widgetElement });
  removeBtn.addEventListener('click', () => grid.removeWidget(widget));

  // Function to fetch balance sheet data
  const fetchBalanceSheetData = async () => {
    try {
      // Use Alpha Vantage API for balance sheet data
      const apiKey = 'KO9Q5OPB94XH9XJR'; // Free tier API key
      const url = `https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=${symbol}&apikey=${apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      // Check if we got valid data
      if (!data.annualReports || data.annualReports.length === 0) {
        throw new Error('No balance sheet data available');
      }
      
      // Get the most recent 4 annual reports (or fewer if not available)
      const reports = data.annualReports.slice(0, 4);
      
      // Track if we're using real or fallback data
      const isReal = true;
      
      return {
        symbol,
        reports,
        isReal
      };
    } catch (error) {
      console.error('Error fetching balance sheet data:', error);
      
      // Generate fallback data
      return {
        symbol,
        reports: generateFallbackBalanceSheet(symbol),
        isReal: false
      };
    }
  };
  
  // Generate fallback balance sheet data
  const generateFallbackBalanceSheet = (symbol) => {
    const currentYear = new Date().getFullYear();
    
    return [
      {
        fiscalDateEnding: `${currentYear - 1}-12-31`,
        totalAssets: '1000000000',
        totalCurrentAssets: '400000000',
        cashAndCashEquivalentsAtCarryingValue: '200000000',
        cashAndShortTermInvestments: '250000000',
        inventory: '100000000',
        totalLiabilities: '600000000',
        totalCurrentLiabilities: '300000000',
        currentDebt: '100000000',
        totalShareholderEquity: '400000000'
      },
      {
        fiscalDateEnding: `${currentYear - 2}-12-31`,
        totalAssets: '900000000',
        totalCurrentAssets: '350000000',
        cashAndCashEquivalentsAtCarryingValue: '180000000',
        cashAndShortTermInvestments: '220000000',
        inventory: '90000000',
        totalLiabilities: '550000000',
        totalCurrentLiabilities: '280000000',
        currentDebt: '95000000',
        totalShareholderEquity: '350000000'
      },
      {
        fiscalDateEnding: `${currentYear - 3}-12-31`,
        totalAssets: '800000000',
        totalCurrentAssets: '300000000',
        cashAndCashEquivalentsAtCarryingValue: '160000000',
        cashAndShortTermInvestments: '190000000',
        inventory: '80000000',
        totalLiabilities: '500000000',
        totalCurrentLiabilities: '260000000',
        currentDebt: '90000000',
        totalShareholderEquity: '300000000'
      }
    ];
  };
  
  // Format large numbers
  const formatNumber = (num) => {
    if (!num) return 'N/A';
    
    const value = parseFloat(num);
    if (isNaN(value)) return 'N/A';
    
    if (value >= 1e12) {
      return (value / 1e12).toFixed(2) + ' T';
    } else if (value >= 1e9) {
      return (value / 1e9).toFixed(2) + ' B';
    } else if (value >= 1e6) {
      return (value / 1e6).toFixed(2) + ' M';
    } else if (value >= 1e3) {
      return (value / 1e3).toFixed(2) + ' K';
    } else {
      return value.toFixed(2);
    }
  };
  
  // Create balance sheet table
  const createBalanceSheetTable = (container, data) => {
    container.innerHTML = '';
    container.style.display = 'block';
    
    // Create table element
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.color = '#fff';
    table.style.marginBottom = '20px';
    
    // Create header row
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const metricHeader = document.createElement('th');
    metricHeader.textContent = 'Metric';
    metricHeader.style.padding = '10px';
    metricHeader.style.textAlign = 'left';
    metricHeader.style.borderBottom = '1px solid #00FFC2';
    headerRow.appendChild(metricHeader);
    
    data.reports.forEach(report => {
      const year = report.fiscalDateEnding.split('-')[0];
      const th = document.createElement('th');
      th.textContent = year;
      th.style.padding = '10px';
      th.style.textAlign = 'right';
      th.style.borderBottom = '1px solid #00FFC2';
      headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create table body
    const tbody = document.createElement('tbody');
    
    // Define the metrics to display
    const metrics = [
      { key: 'totalAssets', label: 'Total Assets' },
      { key: 'totalCurrentAssets', label: 'Current Assets' },
      { key: 'cashAndCashEquivalentsAtCarryingValue', label: 'Cash & Equivalents' },
      { key: 'cashAndShortTermInvestments', label: 'Cash & Short-term Investments' },
      { key: 'inventory', label: 'Inventory' },
      { key: 'totalLiabilities', label: 'Total Liabilities' },
      { key: 'totalCurrentLiabilities', label: 'Current Liabilities' },
      { key: 'currentDebt', label: 'Current Debt' },
      { key: 'totalShareholderEquity', label: 'Total Shareholder Equity' }
    ];
    
    metrics.forEach(metric => {
      const row = document.createElement('tr');
      row.style.borderBottom = '1px solid rgba(0, 255, 194, 0.2)';
      
      const labelCell = document.createElement('td');
      labelCell.textContent = metric.label;
      labelCell.style.padding = '8px 10px';
      labelCell.style.textAlign = 'left';
      row.appendChild(labelCell);
      
      data.reports.forEach(report => {
        const valueCell = document.createElement('td');
        valueCell.textContent = formatNumber(report[metric.key]);
        valueCell.style.padding = '8px 10px';
        valueCell.style.textAlign = 'right';
        row.appendChild(valueCell);
      });
      
      tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    container.appendChild(table);
    
    // Add a disclaimer for fallback data
    if (!data.isReal) {
      const disclaimer = document.createElement('p');
      disclaimer.textContent = '* Sample balance sheet data (real data unavailable)';
      disclaimer.style.fontSize = '12px';
      disclaimer.style.fontStyle = 'italic';
      disclaimer.style.color = '#999';
      disclaimer.style.marginTop = '10px';
      container.appendChild(disclaimer);
    }
  };
  
  // Function to overlay balance sheet data on Streamlit
  const overlayOnStockChart = (balanceSheetData) => {
    // Prepare years and equity data from balance sheet
    const years = balanceSheetData.reports.map(report => report.fiscalDateEnding.split('-')[0]);
    const equity = balanceSheetData.reports.map(report => parseFloat(report.totalShareholderEquity) || 0);
    
    // Create a URL with balance sheet data as parameters to send to Streamlit
    let streamlitUrl = 'http://localhost:8502/?';
    
    // Add symbol parameter
    streamlitUrl += `symbol=${symbol}`;
    
    // Add balance sheet overlay parameter
    streamlitUrl += '&overlay=true';
    
    // Add years and equity data
    years.forEach((year, index) => {
      streamlitUrl += `&year${index}=${year}&equity${index}=${equity[index]}`;
    });
    
    // Create a notification message
    const notification = document.createElement('div');
    notification.textContent = 'Opening balance sheet overlay in Streamlit...';
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = 'rgba(0, 255, 194, 0.9)';
    notification.style.color = '#1E1E1E';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '1000';
    notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    document.body.appendChild(notification);
    
    // Open Streamlit in a new tab
    window.open(streamlitUrl, '_blank');
    
    // Remove notification after 5 seconds
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 5000);
  };
  
  // Fetch balance sheet data and update the widget
  fetchBalanceSheetData().then(data => {
    // Remove loading indicator
    widgetContent.removeChild(loadingIndicator);
    
    // Create balance sheet table
    createBalanceSheetTable(balanceSheetContainer, data);
    
    // Show overlay button
    overlayButton.style.display = 'block';
    
    // Add click event for overlay button
    overlayButton.addEventListener('click', () => {
      overlayOnStockChart(data);
    });
    
  }).catch(error => {
    console.error('Balance Sheet Widget error:', error);
    
    // Show error and use fallback data
    loadingIndicator.textContent = 'Could not load balance sheet data. Using sample values.';
    
    setTimeout(() => {
      // Remove loading indicator
      widgetContent.removeChild(loadingIndicator);
      
      // Create balance sheet with fallback data
      const fallbackData = {
        symbol,
        reports: generateFallbackBalanceSheet(symbol),
        isReal: false
      };
      
      createBalanceSheetTable(balanceSheetContainer, fallbackData);
      
      // Show overlay button
      overlayButton.style.display = 'block';
      
      // Add click event for overlay button
      overlayButton.addEventListener('click', () => {
        overlayOnStockChart(fallbackData);
      });
      
    }, 1000);
  });
}

function renderFredRatesWidget(grid, symbol = 'NVDA') {
  // Create widget element
  const widgetElement = document.createElement('div');
  widgetElement.className = 'grid-stack-item-content';

  const widgetContent = document.createElement('div');
  widgetContent.className = 'widget-content';

  const title = document.createElement('h2');
  title.textContent = 'Federal Reserve Rates';
  title.style.color = '#00FFC2';
  widgetContent.appendChild(title);

  // Loading indicator
  const loadingIndicator = document.createElement('div');
  loadingIndicator.textContent = 'Loading FRED data...';
  loadingIndicator.style.color = '#fff';
  loadingIndicator.style.padding = '20px 0';
  widgetContent.appendChild(loadingIndicator);

  // Create rates container
  const ratesContainer = document.createElement('div');
  ratesContainer.style.width = '100%';
  ratesContainer.style.display = 'none';
  widgetContent.appendChild(ratesContainer);

  // Create chart container
  const chartContainer = document.createElement('div');
  chartContainer.style.width = '100%';
  chartContainer.style.height = '250px';
  chartContainer.style.marginTop = '20px';
  chartContainer.style.display = 'none';
  widgetContent.appendChild(chartContainer);

  // Create overlay button
  const overlayButton = document.createElement('button');
  overlayButton.textContent = 'Overlay on Stock Chart';
  overlayButton.style.backgroundColor = '#00FFC2';
  overlayButton.style.color = '#1E1E1E';
  overlayButton.style.border = 'none';
  overlayButton.style.borderRadius = '4px';
  overlayButton.style.padding = '8px 16px';
  overlayButton.style.margin = '15px 0';
  overlayButton.style.cursor = 'pointer';
  overlayButton.style.display = 'none';
  overlayButton.addEventListener('mouseover', () => {
    overlayButton.style.backgroundColor = '#00D1A1';
  });
  overlayButton.addEventListener('mouseout', () => {
    overlayButton.style.backgroundColor = '#00FFC2';
  });
  widgetContent.appendChild(overlayButton);

  // Add remove button
  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn';
  removeBtn.textContent = 'x';
  removeBtn.setAttribute('title', 'Remove widget');
  widgetContent.appendChild(removeBtn);

  widgetElement.appendChild(widgetContent);

  // Add to grid first so it appears immediately
  const widget = grid.addWidget({ w: 6, h: 6, el: widgetElement });
  removeBtn.addEventListener('click', () => grid.removeWidget(widget));

  // Function to fetch FRED rates data
  const fetchFredRatesData = async () => {
    try {
      // Use FRED API for data
      const apiKey = '2950922c2fe1b905a5c3a8436bd6b89f'; // Free FRED API key
      
      // Get the Federal Funds Rate
      const ffr_url = `https://api.stlouisfed.org/fred/series/observations?series_id=FEDFUNDS&api_key=${apiKey}&file_type=json&sort_order=desc&limit=12`;
      
      // Get 10-Year Treasury Constant Maturity Rate
      const tcm_url = `https://api.stlouisfed.org/fred/series/observations?series_id=GS10&api_key=${apiKey}&file_type=json&sort_order=desc&limit=12`;
      
      // Get Effective Federal Funds Rate
      const effr_url = `https://api.stlouisfed.org/fred/series/observations?series_id=EFFR&api_key=${apiKey}&file_type=json&sort_order=desc&limit=12`;
      
      // Make parallel requests
      const [ffr_response, tcm_response, effr_response] = await Promise.all([
        fetch(ffr_url),
        fetch(tcm_url),
        fetch(effr_url)
      ]);
      
      // Parse responses
      const ffr_data = await ffr_response.json();
      const tcm_data = await tcm_response.json();
      const effr_data = await effr_response.json();
      
      // Check if we got valid data
      if (!ffr_data.observations || !tcm_data.observations || !effr_data.observations) {
        throw new Error('Invalid data received from FRED API');
      }
      
      // Process the data
      const fedFundsRate = ffr_data.observations.slice(0, 12).map(item => ({
        date: item.date,
        value: parseFloat(item.value)
      }));
      
      const treasury10Y = tcm_data.observations.slice(0, 12).map(item => ({
        date: item.date,
        value: parseFloat(item.value)
      }));
      
      const effectiveFedRate = effr_data.observations.slice(0, 12).map(item => ({
        date: item.date,
        value: parseFloat(item.value)
      }));
      
      // Get current rates (most recent values)
      const currentFedFundsRate = fedFundsRate[0]?.value || 0;
      const current10YTreasury = treasury10Y[0]?.value || 0;
      const currentEffectiveFedRate = effectiveFedRate[0]?.value || 0;
      
      return {
        fedFundsRate,
        treasury10Y,
        effectiveFedRate,
        currentRates: {
          fedFundsRate: currentFedFundsRate,
          treasury10Y: current10YTreasury,
          effectiveFedRate: currentEffectiveFedRate
        },
        isReal: true
      };
    } catch (error) {
      console.error('Error fetching FRED data:', error);
      
      // Generate fallback data
      return {
        fedFundsRate: generateFallbackRatesData(5.25, 12),
        treasury10Y: generateFallbackRatesData(4.35, 12),
        effectiveFedRate: generateFallbackRatesData(5.33, 12),
        currentRates: {
          fedFundsRate: 5.25,
          treasury10Y: 4.35,
          effectiveFedRate: 5.33
        },
        isReal: false
      };
    }
  };
  
  // Generate fallback rates data
  const generateFallbackRatesData = (currentValue, count) => {
    const today = new Date();
    const result = [];
    
    for (let i = 0; i < count; i++) {
      const date = new Date(today);
      date.setMonth(date.getMonth() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // Add some variance to make the data look realistic
      const variance = Math.random() * 0.4 - 0.2; // Between -0.2 and 0.2
      const value = Math.max(0, currentValue - (i * 0.1) + variance);
      
      result.push({
        date: dateString,
        value: parseFloat(value.toFixed(2))
      });
    }
    
    return result.reverse(); // Oldest to newest
  };
  
  // Create rates table
  const createRatesTable = (container, data) => {
    container.innerHTML = '';
    container.style.display = 'block';
    
    // Create current rates display
    const currentRatesContainer = document.createElement('div');
    currentRatesContainer.style.display = 'flex';
    currentRatesContainer.style.justifyContent = 'space-between';
    currentRatesContainer.style.marginBottom = '20px';
    currentRatesContainer.style.textAlign = 'center';
    
    const rates = [
      { label: 'Fed Funds Rate', value: data.currentRates.fedFundsRate },
      { label: '10-Year Treasury', value: data.currentRates.treasury10Y },
      { label: 'Effective Fed Rate', value: data.currentRates.effectiveFedRate }
    ];
    
    rates.forEach(rate => {
      const rateBox = document.createElement('div');
      rateBox.style.flex = '1';
      rateBox.style.margin = '0 5px';
      rateBox.style.padding = '15px';
      rateBox.style.backgroundColor = 'rgba(0, 255, 194, 0.1)';
      rateBox.style.borderRadius = '5px';
      
      const rateValue = document.createElement('div');
      rateValue.textContent = `${rate.value.toFixed(2)}%`;
      rateValue.style.fontSize = '24px';
      rateValue.style.fontWeight = 'bold';
      rateValue.style.color = '#00FFC2';
      
      const rateLabel = document.createElement('div');
      rateLabel.textContent = rate.label;
      rateLabel.style.fontSize = '14px';
      rateLabel.style.color = '#fff';
      rateLabel.style.marginTop = '5px';
      
      rateBox.appendChild(rateValue);
      rateBox.appendChild(rateLabel);
      currentRatesContainer.appendChild(rateBox);
    });
    
    container.appendChild(currentRatesContainer);
    
    // Create historical rates table
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.color = '#fff';
    
    // Create header row
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    ['Date', 'Fed Funds Rate', '10-Year Treasury', 'Effective Fed Rate'].forEach(header => {
      const th = document.createElement('th');
      th.textContent = header;
      th.style.padding = '10px';
      th.style.textAlign = header === 'Date' ? 'left' : 'right';
      th.style.borderBottom = '1px solid #00FFC2';
      headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create table body
    const tbody = document.createElement('tbody');
    
    // Get the dates from the Fed Funds Rate data
    const dates = data.fedFundsRate.map(item => item.date);
    
    // Create a lookup for each rate series
    const ffrLookup = new Map(data.fedFundsRate.map(item => [item.date, item.value]));
    const tcmLookup = new Map(data.treasury10Y.map(item => [item.date, item.value]));
    const effrLookup = new Map(data.effectiveFedRate.map(item => [item.date, item.value]));
    
    // Create rows for each date
    dates.forEach(date => {
      const row = document.createElement('tr');
      row.style.borderBottom = '1px solid rgba(0, 255, 194, 0.2)';
      
      // Date cell
      const dateCell = document.createElement('td');
      const dateObj = new Date(date);
      dateCell.textContent = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      dateCell.style.padding = '8px 10px';
      dateCell.style.textAlign = 'left';
      row.appendChild(dateCell);
      
      // Rate cells
      [ffrLookup.get(date) || 'N/A', tcmLookup.get(date) || 'N/A', effrLookup.get(date) || 'N/A'].forEach(value => {
        const valueCell = document.createElement('td');
        valueCell.textContent = typeof value === 'number' ? `${value.toFixed(2)}%` : value;
        valueCell.style.padding = '8px 10px';
        valueCell.style.textAlign = 'right';
        row.appendChild(valueCell);
      });
      
      tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    container.appendChild(table);
    
    // Add a disclaimer for fallback data
    if (!data.isReal) {
      const disclaimer = document.createElement('p');
      disclaimer.textContent = '* Sample FRED data (real data unavailable)';
      disclaimer.style.fontSize = '12px';
      disclaimer.style.fontStyle = 'italic';
      disclaimer.style.color = '#999';
      disclaimer.style.marginTop = '10px';
      container.appendChild(disclaimer);
    }
  };
  
  // Create rates chart
  const createRatesChart = (container, data) => {
    container.innerHTML = '';
    container.style.display = 'block';
    
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);
    
    // Prepare data for chart
    const chartLabels = data.fedFundsRate.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });
    
    const ffrData = data.fedFundsRate.map(item => item.value);
    const tcmData = data.treasury10Y.map(item => item.value);
    const effrData = data.effectiveFedRate.map(item => item.value);
    
    // Create chart
    const chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: 'Fed Funds Rate',
            data: ffrData,
            borderColor: '#00FFC2',
            backgroundColor: 'rgba(0, 255, 194, 0.1)',
            tension: 0.4,
            fill: false,
            pointRadius: 2,
            pointHoverRadius: 5
          },
          {
            label: '10-Year Treasury',
            data: tcmData,
            borderColor: '#FF9A3D',
            backgroundColor: 'rgba(255, 154, 61, 0.1)',
            tension: 0.4,
            fill: false,
            pointRadius: 2,
            pointHoverRadius: 5
          },
          {
            label: 'Effective Fed Rate',
            data: effrData,
            borderColor: '#FF5E93',
            backgroundColor: 'rgba(255, 94, 147, 0.1)',
            tension: 0.4,
            fill: false,
            pointRadius: 2,
            pointHoverRadius: 5
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#fff'
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y.toFixed(2) + '%';
                }
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#fff'
            }
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#fff',
              callback: function(value) {
                return value.toFixed(2) + '%';
              }
            }
          }
        }
      }
    });
    
    // Store chart reference
    container.__chart = chart;
  };
  
  // Function to overlay on Streamlit chart
  const overlayOnStockChart = (ratesData) => {
    // Prepare rates data for overlay
    const dates = ratesData.fedFundsRate.map(item => item.date);
    const ffrValues = ratesData.fedFundsRate.map(item => item.value);
    const tcmValues = ratesData.treasury10Y.map(item => item.value);
    
    // Create a URL with rates data as parameters to send to Streamlit
    let streamlitUrl = 'http://localhost:8502/?';
    
    // Add symbol parameter (keep the current symbol)
    streamlitUrl += `symbol=${symbol}`;
    
    // Add rates overlay parameter
    streamlitUrl += '&rates_overlay=true';
    
    // Add dates and rates data
    dates.forEach((date, index) => {
      const formattedDate = date.replace(/-/g, '');
      streamlitUrl += `&date${index}=${formattedDate}&ffr${index}=${ffrValues[index]}&tcm${index}=${tcmValues[index]}`;
    });
    
    // Create a notification message
    const notification = document.createElement('div');
    notification.textContent = 'Opening rates overlay in Streamlit...';
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = 'rgba(0, 255, 194, 0.9)';
    notification.style.color = '#1E1E1E';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '1000';
    notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    document.body.appendChild(notification);
    
    // Open Streamlit in a new tab
    window.open(streamlitUrl, '_blank');
    
    // Remove notification after 5 seconds
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 5000);
  };
  
  // Fetch rates data and update the widget
  fetchFredRatesData().then(data => {
    // Remove loading indicator
    widgetContent.removeChild(loadingIndicator);
    
    // Create rates table
    createRatesTable(ratesContainer, data);
    
    // Create rates chart
    createRatesChart(chartContainer, data);
    
    // Show overlay button
    overlayButton.style.display = 'block';
    
    // Add click event for overlay button
    overlayButton.addEventListener('click', () => {
      overlayOnStockChart(data);
    });
    
  }).catch(error => {
    console.error('FRED Rates Widget error:', error);
    
    // Show error and use fallback data
    loadingIndicator.textContent = 'Could not load FRED data. Using sample values.';
    
    setTimeout(() => {
      // Remove loading indicator
      widgetContent.removeChild(loadingIndicator);
      
      // Create rates table and chart with fallback data
      const fallbackData = {
        fedFundsRate: generateFallbackRatesData(5.25, 12),
        treasury10Y: generateFallbackRatesData(4.35, 12),
        effectiveFedRate: generateFallbackRatesData(5.33, 12),
        currentRates: {
          fedFundsRate: 5.25,
          treasury10Y: 4.35,
          effectiveFedRate: 5.33
        },
        isReal: false
      };
      
      createRatesTable(ratesContainer, fallbackData);
      createRatesChart(chartContainer, fallbackData);
      
      // Show overlay button
      overlayButton.style.display = 'block';
      
      // Add click event for overlay button
      overlayButton.addEventListener('click', () => {
        overlayOnStockChart(fallbackData);
      });
      
    }, 1000);
  });
}

function renderRrpDataWidget(grid, symbol = 'NVDA') {
  // Create widget element
  const widgetElement = document.createElement('div');
  widgetElement.className = 'grid-stack-item-content';

  const widgetContent = document.createElement('div');
  widgetContent.className = 'widget-content';

  const title = document.createElement('h2');
  title.textContent = 'Reverse Repo Data';
  title.style.color = '#00FFC2';
  widgetContent.appendChild(title);

  // Loading indicator
  const loadingIndicator = document.createElement('div');
  loadingIndicator.textContent = 'Loading Reverse Repo data...';
  loadingIndicator.style.color = '#fff';
  loadingIndicator.style.padding = '20px 0';
  widgetContent.appendChild(loadingIndicator);

  // Create data container
  const dataContainer = document.createElement('div');
  dataContainer.style.width = '100%';
  dataContainer.style.display = 'none';
  widgetContent.appendChild(dataContainer);

  // Create chart container
  const chartContainer = document.createElement('div');
  chartContainer.style.width = '100%';
  chartContainer.style.height = '250px';
  chartContainer.style.marginTop = '20px';
  chartContainer.style.display = 'none';
  widgetContent.appendChild(chartContainer);

  // Create overlay button
  const overlayButton = document.createElement('button');
  overlayButton.textContent = 'Overlay on Stock Chart';
  overlayButton.style.backgroundColor = '#00FFC2';
  overlayButton.style.color = '#1E1E1E';
  overlayButton.style.border = 'none';
  overlayButton.style.borderRadius = '4px';
  overlayButton.style.padding = '8px 16px';
  overlayButton.style.margin = '15px 0';
  overlayButton.style.cursor = 'pointer';
  overlayButton.style.display = 'none';
  overlayButton.addEventListener('mouseover', () => {
    overlayButton.style.backgroundColor = '#00D1A1';
  });
  overlayButton.addEventListener('mouseout', () => {
    overlayButton.style.backgroundColor = '#00FFC2';
  });
  widgetContent.appendChild(overlayButton);

  // Add remove button
  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn';
  removeBtn.textContent = 'x';
  removeBtn.setAttribute('title', 'Remove widget');
  widgetContent.appendChild(removeBtn);

  widgetElement.appendChild(widgetContent);

  // Add to grid first so it appears immediately
  const widget = grid.addWidget({ w: 6, h: 6, el: widgetElement });
  removeBtn.addEventListener('click', () => grid.removeWidget(widget));

  // Function to fetch RRP data
  const fetchRrpData = async () => {
    try {
      // Use FRED API for RRP data
      const apiKey = '2950922c2fe1b905a5c3a8436bd6b89f'; // Free FRED API key
      
      // Get the Overnight Reverse Repurchase Agreements
      const rrp_url = `https://api.stlouisfed.org/fred/series/observations?series_id=RRPONTSYAWARD&api_key=${apiKey}&file_type=json&sort_order=desc&limit=30`;
      
      const response = await fetch(rrp_url);
      const data = await response.json();
      
      // Check if we got valid data
      if (!data.observations) {
        throw new Error('Invalid data received from FRED API');
      }
      
      // Process the data
      const rrpData = data.observations.slice(0, 30).map(item => ({
        date: item.date,
        value: parseFloat(item.value) / 1000 // Convert to billions
      })).filter(item => !isNaN(item.value));
      
      // Calculate metrics
      const currentRrp = rrpData[0]?.value || 0;
      const previousRrp = rrpData[1]?.value || 0;
      const weekAgoRrp = rrpData[5]?.value || 0;
      const monthAgoRrp = rrpData[20]?.value || 0;
      
      // Calculate changes
      const dailyChange = currentRrp - previousRrp;
      const weeklyChange = currentRrp - weekAgoRrp;
      const monthlyChange = currentRrp - monthAgoRrp;
      
      return {
        rrpData,
        metrics: {
          current: currentRrp,
          dailyChange,
          weeklyChange,
          monthlyChange
        },
        isReal: true
      };
    } catch (error) {
      console.error('Error fetching RRP data:', error);
      
      // Generate fallback data
      const fallbackData = generateFallbackRrpData(30);
      const current = fallbackData[0].value;
      const previous = fallbackData[1].value;
      const weekAgo = fallbackData[5].value;
      const monthAgo = fallbackData[20].value;
      
      return {
        rrpData: fallbackData,
        metrics: {
          current,
          dailyChange: current - previous,
          weeklyChange: current - weekAgo,
          monthlyChange: current - monthAgo
        },
        isReal: false
      };
    }
  };
  
  // Generate fallback RRP data
  const generateFallbackRrpData = (count) => {
    const today = new Date();
    const result = [];
    let value = 1800 + Math.random() * 200; // Around 1.8-2.0 trillion
    
    for (let i = 0; i < count; i++) {
      // Skip weekends (no RRP operations on weekends)
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) {
        continue;
      }
      
      const dateString = date.toISOString().split('T')[0];
      
      // Add some variance to make the data look realistic
      const variance = Math.random() * 100 - 50; // Between -50B and +50B
      value += variance;
      
      // Make sure value doesn't go below 1.5T
      value = Math.max(1500, value);
      
      result.push({
        date: dateString,
        value: parseFloat(value.toFixed(2))
      });
      
      if (result.length >= count) break;
    }
    
    return result.reverse(); // Oldest to newest
  };
  
  // Format currency in billions/trillions
  const formatCurrency = (value) => {
    if (value >= 1000) {
      return `$${(value/1000).toFixed(2)}T`;
    } else {
      return `$${value.toFixed(2)}B`;
    }
  };
  
  // Format percent change with + or - sign
  const formatPercentChange = (current, previous) => {
    if (previous === 0) return '0.00%';
    const percent = ((current - previous) / previous) * 100;
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };
  
  // Create RRP data display
  const createRrpDataDisplay = (container, data) => {
    container.innerHTML = '';
    container.style.display = 'block';
    
    // Create summary metrics
    const metricsContainer = document.createElement('div');
    metricsContainer.style.display = 'flex';
    metricsContainer.style.justifyContent = 'space-between';
    metricsContainer.style.marginBottom = '20px';
    
    // Current RRP amount
    const currentBox = document.createElement('div');
    currentBox.style.flex = '1';
    currentBox.style.backgroundColor = 'rgba(0, 255, 194, 0.1)';
    currentBox.style.borderRadius = '5px';
    currentBox.style.padding = '15px';
    currentBox.style.textAlign = 'center';
    
    const currentValue = document.createElement('div');
    currentValue.textContent = formatCurrency(data.metrics.current);
    currentValue.style.fontSize = '24px';
    currentValue.style.fontWeight = 'bold';
    currentValue.style.color = '#00FFC2';
    
    const currentLabel = document.createElement('div');
    currentLabel.textContent = 'Current RRP Amount';
    currentLabel.style.fontSize = '14px';
    currentLabel.style.color = '#fff';
    currentLabel.style.marginTop = '5px';
    
    currentBox.appendChild(currentValue);
    currentBox.appendChild(currentLabel);
    metricsContainer.appendChild(currentBox);
    
    // Changes
    const changes = [
      { label: 'Daily Change', value: data.metrics.dailyChange },
      { label: 'Weekly Change', value: data.metrics.weeklyChange },
      { label: 'Monthly Change', value: data.metrics.monthlyChange }
    ];
    
    changes.forEach(change => {
      const changeBox = document.createElement('div');
      changeBox.style.flex = '1';
      changeBox.style.backgroundColor = 'rgba(0, 255, 194, 0.1)';
      changeBox.style.borderRadius = '5px';
      changeBox.style.padding = '15px';
      changeBox.style.textAlign = 'center';
      changeBox.style.marginLeft = '10px';
      
      const changeValue = document.createElement('div');
      changeValue.textContent = formatCurrency(change.value);
      changeValue.style.fontSize = '24px';
      changeValue.style.fontWeight = 'bold';
      changeValue.style.color = change.value >= 0 ? '#4DFF4D' : '#FF4D4D';
      
      const changePercent = document.createElement('div');
      const baseValue = data.metrics.current - change.value;
      changePercent.textContent = formatPercentChange(data.metrics.current, baseValue);
      changePercent.style.fontSize = '14px';
      changePercent.style.color = change.value >= 0 ? '#4DFF4D' : '#FF4D4D';
      
      const changeLabel = document.createElement('div');
      changeLabel.textContent = change.label;
      changeLabel.style.fontSize = '14px';
      changeLabel.style.color = '#fff';
      changeLabel.style.marginTop = '5px';
      
      changeBox.appendChild(changeValue);
      changeBox.appendChild(changePercent);
      changeBox.appendChild(changeLabel);
      metricsContainer.appendChild(changeBox);
    });
    
    container.appendChild(metricsContainer);
    
    // Create RRP data table
    const tableContainer = document.createElement('div');
    tableContainer.style.maxHeight = '250px';
    tableContainer.style.overflowY = 'auto';
    
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.color = '#fff';
    
    // Create header row
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    ['Date', 'RRP Amount', 'Daily Change'].forEach(header => {
      const th = document.createElement('th');
      th.textContent = header;
      th.style.position = 'sticky';
      th.style.top = '0';
      th.style.backgroundColor = '#1E1E1E';
      th.style.padding = '10px';
      th.style.textAlign = header === 'Date' ? 'left' : 'right';
      th.style.borderBottom = '1px solid #00FFC2';
      headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create table body
    const tbody = document.createElement('tbody');
    
    // Add rows for each data point
    for (let i = 0; i < data.rrpData.length - 1; i++) {
      const current = data.rrpData[i];
      const previous = data.rrpData[i + 1];
      const dailyChange = current.value - previous.value;
      
      const row = document.createElement('tr');
      row.style.borderBottom = '1px solid rgba(0, 255, 194, 0.2)';
      
      // Date cell
      const dateCell = document.createElement('td');
      const dateObj = new Date(current.date);
      dateCell.textContent = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      dateCell.style.padding = '8px 10px';
      dateCell.style.textAlign = 'left';
      row.appendChild(dateCell);
      
      // RRP amount cell
      const amountCell = document.createElement('td');
      amountCell.textContent = formatCurrency(current.value);
      amountCell.style.padding = '8px 10px';
      amountCell.style.textAlign = 'right';
      row.appendChild(amountCell);
      
      // Change cell
      const changeCell = document.createElement('td');
      changeCell.textContent = formatCurrency(dailyChange);
      changeCell.style.padding = '8px 10px';
      changeCell.style.textAlign = 'right';
      changeCell.style.color = dailyChange >= 0 ? '#4DFF4D' : '#FF4D4D';
      row.appendChild(changeCell);
      
      tbody.appendChild(row);
    }
    
    table.appendChild(tbody);
    tableContainer.appendChild(table);
    container.appendChild(tableContainer);
    
    // Add a disclaimer for fallback data
    if (!data.isReal) {
      const disclaimer = document.createElement('p');
      disclaimer.textContent = '* Sample RRP data (real data unavailable)';
      disclaimer.style.fontSize = '12px';
      disclaimer.style.fontStyle = 'italic';
      disclaimer.style.color = '#999';
      disclaimer.style.marginTop = '10px';
      container.appendChild(disclaimer);
    }
  };
  
  // Create RRP chart
  const createRrpChart = (container, data) => {
    container.innerHTML = '';
    container.style.display = 'block';
    
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);
    
    // Prepare data for chart
    const chartLabels = data.rrpData.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    const chartData = data.rrpData.map(item => item.value);
    
    // Create chart
    const chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: 'RRP Amount (Billions $)',
            data: chartData,
            borderColor: '#00FFC2',
            backgroundColor: 'rgba(0, 255, 194, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 2,
            pointHoverRadius: 5
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#fff'
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += formatCurrency(context.parsed.y);
                }
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#fff'
            }
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#fff',
              callback: function(value) {
                return formatCurrency(value);
              }
            }
          }
        }
      }
    });
    
    // Store chart reference
    container.__chart = chart;
  };
  
  // Function to overlay on Streamlit chart
  const overlayOnStockChart = (rrpData) => {
    // Prepare RRP data for overlay
    const dates = rrpData.rrpData.map(item => item.date);
    const values = rrpData.rrpData.map(item => item.value);
    
    // Create a URL with RRP data as parameters to send to Streamlit
    let streamlitUrl = 'http://localhost:8502/?';
    
    // Add symbol parameter (keep the current symbol)
    streamlitUrl += `symbol=${symbol}`;
    
    // Add RRP overlay parameter
    streamlitUrl += '&rrp_overlay=true';
    
    // Add dates and values
    dates.forEach((date, index) => {
      const formattedDate = date.replace(/-/g, '');
      streamlitUrl += `&rrp_date${index}=${formattedDate}&rrp_value${index}=${values[index]}`;
    });
    
    // Create a notification message
    const notification = document.createElement('div');
    notification.textContent = 'Opening RRP overlay in Streamlit...';
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = 'rgba(0, 255, 194, 0.9)';
    notification.style.color = '#1E1E1E';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '1000';
    notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    document.body.appendChild(notification);
    
    // Open Streamlit in a new tab
    window.open(streamlitUrl, '_blank');
    
    // Remove notification after 5 seconds
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 5000);
  };
  
  // Fetch data and update the widget
  fetchRrpData().then(data => {
    // Remove loading indicator
    widgetContent.removeChild(loadingIndicator);
    
    // Create RRP data display
    createRrpDataDisplay(dataContainer, data);
    
    // Create RRP chart
    createRrpChart(chartContainer, data);
    
    // Show overlay button
    overlayButton.style.display = 'block';
    
    // Add click event for overlay button
    overlayButton.addEventListener('click', () => {
      overlayOnStockChart(data);
    });
    
  }).catch(error => {
    console.error('RRP Widget error:', error);
    
    // Show error and use fallback data
    loadingIndicator.textContent = 'Could not load RRP data. Using sample values.';
    
    setTimeout(() => {
      // Remove loading indicator
      widgetContent.removeChild(loadingIndicator);
      
      // Create with fallback data
      const fallbackData = generateFallbackRrpData(30);
      const current = fallbackData[0].value;
      const previous = fallbackData[1].value;
      const weekAgo = fallbackData[5].value;
      const monthAgo = fallbackData[20].value;
      
      const data = {
        rrpData: fallbackData,
        metrics: {
          current,
          dailyChange: current - previous,
          weeklyChange: current - weekAgo,
          monthlyChange: current - monthAgo
        },
        isReal: false
      };
      
      createRrpDataDisplay(dataContainer, data);
      createRrpChart(chartContainer, data);
      
      // Show overlay button
      overlayButton.style.display = 'block';
      
      // Add click event for overlay button
      overlayButton.addEventListener('click', () => {
        overlayOnStockChart(data);
      });
      
    }, 1000);
  });
}

function renderTreasuryIssuanceWidget(grid, symbol) {
  // Create widget element
  const widgetElement = document.createElement('div');
  widgetElement.className = 'grid-stack-item-content';

  const widgetContent = document.createElement('div');
  widgetContent.className = 'widget-content';

  const title = document.createElement('h2');
  title.textContent = 'Treasury Issuance';
  title.style.color = '#00FFC2';
  widgetContent.appendChild(title);

  // Loading indicator
  const loadingIndicator = document.createElement('div');
  loadingIndicator.textContent = 'Loading Treasury issuance data...';
  loadingIndicator.style.color = '#fff';
  loadingIndicator.style.padding = '20px 0';
  widgetContent.appendChild(loadingIndicator);

  // Create data container
  const dataContainer = document.createElement('div');
  dataContainer.style.width = '100%';
  dataContainer.style.display = 'none';
  widgetContent.appendChild(dataContainer);

  // Create chart container
  const chartContainer = document.createElement('div');
  chartContainer.style.width = '100%';
  chartContainer.style.height = '300px';
  chartContainer.style.marginTop = '20px';
  chartContainer.style.display = 'none';
  widgetContent.appendChild(chartContainer);

  // Create overlay button for Streamlit
  const overlayButton = document.createElement('button');
  overlayButton.textContent = 'Overlay on Stock Chart';
  overlayButton.style.backgroundColor = '#00FFC2';
  overlayButton.style.color = '#1E1E1E';
  overlayButton.style.border = 'none';
  overlayButton.style.borderRadius = '4px';
  overlayButton.style.padding = '8px 16px';
  overlayButton.style.margin = '15px 0';
  overlayButton.style.cursor = 'pointer';
  overlayButton.style.display = 'none';
  overlayButton.addEventListener('mouseover', () => {
    overlayButton.style.backgroundColor = '#00D1A1';
  });
  overlayButton.addEventListener('mouseout', () => {
    overlayButton.style.backgroundColor = '#00FFC2';
  });
  widgetContent.appendChild(overlayButton);

  // Add remove button
  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn';
  removeBtn.textContent = 'x';
  removeBtn.setAttribute('title', 'Remove widget');
  widgetContent.appendChild(removeBtn);

  widgetElement.appendChild(widgetContent);

  // Add to grid first so it appears immediately
  const widget = grid.addWidget({ w: 6, h: 6, el: widgetElement });
  removeBtn.addEventListener('click', () => grid.removeWidget(widget));

  // Function to fetch Treasury issuance data
  const fetchTreasuryIssuance = async () => {
    try {
      // Calculate dates for the last 3 months
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 3);
      
      const formattedEndDate = endDate.toISOString().split('T')[0];
      const formattedStartDate = startDate.toISOString().split('T')[0];
      
      // Use the Treasury API
      const baseUrl = "https://api.fiscaldata.treasury.gov/services/api/fiscal_service";
      const endpoint = "/v1/accounting/od/auctions_query";
      const fields = "?fields=security_type,auction_date,offering_amt";
      const filters = `&filter=auction_date:gte:${formattedStartDate},auction_date:lte:${formattedEndDate}`;
      const sort = "&sort=-auction_date";
      const fmt = "&format=json";
      const pagination = "&page[size]=1000";
      
      const url = `${baseUrl}${endpoint}${fields}${filters}${sort}${fmt}${pagination}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const responseData = await response.json();
      const data = responseData.data || [];
      
      if (data.length === 0) {
        throw new Error("No data returned from Treasury API");
      }
      
      // Process the data
      const issuanceData = data.map(item => ({
        auctionDate: new Date(item.auction_date),
        securityType: item.security_type,
        amount: parseFloat(item.offering_amt) || 0
      })).filter(item => !isNaN(item.amount) && item.securityType);
      
      // Group by date and security type
      const groupedData = groupTreasuryData(issuanceData);
      
      return {
        issuanceData,
        groupedData,
        isReal: true
      };
    } catch (error) {
      console.error('Error fetching Treasury issuance data:', error);
      
      // Generate fallback data
      const fallbackData = generateFallbackIssuanceData();
      const groupedData = groupTreasuryData(fallbackData);
      
      return {
        issuanceData: fallbackData,
        groupedData,
        isReal: false
      };
    }
  };
  
  // Helper to group treasury data by date and security type
  const groupTreasuryData = (data) => {
    // Get unique dates and security types
    const dates = [...new Set(data.map(item => item.auctionDate.toISOString().split('T')[0]))];
    const securityTypes = [...new Set(data.map(item => item.securityType))];
    
    // Sort dates and add a bit of padding to array
    dates.sort((a, b) => new Date(a) - new Date(b));
    
    // Create the grouped data structure
    const grouped = {};
    
    // Initialize with zero values
    dates.forEach(date => {
      grouped[date] = {};
      securityTypes.forEach(type => {
        grouped[date][type] = 0;
      });
    });
    
    // Populate with actual values
    data.forEach(item => {
      const dateStr = item.auctionDate.toISOString().split('T')[0];
      if (grouped[dateStr] && grouped[dateStr][item.securityType] !== undefined) {
        grouped[dateStr][item.securityType] += item.amount;
      }
    });
    
    return {
      dates,
      securityTypes,
      groupedData: grouped
    };
  };
  
  // Generate fallback issuance data
  const generateFallbackIssuanceData = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);
    
    const securityTypes = ['Bill', 'Note', 'Bond', 'FRN', 'TIPS'];
    const fallbackData = [];
    
    // Generate one auction every few days
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      // Skip weekends
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Generate 1-3 auctions per day randomly
        const auctionsPerDay = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < auctionsPerDay; i++) {
          const securityType = securityTypes[Math.floor(Math.random() * securityTypes.length)];
          
          // Amounts vary by security type
          let baseAmount = 0;
          switch (securityType) {
            case 'Bill':
              baseAmount = 40000000000; // $40B
              break;
            case 'Note':
              baseAmount = 25000000000; // $25B
              break;
            case 'Bond':
              baseAmount = 15000000000; // $15B
              break;
            case 'FRN':
              baseAmount = 10000000000; // $10B
              break;
            case 'TIPS':
              baseAmount = 8000000000; // $8B
              break;
          }
          
          // Add some variance
          const variance = (Math.random() * 0.4 + 0.8); // 80% to 120% of base amount
          const amount = baseAmount * variance;
          
          fallbackData.push({
            auctionDate: new Date(currentDate),
            securityType,
            amount
          });
        }
      }
      
      // Advance by 1-3 days randomly
      const daysToAdd = Math.floor(Math.random() * 3) + 1;
      currentDate.setDate(currentDate.getDate() + daysToAdd);
    }
    
    return fallbackData;
  };
  
  // Format currency in billions/trillions
  const formatCurrency = (value) => {
    if (value >= 1e12) {
      return `$${(value/1e12).toFixed(2)}T`;
    } else if (value >= 1e9) {
      return `$${(value/1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `$${(value/1e6).toFixed(2)}M`;
    } else {
      return `$${value.toFixed(2)}`;
    }
  };
  
  // Create issuance summary
  const createIssuanceSummary = (container, data) => {
    container.innerHTML = '';
    container.style.display = 'block';
    
    // Calculate totals
    const totalIssuance = data.issuanceData.reduce((sum, item) => sum + item.amount, 0);
    
    // Calculate by type
    const byType = {};
    data.groupedData.securityTypes.forEach(type => {
      byType[type] = data.issuanceData
        .filter(item => item.securityType === type)
        .reduce((sum, item) => sum + item.amount, 0);
    });
    
    // Create summary
    const summaryContainer = document.createElement('div');
    summaryContainer.style.backgroundColor = 'rgba(0, 255, 194, 0.1)';
    summaryContainer.style.padding = '15px';
    summaryContainer.style.borderRadius = '5px';
    summaryContainer.style.marginBottom = '20px';
    
    const totalHeader = document.createElement('div');
    totalHeader.textContent = `Total Treasury Issuance: ${formatCurrency(totalIssuance)}`;
    totalHeader.style.fontSize = '18px';
    totalHeader.style.fontWeight = 'bold';
    totalHeader.style.color = '#00FFC2';
    totalHeader.style.marginBottom = '10px';
    summaryContainer.appendChild(totalHeader);
    
    // Create breakdown by type
    const typeBreakdown = document.createElement('div');
    typeBreakdown.style.display = 'grid';
    typeBreakdown.style.gridTemplateColumns = 'repeat(auto-fit, minmax(120px, 1fr))';
    typeBreakdown.style.gap = '10px';
    
    data.groupedData.securityTypes.forEach(type => {
      const typeBox = document.createElement('div');
      typeBox.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      typeBox.style.padding = '10px';
      typeBox.style.borderRadius = '4px';
      typeBox.style.textAlign = 'center';
      
      const typeAmount = document.createElement('div');
      typeAmount.textContent = formatCurrency(byType[type]);
      typeAmount.style.fontSize = '16px';
      typeAmount.style.fontWeight = 'bold';
      typeAmount.style.color = '#fff';
      
      const typeLabel = document.createElement('div');
      typeLabel.textContent = type;
      typeLabel.style.fontSize = '14px';
      typeLabel.style.color = '#999';
      typeLabel.style.marginTop = '5px';
      
      const typePercent = document.createElement('div');
      const percent = (byType[type] / totalIssuance * 100).toFixed(1);
      typePercent.textContent = `${percent}%`;
      typePercent.style.fontSize = '12px';
      typePercent.style.color = '#00FFC2';
      
      typeBox.appendChild(typeAmount);
      typeBox.appendChild(typeLabel);
      typeBox.appendChild(typePercent);
      typeBreakdown.appendChild(typeBox);
    });
    
    summaryContainer.appendChild(typeBreakdown);
    container.appendChild(summaryContainer);
    
    // Create recent issuances table
    const tableContainer = document.createElement('div');
    tableContainer.style.marginTop = '20px';
    tableContainer.style.maxHeight = '250px';
    tableContainer.style.overflowY = 'auto';
    
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.color = '#fff';
    
    // Create header row
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    ['Auction Date', 'Security Type', 'Amount'].forEach(header => {
      const th = document.createElement('th');
      th.textContent = header;
      th.style.position = 'sticky';
      th.style.top = '0';
      th.style.backgroundColor = '#1E1E1E';
      th.style.padding = '10px';
      th.style.textAlign = header === 'Amount' ? 'right' : 'left';
      th.style.borderBottom = '1px solid #00FFC2';
      headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create table body
    const tbody = document.createElement('tbody');
    
    // Sort issuances by date (newest first)
    const sortedData = [...data.issuanceData].sort((a, b) => b.auctionDate - a.auctionDate);
    
    // Show up to 15 most recent issuances
    sortedData.slice(0, 15).forEach(item => {
      const row = document.createElement('tr');
      row.style.borderBottom = '1px solid rgba(0, 255, 194, 0.2)';
      
      // Auction Date
      const dateCell = document.createElement('td');
      dateCell.textContent = item.auctionDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
      dateCell.style.padding = '8px 10px';
      dateCell.style.textAlign = 'left';
      row.appendChild(dateCell);
      
      // Security Type
      const typeCell = document.createElement('td');
      typeCell.textContent = item.securityType;
      typeCell.style.padding = '8px 10px';
      typeCell.style.textAlign = 'left';
      row.appendChild(typeCell);
      
      // Amount
      const amountCell = document.createElement('td');
      amountCell.textContent = formatCurrency(item.amount);
      amountCell.style.padding = '8px 10px';
      amountCell.style.textAlign = 'right';
      row.appendChild(amountCell);
      
      tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    tableContainer.appendChild(table);
    container.appendChild(tableContainer);
    
    // Add a disclaimer for fallback data
    if (!data.isReal) {
      const disclaimer = document.createElement('p');
      disclaimer.textContent = '* Sample Treasury issuance data (real data unavailable)';
      disclaimer.style.fontSize = '12px';
      disclaimer.style.fontStyle = 'italic';
      disclaimer.style.color = '#999';
      disclaimer.style.marginTop = '10px';
      container.appendChild(disclaimer);
    }
  };
  
  // Create stacked bar chart for issuance composition
  const createIssuanceChart = (container, data) => {
    container.innerHTML = '';
    container.style.display = 'block';
    
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);
    
    // Prepare data for chart
    const dates = data.groupedData.dates;
    const securityTypes = data.groupedData.securityTypes;
    
    // Create datasets for each security type
    const datasets = securityTypes.map((type, index) => {
      // Create a consistent color scheme
      const colors = [
        'rgba(0, 255, 194, 0.7)',    // Teal
        'rgba(255, 154, 61, 0.7)',   // Orange
        'rgba(255, 94, 147, 0.7)',   // Pink
        'rgba(125, 95, 255, 0.7)',   // Purple
        'rgba(255, 223, 80, 0.7)'    // Yellow
      ];
      
      // Extract data for this security type across all dates
      const typeData = dates.map(date => {
        return data.groupedData.groupedData[date][type] / 1e9; // Convert to billions
      });
      
      return {
        label: type,
        data: typeData,
        backgroundColor: colors[index % colors.length],
        borderColor: colors[index % colors.length].replace('0.7', '1'),
        borderWidth: 1
      };
    });
    
    // Format dates for display
    const formattedDates = dates.map(date => {
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    // Create chart
    const chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: formattedDates,
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#fff',
              maxRotation: 45,
              minRotation: 45
            }
          },
          y: {
            stacked: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#fff',
              callback: function(value) {
                return '$' + value + 'B';
              }
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#fff'
            }
          },
          title: {
            display: true,
            text: 'Daily Treasury Issuance by Type',
            color: '#fff',
            font: {
              size: 16
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += '$' + context.parsed.y.toFixed(2) + 'B';
                }
                return label;
              }
            }
          }
        }
      }
    });
    
    // Store chart reference
    container.__chart = chart;
  };
  
  // Function to overlay on Streamlit chart
  const overlayOnStockChart = (treasuryData) => {
    // Prepare data for overlay
    const dates = treasuryData.groupedData.dates;
    const securityTypes = treasuryData.groupedData.securityTypes;
    
    // Calculate total issuance by date
    const totalByDate = {};
    dates.forEach(date => {
      totalByDate[date] = securityTypes.reduce((sum, type) => {
        return sum + treasuryData.groupedData.groupedData[date][type];
      }, 0) / 1e9; // Convert to billions
    });
    
    // Create a URL with Treasury data as parameters to send to Streamlit
    let streamlitUrl = 'http://localhost:8502/?';
    
    // Add symbol parameter (keep the current symbol)
    streamlitUrl += `symbol=${symbol}`;
    
    // Add Treasury overlay parameter
    streamlitUrl += '&treasury_overlay=true';
    
    // Add dates and issuance data
    dates.forEach((date, index) => {
      const formattedDate = date.replace(/-/g, '');
      streamlitUrl += `&treasury_date${index}=${formattedDate}&treasury_amount${index}=${totalByDate[date]}`;
    });
    
    // Create a notification message
    const notification = document.createElement('div');
    notification.textContent = 'Opening Treasury issuance overlay in Streamlit...';
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = 'rgba(0, 255, 194, 0.9)';
    notification.style.color = '#1E1E1E';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '1000';
    notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    document.body.appendChild(notification);
    
    // Open Streamlit in a new tab
    window.open(streamlitUrl, '_blank');
    
    // Remove notification after 5 seconds
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 5000);
  };
  
  // Fetch Treasury issuance data and update the widget
  fetchTreasuryIssuance().then(data => {
    // Remove loading indicator
    widgetContent.removeChild(loadingIndicator);
    
    // Create issuance summary
    createIssuanceSummary(dataContainer, data);
    
    // Create issuance chart
    createIssuanceChart(chartContainer, data);
    
    // Show overlay button
    overlayButton.style.display = 'block';
    
    // Add click event for overlay button
    overlayButton.addEventListener('click', () => {
      overlayOnStockChart(data);
    });
    
  }).catch(error => {
    console.error('Treasury Widget error:', error);
    
    // Show error and use fallback data
    loadingIndicator.textContent = 'Could not load Treasury data. Using sample values.';
    
    setTimeout(() => {
      // Remove loading indicator
      widgetContent.removeChild(loadingIndicator);
      
      // Generate fallback data
      const fallbackData = generateFallbackIssuanceData();
      const groupedData = groupTreasuryData(fallbackData);
      
      const data = {
        issuanceData: fallbackData,
        groupedData,
        isReal: false
      };
      
      // Create with fallback data
      createIssuanceSummary(dataContainer, data);
      createIssuanceChart(chartContainer, data);
      
      // Show overlay button
      overlayButton.style.display = 'block';
      
      // Add click event for overlay button
      overlayButton.addEventListener('click', () => {
        overlayOnStockChart(data);
      });
      
    }, 1000);
  });
}

  

//   function addWidgetToGrid(title, contentEl) {
//     const widgetWrapper = document.createElement('div');
//     widgetWrapper.className = 'grid-stack-item-content';
//     widgetWrapper.style.background = '#1e1e1e';
//     widgetWrapper.style.border = '1px solid #00ffc2';
//     widgetWrapper.style.padding = '10px';
//     widgetWrapper.style.borderRadius = '8px';
  
//     // Optional: Add a header
//     const header = document.createElement('div');
//     header.textContent = title;
//     header.style.fontWeight = 'bold';
//     header.style.marginBottom = '10px';
//     header.style.color = '#00ffc2';
//     widgetWrapper.appendChild(header);
  
//     widgetWrapper.appendChild(contentEl);
  
//     const widgetContainer = document.createElement('div');
//     widgetContainer.appendChild(widgetWrapper);
  
//     grid.addWidget(widgetContainer, { w: 4, h: 3 }); // width/height can be adjusted
//   }

function addWidgetToGrid(title, contentEl, grid) {
  const widgetWrapper = document.createElement('div');
  widgetWrapper.className = 'grid-stack-item-content';
  widgetWrapper.style.background = '#1e1e1e';
  widgetWrapper.style.border = '1px solid #00ffc2';
  widgetWrapper.style.padding = '10px';
  widgetWrapper.style.borderRadius = '8px';

  const header = document.createElement('div');
  header.textContent = title;
  header.style.fontWeight = 'bold';
  header.style.marginBottom = '10px';
  header.style.color = '#00ffc2';
  widgetWrapper.appendChild(header);

  widgetWrapper.appendChild(contentEl);

  const widgetContainer = document.createElement('div');
  widgetContainer.appendChild(widgetWrapper);

  grid.addWidget(widgetContainer, { w: 4, h: 3 });
}
  
  

// Function to fetch stock data from the Flask backend for a specific symbol
function fetchStockDataForSymbol(chartElement, textElement, symbol) {
  // Show a loading message
  textElement.innerHTML = `<p>Loading ${symbol} data...</p>`;
  
  // Create an iframe to embed the Streamlit app
  const iframe = document.createElement('iframe');
  iframe.src = `http://localhost:8502/?symbol=${encodeURIComponent(symbol)}`;
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  iframe.style.borderRadius = '4px';
  iframe.title = `${symbol} Stock Chart`;
  
  // Clear the chart container and add the iframe
  chartElement.innerHTML = '';
  chartElement.appendChild(iframe);
  
  // Update the text information
  textElement.innerHTML = `
    <p><strong>${symbol}</strong> Stock Data</p>
    <p>View interactive chart in the frame above</p>
  `;
  
  // Add a refresh button
  const refreshBtn = document.createElement('button');
  refreshBtn.textContent = 'Refresh Data';
  refreshBtn.style.padding = '5px 10px';
  refreshBtn.style.backgroundColor = 'rgba(75, 192, 192, 0.2)';
  refreshBtn.style.color = '#D4D4D4';
  refreshBtn.style.border = 'none';
  refreshBtn.style.borderRadius = '4px';
  refreshBtn.style.cursor = 'pointer';
  refreshBtn.style.marginTop = '5px';
  
  refreshBtn.addEventListener('click', () => {
    // Reload the iframe with the same symbol
    iframe.src = `http://localhost:8502/?symbol=${encodeURIComponent(symbol)}`;
  });
  
  textElement.appendChild(refreshBtn);
}

// Original fetchStockData function for backward compatibility
function fetchStockData(chartElement, textElement, symbol) {
  fetchStockDataForSymbol(chartElement, textElement, symbol);
}

// Function to create an interactive chart
function createChart(container, data) {
  // Create a canvas element for the chart
  const canvas = document.createElement('canvas');
  container.innerHTML = '';
  container.appendChild(canvas);
  
  // Default to closing prices
  let activeDataset = 'closing';
  
  // Set up initial chart
  const chart = new Chart(canvas, {
    type: 'line',
    data: {
      labels: data.dates,
      datasets: [
        {
          label: `${data.symbol} Closing Price`,
          data: data[activeDataset],
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          tension: 0.1,
          fill: true,
          pointRadius: 3,
          pointHoverRadius: 6,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat('en-US', { 
                  style: 'currency', 
                  currency: 'USD' 
                }).format(context.parsed.y);
              }
              return label;
            }
          }
        },
        legend: {
          position: 'top',
          labels: {
            color: '#D4D4D4'
          }
        }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Date',
            color: '#D4D4D4'
          },
          ticks: {
            maxTicksLimit: 10,
            color: '#D4D4D4'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Price ($)',
            color: '#D4D4D4'
          },
          ticks: {
            color: '#D4D4D4',
            callback: function(value) {
              return value;
            }
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        }
      }
    }
  });
  
  // Add chart controls - toggle different data views
  const controls = document.createElement('div');
  controls.className = 'chart-controls';
  controls.style.margin = '10px 0';
  controls.style.display = 'flex';
  controls.style.justifyContent = 'center';
  controls.style.gap = '10px';
  
  const options = [
    { label: 'Closing', value: 'closing', color: 'rgb(75, 192, 192)' },
    { label: 'Opening', value: 'opening', color: 'rgb(255, 159, 64)' },
    { label: 'High', value: 'high', color: 'rgb(54, 162, 235)' },
    { label: 'Low', value: 'low', color: 'rgb(255, 99, 132)' }
  ];
  
  options.forEach(option => {
    const button = document.createElement('button');
    button.textContent = option.label;
    button.style.padding = '5px 10px';
    button.style.backgroundColor = option === 'closing' ? 'rgba(75, 192, 192, 0.2)' : 'rgba(25, 25, 25, 0.5)';
    button.style.color = '#D4D4D4';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    
    button.addEventListener('click', () => {
      // Update active dataset
      activeDataset = option.value;
      
      // Update chart data
      chart.data.datasets[0].data = data[activeDataset];
      chart.data.datasets[0].label = `${data.symbol} ${option.label} Price`;
      chart.data.datasets[0].borderColor = option.color;
      chart.data.datasets[0].backgroundColor = option.color.replace('rgb', 'rgba').replace(')', ', 0.1)');
      
      // Update all buttons styling
      controls.querySelectorAll('button').forEach(btn => {
        btn.style.backgroundColor = 'rgba(25, 25, 25, 0.5)';
      });
      
      // Highlight active button
      button.style.backgroundColor = `${option.color.replace('rgb', 'rgba').replace(')', ', 0.2)')}`;
      
      chart.update();
    });
    
    controls.appendChild(button);
  });
  
  // Add controls before the chart
  container.insertBefore(controls, canvas);
}

function renderChatWidget(grid) {
  // Create widget element
  const widgetElement = document.createElement('div');
  widgetElement.className = 'grid-stack-item-content';

  const widgetContent = document.createElement('div');
  widgetContent.className = 'widget-content chat-widget';
  widgetContent.style.display = 'flex';
  widgetContent.style.flexDirection = 'column';
  widgetContent.style.height = '100%';

  const title = document.createElement('h2');
  title.textContent = 'Chat Assistant';
  title.style.color = '#00FFC2';
  title.style.marginBottom = '10px';
  widgetContent.appendChild(title);

  // Create chat container
  const chatContainer = document.createElement('div');
  chatContainer.className = 'chat-container';
  chatContainer.style.flex = '1';
  chatContainer.style.overflowY = 'auto';
  chatContainer.style.padding = '10px';
  chatContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
  chatContainer.style.borderRadius = '8px';
  chatContainer.style.marginBottom = '10px';
  chatContainer.style.display = 'flex';
  chatContainer.style.flexDirection = 'column';
  widgetContent.appendChild(chatContainer);

  // Define chat history reference for use in processChat function
  const chatHistory = chatContainer;

  // Welcome message
  const welcomeMessage = document.createElement('div');
  welcomeMessage.className = 'chat-message system';
  welcomeMessage.innerHTML = `
    <div class="message-content">
      <p>👋 Welcome to the SimplyStocks Assistant! I can help you with:</p>
      <ul>
        <li>Explaining stock metrics and indicators</li>
        <li>Understanding widget functionality</li>
        <li>Providing market insights</li>
        <li>Navigating dashboard features</li>
      </ul>
      <p>How can I assist you today?</p>
    </div>
  `;
  welcomeMessage.style.backgroundColor = 'rgba(0, 255, 194, 0.1)';
  welcomeMessage.style.borderRadius = '8px';
  welcomeMessage.style.padding = '10px';
  welcomeMessage.style.marginBottom = '10px';
  welcomeMessage.style.alignSelf = 'flex-start';
  welcomeMessage.style.maxWidth = '85%';
  
  chatContainer.appendChild(welcomeMessage);

  // Input area
  const inputArea = document.createElement('div');
  inputArea.className = 'chat-input-area';
  inputArea.style.display = 'flex';
  inputArea.style.gap = '10px';

  const textInput = document.createElement('input');
  textInput.type = 'text';
  textInput.placeholder = 'Ask a question...';
  textInput.className = 'chat-input';
  textInput.style.flex = '1';
  textInput.style.padding = '10px';
  textInput.style.borderRadius = '4px';
  textInput.style.border = '1px solid #333';
  textInput.style.backgroundColor = '#242424';
  textInput.style.color = '#fff';

  const sendButton = document.createElement('button');
  sendButton.textContent = 'Send';
  sendButton.className = 'chat-send-btn';
  sendButton.style.backgroundColor = '#00FFC2';
  sendButton.style.color = '#1E1E1E';
  sendButton.style.border = 'none';
  sendButton.style.borderRadius = '4px';
  sendButton.style.padding = '10px 15px';
  sendButton.style.cursor = 'pointer';
  sendButton.addEventListener('mouseover', () => {
    sendButton.style.backgroundColor = '#00D1A1';
  });
  sendButton.addEventListener('mouseout', () => {
    sendButton.style.backgroundColor = '#00FFC2';
  });

  inputArea.appendChild(textInput);
  inputArea.appendChild(sendButton);
  widgetContent.appendChild(inputArea);

  // Add event listeners for the chat input
  const handleSendMessage = () => {
    const message = textInput.value.trim();
    if (message) {
      processChat(message);
      textInput.value = '';
    }
  };

  sendButton.addEventListener('click', handleSendMessage);
  
  textInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  });

  // Add remove button
  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn';
  removeBtn.textContent = 'x';
  removeBtn.setAttribute('title', 'Remove widget');
  widgetContent.appendChild(removeBtn);

  widgetElement.appendChild(widgetContent);

  // Add to grid
  const widget = grid.addWidget({ w: 6, h: 5, el: widgetElement });
  removeBtn.addEventListener('click', () => grid.removeWidget(widget));

  // Get active widgets and visible symbols
  const getActiveWidgets = () => {
    const widgets = [];
    document.querySelectorAll('.grid-stack-item').forEach(item => {
      const titleEl = item.querySelector('h2');
      if (titleEl) {
        widgets.push(titleEl.textContent.trim());
      }
    });
    return widgets;
  };

  // Get currently viewed symbols
  const getActiveSymbols = () => {
    const symbols = new Set();
    // Try to extract symbols from iframe URLs
    document.querySelectorAll('iframe').forEach(iframe => {
      if (iframe.src && iframe.src.includes('symbol=')) {
        const urlParams = new URLSearchParams(iframe.src.split('?')[1]);
        const symbol = urlParams.get('symbol');
        if (symbol) symbols.add(symbol);
      }
    });
    return Array.from(symbols);
  };

  // Chat processing function
  const processChat = async (userMessage) => {
    // Add user message to chat
    const userMessageEl = document.createElement('div');
    userMessageEl.className = 'chat-message user';
    userMessageEl.innerHTML = `<div class="message-content"><p>${userMessage}</p></div>`;
    userMessageEl.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    userMessageEl.style.borderRadius = '8px';
    userMessageEl.style.padding = '10px';
    userMessageEl.style.marginBottom = '10px';
    userMessageEl.style.alignSelf = 'flex-end';
    userMessageEl.style.maxWidth = '85%';
    chatContainer.appendChild(userMessageEl);

    // Add typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
    typingIndicator.style.backgroundColor = 'rgba(0, 255, 194, 0.1)';
    typingIndicator.style.borderRadius = '8px';
    typingIndicator.style.padding = '15px';
    typingIndicator.style.marginBottom = '10px';
    typingIndicator.style.alignSelf = 'flex-start';
    typingIndicator.style.width = '60px';
    typingIndicator.style.display = 'flex';
    typingIndicator.style.justifyContent = 'space-between';
    
    // Style the dots
    const style = document.createElement('style');
    style.textContent = `
      .typing-indicator .dot {
        width: 8px;
        height: 8px;
        background-color: #00FFC2;
        border-radius: 50%;
        animation: bounce 1.5s infinite;
      }
      .typing-indicator .dot:nth-child(2) {
        animation-delay: 0.2s;
      }
      .typing-indicator .dot:nth-child(3) {
        animation-delay: 0.4s;
      }
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }
    `;
    document.head.appendChild(style);
    
    chatContainer.appendChild(typingIndicator);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Initialize or retrieve conversation history
    if (!chatContainer.conversationHistory) {
      chatContainer.conversationHistory = [];
    }
    
    // Add user message to history
    chatContainer.conversationHistory.push({
      role: 'user',
      content: userMessage
    });
    
    // Keep conversation history to a reasonable size (last 10 messages)
    if (chatContainer.conversationHistory.length > 10) {
      chatContainer.conversationHistory = chatContainer.conversationHistory.slice(-10);
    }

    // Gather context from the dashboard
    const activeWidgets = getActiveWidgets();
    const activeSymbols = getActiveSymbols();
    
    // Create context object for the AI
    const context = {
      activeWidgets,
      activeSymbols,
      dashboardState: {
        hasStockData: activeWidgets.includes('Stock Values'),
        hasTechnicals: activeWidgets.includes('Technical Indicators'),
        hasFundamentals: activeWidgets.includes('Fundamental Indicators'),
        currentSymbols: activeSymbols.join(', ') || 'None'
      }
    };

    try {
      // Create the messages array with system prompt and conversation history
      const messages = [
        {
          role: 'system',
          content: `You are an AI assistant for the SimplyStocks dashboard application. 
          The dashboard displays financial data and stock information through various widgets.
          
          About SimplyStocks:
          SimplyStocks is an interactive financial dashboard that provides real-time stock data, 
          technical analysis, and fundamental metrics. It's designed to help both novice and 
          experienced investors make informed decisions by visualizing complex financial information.
          
          Dashboard features include:
          - Stock Values: Shows price data for stocks (open, high, low, close, volume)
          - Fundamental Indicators: Displays financial metrics like P/E ratio, EPS, market cap, debt-to-equity ratio
          - Technical Indicators: Shows technical analysis metrics (RSI, MACD, moving averages, Bollinger Bands)
          - Sentiment Analysis: Analyzes news sentiment for stocks using natural language processing
          - Balance Sheet Analysis: Displays company financial health data from quarterly/annual reports
          - FRED Rates: Shows Federal Reserve economic data (interest rates, treasury yields)
          - RRP Data: Displays Reverse Repo information for monitoring market liquidity
          - Treasury Issuance: Shows US Treasury debt issuance data and its market impact
          
          Data sources:
          - Stock price data: Alpha Vantage and Alpaca APIs
          - Fundamental data: Alpha Vantage's company overviews
          - News and sentiment: Alpha Vantage News API
          - FRED/Treasury/RRP data: Federal Reserve APIs
          
          Current dashboard state:
          - Active widgets: ${context.activeWidgets.join(', ') || 'None'}
          - Active stock symbols: ${context.dashboardState.currentSymbols}
          
          Provide concise, helpful responses about financial data, stock information, and how to use the dashboard.
          When explaining concepts, balance technical accuracy with accessibility.
          If you don't know specific data about a company or market condition, be transparent about your limitations.`
        }
      ];
      
      // Add conversation history to messages
      messages.push(...chatContainer.conversationHistory);

      // Format the messages for Gemini API
      const formattedMessages = messages.map(msg => {
        // Convert "system" role to "user" since Gemini doesn't have a system role
        const role = msg.role === 'system' ? 'user' : msg.role;
        return {
          role: role,
          parts: [{ text: msg.content }]
        };
      });
      
      // Call the Gemini API
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${window.ENV.AI_MODEL}:generateContent?key=${window.ENV.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: formattedMessages,
          generationConfig: {
            temperature: window.ENV.TEMPERATURE,
            maxOutputTokens: window.ENV.MAX_TOKENS,
            topP: 0.8,
            topK: 40
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract the response text from Gemini's response format
      const responseText = data.candidates[0].content.parts[0].text;
      
      // Add assistant response to conversation history
      chatContainer.conversationHistory.push({
        role: 'assistant',
        content: responseText
      });
      
      // Keep conversation history manageable (last 10 messages)
      if (chatContainer.conversationHistory.length > 20) {
        chatContainer.conversationHistory = chatContainer.conversationHistory.slice(-20);
      }
      
      // Remove the typing indicator
      typingIndicator.remove();
      
      // Add the assistant's response to the chat
      const assistantMessageEl = document.createElement('div');
      assistantMessageEl.className = 'message assistant-message';
      assistantMessageEl.textContent = responseText;
      chatHistory.appendChild(assistantMessageEl);
      
      // Scroll to the bottom of the chat
      chatHistory.scrollTop = chatHistory.scrollHeight;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      // Remove the typing indicator
      typingIndicator.remove();
      
      // Use local fallback model if API call fails
      const fallbackResponse = getLocalResponse(userMessage, context);
      
      // Add fallback response to conversation history
      chatContainer.conversationHistory.push({
        role: 'assistant',
        content: fallbackResponse
      });
      
      // Keep conversation history manageable
      if (chatContainer.conversationHistory.length > 20) {
        chatContainer.conversationHistory = chatContainer.conversationHistory.slice(-20);
      }
      
      // Add the fallback response to the chat
      const assistantMessageEl = document.createElement('div');
      assistantMessageEl.className = 'message assistant-message';
      assistantMessageEl.textContent = fallbackResponse;
      chatHistory.appendChild(assistantMessageEl);
      
      // Add fallback indicator
      const fallbackIndicator = document.createElement('div');
      fallbackIndicator.className = 'fallback-indicator';
      fallbackIndicator.textContent = '(Offline mode)';
      fallbackIndicator.style.fontSize = '10px';
      fallbackIndicator.style.fontStyle = 'italic';
      fallbackIndicator.style.color = '#888';
      fallbackIndicator.style.marginTop = '2px';
      assistantMessageEl.appendChild(fallbackIndicator);
      
      // Scroll to the bottom of the chat
      chatHistory.scrollTop = chatHistory.scrollHeight;
    }
  };

  // Fallback local model when API is unavailable
  const generateLocalFallbackResponse = (userMessage, context) => {
    const query = userMessage.toLowerCase();
    const { activeWidgets, activeSymbols, dashboardState } = context;
    
    // Access structured data from chat-data-sources.js if available
    const chatData = window.CHAT_DATA || {};
    const { financialTerms, dashboardFeatures, commonQuestions } = chatData;
    
    // Check for direct matches in common questions
    if (commonQuestions) {
      for (const item of commonQuestions) {
        if (query.includes(item.question.toLowerCase())) {
          return item.answer;
        }
      }
    }
    
    // Check for financial term definitions
    if (financialTerms) {
      for (const [term, data] of Object.entries(financialTerms)) {
        if (query.includes(term)) {
          // Format a comprehensive response based on the available term data
          let response = `${data.term}: ${data.definition}\n\n`;
          
          if (data.importance) {
            response += `Importance: ${data.importance}\n\n`;
          }
          
          if (data.interpretation) {
            if (typeof data.interpretation === 'string') {
              response += `Interpretation: ${data.interpretation}\n\n`;
            } else if (Array.isArray(data.interpretation)) {
              response += "Interpretation:\n";
              data.interpretation.forEach(item => {
                response += `• ${item.range || ''}: ${item.meaning || item}\n`;
              });
              response += "\n";
            }
          }
          
          if (data.example) {
            response += `Example: ${data.example}`;
          }
          
          if (data.components) {
            response += "Components:\n";
            data.components.forEach(comp => {
              response += `• ${comp.name}: ${comp.calculation || comp.description}\n`;
            });
          }
          
          if (data.signals) {
            response += "\nSignals:\n";
            data.signals.forEach(signal => {
              response += `• ${signal.name}: ${signal.meaning}\n`;
            });
          }
          
          return response;
        }
      }
    }
    
    // Check for dashboard feature explanations
    if (dashboardFeatures) {
      for (const [feature, data] of Object.entries(dashboardFeatures)) {
        if (query.includes(feature)) {
          let response = `${data.name}: ${data.description}\n\n`;
          
          if (data.dataShown && Array.isArray(data.dataShown)) {
            response += "Data shown:\n";
            data.dataShown.forEach(item => {
              response += `• ${item}\n`;
            });
            response += "\n";
          }
          
          if (data.metrics && Array.isArray(data.metrics)) {
            response += "Metrics included:\n";
            data.metrics.forEach(item => {
              response += `• ${item}\n`;
            });
            response += "\n";
          }
          
          if (data.indicators && Array.isArray(data.indicators)) {
            response += "Indicators included:\n";
            data.indicators.forEach(item => {
              response += `• ${item}\n`;
            });
            response += "\n";
          }
          
          if (data.dataSource) {
            response += `Data source: ${data.dataSource}\n`;
          }
          
          if (data.interpretation) {
            response += `\n${data.interpretation}`;
          }
          
          return response;
        }
      }
    }
    
    // Simple keyword-based response system as fallback
    if (query.includes('hello') || query.includes('hi ') || query === 'hi') {
      return "Hello! I'm your SimplyStocks assistant (offline mode). How can I help you with the dashboard today?";
    }
    
    // Dashboard navigation help
    if (query.includes('help') || query.includes('how') || query.includes('guide')) {
      if (query.includes('widget') || query.includes('add')) {
        return "To add widgets: Click the 'Add View' button at the top and select from the available options. Each widget provides different financial insights and can be moved or resized as needed.";
      }
      if (query.includes('search') || query.includes('find') || query.includes('stock')) {
        return "To search for a stock: Type the ticker symbol (e.g., AAPL for Apple) in the search bar at the top and press Enter. This will add a new widget with that stock's data.";
      }
      return "SimplyStocks Help (Offline Mode):\n• Search for stocks with the search bar\n• Add widgets with the 'Add View' button\n• Resize widgets by dragging their corners\n• Remove widgets with the X button";
    }
    
    // Widget-specific help based on context
    const activeWidgetsList = activeWidgets.join(' ').toLowerCase();
    if (activeWidgetsList.includes('technical') && (query.includes('technical') || query.includes('indicator'))) {
      return "The Technical Indicators widget shows various metrics used for technical analysis, including moving averages, RSI, MACD, and Bollinger Bands. These help identify trends, momentum, and potential reversal points in stock price movements.";
    }
    if (activeWidgetsList.includes('fundamental') && (query.includes('fundamental') || query.includes('financials'))) {
      return "The Fundamental Indicators widget displays key financial metrics like P/E ratio, EPS, market cap, and debt-to-equity ratio. These metrics help evaluate a company's financial health and intrinsic value.";
    }
    if (activeWidgetsList.includes('sentiment') && (query.includes('sentiment') || query.includes('news'))) {
      return "The Sentiment Analysis widget evaluates news and social media content to gauge market perception of a stock. It analyzes tone, relevance, and volume to provide insights into whether sentiment is positive, negative, or neutral.";
    }
    
    // Symbol-specific responses if symbols are present
    if (activeSymbols.length > 0 && query.includes('symbol')) {
      return `Currently displaying data for: ${activeSymbols.join(', ')}. You can add more symbols using the search bar at the top.`;
    }
    
    // Default fallback response
    return "I'm currently in offline mode with limited functionality. For more detailed information, please try again when the online AI service is available. In the meantime, I can help with basic dashboard navigation and financial term explanations.";
  };

  // Send message handler
  const sendMessage = () => {
    const userMessage = textInput.value.trim();
    if (userMessage) {
      processChat(userMessage);
      textInput.value = '';
    }
  };

  // Add event listeners for sending messages
  sendButton.addEventListener('click', sendMessage);
  textInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  // Focus the input field
  setTimeout(() => textInput.focus(), 100);
}

// Function to generate local responses when API is unavailable
function getLocalResponse(userMessage, context) {
  const message = userMessage.toLowerCase().trim();
  
  // Check for greetings
  if (/^(hi|hello|hey|greetings)/i.test(message)) {
    return "Hello! I'm your SimplyStocks assistant. How can I help you with your financial analysis today?";
  }
  
  // Check for thank you messages
  if (/thank|thanks/i.test(message)) {
    return "You're welcome! Let me know if you need any other assistance.";
  }
  
  // Check for help requests
  if (/help|assist|support/i.test(message)) {
    return "I can help you understand stock data, financial metrics, and how to use this dashboard. You can ask about specific widgets, financial terms, or how to analyze particular stocks.";
  }
  
  // Check for widget-related questions
  if (/widget|add widget|remove widget/i.test(message)) {
    return "To add a widget, click the 'Add View' button at the top of the dashboard. To remove a widget, click the X button in the top-right corner of any widget.";
  }
  
  // Check for stock-related questions
  if (/stock|price|symbol/i.test(message)) {
    const symbols = context.dashboardState.currentSymbols || [];
    if (symbols.length > 0) {
      return `You're currently viewing data for the following symbols: ${symbols.join(', ')}. You can search for other stocks using the search bar at the top.`;
    } else {
      return "You can search for stocks using the search bar at the top of the dashboard. Try entering a symbol like AAPL, MSFT, or GOOGL.";
    }
  }
  
  // Check for financial term definitions
  if (window.FINANCIAL_TERMS && window.FINANCIAL_TERMS[message]) {
    const term = window.FINANCIAL_TERMS[message];
    return `${term.definition} ${term.importance}`;
  }
  
  // Check for common questions
  if (window.COMMON_QUESTIONS) {
    for (const question in window.COMMON_QUESTIONS) {
      if (message.includes(question.toLowerCase())) {
        return window.COMMON_QUESTIONS[question];
      }
    }
  }
  
  // Default response
  return "I'm currently operating in offline mode with limited capabilities. I can help with basic questions about the dashboard and financial concepts. When online, I can provide more detailed analysis and information.";
}



