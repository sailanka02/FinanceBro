# plots/plot_rrp.py

import matplotlib.pyplot as plt

def plot_rrp(rrp_df):
    """
    Plots the Fed Reverse Repo daily total quantity.

    Args:
        rrp_df (pd.DataFrame): Must contain datetime index and 'rrp' column.
    """

    plt.figure(figsize=(12, 6))
    plt.plot(rrp_df.index, rrp_df['rrp'], color='orange', marker='o', linestyle='-')

    plt.title("Daily Reverse Repo (RRP) Usage")
    plt.xlabel("Date")
    plt.ylabel("RRP Volume (Millions of USD)")
    plt.xticks(rotation=45)
    plt.grid(True, axis='y')
    plt.tight_layout()
    plt.show()
