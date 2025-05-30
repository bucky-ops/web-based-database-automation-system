import os
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from dotenv import load_dotenv
import psycopg2
from psycopg2 import sql

# Load environment variables
load_dotenv()

def get_db_connection():
    """Create a database connection."""
    return psycopg2.connect(
        host=os.getenv('DB_HOST'),
        database=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD')
    )

def fetch_data(query):
    """Fetch data from the database."""
    conn = get_db_connection()
    try:
        df = pd.read_sql_query(query, conn)
        return df
    finally:
        conn.close()

def preprocess_data(df):
    """Preprocess the data for analysis."""
    # Remove duplicates
    df = df.drop_duplicates()
    
    # Handle missing values
    df = df.fillna(df.mean())
    
    return df

def analyze_data(df):
    """Perform basic data analysis."""
    analysis = {
        'summary': df.describe(),
        'correlations': df.corr(),
        'missing_values': df.isnull().sum()
    }
    return analysis

def main():
    # Example query
    query = "SELECT * FROM your_table LIMIT 1000"
    
    # Fetch and process data
    df = fetch_data(query)
    df_processed = preprocess_data(df)
    
    # Perform analysis
    analysis_results = analyze_data(df_processed)
    
    # Print results
    print("\nData Summary:")
    print(analysis_results['summary'])
    
    print("\nCorrelations:")
    print(analysis_results['correlations'])
    
    print("\nMissing Values:")
    print(analysis_results['missing_values'])

if __name__ == "__main__":
    main() 