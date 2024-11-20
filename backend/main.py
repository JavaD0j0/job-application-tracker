"""
Module for handling API requests and responses.

This module provides functions for handling API requests and responses, including 
uploading and downloading job application Excel files, and analyzing and summarizing 
job application data.

Author: Mario Rodriguez
"""

import sys
import logging
from pathlib import Path
from io import BytesIO
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.analysis import analyze_file

app = FastAPI()

# Serve React static files
app.mount("/static", StaticFiles(directory="backend/build/static"), name="static")

# Configure logging
logging.basicConfig(level=logging.INFO)

# Configure CORS
origins = [
    "http://localhost:3000", # Allow local development
    "https://job-application-tracker-3mct.onrender.com", # Allow production deployment 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def serve_frontend():
    """
    Serve the React frontend entrypoint.

    Returns:
        A FileResponse containing the index.html from the React build directory.
    """
    return FileResponse("backend/build/index.html")

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Upload an Excel file and receive analysis results in JSON format.

    Args:
        file: The Excel file to be analyzed.

    Returns:
        A JSON response containing the analysis results with the following keys:

        totalApplications: The total number of applications
        remoteApplications: The number of remote applications
        onsiteApplications: The number of onsite applications
        pendingApplications: The number of pending applications
        rejectedApplications: The number of rejected applications

    Raises:
        HTTPException: If the file is not an Excel file (with .xlsx or .xls extension)
    """
    try:
        if not file.filename.endswith(('.xlsx', '.xls')):
            raise HTTPException(status_code=400, detail="Invalid file type. Please upload an Excel file.")

        file_stream = BytesIO(await file.read())

        # Perform analysis
        file_size = file_stream.getbuffer().nbytes
        logging.info("Uploaded file size: %s", file_size)
        analysis_results = analyze_file(file_stream)

        return JSONResponse({
            'totalApplications': analysis_results['total_applications'],
            'remoteApplications': analysis_results['remote_applications'],
            'onsiteApplications': analysis_results['onsite_applications'],
            'pendingApplications': analysis_results['pending_applications'],
            'rejectedApplications': analysis_results['rejected_applications']
            # 'filename': output_filename
        })
    except Exception as e:
        logging.error("Error durring file upload: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="An error occurred during file upload.") from e


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
