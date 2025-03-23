import matplotlib.pyplot as plt
import pandas as pd

def plot_treasury_issuance_composition(df):
    if df.empty:
        print("⚠️ No data to plot.")
        return

    df = df.copy()
    df.set_index("auction_date", inplace=True)
    grouped = df.groupby([pd.Grouper(freq='D'), 'security_type'])['issuance'].sum()
    pivoted = grouped.unstack(fill_value=0)

    pivoted.plot(kind='bar', stacked=True, figsize=(14, 6), width=0.8)
    plt.title("Daily Treasury Issuance by Type")
    plt.xlabel("Date")
    plt.ylabel("Total Issued ($)")
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.grid(True, axis='y')
    plt.legend(title="Security Type")
    plt.show()


