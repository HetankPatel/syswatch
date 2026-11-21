from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from app.alerts import get_alerts
from app.history import (
    get_metric_history,
    initialize_database,
    save_metrics,
)
from app.monitor import get_processes, get_system_metrics


initialize_database()

app = FastAPI(
    title="SysWatch API",
    description="System monitoring API for SysWatch",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/status")
def get_status():
    return {
        "message": "SysWatch backend is running"
    }


@app.get("/api/system")
def system_metrics():
    metrics = get_system_metrics()
    timestamp = save_metrics(metrics)

    return {
        "timestamp": timestamp,
        **metrics,
    }


@app.get("/api/processes")
def processes(
    limit: int = Query(default=20, ge=1, le=100)
):
    return get_processes(limit)


@app.get("/api/history")
def metric_history(
    limit: int = Query(default=60, ge=1, le=500)
):
    return get_metric_history(limit)


@app.get("/api/alerts")
def alerts():
    metrics = get_system_metrics()

    return {
        "alerts": get_alerts(metrics)
    }
