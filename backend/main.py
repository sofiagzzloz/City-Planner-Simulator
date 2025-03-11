from fastapi import FastAPI, HTTPException
from supabase import create_client, Client
import os
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

# Add this **before** defining routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change to frontend URL in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (POST, GET, OPTIONS, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Get Supabase credentials
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase credentials not set. Check your .env file.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.get("/")
async def root():
    return {"message": "Welcome to the City Planner API!"}

@app.post("/save-layout/")
async def save_layout(layout: dict):
    try:
        print("Saving Layout:", layout)  # ✅ Debugging
        response = supabase.table("city_layouts").insert({
            "grid_data": json.dumps(layout["grid_data"])
        }).execute()

        print("Supabase Save Response:", response.data)  # ✅ Debugging

        if response.data:
            return {"message": "City layout saved!", "id": response.data[0]["id"]}
    except Exception as e:
        print("Error saving layout:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

    raise HTTPException(status_code=400, detail="Failed to save layout")


@app.get("/load-layout/{layout_id}")
async def load_layout(layout_id: str):
    try:
        response = supabase.table("city_layouts").select("*").eq("id", layout_id).single().execute()
        
        if response.data:
            layout_data = json.loads(response.data["grid_data"])  # Convert JSON string back to a Python object
            return {"layout": {"grid_data": layout_data}}  # Ensure it's structured correctly

        raise HTTPException(status_code=404, detail="Layout not found")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/get-layouts/")
async def get_layouts():
    try:
        response = supabase.table("city_layouts").select("id").execute()
        if response.data:
            return {"layouts": response.data}
        return {"layouts": []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    