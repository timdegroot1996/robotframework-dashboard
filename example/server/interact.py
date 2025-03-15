# usage: python interact.py

import requests

# get the outputs in the database in a list of dicts
response = requests.get('http://127.0.0.1:8543/get-outputs')
print(response.json())
print('\n')

# add an output to the database
body = {
  "output_path": "C:\\users\\docs\\output.xml",
  "output_tags": [
    "tag1",
    "cool-tag2",
    "production_tag"
  ]
}
response = requests.post('http://127.0.0.1:8543/add-outputs', json=body)
print(response.json())
print('\n')

# remove some outputs from the database
body = {
  "runs": [
    "0",
    "-1",
    "2025-03-13 00:22:22.304104"
  ]
}
response = requests.delete('http://127.0.0.1:8543/remove-outputs', json=body)
print(response.json())