/**
 * Application Engine for Industrial Connectivity MCDA Matrix (GitHub Pages)
 * O Plataforma Studio (SKA) - 20 Soluções, 15 Critérios
 */

let currentWeights = {};
let currentFilterLicense = 'all';
let currentSearchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
  initWeights();
  renderPresetButtons();
  renderSliders();
  setupEventListeners();
  recalculateAndRender();
});

// Initialize default weights
function initWeights() {
  CRITERIA_DEFINITIONS.forEach(c => {
    currentWeights[c.id] = c.weight;
  });
}

// Render Preset Scenario Buttons
function renderPresetButtons() {
  const container = document.getElementById('presetsContainer');
  if (!container) return;

  container.innerHTML = PRESETS.map((p, idx) => `
    <button class="preset-chip ${idx === 0 ? 'active' : ''}" data-preset-id="${p.id}" title="${p.desc}">
      ${p.name}
    </button>
  `).join('');

  container.querySelectorAll('.preset-chip').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const presetId = btn.getAttribute('data-preset-id');
      applyPreset(presetId);
      
      container.querySelectorAll('.preset-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

// Apply Selected Preset
function applyPreset(presetId) {
  const preset = PRESETS.find(p => p.id === presetId);
  if (!preset) return;

  CRITERIA_DEFINITIONS.forEach(c => {
    currentWeights[c.id] = preset.weights[c.id] !== undefined ? preset.weights[c.id] : 5;
    const slider = document.getElementById(`slider-${c.id}`);
    const valDisplay = document.getElementById(`val-${c.id}`);
    if (slider) slider.value = currentWeights[c.id];
    if (valDisplay) valDisplay.textContent = currentWeights[c.id];
  });

  recalculateAndRender();
}

// Render Sliders List with Hover Tooltips
function renderSliders() {
  const container = document.getElementById('slidersList');
  if (!container) return;

  container.innerHTML = CRITERIA_DEFINITIONS.map(c => `
    <div class="slider-group">
      <div class="slider-label">
        <span class="criteria-name-tooltip" data-tooltip="${c.desc}">
          ${c.icon} ${c.name} <span class="info-icon" title="${c.desc}">ℹ️</span>
        </span>
        <span class="slider-val" id="val-${c.id}">${currentWeights[c.id]}</span>
      </div>
      <input type="range" id="slider-${c.id}" min="0" max="10" step="1" value="${currentWeights[c.id]}" data-criteria-id="${c.id}" title="${c.desc}" />
    </div>
  `).join('');

  container.querySelectorAll('input[type="range"]').forEach(input => {
    input.addEventListener('input', (e) => {
      const id = input.getAttribute('data-criteria-id');
      const val = parseInt(input.value, 10);
      currentWeights[id] = val;
      document.getElementById(`val-${id}`).textContent = val;
      
      // Deactivate active preset chips since custom weights are selected
      document.querySelectorAll('.preset-chip').forEach(b => b.classList.remove('active'));
      
      recalculateAndRender();
    });
  });
}

// Calculate Scores for all Solutions
function calculateScores() {
  const totalMaxWeight = Object.values(currentWeights).reduce((a, b) => a + (b * 10), 0);

  return SOLUTIONS.map(sol => {
    let weightedSum = 0;
    Object.keys(currentWeights).forEach(cid => {
      const w = currentWeights[cid];
      const s = sol.scores[cid] !== undefined ? sol.scores[cid] : 5;
      weightedSum += w * s;
    });

    const fitScorePct = totalMaxWeight > 0 ? (weightedSum / totalMaxWeight) * 100 : 0;

    return {
      ...sol,
      fitScorePct: Math.round(fitScorePct * 10) / 10,
      weightedSum
    };
  }).sort((a, b) => b.fitScorePct - a.fitScorePct);
}

// Recalculate and Update UI
function recalculateAndRender() {
  const rankedSolutions = calculateScores();
  
  // Filter solutions for table display
  const filteredSolutions = rankedSolutions.filter(sol => {
    const matchesLicense = currentFilterLicense === 'all' || sol.licenseType.toLowerCase() === currentFilterLicense.toLowerCase();
    const matchesSearch = sol.name.toLowerCase().includes(currentSearchQuery.toLowerCase()) || 
                          sol.vendor.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
                          sol.execType.toLowerCase().includes(currentSearchQuery.toLowerCase());
    return matchesLicense && matchesSearch;
  });

  renderPodium(rankedSolutions);
  renderTable(filteredSolutions);
}

// Render Top 3 Winners Podium
function renderPodium(rankedSolutions) {
  const container = document.getElementById('podiumContainer');
  if (!container) return;

  const gold = rankedSolutions[0];
  const silver = rankedSolutions[1];
  const bronze = rankedSolutions[2];

  if (!gold) return;

  container.innerHTML = `
    <!-- GOLD CARD (#1) -->
    <div class="winner-card gold">
      <span class="winner-badge">🥇 #1 RECOMENDADA</span>
      <h3>${gold.name}</h3>
      <p class="winner-vendor">${gold.vendor} | ${gold.licenseType}</p>
      <div class="score-display">
        <span class="score-num">${gold.fitScorePct}%</span>
        <span class="score-label">Adequação aos Pesos</span>
      </div>
      <p class="winner-summary">${gold.summary}</p>
      <div class="winner-footer">
        <button class="btn btn-primary" onclick="openModal('${gold.id}')" style="width: 100%; justify-content: center;">
          🔍 Ver Análise Técnica Completa
        </button>
      </div>
    </div>

    <!-- SILVER CARD (#2) -->
    ${silver ? `
    <div class="winner-card silver">
      <span class="winner-badge">🥈 #2 LUGAR</span>
      <h3>${silver.name}</h3>
      <p class="winner-vendor">${silver.vendor} | ${silver.licenseType}</p>
      <div class="score-display">
        <span class="score-num" style="color: var(--silver);">${silver.fitScorePct}%</span>
        <span class="score-label">Adequação</span>
      </div>
      <p class="winner-summary">${silver.summary}</p>
      <div class="winner-footer">
        <button class="btn" onclick="openModal('${silver.id}')" style="width: 100%; justify-content: center;">
          🔍 Detalhes Técnicos
        </button>
      </div>
    </div>
    ` : ''}

    <!-- BRONZE CARD (#3) -->
    ${bronze ? `
    <div class="winner-card bronze">
      <span class="winner-badge">🥉 #3 LUGAR</span>
      <h3>${bronze.name}</h3>
      <p class="winner-vendor">${bronze.vendor} | ${bronze.licenseType}</p>
      <div class="score-display">
        <span class="score-num" style="color: var(--bronze);">${bronze.fitScorePct}%</span>
        <span class="score-label">Adequação</span>
      </div>
      <p class="winner-summary">${bronze.summary}</p>
      <div class="winner-footer">
        <button class="btn" onclick="openModal('${bronze.id}')" style="width: 100%; justify-content: center;">
          🔍 Detalhes Técnicos
        </button>
      </div>
    </div>
    ` : ''}
  `;
}

// Render Comparison Matrix Table
function renderTable(solutions) {
  const tbody = document.getElementById('matrixTbody');
  if (!tbody) return;

  if (solutions.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">Nenhuma solução encontrada com os filtros aplicados.</td></tr>`;
    return;
  }

  tbody.innerHTML = solutions.map((sol, index) => {
    let licenseBadgeClass = 'badge-commercial';
    if (sol.licenseType === 'Free') licenseBadgeClass = 'badge-free';
    if (sol.licenseType === 'Dual') licenseBadgeClass = 'badge-dual';

    return `
      <tr>
        <td><div class="rank-pill">${index + 1}</div></td>
        <td>
          <div class="solution-name">${sol.name}</div>
          <div class="solution-vendor">${sol.vendor}</div>
        </td>
        <td><span class="badge-tag ${licenseBadgeClass}">${sol.licenseText}</span></td>
        <td style="color: var(--text-light);">${sol.execType}</td>
        <td>
          <div style="display: flex; gap: 4px; font-size: 0.75rem; flex-wrap: wrap;">
            <span title="Cobertura CNC" style="background: rgba(0,210,255,0.1); padding: 2px 5px; border-radius: 3px;">⚙️ ${sol.scores.cnc}</span>
            <span title="Cobertura PLC" style="background: rgba(0,210,255,0.1); padding: 2px 5px; border-radius: 3px;">🔌 ${sol.scores.plc}</span>
            <span title="Store & Forward" style="background: rgba(0,210,255,0.1); padding: 2px 5px; border-radius: 3px;">🛡️ ${sol.scores.sf}</span>
            <span title="Gestão de Frota" style="background: rgba(0,210,255,0.1); padding: 2px 5px; border-radius: 3px;">📡 ${sol.scores.fleet}</span>
            <span title="Edge Analytics" style="background: rgba(0,210,255,0.1); padding: 2px 5px; border-radius: 3px;">🧠 ${sol.scores.analytics}</span>
          </div>
        </td>
        <td>
          <div class="fit-bar-container">
            <div class="fit-bar-bg">
              <div class="fit-bar-fill" style="width: ${sol.fitScorePct}%;"></div>
            </div>
            <span class="fit-percentage">${sol.fitScorePct}%</span>
          </div>
        </td>
        <td>
          <button class="btn" onclick="openModal('${sol.id}')" style="padding: 5px 10px; font-size: 0.8rem;">
            Ver Análise
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// Open Technical Details Modal
function openModal(solutionId) {
  const sol = SOLUTIONS.find(s => s.id === solutionId);
  if (!sol) return;

  const modal = document.getElementById('techModal');
  const body = document.getElementById('modalBody');
  if (!modal || !body) return;

  body.innerHTML = `
    <div class="modal-header">
      <h2>${sol.name}</h2>
      <p style="color: var(--text-light); margin-top: 4px;">${sol.vendor} | <strong>${sol.licenseText}</strong></p>
    </div>

    <div class="modal-grid">
      <div class="detail-item full-width">
        <h4>📋 Resumo Executivo</h4>
        <p>${sol.summary}</p>
      </div>

      <div class="detail-item">
        <h4>🖥️ Tipo de Execução & Arquitetura</h4>
        <p>${sol.details.tipoExecucao}</p>
      </div>

      <div class="detail-item">
        <h4>⚙️ Cobertura de Fabricantes CNC</h4>
        <p>${sol.details.coberturaCNC}</p>
      </div>

      <div class="detail-item">
        <h4>🔌 Cobertura de Fabricantes PLC</h4>
        <p>${sol.details.coberturaPLC}</p>
      </div>

      <div class="detail-item">
        <h4>🛡️ Resiliência Offline (Store & Forward)</h4>
        <p>${sol.details.storeAndForward}</p>
      </div>

      <div class="detail-item">
        <h4>🔒 Segurança & Criptografia</h4>
        <p>${sol.details.seguranca}</p>
      </div>

      <div class="detail-item">
        <h4>🏛️ Maturidade da Solução</h4>
        <p>${sol.details.maturidade}</p>
      </div>

      <div class="detail-item">
        <h4>🧩 Extensibilidade & Novos Protocolos</h4>
        <p>${sol.details.extensibilidade}</p>
      </div>

      <div class="detail-item">
        <h4>🚀 Esforço de Implantação</h4>
        <p>${sol.details.esforcoImplantacao}</p>
      </div>

      <!-- Novos Critérios Estratégicos -->
      <div class="detail-item">
        <h4>📡 Gestão de Frota (Fleet Management)</h4>
        <p>${sol.details.gestaoFrota || 'Disponível via console administrativo ou orquestradores de borda.'}</p>
      </div>

      <div class="detail-item">
        <h4>🔎 Autodescoberta (Tag Browsing)</h4>
        <p>${sol.details.autodescoberta || 'Suporte a importação visual e varredura de rede.'}</p>
      </div>

      <div class="detail-item">
        <h4>✍️ Escrita Bi-direcional (Write-Back)</h4>
        <p>${sol.details.escritaBiDirecional || 'Suporte a envio de comandos e escrita em registradores.'}</p>
      </div>

      <div class="detail-item">
        <h4>🧠 Edge Analytics & Lógica Local</h4>
        <p>${sol.details.edgeAnalytics || 'Processamento local e regras de agregação no Edge.'}</p>
      </div>

      <div class="detail-item full-width" style="border-color: var(--cyan-accent); background: rgba(0, 210, 255, 0.05);">
        <h4 style="color: var(--cyan-accent);">⚡ Compatibilidade com O Plataforma Studio (C# .NET / MQTT / gRPC)</h4>
        <p>${sol.details.compatibilidadeStudio}</p>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

// Close Modal
function closeModal() {
  const modal = document.getElementById('techModal');
  if (modal) modal.classList.remove('active');
}

// Setup Event Listeners
function setupEventListeners() {
  // Reset weights button
  const btnReset = document.getElementById('btnResetWeights');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      applyPreset('balanced');
      document.querySelectorAll('.preset-chip').forEach((b, idx) => {
        b.classList.toggle('active', idx === 0);
      });
    });
  }

  // Search input
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      recalculateAndRender();
    });
  }

  // License filter select
  const filterSelect = document.getElementById('licenseFilterSelect');
  if (filterSelect) {
    filterSelect.addEventListener('change', (e) => {
      currentFilterLicense = e.target.value;
      recalculateAndRender();
    });
  }

  // Export CSV button
  const btnExport = document.getElementById('btnExportCSV');
  if (btnExport) {
    btnExport.addEventListener('click', exportCSV);
  }

  // Modal overlay click close
  const modal = document.getElementById('techModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
}

// Export CSV Report
function exportCSV() {
  const ranked = calculateScores();
  let csv = 'Rank;Solução;Desenvolvedor;Tipo Licença;Adequação (%)\n';

  ranked.forEach((r, idx) => {
    csv += `${idx + 1};"${r.name}";"${r.vendor}";"${r.licenseType}";${r.fitScorePct}%\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'Ranking_Conectividade_Plataforma_Studio.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
