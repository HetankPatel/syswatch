from fastapi import FastAPI

app = FastAPI(
    title="SysWatch API",
    description="System monitoring API for SysWatch",
    version="1.0.0",
)


@app.get("/api/status")
def get_status():
    return {
        "message": "SysWatch backend is running"
    }
