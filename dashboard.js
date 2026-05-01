/* ============================================================
   HCC Risk Scoring System — Dashboard Logic (dashboard.js)
   ============================================================ */

let allPatients = [];
let rafChart, hccChart, trendChart;

// ── INIT ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  allPatients = loadPatients();
  renderKPIs();
  renderTable(allPatients);
  renderCharts();
  setupSidebarToggle();
});

// ── SIDEBAR TOGGLE ──────────────────────────────────────────────
function setupSidebarToggle() {
  const btn  = document.getElementById('sidebarToggle');
  const sb   = document.getElementById('sidebar');
  const main = document.getElementById('mainContent');
  if (!btn) return;
  btn.addEventListener('click', () => {
    sb.classList.toggle('collapsed');
    main.classList.toggle('expanded');
    btn.textContent = sb.classList.contains('collapsed') ? '›' : '‹';
  });
}

// ── KPI CARDS ───────────────────────────────────────────────────
function renderKPIs() {
  const high  = allPatients.filter(p => p.risk === 'High').length;
  const avgR  = (allPatients.reduce((s,p) => s + p.raf, 0) / allPatients.length).toFixed(2);
  const gaps  = allPatients.reduce((s,p) => s + p.alerts.length, 0);

  animCount('totalPatients', allPatients.length);
  animCount('highRiskCount', high);
  document.getElementById('avgRaf').textContent = avgR;
  animCount('codingGaps', gaps);
}

function animCount(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let current = 0;
  const step  = Math.max(1, Math.floor(target / 30));
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, 30);
}

