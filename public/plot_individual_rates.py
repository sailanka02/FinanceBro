import matplotlib.pyplot as plt

def plot_nvidia_with_individual_rate(stock_df, selected_maturity):
    fig, ax1 = plt.subplots(figsize=(12, 6))

    ax1.plot(stock_df.index, stock_df['close'], label='Nvidia Closing Price', color='blue')
    ax1.set_xlabel('Date')
    ax1.set_ylabel('Price ($)', color='blue')
    ax1.tick_params(axis='y', labelcolor='blue')

    skip = max(1, len(stock_df.index) // 10)
    ax1.set_xticks(stock_df.index[::skip])
    ax1.set_xticklabels([x.strftime('%Y-%m-%d') for x in stock_df.index[::skip]], rotation=45)

    ax2 = ax1.twinx()
    ax2.plot(stock_df.index, stock_df['rate'], label=f'{selected_maturity} Treasury Yield', color='green')
    ax2.set_ylabel('Interest Rate (%)', color='green')
    ax2.tick_params(axis='y', labelcolor='green')

    plt.title(f'Nvidia vs {selected_maturity} Treasury Yield')
    fig.tight_layout()
    plt.grid(True)
    plt.show()
