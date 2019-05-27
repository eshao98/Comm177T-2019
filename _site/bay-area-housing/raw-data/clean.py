"""
Splitting city name from zip code.
"""

import pandas as pd
import csv

df = pd.read_csv("test-data.csv", sep=",")

# Split city on "(", keep first split as zip code
# and last split as city.

split = df["zip-code"].str.split(" - ")
df["zip-code"] = split.str[0]
df["city"] = split.str[-1]

df = df[["zip-code", "city", "county", "2018-county-housing-wage"]]

# Write altered dataframe to file
df.to_csv("zip-code-city.csv", sep=",", index=False)