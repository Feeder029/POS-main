import pandas as pd
from tabulate import tabulate
def read_csv():
    file_path = "Reciept_Info.csv"  # File path
    try:
        df = pd.read_csv(file_path)  # Read CSV file
        print(tabulate(df, headers='keys', tablefmt='grid'))  # Display data in table format
    except Exception as e:
        print(f"Error: {e}")

# Call the function
read_csv()