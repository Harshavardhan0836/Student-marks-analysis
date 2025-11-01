import pdfplumber
import re
import os
import pandas as pd


def extract_text_from_pdf(pdf_path):
    """Extract text from a given PDF file."""
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text


def parse_pdf_text(text):
    """Parse student information and subject data from the PDF text."""
    # Extract main student details
    student_info = {
        "University Seat Number": re.search(r'University\s+Seat\s+Number\s*:\s*(\S+)', text),
        "Student Name": re.search(r'Student\s+Name\s*:\s*(.+)', text),
        "Semester": re.search(r'Semester\s*:\s*(\S+)', text)
    }

    # Clean and normalize details
    for key, value in student_info.items():
        student_info[key] = value.group(1).strip() if value else "N/A"

    # Extract subject details
    pattern = r'([A-Z0-9]+)\s+([A-Za-z\s&]+?)\s+(\d+)\s+(\d+)\s+(\d+)\s+([A-Z])\s+(\d{4}-\d{2}-\d{2})'
    matches = re.findall(pattern, text)

    subjects = []
    for match in matches:
        subjects.append({
            "Subject Code": match[0],
            "Subject Name": match[1].strip(),
            "Internal Marks": int(match[2]),
            "External Marks": int(match[3]),
            "Total Marks": int(match[4]),
            "Result": match[5],
            "Announced Date": match[6]
        })

    return student_info, subjects


def extract_year_and_department(file_name):
    """Extract year and department info from the PDF filename."""
    # Example filename: 4GW21CI001.pdf
    base_name = os.path.splitext(file_name)[0].upper()

    if len(base_name) < 7:
        return "Unknown", "Unknown"

    year_code = base_name[3:5]  # e.g., '21'
    dept_code = base_name[5:7]  # e.g., 'CI'

    # Map department code to full name
    dept_map = {
        "CI": "AIML",
        "AD": "AIDS",
        "CS": "CSEA"
    }

    department = dept_map.get(dept_code, "Unknown")

    # Convert '21' → '2021', '22' → '2022', etc.
    try:
        year = f"20{int(year_code)}"
    except ValueError:
        year = "Unknown"

    return year, department


def prepare_student_row(student_info, subjects, year, department):
    """Prepare one single line per student for the Excel sheet."""
    row = {
        "Department": department,
        "Year": year,
        "Semester": student_info.get("Semester", "N/A"),
        "University Seat Number": student_info.get("University Seat Number", "N/A"),
        "Student Name": student_info.get("Student Name", "N/A")
    }

    # Add subject-wise data dynamically
    for i, sub in enumerate(subjects, start=1):
        row[f"Subject Code {i}"] = sub.get("Subject Code", "N/A")
        row[f"Subject Name {i}"] = sub.get("Subject Name", "N/A")
        row[f"Internal Marks {i}"] = sub.get("Internal Marks", "N/A")
        row[f"External Marks {i}"] = sub.get("External Marks", "N/A")
        row[f"Total Marks {i}"] = sub.get("Total Marks", "N/A")
        row[f"Result {i}"] = sub.get("Result", "N/A")

    # Totals across all subjects
    if subjects:
        row["Total Internal Marks"] = sum(sub["Internal Marks"] for sub in subjects)
        row["Total External Marks"] = sum(sub["External Marks"] for sub in subjects)
        row["Grand Total Marks"] = sum(sub["Total Marks"] for sub in subjects)
    else:
        row["Total Internal Marks"] = 0
        row["Total External Marks"] = 0
        row["Grand Total Marks"] = 0
        row["Note"] = "No subject data found"

    return row


def extract_data_from_folder(folder_path):
    """
    Process all PDF files in a folder and return a combined DataFrame.
    Each student appears on one row with all subjects in the same line.
    """
    all_rows = []

    for file_name in os.listdir(folder_path):
        if file_name.lower().endswith(".pdf"):
            pdf_path = os.path.join(folder_path, file_name)
            year, department = extract_year_and_department(file_name)
            text = extract_text_from_pdf(pdf_path)
            student_info, subjects = parse_pdf_text(text)
            student_row = prepare_student_row(student_info, subjects, year, department)
            all_rows.append(student_row)

    return pd.DataFrame(all_rows)
