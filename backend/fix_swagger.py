import os
import re

directory = r"c:\etudes\SEM6\Approfondissement au developpement web\ProjetAtlas\backend\app\Http\Controllers\Api\V1"

for filename in os.listdir(directory):
    if filename.endswith(".php"):
        filepath = os.path.join(directory, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Replace response=200 with response="200"
        content = re.sub(r'response=(\d+)', r'response="\1"', content)
        
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Fixed responses in {filename}")
