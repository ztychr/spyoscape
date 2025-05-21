import json, sys
from collections import OrderedDict

input_filename = sys.argv[1]
output_filename = 'sorted_output.json'

with open(input_filename, 'r', encoding='utf-8') as f:
    data = json.load(f)

sorted_data = OrderedDict(sorted(data.items(), key=lambda item: item[0].lower()))

with open(output_filename, 'w', encoding='utf-8') as f:
    json.dump(sorted_data, f, ensure_ascii=False, indent=2)

print(f"Sorted JSON saved to '{output_filename}'")
