const teamNames = [
  'Equipo A', 'Equipo B', 'Equipo C', 'Equipo D', 'Equipo E', 'Equipo F', 'Equipo G', 'Equipo H'
];

const rounds = ['Jornada 1', 'Jornada 2', 'Jornada 3', 'Jornada 4', 'Jornada 5', 'Jornada 6'];

const fixtures = [
  ['Equipo A', 'Equipo B'], ['Equipo C', 'Equipo D'], ['Equipo E', 'Equipo F'], ['Equipo G', 'Equipo H'],
  ['Equipo A', 'Equipo C'], ['Equipo B', 'Equipo D'], ['Equipo E', 'Equipo G'], ['Equipo F', 'Equipo H'],
  ['Equipo A', 'Equipo D'], ['Equipo B', 'Equipo C'], ['Equipo E', 'Equipo H'], ['Equipo F', 'Equipo G'],
  ['Equipo A', 'Equipo E'], ['Equipo B', 'Equipo F'], ['Equipo C', 'Equipo G'], ['Equipo D', 'Equipo H'],
  ['Equipo A', 'Equipo F'], ['Equipo B', 'Equipo G'], ['Equipo C', 'Equipo H'], ['Equipo D', 'Equipo E'],
  ['Equipo A', 'Equipo G'], ['Equipo B', 'Equipo H'], ['Equipo C', 'Equipo E'], ['Equipo D', 'Equipo F']
];

function seededGoalValue(teamName, roundIndex, variance) {
  const base = (teamName.charCodeAt(0) + roundIndex * 3 + variance) % 3;
  return base + 0;
}

function simulateMatch(roundIndex, homeName, awayName) {
  const homeSeed = homeName.charCodeAt(0) + roundIndex * 2;
  const awaySeed = awayName.charCodeAt(0) + roundIndex * 3;
  const homeGoals = Math.max(0, (homeSeed % 4) + (roundIndex % 2));
  const awayGoals = Math.max(0, (awaySeed % 3) + ((roundIndex + 1) % 2));
  return {
    round: rounds[roundIndex],
    opponentA: homeName,
    opponentB: awayName,
    homeGoals,
    awayGoals,
    winner: homeGoals === awayGoals ? 'draw' : homeGoals > awayGoals ? homeName : awayName
  };
}

function buildMatchData() {
  const matchData = [];
  fixtures.forEach((fixture, index) => {
    const roundIndex = Math.floor(index / 4);
    const match = simulateMatch(roundIndex, fixture[0], fixture[1]);
    matchData.push({
      round: match.round,
      roundIndex,
      home: match.opponentA,
      away: match.opponentB,
      homeGoals: match.homeGoals,
      awayGoals: match.awayGoals,
      winner: match.winner,
      homeScore: match.homeGoals,
      awayScore: match.awayGoals
    });
  });
  return matchData;
}

const allMatches = buildMatchData();

function createInitialStandings() {
  const standings = teamNames.map(team => ({
    team,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
    pointsByRound: []
  }));

  return standings;
}

function filterMatchesByRound(roundValue) {
  if (!roundValue || roundValue === 'all') return allMatches;
  const selectedIndex = Number(roundValue);
  return allMatches.filter(match => match.roundIndex <= selectedIndex);
}

