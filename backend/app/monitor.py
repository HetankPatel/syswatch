import os
import time

import psutil


def get_system_metrics():
    memory = psutil.virtual_memory()
    disk = psutil.disk_usage(os.path.abspath(os.sep))
    boot_time = psutil.boot_time()

    return {
        "cpu_percent": psutil.cpu_percent(interval=0.2),
        "memory_percent": memory.percent,
        "memory_used_gb": round(memory.used / (1024 ** 3), 2),
        "memory_total_gb": round(memory.total / (1024 ** 3), 2),
        "disk_percent": disk.percent,
        "disk_used_gb": round(disk.used / (1024 ** 3), 2),
        "disk_total_gb": round(disk.total / (1024 ** 3), 2),
        "uptime_seconds": int(time.time() - boot_time),
    }


def get_processes(limit=20):
    processes = []

    for process in psutil.process_iter(
        ["pid", "name", "cpu_percent", "memory_percent"]
    ):
        try:
            info = process.info

            processes.append({
                "pid": info["pid"],
                "name": info["name"] or "Unknown",
                "cpu_percent": round(
                    info["cpu_percent"] or 0,
                    1
                ),
                "memory_percent": round(
                    info["memory_percent"] or 0,
                    1
                ),
            })
        except (
            psutil.NoSuchProcess,
            psutil.AccessDenied,
        ):
            continue

    processes.sort(
        key=lambda item: item["memory_percent"],
        reverse=True,
    )

    return processes[:limit]
