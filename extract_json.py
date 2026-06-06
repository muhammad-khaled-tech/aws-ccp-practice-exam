import json

with open("src/App.jsx", "r") as f:
    content = f.read()

start_idx = content.find('const RAW = JSON.parse(`') + len('const RAW = JSON.parse(`')
end_idx = content.find('`);\n', start_idx)

raw_str = content[start_idx:end_idx]

# Parse it in python (which correctly understands the json without template literal issues)
try:
    data = json.loads(raw_str)
    with open("src/questions.json", "w") as f:
        json.dump(data, f, indent=2)
    print("Extracted to src/questions.json")
    
    # Now replace the raw string in App.jsx
    new_content = content[:content.find('const RAW = JSON.parse(`')] + 'import RAW from "./questions.json";\n' + content[end_idx+4:]
    with open("src/App.jsx", "w") as f:
        f.write(new_content)
    print("Updated src/App.jsx")
except Exception as e:
    print(f"Error: {e}")