function buildStandings(roundValue, selectedTeam) {
  const standings = createInitialStandings();
  const filteredMatches = filterMatchesByRound(roundValue);

  filteredMatches.forEach(match => {
    const home = standings.find(team => team.team === match.home);
    const away = standings.find(team => team.team === match.away);

    if (!home || !away) return;

    home.played += 1;
    away.played += 1;
    home.goalsFor += match.homeGoals;
    home.goalsAgainst += match.awayGoals;
    away.goalsFor += match.awayGoals;
    away.goalsAgainst += match.homeGoals;

    if (match.homeGoals > match.awayGoals) {
      home.wins += 1;
      away.losses += 1;
      home.points += 3;
    } else if (match.homeGoals < match.awayGoals) {
      away.wins += 1;
      home.losses += 1;
      away.points += 3;
    } else {
      home.draws += 1;
      away.draws += 1;
      home.points += 1;
      away.points += 1;
    }
  });

  standings.forEach(team => {
    team.goalDifference = team.goalsFor - team.goalsAgainst;
    team.pointsByRound = [];
    for (let i = 0; i < rounds.length; i += 1) {
      const periodMatches = filteredMatches.filter(match => match.roundIndex === i);
      let running = 0;
      periodMatches.forEach(match => {
        if (match.home === team.team) {
          running += match.homeGoals > match.awayGoals ? 3 : match.homeGoals === match.awayGoals ? 1 : 0;
        }
        if (match.away === team.team) {
          running += match.awayGoals > match.homeGoals ? 3 : match.awayGoals === match.homeGoals ? 1 : 0;
        }
      });
      const previous = team.pointsByRound[team.pointsByRound.length - 1] || 0;
      team.pointsByRound.push(previous + running);
    }
  });

  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.team.localeCompare(b.team);
  });

  if (selectedTeam && selectedTeam !== 'all') {
    const selectedRecord = standings.find(item => item.team === selectedTeam);
    if (selectedRecord) {
      return [selectedRecord, ...standings.filter(item => item.team !== selectedTeam)];
    }
  }

  return standings;
}

function getLeaderName(standings) {
  return standings[0]?.team || 'Equipo A';
}

function getSelectedTeamData(standings, selectedTeam) {
  if (!selectedTeam || selectedTeam === 'all') {
    return standings[0] || null;
  }
  return standings.find(team => team.team === selectedTeam) || standings[0];
}

function buildResultDistribution(teamStats) {
  const wins = teamStats.wins;
  const draws = teamStats.draws;
  const losses = teamStats.losses;
  const total = wins + draws + losses || 1;
  return {
    labels: ['Victorias', 'Empates', 'Derrotas'],
    values: [wins, draws, losses],
    percentages: [
      ((wins / total) * 100).toFixed(0),
      ((draws / total) * 100).toFixed(0),
      ((losses / total) * 100).toFixed(0)
    ]
  };
}

function buildHomeAwayDistribution(matches, selectedTeam) {
  const homeWins = matches.filter(match => match.home === selectedTeam && match.homeGoals > match.awayGoals).length;
  const awayWins = matches.filter(match => match.away === selectedTeam && match.awayGoals > match.homeGoals).length;
  return {
    labels: ['Local', 'Visitante'],
    values: [homeWins, awayWins]
  };
}

function renderKPIs(standings, roundValue, selectedTeam) {
  const matches = filterMatchesByRound(roundValue);
  const totalGoals = matches.reduce((sum, match) => sum + match.homeGoals + match.awayGoals, 0);
  const avgGoals = matches.length ? (totalGoals / matches.length).toFixed(2) : '0.00';
  const leader = standings[0];
  const selectedRecord = getSelectedTeamData(standings, selectedTeam);

  const kpis = [
    { id: 'matches', label: 'Partidos analizados', value: matches.length, icon: '⚽', trend: `${rounds.length} jornadas` },
    { id: 'goals', label: 'Goles registrados', value: totalGoals, icon: '🥅', trend: 'Total' },
    { id: 'avg', label: 'Promedio de goles', value: `${avgGoals}`, icon: '📊', trend: 'por partido' },
    { id: 'leader', label: 'Equipo con más puntos', value: leader ? leader.team : 'N/A', icon: '🏆', trend: `${leader ? leader.points : 0} pts` },
    { id: 'topScorer', label: 'Equipo con más goles', value: standings.reduce((best, current) => current.goalsFor > best.goalsFor ? current : best, standings[0]).team, icon: '🎯', trend: `${standings.reduce((max, team) => Math.max(max, team.goalsFor), 0)} GF` },
    { id: 'selected', label: 'Puntos equipo seleccionado', value: selectedRecord ? selectedRecord.points : 0, icon: '📈', trend: selectedTeam && selectedTeam !== 'all' ? selectedRecord.team : 'Top equipo' }
  ];

  const kpiContainer = document.querySelector('#kpi-grid');
  if (!kpiContainer) return;

  kpiContainer.innerHTML = kpis.map(kpi => `
    <article class="kpi-card">
      <div class="label"><span>${kpi.label}</span><span class="icon">${kpi.icon}</span></div>
      <span class="value">${kpi.value}</span>
      <span class="trend">${kpi.trend}</span>
    </article>
  `).join('');
}

