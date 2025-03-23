# plot_term_structure.py
import matplotlib.pyplot as plt

def plot_term_structure(yield_df):
    latest_yields = yield_df.iloc[-1]

    plt.figure(figsize=(10, 6))
    plt.plot(latest_yields.index, latest_yields.values, marker='o', linestyle='-', color='purple')
    plt.title(f"U.S. Treasury Yield Curve as of {latest_yields.name.date()}")
    plt.xlabel('Maturity')
    plt.ylabel('Yield (%)')
    plt.grid(True)
    plt.tight_layout()
    plt.show()
