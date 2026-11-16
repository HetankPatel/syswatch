from fastapi import FastAPI, Query

from app.monitor import get_processes, get_system_metrics

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


@app.get("/api/system")
def system_metrics():
    return get_system_metrics()


@app.get("/api/processes")
def processes(
    limit: int = Query(default=20, ge=1, le=100)
):
    return get_processes(limit)
