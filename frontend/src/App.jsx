import "./App.css";

const metrics = [
  { label: "CPU Usage", value: "32%", percent: 32 },
  { label: "Memory Usage", value: "68%", percent: 68 },
  { label: "Disk Usage", value: "74%", percent: 74 },
  { label: "System Uptime", value: "4d 8h", percent: null },
];

const processes = [
  { pid: 8576, name: "chrome.exe", cpu: 18.4, memory: 3.5 },
  { pid: 24004, name: "Code.exe", cpu: 8.1, memory: 2.8 },
  { pid: 22324, name: "system.exe", cpu: 5.6, memory: 2.3 },
  { pid: 47420, name: "chrome.exe", cpu: 4.2, memory: 2.1 },
  { pid: 18240, name: "explorer.exe", cpu: 1.8, memory: 1.4 },
];

const history = [28, 42, 35, 58, 46, 61, 49, 72, 54, 63, 45, 32];

function MetricCard({ label, value, percent }) {
  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>

      {percent !== null && (
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
    </div>
  );
}

function App() {
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
              <span className="muted">Recent activity</span>
            </div>

            <div className="chart">
              {history.map((value, index) => (
                <div
                  key={index}
                  className="chart-bar"
                  style={{ height: `${value}%` }}
                  title={`${value}%`}
                />
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <p className="panel-label">HEALTH</p>
                <h2>Active Alerts</h2>
              </div>
              <span className="alert-count">2</span>
            </div>

            <div className="alert warning">
              <div>
                <strong>Memory usage is high</strong>
                <p>Current usage has passed 85%.</p>
              </div>
              <span>Warning</span>
            </div>

            <div className="alert warning">
              <div>
                <strong>Disk space is running low</strong>
                <p>Disk usage has passed 90%.</p>
              </div>
              <span>Warning</span>
            </div>
          </div>
        </section>

        <section className="panel process-panel">
          <div className="panel-header">
            <div>
              <p className="panel-label">PROCESSES</p>
              <h2>Top Processes</h2>
            </div>
            <span className="muted">Sorted by resource usage</span>
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
                    <td className="process-name">{process.name}</td>
                    <td>{process.pid}</td>
                    <td>{process.cpu}%</td>
                    <td>{process.memory}%</td>
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