// ── PATIENT TABLE ────────────────────────────────────────────────
function renderTable(patients) {
  const tbody = document.getElementById('patientTableBody');
  if (!tbody) return;

  if (patients.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:32px;color:var(--text-muted)">No patients found</td></tr>`;
    return;
  }

  tbody.innerHTML = patients.map(p => {
    const rafPct  = Math.min(100, (p.raf / 4) * 100);
    const rafCol  = p.raf >= 2 ? '#ef4444' : p.raf >= 1.2 ? '#f59e0b' : '#22c55e';
    const badgeCls = p.risk === 'High' ? 'badge-high' : p.risk === 'Moderate' ? 'badge-mod' : 'badge-low';
    return `<tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <div style="width:30px;height:30px;border-radius:50%;background:var(--blue-dim);
               display:flex;align-items:center;justify-content:center;
               font-size:11px;font-weight:600;color:var(--blue);flex-shrink:0">
            ${p.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
          </div>
          <div>
            <div style="font-weight:500;font-size:13px">${p.name}</div>
            <div style="font-size:11px;color:var(--text-muted)">${p.gender}, ${p.age}y</div>
          </div>
        </div>
      </td>
      <td class="mono" style="font-size:11px;color:var(--text-muted)">${p.mrn}</td>
      <td>${p.age}</td>
      <td>
        <div class="raf-bar-wrap">
          <div class="raf-bar">
            <div class="raf-bar-fill" style="width:${rafPct}%;background:${rafCol}"></div>
          </div>
          <span class="raf-val">${p.raf.toFixed(2)}</span>
        </div>
      </td>
      <td>${p.hccs.length}</td>
      <td><span class="badge ${badgeCls}">${p.risk}</span></td>
      <td style="color:var(--text-muted);font-size:12px">${p.lastScored}</td>
      <td>
        <div style="display:flex;gap:6px">
          <button class="btn-sm" onclick="openModal('${p.id}')">View</button>
          <button class="btn-sm" onclick="window.location.href='pages/scoring.html?id=${p.id}'">Score</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

// ── FILTER TABLE ─────────────────────────────────────────────────
function filterTable() {
  const q    = (document.getElementById('searchBox')?.value || '').toLowerCase();
  const risk = document.getElementById('riskFilter')?.value || '';
  const filtered = allPatients.filter(p =>
    (!q    || p.name.toLowerCase().includes(q) || p.mrn.includes(q)) &&
    (!risk || p.risk === risk)
  );
  renderTable(filtered);
}

// ── MODAL ─────────────────────────────────────────────────────────
function openModal(id) {
  const p = allPatients.find(pt => pt.id === id);
  if (!p) return;

  document.getElementById('modalTitle').textContent = p.name + ' — Risk Profile';

  const badgeCls = p.risk === 'High' ? 'badge-high' : p.risk === 'Moderate' ? 'badge-mod' : 'badge-low';

  const hccTags = p.hccs.map(h => {
    const cat = HCC_CATEGORIES[h];
    return `<span class="hcc-tag">
      <span class="hcc-tag-code">${h}</span>
      ${cat ? cat.desc : ''} 
      <span style="color:var(--text-muted);font-size:10px">(+${cat ? cat.raf.toFixed(3) : '—'})</span>
    </span>`;
  }).join('');

  const diagRows = p.diagnoses.map(d => {
    const hccCat = HCC_CATEGORIES[d.hcc];
    return `<tr>
      <td class="mono" style="font-size:11px;color:var(--blue)">${d.icd}</td>
      <td style="font-size:12px">${hccCat ? hccCat.desc : d.hcc}</td>
      <td class="mono" style="font-size:11px">${d.hcc}</td>
      <td style="font-size:12px;font-weight:500">${hccCat ? hccCat.raf.toFixed(3) : '—'}</td>
      <td><span class="badge ${d.status==='Confirmed'?'badge-blue':'badge-pending'}" style="font-size:10px">${d.status}</span></td>
    </tr>`;
  }).join('');

  const alertItems = p.alerts.map(a =>
    `<div class="alert-item"><div class="alert-dot"></div><span>${a}</span></div>`
  ).join('');

  document.getElementById('modalBody').innerHTML = `
    <div class="detail-grid">
      <div class="detail-section">
        <div class="detail-section-title">Patient Info</div>
        <div class="detail-row"><span class="detail-label">MRN</span><span class="detail-value">${p.mrn}</span></div>
        <div class="detail-row"><span class="detail-label">DOB</span><span class="detail-value">${p.dob}</span></div>
        <div class="detail-row"><span class="detail-label">Gender</span><span class="detail-value">${p.gender === 'M' ? 'Male' : 'Female'}</span></div>
        <div class="detail-row"><span class="detail-label">Plan</span><span class="detail-value">${p.plan}</span></div>
        <div class="detail-row"><span class="detail-label">Last Scored</span><span class="detail-value">${p.lastScored}</span></div>
      </div>
      <div class="detail-section">
        <div class="detail-section-title">Risk Summary</div>
        <div class="detail-row"><span class="detail-label">RAF Score</span><span class="detail-value" style="font-size:18px;color:var(--blue)">${p.raf.toFixed(2)}</span></div>
        <div class="detail-row"><span class="detail-label">Risk Level</span><span class="badge ${badgeCls}">${p.risk}</span></div>
        <div class="detail-row"><span class="detail-label">Demo Score</span><span class="detail-value">${p.demoScore.toFixed(2)}</span></div>
        <div class="detail-row"><span class="detail-label">Chronic Score</span><span class="detail-value">${p.chronicScore.toFixed(2)}</span></div>
        <div class="detail-row"><span class="detail-label">Est. Annual Cost</span><span class="detail-value">${formatCurrency(estimateCost(p.raf))}</span></div>
      </div>
    </div>
    <div class="detail-section" style="margin-bottom:14px">
      <div class="detail-section-title">Active HCC Conditions</div>
      <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px">${hccTags}</div>
    </div>
    <div class="detail-section" style="margin-bottom:14px">
      <div class="detail-section-title">Diagnosis Codes</div>
      <div style="overflow-x:auto">
        <table class="data-table" style="margin-top:4px">
          <thead><tr><th>ICD-10</th><th>Description</th><th>HCC</th><th>RAF</th><th>Status</th></tr></thead>
          <tbody>${diagRows}</tbody>
        </table>
      </div>
    </div>
    <div class="detail-section">
      <div class="detail-section-title">Coding Alerts</div>
      <div style="margin-top:8px">${alertItems}</div>
    </div>
    <div style="margin-top:16px;display:flex;gap:8px">
      <button class="btn-primary" onclick="window.location.href='pages/scoring.html?id=${p.id}'">Open Full Score Report</button>
      <button class="btn-ghost" onclick="window.location.href='pages/icd-mapper.html'">ICD Mapper</button>
      <button class="btn-ghost" onclick="closeModal()">Close</button>
    </div>
  `;
  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modalOverlay')?.classList.remove('open');
}

// ── CHARTS ────────────────────────────────────────────────────────
const CHART_DEFAULTS = {
  color: '#e8eaf0',
  gridColor: 'rgba(255,255,255,0.05)',
  fontFamily: "'DM Sans', sans-serif"
};

function chartFont() {
  return { family: CHART_DEFAULTS.fontFamily, size: 11 };
}

function renderCharts() {
  renderRAFChart();
  renderHCCChart();
  renderTrendChart();
}

function renderRAFChart() {
  const ctx = document.getElementById('rafChart');
  if (!ctx) return;

  const bins  = [0, 0, 0, 0, 0];
  const labels = ['<0.5','0.5–1.0','1.0–1.5','1.5–2.0','2.0+'];
  allPatients.forEach(p => {
    if (p.raf < 0.5)       bins[0]++;
    else if (p.raf < 1.0)  bins[1]++;
    else if (p.raf < 1.5)  bins[2]++;
    else if (p.raf < 2.0)  bins[3]++;
    else                   bins[4]++;
  });

  if (rafChart) rafChart.destroy();
  rafChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data: bins,
        backgroundColor: ['#22c55e','#22c55e','#f59e0b','#f59e0b','#ef4444'],
        borderRadius: 5,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: CHART_DEFAULTS.gridColor }, ticks: { color: CHART_DEFAULTS.color, font: chartFont() } },
        y: { grid: { color: CHART_DEFAULTS.gridColor }, ticks: { color: CHART_DEFAULTS.color, font: chartFont(), stepSize: 1 } }
      }
    }
  });
}

function renderHCCChart() {
  const ctx = document.getElementById('hccChart');
  if (!ctx) return;

  const freq = {};
  allPatients.forEach(p => p.hccs.forEach(h => { freq[h] = (freq[h]||0) + 1; }));
  const sorted = Object.entries(freq).sort((a,b) => b[1]-a[1]).slice(0, 6);
  const labels = sorted.map(([k]) => k);
  const vals   = sorted.map(([,v]) => v);

  if (hccChart) hccChart.destroy();
  hccChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data: vals,
        backgroundColor: 'rgba(59,130,246,0.55)',
        borderColor: '#3b82f6',
        borderWidth: 1,
        borderRadius: 5,
        borderSkipped: false
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: CHART_DEFAULTS.gridColor }, ticks: { color: CHART_DEFAULTS.color, font: chartFont(), stepSize: 1 } },
        y: { grid: { color: CHART_DEFAULTS.gridColor }, ticks: { color: CHART_DEFAULTS.color, font: chartFont() } }
      }
    }
  });
}

function renderTrendChart() {
  const ctx = document.getElementById('trendChart');
  if (!ctx) return;

  const months = ['Nov','Dec','Jan','Feb','Mar','Apr'];
  const avg    = months.map((_, i) =>
    +(allPatients.reduce((s, p) => s + (p.trend[i] || 0), 0) / allPatients.length).toFixed(2)
  );
  const highAvg = months.map((_, i) => {
    const hp = allPatients.filter(p => p.risk === 'High');
    return +(hp.reduce((s, p) => s + (p.trend[i] || 0), 0) / hp.length).toFixed(2);
  });

  if (trendChart) trendChart.destroy();
  trendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Avg RAF',
          data: avg,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,0.08)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#3b82f6',
          pointRadius: 4
        },
        {
          label: 'High Risk Avg',
          data: highAvg,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239,68,68,0.06)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#ef4444',
          pointRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: CHART_DEFAULTS.gridColor }, ticks: { color: CHART_DEFAULTS.color, font: chartFont() } },
        y: { grid: { color: CHART_DEFAULTS.gridColor }, ticks: { color: CHART_DEFAULTS.color, font: chartFont() } }
      }
    }
  });
}

// ── REFRESH ─────────────────────────────────────────────────────
function refreshData() {
  allPatients = loadPatients();
  renderKPIs();
  renderTable(allPatients);
  renderCharts();
  showToast('✓ Data refreshed');
}
