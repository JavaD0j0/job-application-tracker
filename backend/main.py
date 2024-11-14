# Author: Mario Rodriguez

import sys
from pathlib import Path

# Set the root directory as the main module path
root_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(root_dir))

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from analysis import analyze_file

app = FastAPI()

# Path to the React build directory in `frontend`
static_dir = Path(__file__).resolve().parent.parent / "frontend" / "build"
if not static_dir.is_dir():
    raise RuntimeError(f"Build directory not found at {static_dir}")

# Serve React static files
app.mount("/static", StaticFiles(directory=static_dir / "static"), name="static")

# Enable CORS for frontend-backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Adjust for frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = Path("uploads")
RESULT_FOLDER = Path("results")
UPLOAD_FOLDER.mkdir(exist_ok=True)
RESULT_FOLDER.mkdir(exist_ok=True)

@app.get("/")
async def serve_frontend():
    """
    Serve the React frontend entrypoint.

    Returns:
        A FileResponse containing the index.html from the React build directory.
    """
    return FileResponse(static_dir / "index.html")

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
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an Excel file.")

    # Save the uploaded file
    upload_path = UPLOAD_FOLDER / file.filename
    with upload_path.open("wb") as f:
        f.write(file.file.read())

    # Perform analysis
    # analysis_results, output_filename = analyze_file(upload_path)
    analysis_results = analyze_file(upload_path)

    return JSONResponse({
        'totalApplications': analysis_results['total_applications'],
        'remoteApplications': analysis_results['remote_applications'],
        'onsiteApplications': analysis_results['onsite_applications'],
        'pendingApplications': analysis_results['pending_applications'],
        'rejectedApplications': analysis_results['rejected_applications']
        # 'filename': output_filename
    })

# @app.get("/download/{filename}")
# async def download_file(filename: str):
#     file_path = RESULT_FOLDER / filename
#     if not file_path.exists():
#         raise HTTPException(status_code=404, detail="File not found.")
#     return FileResponse(path=file_path, filename=filename, media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
