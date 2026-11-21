import { useCallback, useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000/api";

function formatUptime(seconds) {
  if (seconds === undefined || seconds === null) {
    return "--";
  }

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

function MetricCard({ label, value, percent }) {
  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>

      {percent !== null && percent !== undefined && (
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}

function App() {
  const [system, setSystem] = useState(null);
  const [processes, setProcesses] = useState([]);
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const [
        systemResponse,
        processResponse,
        historyResponse,
        alertResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/system`),
        fetch(`${API_URL}/processes?limit=8`),
        fetch(`${API_URL}/history?limit=20`),
        fetch(`${API_URL}/alerts`),
      ]);

      if (
        !systemResponse.ok ||
        !processResponse.ok ||
        !historyResponse.ok ||
        !alertResponse.ok
      ) {
        throw new Error("Unable to load system data");
      }

      const systemData = await systemResponse.json();
      const processData = await processResponse.json();
      const historyData = await historyResponse.json();
      const alertData = await alertResponse.json();

      setSystem(systemData);
      setProcesses(processData);
      setHistory(historyData);
      setAlerts(alertData.alerts);
      setError("");
      setLastUpdated(new Date());
    } catch {
      setError("Unable to connect to the SysWatch backend.");
    }
  }, []);

  useEffect(() => {
    loadData();

    const interval = setInterval(loadData, 5000);

    return () => clearInterval(interval);
  }, [loadData]);

  const metrics = system
    ? [
        {
          label: "CPU Usage",
          value: `${system.cpu_percent}%`,
          percent: system.cpu_percent,
        },
        {
          label: "Memory Usage",
          value: `${system.memory_percent}%`,
          percent: system.memory_percent,
        },
        {
          label: "Disk Usage",
          value: `${system.disk_percent}%`,
          percent: system.disk_percent,
        },
        {
          label: "System Uptime",
          value: formatUptime(system.uptime_seconds),
          percent: null,
        },
      ]
    : [
        { label: "CPU Usage", value: "--", percent: 0 },
        { label: "Memory Usage", value: "--", percent: 0 },
        { label: "Disk Usage", value: "--", percent: 0 },
        { label: "System Uptime", value: "--", percent: null },
      ];

  return (
    <div className="app">
      <aside className="sidebar">
        <div>
          <div className="brand">SysWatch</div>
          <div className="brand-subtitle">System Monitor</div>
        </div>

        <nav>
          <button className="nav-item active">Overview</button>
          <button className="nav-item">Processes</button>
          <button className="nav-item">History</button>
          <button className="nav-item">Alerts</button>
        </nav>

        <div className="system-status">
          <span className="status-dot"></span>
          System online
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">SYSTEM MONITORING</p>
            <h1>System Overview</h1>
            <p className="subtitle">
              Monitor performance, processes and system health.
            </p>
          </div>

          <div className="live-badge">
            <span className="status-dot"></span>
            Live
          </div>
        </header>

        {error && <div className="error-message">{error}</div>}

        <section className="metric-grid">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </section>

        <section className="content-grid">
          <div className="panel">
            <div className="panel-header">
              <div>
                <p className="panel-label">PERFORMANCE</p>
                <h2>CPU History</h2>
              </div>

              <span className="muted">
                {lastUpdated
                  ? `Updated ${lastUpdated.toLocaleTimeString()}`
                  : "Loading..."}
              </span>
            </div>

            <div className="chart">
              {history.length > 0 ? (
                history.map((record, index) => (
                  <div
                    key={`${record.timestamp}-${index}`}
                    className="chart-bar"
                    style={{
                      height: `${Math.max(record.cpu_percent, 3)}%`,
                    }}
                    title={`${record.cpu_percent}%`}
                  />
                ))
              ) : (
                <p className="empty-message">
                  Waiting for metric history...
                </p>
              )}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <p className="panel-label">HEALTH</p>
                <h2>Active Alerts</h2>
              </div>

              <span className="alert-count">
                {alerts.length}
              </span>
            </div>

            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <div
                  className="alert warning"
                  key={alert.metric}
                >
                  <div>
                    <strong>{alert.message}</strong>
                    <p>
                      Current: {alert.value}% · Threshold:{" "}
                      {alert.threshold}%
                    </p>
                  </div>

                  <span>Warning</span>
                </div>
              ))
            ) : (
              <p className="empty-message">
                No active alerts. System health looks good.
              </p>
            )}
          </div>
        </section>

        <section className="panel process-panel">
          <div className="panel-header">
            <div>
              <p className="panel-label">PROCESSES</p>
              <h2>Top Processes</h2>
            </div>

            <span className="muted">
              Highest memory usage
            </span>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Process</th>
                  <th>PID</th>
                  <th>CPU</th>
                  <th>Memory</th>
                </tr>
              </thead>

              <tbody>
                {processes.map((process) => (
                  <tr key={process.pid}>
                    <td className="process-name">
                      {process.name}
                    </td>
                    <td>{process.pid}</td>
                    <td>{process.cpu_percent}%</td>
                    <td>{process.memory_percent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
