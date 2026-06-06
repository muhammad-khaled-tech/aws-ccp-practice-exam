import json
import re

with open("src/App.jsx", "r") as f:
    content = f.read()

# Find the start of the RAW string
start_idx = content.find('const RAW = JSON.parse(`') + len('const RAW = JSON.parse(`')
end_idx = content.find('`);', start_idx)

raw_str = content[start_idx:end_idx]

print(f"Length of RAW string: {len(raw_str)}")

try:
    data = json.loads(raw_str)
    print("Parsed successfully!")
except json.JSONDecodeError as e:
    print(f"Error parsing JSON: {e}")
    # Print the context around the error
    pos = e.pos
    print("Context around error:")
    print(raw_str[max(0, pos-50):pos] + ">>>" + raw_str[pos:min(len(raw_str), pos+50)])
