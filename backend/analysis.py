# Author: Mario Rodriguez

from pathlib import Path
import pandas as pd

RESULT_FOLDER = Path("results")
RESULT_FOLDER.mkdir(exist_ok=True)

def analyze_file(filepath):
    """
    Analyzes a job application Excel file and returns summarized insights.

    Parameters:
    filepath (str or Path): The file path to the Excel file containing job application data.

    Returns:
    tuple: A dictionary containing the analysis results and the filename of the saved Excel file.

    The function performs the following operations:
    1. Reads the Excel file into a DataFrame.
    2. Renames columns for standardized access.
    3. Cleans the data by removing rows with missing values in essential columns.
    4. Converts the 'Application_Date' column to datetime format and filters out unparseable dates.
    5. Counts total applications, remote applications, onsite applications, and various status counts.
    6. Saves the cleaned and analyzed data to a new Excel file in the results folder.
    """

    # Read the Excel file
    data = pd.read_excel(filepath)

    # Rename columns for easy access
    data.columns = [
        "Company", "Role_Title", "Salary_Rate", "Job_Link", "Application_Date",
        "Is_Remote", "Contact_Info", "Interview_Stage", "Interview_Info", "Response_Status"
    ]

    # Drop any rows with null values in essential columns (e.g., Company, Role_Title)
    data = data.dropna(subset=["Company", "Role_Title", "Application_Date"])

    # Convert 'Application_Date' column to datetime format
    data['Application_Date'] = pd.to_datetime(data['Application_Date'], errors='coerce')

    # Filter out rows where 'Application_Date' could not be parsed
    data = data.dropna(subset=["Application_Date"])

    # Count total applications
    total_applications = len(data)

    # Count remote and onsite applications
    remote_applications = data[data['Is_Remote'] == 'Yes'].shape[0]
    onsite_applications = data[data['Is_Remote'] == 'No'].shape[0]

    # Count application statuses
    pending_applications = data[data['Response_Status'] == 'Waiting...'].shape[0]
    rejected_applications = data[data['Response_Status'] == 'Rejected'].shape[0]

    # Generate analysis results
    total_applications = len(data)
    remote_applications = data[data['Is_Remote'] == 'Yes'].shape[0]
    onsite_applications = data[data['Is_Remote'] == 'No'].shape[0]
    pending_applications = data[data['Response_Status'] == 'Waiting...'].shape[0]
    rejected_applications = data[data['Response_Status'] == 'Rejected'].shape[0]
    
    # Generate summary dictionary
    analysis_results = {
        'total_applications': total_applications,
        'remote_applications': remote_applications,
        'onsite_applications': onsite_applications,
        'pending_applications': pending_applications,
        'rejected_applications': rejected_applications
    }
    
    # Save the cleaned and analyzed data to a new Excel file in the results folder
    # output_filename = f"Analysis_{filepath.stem}.xlsx"
    # output_filepath = RESULT_FOLDER / output_filename
    # data.to_excel(output_filepath, index=False)
    
    # return analysis_results, output_filename
    return analysis_results