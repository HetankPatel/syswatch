from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_status_endpoint():
    response = client.get("/api/status")

    assert response.status_code == 200
    assert response.json() == {
        "message": "SysWatch backend is running"
    }


def test_system_endpoint(monkeypatch):
    fake_metrics = {
        "cpu_percent": 25.0,
        "memory_percent": 60.0,
        "memory_used_gb": 9.0,
        "memory_total_gb": 16.0,
        "disk_percent": 70.0,
        "disk_used_gb": 140.0,
        "disk_total_gb": 200.0,
        "uptime_seconds": 3600,
    }

    monkeypatch.setattr(
        "app.main.get_system_metrics",
        lambda: fake_metrics,
    )

    monkeypatch.setattr(
        "app.main.save_metrics",
        lambda metrics: "2026-11-21T12:00:00+00:00",
    )

    response = client.get("/api/system")

    assert response.status_code == 200
    data = response.json()

    assert data["cpu_percent"] == 25.0
    assert data["memory_percent"] == 60.0
    assert data["disk_percent"] == 70.0
    assert data["uptime_seconds"] == 3600


def test_process_limit_validation():
    response = client.get("/api/processes?limit=0")

    assert response.status_code == 422


def test_alerts_endpoint(monkeypatch):
    fake_metrics = {
        "cpu_percent": 20.0,
        "memory_percent": 92.0,
        "disk_percent": 95.0,
    }

    monkeypatch.setattr(
        "app.main.get_system_metrics",
        lambda: fake_metrics,
    )

    response = client.get("/api/alerts")

    assert response.status_code == 200

    alerts = response.json()["alerts"]

    assert len(alerts) == 2
    assert alerts[0]["metric"] == "memory"
    assert alerts[1]["metric"] == "disk"
