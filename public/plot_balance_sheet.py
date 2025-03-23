# plots/plot_balance_sheet.py

import matplotlib.pyplot as plt

def plot_balance_sheet(balance_df):
    plt.figure(figsize=(14, 6))

    delta_billions = balance_df['balance_sheet_delta'] / 1_000  # convert to billions

    plt.bar(balance_df.index, delta_billions, color='gray', alpha=0.6)
    plt.axhline(0, color='black', linewidth=0.8, linestyle='--')

    plt.title("Daily Fed Balance Sheet Change (Δ WALCL on Update Days)")
    plt.xlabel("Date")
    plt.ylabel("Change in Balance Sheet (Billion USD)")
    plt.grid(True)
    plt.tight_layout()
    plt.show()