function renderSummary(standings, selectedTeam, roundValue) {
  const selectedRecord = getSelectedTeamData(standings, selectedTeam);
  const summary = document.querySelector('#team-summary');
  if (!summary) return;

  const displayTeam = selectedTeam && selectedTeam !== 'all' ? selectedTeam : getLeaderName(standings);
  const distribution = buildResultDistribution(selectedRecord);
  const recentForm = [selectedRecord.wins, selectedRecord.draws, selectedRecord.losses].join(' - ');

  summary.innerHTML = `
    <div class="summary-metric">
      <div class="team-badge">${displayTeam.slice(0, 2).toUpperCase()}</div>
      <div>
        <h3>${displayTeam}</h3>
        <p>Puntos: <strong>${selectedRecord.points}</strong> · Diferencia: <strong>${selectedRecord.goalDifference}</strong></p>
      </div>
    </div>
    <p>Partidos: <strong>${selectedRecord.played}</strong> · Goles a favor: <strong>${selectedRecord.goalsFor}</strong></p>
    <p>Goles en contra: <strong>${selectedRecord.goalsAgainst}</strong></p>
    <p>Rendimiento: <strong>${distribution.percentages[0]}% victorias</strong> · Formato reciente: <strong>${recentForm}</strong></p>
    <div class="data-note">DEMO ACADÉMICA: los datos mostrados son simulados y no representan necesariamente la clasificación oficial de LigaPro 2026.</div>
  `;
}

function renderTable(standings) {
  const tbody = document.querySelector('#standings-body');
  const emptyState = document.querySelector('#standings-empty');
  if (!tbody) return;

  tbody.innerHTML = standings.map((team, index) => `
    <tr class="${index < 3 ? 'top-three' : ''}">
      <td>${index + 1}</td>
      <td>${team.team}</td>
      <td>${team.played}</td>
      <td>${team.wins}</td>
      <td>${team.draws}</td>
      <td>${team.losses}</td>
      <td>${team.goalsFor}</td>
      <td>${team.goalsAgainst}</td>
      <td>${team.goalDifference}</td>
      <td>${team.points}</td>
    </tr>
  `).join('');

  if (emptyState) {
    emptyState.classList.toggle('visible', standings.length === 0);
  }
}

