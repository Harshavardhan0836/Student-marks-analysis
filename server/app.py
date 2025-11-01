import os
import datetime
import pandas as pd
from helper import extract_data_from_folder
from db import save_to_mysql, save_to_local_sqlite

# ✅ Automatically pick today's folder
today_str = datetime.datetime.now().strftime("%d-%m-%Y")
folder_path = os.path.join("./uploads", today_str)

csv_output_file = f"./output/result_{today_str}.csv"

print(f"📁 Checking folder: {folder_path}")

if not os.path.exists(folder_path):
    print(f"❌ Folder not found: {folder_path}")
else:
    df = extract_data_from_folder(folder_path)

    if not df.empty:
        os.makedirs("./output", exist_ok=True)
        df.to_csv(csv_output_file, index=False, encoding="utf-8-sig")
        print(f"✅ Extraction complete. Results saved to {csv_output_file}")
        save_to_local_sqlite(df, db_path=f"./output/student_results_{today_str}.db")

        save_to_mysql(df)
        
    else:
        print("⚠️ No data extracted. Please check the PDF files or extraction logic.")
