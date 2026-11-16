CPU_THRESHOLD = 90
MEMORY_THRESHOLD = 85
DISK_THRESHOLD = 90


def get_alerts(metrics):
    alerts = []

    if metrics["cpu_percent"] >= CPU_THRESHOLD:
        alerts.append({
            "metric": "cpu",
            "severity": "warning",
            "message": "CPU usage is high",
            "value": metrics["cpu_percent"],
            "threshold": CPU_THRESHOLD,
        })

    if metrics["memory_percent"] >= MEMORY_THRESHOLD:
        alerts.append({
            "metric": "memory",
            "severity": "warning",
            "message": "Memory usage is high",
            "value": metrics["memory_percent"],
            "threshold": MEMORY_THRESHOLD,
        })

    if metrics["disk_percent"] >= DISK_THRESHOLD:
        alerts.append({
            "metric": "disk",
            "severity": "warning",
            "message": "Disk space is running low",
            "value": metrics["disk_percent"],
            "threshold": DISK_THRESHOLD,
        })

    return alerts
