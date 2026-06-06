with open("src/App.jsx", "r") as f:
    content = f.read()

start_idx = content.find('const RAW = JSON.parse(`') + len('const RAW = JSON.parse(`')
end_idx = content.find('`);', start_idx)

raw_str = content[start_idx:end_idx]

# In python, raw_str is just the raw text inside the backticks.
# Let's find index 232905 (give or take depending on newlines)
context = raw_str[232905-100:232905+100]
print("Context around 232905:")
print(context)

# Check for backslashes, backticks
print(f"Backslashes: {raw_str.count(chr(92))}")
print(f"Backticks: {raw_str.count('`')}")
print(f"${{ : {raw_str.count('${')}")