function buildChartConfigs(standings, selectedTeam, roundValue) {
  const selectedRecord = getSelectedTeamData(standings, selectedTeam);
  const matches = filterMatchesByRound(roundValue);
  const teamLabels = standings.map(item => item.team);
  const teamPoints = standings.map(item => item.points);
  const goalData = standings.map(item => ({
    label: item.team,
    goalsFor: item.goalsFor,
    goalsAgainst: item.goalsAgainst
  }));

  const lineSeries = teamNames.map(team => {
    const record = standings.find(item => item.team === team);
    return record ? record.points : 0;
  });

  const homeAway = buildHomeAwayDistribution(matches, selectedRecord.team);
  const resultDistribution = buildResultDistribution(selectedRecord);

  return {
    bar: {
      type: 'bar',
      data: {
        labels: teamLabels,
        datasets: [{ label: 'Puntos', data: teamPoints, backgroundColor: '#22c55e' }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    },
    donut: {
      type: 'doughnut',
      data: {
        labels: resultDistribution.labels,
        datasets: [{ data: resultDistribution.values, backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b'] }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    },
    line: {
      type: 'line',
      data: {
        labels: rounds,
        datasets: [{
          label: selectedRecord ? selectedRecord.team : 'Equipo líder',
          data: selectedRecord ? selectedRecord.pointsByRound : [8, 12, 16, 18, 20, 24],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,0.1)',
          tension: 0.25,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true } }
      }
    },
    goalBars: {
      type: 'bar',
      data: {
        labels: goalData.map(item => item.label),
        datasets: [
          { label: 'Goles a favor', data: goalData.map(item => item.goalsFor), backgroundColor: '#22c55e' },
          { label: 'Goles en contra', data: goalData.map(item => item.goalsAgainst), backgroundColor: '#ef4444' }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    },
    homeAway: {
      type: 'bar',
      data: {
        labels: homeAway.labels,
        datasets: [{ label: 'Victorias', data: homeAway.values, backgroundColor: ['#16a34a', '#60a5fa'] }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    }
  };
}

const dashboards = {};
let currentStandings = [];

function exportExcel() {
  if (!currentStandings.length) return;

  const rows = [
    ['Posición', 'Equipo', 'Partidos jugados', 'Partidos ganados', 'Empates', 'Derrotas', 'Goles a favor', 'Goles en contra', 'Diferencia de goles', 'Puntos']
  ];

  currentStandings.forEach((team, index) => {
    rows.push([
      index + 1,
      team.team,
      team.played,
      team.wins,
      team.draws,
      team.losses,
      team.goalsFor,
      team.goalsAgainst,
      team.goalDifference,
      team.points
    ]);
  });

  const csvContent = rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'liga-pro-2026-dashboard.csv';
  link.click();
  URL.revokeObjectURL(url);
}

function renderCharts(standings, selectedTeam, roundValue) {
  const config = buildChartConfigs(standings, selectedTeam, roundValue);

  Object.keys(dashboards).forEach(key => {
    if (dashboards[key]) {
      dashboards[key].destroy();
    }
    delete dashboards[key];
  });

  const ctxBar = document.getElementById('chart-points');
  const ctxDonut = document.getElementById('chart-results');
  const ctxLine = document.getElementById('chart-evolution');
  const ctxGoals = document.getElementById('chart-goals');
  const ctxHomeAway = document.getElementById('chart-homeaway');

  if (ctxBar && config.bar) dashboards.points = new Chart(ctxBar, config.bar);
  if (ctxDonut && config.donut) dashboards.results = new Chart(ctxDonut, config.donut);
  if (ctxLine && config.line) dashboards.evolution = new Chart(ctxLine, config.line);
  if (ctxGoals && config.goalBars) dashboards.goals = new Chart(ctxGoals, config.goalBars);
  if (ctxHomeAway && config.homeAway) dashboards.homeAway = new Chart(ctxHomeAway, config.homeAway);
}

function setupDashboard() {
  const selectedTeam = document.querySelector('#team-filter');
  const selectedRound = document.querySelector('#round-filter');
  const resetButton = document.querySelector('#reset-filters');

  function refreshDashboard() {
    const teamValue = selectedTeam ? selectedTeam.value : 'all';
    const roundValue = selectedRound ? selectedRound.value : 'all';
    const standings = buildStandings(roundValue, teamValue);
    currentStandings = standings;
    renderKPIs(standings, roundValue, teamValue);
    renderSummary(standings, teamValue, roundValue);
    renderTable(standings);
    renderCharts(standings, teamValue, roundValue);
  }

  if (selectedTeam) {
    const teamOptions = ['<option value="all">Todos los equipos</option>']
      .concat(teamNames.map(team => `<option value="${team}">${team}</option>`))
      .join('');
    selectedTeam.innerHTML = teamOptions;
    selectedTeam.value = 'all';
  }

  if (selectedRound) {
    const roundOptions = ['<option value="all">Todas las jornadas</option>']
      .concat(rounds.map((round, index) => `<option value="${index}">${round}</option>`))
      .join('');
    selectedRound.innerHTML = roundOptions;
    selectedRound.value = 'all';
  }

  if (selectedTeam) selectedTeam.addEventListener('change', refreshDashboard);
  if (selectedRound) selectedRound.addEventListener('change', refreshDashboard);
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      if (selectedTeam) selectedTeam.value = 'all';
      if (selectedRound) selectedRound.value = 'all';
      refreshDashboard();
    });
  }

  const printButton = document.querySelector('#print-dashboard');
  if (printButton) {
    printButton.addEventListener('click', () => window.print());
  }

  const excelButton = document.querySelector('#export-excel');
  if (excelButton) {
    excelButton.addEventListener('click', exportExcel);
  }

  refreshDashboard();
}

document.addEventListener('DOMContentLoaded', setupDashboard);
