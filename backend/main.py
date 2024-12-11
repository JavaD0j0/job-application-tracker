"""
Module for handling API requests and responses.

This module provides functions for handling API requests and responses, including 
uploading and downloading job application Excel files, and analyzing and summarizing 
job application data.

Author: Mario Rodriguez
"""

import os
import logging
import json
from io import BytesIO
import pandas as pd
from fastapi import FastAPI, Request, File, UploadFile, HTTPException
from fastapi.responses import FileResponse, JSONResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from analysis import analyze_file

app = FastAPI()

# Scopes for accessing Google Sheets
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

# Serve React static files
app.mount("/static", StaticFiles(directory="build/static"), name="static")

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

# Placeholder to store user credentials and sheet ID
USER_CREDENTIALS = None
SHEET_ID = "14X_44OptxAmfQLgiw2VXzwA8g25uiGaRYZPvLg-ZIpQ"

@app.get("/")
async def serve_frontend():
    """
    Serve the React frontend entrypoint.

    Returns:
        A FileResponse containing the index.html from the React build directory.
    """
    return FileResponse("build/index.html")

@app.get("/authenticate")
def authenticate(request: Request):
    """
    Authenticate the user with Google and obtain access to their Google Sheets.
    """
    credentials_str = os.getenv('GOOGLE_CLIENT_SECRET')
    if not credentials_str:
        raise RuntimeError("GOOGLE_CLIENT_SECRET environment variable is not set")

    credentials_dict = json.loads(credentials_str)
    
    # Initialize the flow
    flow = InstalledAppFlow.from_client_config(credentials_dict, SCOPES)

    # Dynamically determine the redirect URI
    base_url = str(request.base_url).rstrip("/")
    flow.redirect_uri = f"{base_url}/authenticate/callback"
    logging.info("Redirect URI: %s", flow.redirect_uri)
    
    if "localhost" in base_url:
        os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'  # Allow HTTP for local development

    # Generate the authorization URL
    auth_url, _ = flow.authorization_url(prompt="consent")

    # Redirect the user to Google's OAuth consent page
    return RedirectResponse(auth_url)

@app.get("/authenticate/callback")
def authenticate_callback(request: Request):
    """
    Handle the callback from Google's OAuth server and complete the authentication.
    """
    global USER_CREDENTIALS

    # Load credentials from environment variable
    credentials_str = os.getenv("GOOGLE_CLIENT_SECRET")
    if not credentials_str:
        raise RuntimeError("GOOGLE_CLIENT_SECRET environment variable is not set")

    credentials_dict = json.loads(credentials_str)

    # Initialize the flow
    flow = InstalledAppFlow.from_client_config(credentials_dict, SCOPES)
    base_url = str(request.base_url).rstrip("/")
    flow.redirect_uri = f"{base_url}/authenticate/callback"
    logging.info("Redirect URI: %s", flow.redirect_uri)

    # Parse the authorization response
    auth_response = str(request.url)
    credentials = flow.fetch_token(authorization_response=auth_response)

    # Store the credentials for later use
    USER_CREDENTIALS = credentials
    frontend_url = (
        "https://job-application-tracker-3mct.onrender.com"
        if os.getenv("ENV") == "production"
        else "http://localhost:3000"
    )
    return RedirectResponse(frontend_url)

@app.post("/analyze-sheet")
async def analyze_sheet():
    """
    Send the data from a linked Google Sheet and receive analysis results in JSON format.

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
        # If a Google Sheet is linked, read from Google Sheets
        if SHEET_ID and USER_CREDENTIALS:
            logging.info("Reading data from linked Google Sheet...")
            service = build('sheets', 'v4', credentials=USER_CREDENTIALS)
            sheet = service.spreadsheets()
            result = sheet.values().get(spreadsheetId=SHEET_ID, range="Sheet1").execute()
            values = result.get('values', [])
            
            # Convert to pandas DataFrame
            df = pd.DataFrame(values[1:], columns=values[0])
            
        else:
            raise HTTPException(status_code=400, detail="No Google Sheet linked.")
        
        # Perform analysis
        analysis_results = analyze_file(df)

        return JSONResponse({
            'totalApplications': analysis_results['total_applications'],
            'remoteApplications': analysis_results['remote_applications'],
            'onsiteApplications': analysis_results['onsite_applications'],
            'pendingApplications': analysis_results['pending_applications'],
            'rejectedApplications': analysis_results['rejected_applications']
        })
    except Exception as e:
        logging.error("Error durring analysis: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="An error occurred while analyzing the file.") from e


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
