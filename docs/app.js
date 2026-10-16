/**
 * Python & SQL Master - Game Edition
 * Frontend Single Page Application (Compatible con iPhone 7 / Safari iOS 15 & GitHub Pages)
 */

class AppController {
  constructor() {
    // Detección de URL base de la API (para soporte de GitHub Pages y Local)
    const isGitHubPages = window.location.hostname.includes("github.io");
    const savedApi = localStorage.getItem("PYTHON_MASTER_API_URL");
    
    // Si está en GitHub Pages, usa la URL configurada o la de Render
    if (savedApi) {
      this.apiBaseUrl = savedApi.replace(/\/$/, "");
    } else if (isGitHubPages) {
      this.apiBaseUrl = "https://python-master-game.onrender.com";
    } else {
      this.apiBaseUrl = ""; // Mismo origen (local o Render directo)
    }

    this.token = localStorage.getItem("PYTHON_MASTER_TOKEN") || null;
    this.currentUser = JSON.parse(localStorage.getItem("PYTHON_MASTER_USER") || "null");

    this.user = {
      id: this.currentUser ? this.currentUser.username : "default_user",
      username: this.currentUser ? this.currentUser.username : "Invitado",
      fullName: this.currentUser ? this.currentUser.full_name : "Python Master",
      xp: 150,
      level: 1,
      rankTitle: "Recluta del Byte",
      nextLevelXp: 200,
      streak: 3,
      completedLessons: [],
      achievements: []
    };

    this.modules = [];
    this.sqlChallenges = [];
    this.currentSqlMode = "auto";
    this.selectedMissionId = null;
    this.currentBlockId = null;
    this.currentLessonId = null;

    this.atmCurrentBalance = 1000.00;
  }

  async init() {
    this.updateAuthButtonUI();
    await this.loadUserProfile();
    await this.loadModules();
    await this.loadSqlChallenges();
    this.renderRoadmap();
    this.renderBriefClasses();
  }

  apiUrl(endpoint) {
    if (endpoint.startsWith("http")) return endpoint;
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return `${this.apiBaseUrl}${cleanEndpoint}`;
  }

  getAuthHeaders(extraHeaders = {}) {
    const headers = { "Content-Type": "application/json", ...extraHeaders };
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    return headers;
  }

  // ==================== AUTENTICACIÓN & SESIONES ====================
  openAuthModal() {
    if (this.token && this.currentUser) {
      if (confirm(`Sesión activa como: @${this.currentUser.username} (${this.user.xp} XP).\n¿Deseas cerrar sesión?`)) {
        this.logout();
      }
      return;
    }
    document.getElementById("viewAuthModal").style.display = "flex";
    this.switchAuthMode("login");
  }

  closeAuthModal() {
    document.getElementById("viewAuthModal").style.display = "none";
    document.getElementById("authStatusMsg").style.display = "none";
  }

  switchAuthMode(mode) {
    const isLogin = (mode === "login");
    document.getElementById("formLogin").style.display = isLogin ? "block" : "none";
    document.getElementById("formRegister").style.display = isLogin ? "none" : "block";
    document.getElementById("btnTabLogin").classList.toggle("active", isLogin);
    document.getElementById("btnTabRegister").classList.toggle("active", !isLogin);
    document.getElementById("authStatusMsg").style.display = "none";
  }

  async submitLogin() {
    const ident = document.getElementById("loginIdent").value.trim();
    const pwd = document.getElementById("loginPwd").value.trim();
    const statusMsg = document.getElementById("authStatusMsg");

    statusMsg.style.display = "block";
    statusMsg.style.color = "var(--primary)";
    statusMsg.textContent = "Verificando credenciales...";

    try {
      const res = await fetch(this.apiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: ident, password: pwd })
      });
      const data = await res.json();

      if (res.ok && data.token) {
        this.token = data.token;
        this.currentUser = data.user;
        localStorage.setItem("PYTHON_MASTER_TOKEN", data.token);
        localStorage.setItem("PYTHON_MASTER_USER", JSON.stringify(data.user));

        this.user.id = data.user.username;
        this.user.username = data.user.username;
        this.user.fullName = data.user.full_name;
        this.user.xp = data.user.xp;
        this.user.level = data.user.level;
        this.user.rankTitle = data.user.rank_title;

        this.updateAuthButtonUI();
        this.closeAuthModal();
        await this.loadUserProfile();
        alert(`🎉 ¡Bienvenido de nuevo, ${this.user.fullName || this.user.username}!`);
      } else {
        statusMsg.style.color = "#f87171";
        statusMsg.textContent = data.detail || "Credenciales incorrectas.";
      }
    } catch (e) {
      statusMsg.style.color = "#f87171";
      statusMsg.textContent = "Error de conexión con el servidor.";
    }
  }

  async submitRegister() {
    const username = document.getElementById("regUser").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const fullName = document.getElementById("regFullName").value.trim();
    const pwd = document.getElementById("regPwd").value.trim();
    const statusMsg = document.getElementById("authStatusMsg");

    statusMsg.style.display = "block";
    statusMsg.style.color = "var(--primary)";
    statusMsg.textContent = "Registrando cuenta en Supabase...";

    try {
      const res = await fetch(this.apiUrl("/api/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, full_name: fullName, password: pwd })
      });
      const data = await res.json();

      if (res.ok && data.token) {
        this.token = data.token;
        this.currentUser = data.user;
        localStorage.setItem("PYTHON_MASTER_TOKEN", data.token);
        localStorage.setItem("PYTHON_MASTER_USER", JSON.stringify(data.user));

        this.user.id = data.user.username;
        this.user.username = data.user.username;
        this.user.fullName = data.user.full_name;
        this.user.xp = data.user.xp;
        this.user.level = data.user.level;
        this.user.rankTitle = data.user.rank_title;

        this.updateAuthButtonUI();
        this.closeAuthModal();
        await this.loadUserProfile();
        alert(`🚀 ¡Registro exitoso! Has obtenido tu Pase de Desarrollador con +150 XP de bienvenida.`);
      } else {
        statusMsg.style.color = "#f87171";
        statusMsg.textContent = data.detail || "Error en el registro.";
      }
    } catch (e) {
      statusMsg.style.color = "#f87171";
      statusMsg.textContent = "Error de conexión con el servidor.";
    }
  }

  logout() {
    this.token = null;
    this.currentUser = null;
    localStorage.removeItem("PYTHON_MASTER_TOKEN");
    localStorage.removeItem("PYTHON_MASTER_USER");
    this.user.id = "default_user";
    this.user.username = "Invitado";
    this.updateAuthButtonUI();
    this.loadUserProfile();
    alert("Has cerrado sesión. Jugando en modo invitado.");
  }

  updateAuthButtonUI() {
    const btn = document.getElementById("btnAuthHeader");
    if (!btn) return;
    if (this.token && this.currentUser) {
      btn.innerHTML = `👤 <span class="hide-mobile">${this.currentUser.username}</span>`;
      btn.style.borderColor = "var(--primary)";
      btn.style.color = "var(--primary)";
    } else {
      btn.innerHTML = `🔑 <span class="hide-mobile">Ingresar</span>`;
      btn.style.borderColor = "rgba(168, 85, 247, 0.4)";
      btn.style.color = "#c084fc";
    }
  }

  // ==================== CONFIGURACIÓN DE API (GITHUB PAGES) ====================
  openApiModal() {
    document.getElementById("inputApiBaseUrl").value = this.apiBaseUrl;
    document.getElementById("viewApiModal").style.display = "flex";
  }

  closeApiModal() {
    document.getElementById("viewApiModal").style.display = "none";
  }

  saveApiBaseUrl() {
    const val = document.getElementById("inputApiBaseUrl").value.trim().replace(/\/$/, "");
    this.apiBaseUrl = val;
    localStorage.setItem("PYTHON_MASTER_API_URL", val);
    this.closeApiModal();
    alert(`URL del backend configurada: ${val || 'Mismo Origen (Local)'}\nRecargando datos...`);
    this.init();
  }

  setLocalApi() {
    document.getElementById("inputApiBaseUrl").value = "";
    this.saveApiBaseUrl();
  }

  // ==================== PERFIL & GAMIFICACIÓN ====================
  async loadUserProfile() {
    try {
      const res = await fetch(this.apiUrl("/api/progress"), {
        headers: this.getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        this.user.xp = data.xp || 150;
        this.user.level = data.level || 1;
        this.user.rankTitle = data.rank_title || "Recluta del Byte";
        this.user.nextLevelXp = data.next_level_xp || 200;
        this.user.streak = data.streak_days || 3;
        this.user.completedLessons = data.completed_lessons || [];
        this.user.achievements = data.achievements || [];
        this.updateHeaderStats();
      }
    } catch (e) {
      console.warn("Usando perfil local offline:", e);
      this.updateHeaderStats();
    }
  }

  updateHeaderStats() {
    document.getElementById("userLevelBadge").textContent = `Nvl ${this.user.level}`;
    document.getElementById("userXpBadge").textContent = `${this.user.xp} XP`;
    document.getElementById("userStreakBadge").textContent = `${this.user.streak}`;
    document.getElementById("userRankTitle").textContent = this.user.rankTitle;

    document.getElementById("statCompletedLessons").textContent = this.user.completedLessons.length;
    document.getElementById("statTotalXp").textContent = this.user.xp;
    
    const unlockedAch = this.user.achievements.filter(a => a.unlocked).length;
    document.getElementById("statAchievementsCount").textContent = unlockedAch;

    // Calcular progreso al siguiente nivel
    const pct = Math.min(100, Math.round((this.user.xp / this.user.nextLevelXp) * 100));
    document.getElementById("levelProgressFill").style.width = `${pct}%`;
  }

  async addXP(amount, reason = "Reto superado") {
    try {
      const res = await fetch(this.apiUrl("/api/progress/add_xp"), {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ user_id: this.user.id, xp_amount: amount, reason: reason })
      });
      if (res.ok) {
        const data = await res.json();
        this.user.xp = data.xp;
        this.user.level = data.level;
        this.user.rankTitle = data.rank_title;
        this.user.nextLevelXp = data.next_level_xp;
        this.updateHeaderStats();
        
        if (data.leveled_up) {
          alert(`🎉 ¡SUBISTE DE NIVEL! Ahora eres Nivel ${data.level}: ${data.rank_title}!`);
        }
      }
    } catch (e) {
      this.user.xp += amount;
      this.updateHeaderStats();
    }
  }

  // ==================== NAVEGACIÓN ====================
  switchTab(tabKey) {
    const tabs = {
      camino: "tabCamino",
      sql: "tabSql",
      apps: "tabApps",
      clases: "tabClases",
      logros: "tabLogros"
    };

    document.querySelectorAll(".view-tab").forEach(tab => tab.classList.remove("active"));
    const targetTab = document.getElementById(tabs[tabKey]);
    if (targetTab) targetTab.classList.add("active");

    document.querySelectorAll(".mobile-nav .nav-item").forEach(item => item.classList.remove("active"));
    const navButtons = document.querySelectorAll(".mobile-nav .nav-item");
    const tabIndex = Object.keys(tabs).indexOf(tabKey);
    if (navButtons[tabIndex]) navButtons[tabIndex].classList.add("active");

    window.scrollTo({ top: 0, behavior: "smooth" });
    if (tabKey === "logros") this.renderAchievements();
  }

  // ==================== ROADMAP & LECCIONES ====================
  async loadModules() {
    try {
      const res = await fetch(this.apiUrl("/api/modules"));
      if (res.ok) {
        const data = await res.json();
        this.modules = data.modules || [];
      }
    } catch (e) {
      console.error("Error al cargar módulos:", e);
    }
  }

  renderRoadmap() {
    const container = document.getElementById("gameRoadmap");
    if (!container) return;

    container.innerHTML = "";
    this.modules.forEach((mod) => {
      const card = document.createElement("div");
      card.className = "roadmap-block-card";
      
      card.innerHTML = `
        <div class="block-header-info">
          <div class="block-title-row">
            <span class="block-icon-large">${mod.icon}</span>
            <div>
              <div class="block-title-text">${mod.title}</div>
              <div class="block-days-badge">${mod.days} • ${mod.lessons_count} Estaciones</div>
            </div>
          </div>
          <button class="btn-secondary" onclick="app.openBlockQuests('${mod.id}')">Explorar →</button>
        </div>
        <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 8px;">${mod.description}</p>
        <div class="nodes-timeline" id="nodes_block_${mod.id}">
          <span style="font-size: 0.75rem; color: var(--text-muted);">Cargando estaciones...</span>
        </div>
      `;

      container.appendChild(card);
      this.loadBlockNodes(mod.id);
    });
  }

  async loadBlockNodes(blockId) {
    try {
      const res = await fetch(this.apiUrl(`/api/modules/${blockId}`));
      if (!res.ok) return;
      const data = await res.json();
      const lessons = data.block.lessons || [];

      const container = document.getElementById(`nodes_block_${blockId}`);
      if (!container) return;

      container.innerHTML = "";
      lessons.forEach((les) => {
        const isCompleted = this.user.completedLessons.includes(les.id);
        const node = document.createElement("div");
        node.className = `quest-node ${isCompleted ? 'completed' : ''}`;
        node.innerHTML = `
          <span class="node-status-icon">${isCompleted ? '⭐' : '🔓'}</span>
          <span>${les.title.split(' ')[0]} ${les.title.split(' ').slice(1, 3).join(' ')}</span>
        `;
        node.onclick = () => this.openLessonModal(blockId, les.id);
        container.appendChild(node);
      });
    } catch (e) {
      console.warn("Error cargando nodos de bloque:", blockId, e);
    }
  }

  async openBlockQuests(blockId) {
    try {
      const res = await fetch(this.apiUrl(`/api/modules/${blockId}`));
      const data = await res.json();
      const firstLesson = data.block.lessons[0];
      if (firstLesson) {
        this.openLessonModal(blockId, firstLesson.id);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async openLessonModal(blockId, lessonId) {
    this.currentBlockId = blockId;
    this.currentLessonId = lessonId;

    try {
      const res = await fetch(this.apiUrl(`/api/modules/${blockId}/lesson/${lessonId}`));
      const data = await res.json();
      const lesson = data.lesson;

      const modal = document.getElementById("viewLessonModal");
      const content = document.getElementById("lessonModalDetail");

      content.innerHTML = `
        <div style="margin-bottom: 14px;">
          <span style="font-size: 0.75rem; color: var(--accent-gold); font-weight: 700;">ESTACIÓN DE APRENDIZAJE</span>
          <h2 style="font-size: 1.25rem; font-weight: 800; margin-top: 4px;">${lesson.title}</h2>
        </div>

        <div style="background: rgba(255,255,255,0.03); padding: 14px; border-radius: 8px; font-size: 0.88rem; line-height: 1.6; border: 1px solid var(--border-color); margin-bottom: 16px;">
          ${this.formatMarkdown(lesson.theory)}
        </div>

        <div style="margin-bottom: 16px;">
          <h4 style="font-size: 0.9rem; color: var(--primary); margin-bottom: 8px;">⚖️ Antipatrón vs Código Pythonico:</h4>
          <div style="background: #080c14; border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 6px; padding: 10px; margin-bottom: 8px;">
            <span style="font-size: 0.72rem; color: #f87171; font-weight: 700;">❌ ANTIPATRÓN LENTO:</span>
            <pre style="font-family: var(--font-mono); font-size: 0.8rem; color: #cbd5e1; margin-top: 4px; overflow-x: auto;"><code>${lesson.code_bad}</code></pre>
          </div>
          <div style="background: #080c14; border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 6px; padding: 10px;">
            <span style="font-size: 0.72rem; color: #34d399; font-weight: 700;">✅ ENFOQUE PYTHONIC / SENIOR:</span>
            <pre style="font-family: var(--font-mono); font-size: 0.8rem; color: #cbd5e1; margin-top: 4px; overflow-x: auto;"><code>${lesson.code_good}</code></pre>
          </div>
        </div>

        <!-- Cuestionario / Quizz -->
        <div style="background: var(--bg-card); border: 1px solid var(--border-color); padding: 14px; border-radius: 8px; margin-bottom: 16px;">
          <h4 style="font-size: 0.9rem; margin-bottom: 8px;">❓ Quizz de Verificación (+20 XP):</h4>
          <p style="font-size: 0.85rem; font-weight: 600; margin-bottom: 10px;">${lesson.quiz.question}</p>
          <div id="quizOptionsList">
            ${lesson.quiz.options.map((opt, idx) => `
              <button class="btn-secondary" style="width: 100%; text-align: left; margin-bottom: 6px; font-size: 0.8rem;" onclick="app.submitQuizAnswer(${idx}, ${lesson.quiz.answer}, '${lesson.quiz.explanation.replace(/'/g, "\\'")}')">
                ${String.fromCharCode(65 + idx)}) ${opt}
              </button>
            `).join("")}
          </div>
          <div id="quizFeedbackBox" style="display: none; margin-top: 8px; padding: 8px; border-radius: 6px; font-size: 0.82rem;"></div>
        </div>

        <!-- Reto de Código -->
        <div style="background: var(--bg-card); border: 1px solid var(--border-color); padding: 14px; border-radius: 8px;">
          <h4 style="font-size: 0.9rem; color: var(--primary); margin-bottom: 4px;">💻 Reto de Código (+50 XP):</h4>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 8px;">${lesson.exercise.instructions}</p>
          
          <button class="accordion-btn" onclick="app.toggleAccordion('hintAccordion')">
            <span>💡 Ver Atajos & Pistas de Resolución</span>
            <span>▼</span>
          </button>
          <div id="hintAccordion" class="accordion-content">
            ${this.formatMarkdown(lesson.exercise.hints || "Pistas no disponibles.")}
          </div>

          <textarea id="lessonCodeEditor" class="code-editor-area">${lesson.exercise.starter_code}</textarea>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
            <button class="btn-primary" onclick="app.executeLessonCode('${blockId}', '${lessonId}')">⚡ Ejecutar Código</button>
          </div>

          <div id="codeTerminalOutput" style="display: none; background: #03060a; border: 1px solid var(--border-color); padding: 10px; border-radius: 6px; margin-top: 10px; font-family: var(--font-mono); font-size: 0.8rem;"></div>

          <button class="accordion-btn" onclick="app.toggleAccordion('solAccordion')" style="margin-top: 10px;">
            <span>🔍 Ver Explicación Detallada del Código</span>
            <span>▼</span>
          </button>
          <div id="solAccordion" class="accordion-content">
            ${this.formatMarkdown(lesson.exercise.solution_explanation || "Explicación en desarrollo.")}
          </div>
        </div>
      `;

      modal.style.display = "flex";
    } catch (e) {
      alert("Error al cargar la lección: " + e);
    }
  }

  closeLessonModal() {
    document.getElementById("viewLessonModal").style.display = "none";
  }

  submitQuizAnswer(selectedIdx, correctIdx, explanation) {
    const feedback = document.getElementById("quizFeedbackBox");
    feedback.style.display = "block";

    if (selectedIdx === correctIdx) {
      feedback.style.background = "rgba(16, 185, 129, 0.15)";
      feedback.style.border = "1px solid rgba(16, 185, 129, 0.4)";
      feedback.style.color = "#34d399";
      feedback.innerHTML = `<strong>✅ ¡Correcto! (+20 XP)</strong><br>${explanation}`;
      this.addXP(20, "Respuesta correcta en Quizz");
    } else {
      feedback.style.background = "rgba(239, 68, 68, 0.15)";
      feedback.style.border = "1px solid rgba(239, 68, 68, 0.4)";
      feedback.style.color = "#f87171";
      feedback.innerHTML = `<strong>❌ No es correcto.</strong><br>${explanation}`;
    }
  }

  async executeLessonCode(blockId, lessonId) {
    const code = document.getElementById("lessonCodeEditor").value;
    const term = document.getElementById("codeTerminalOutput");
    term.style.display = "block";
    term.innerHTML = "⏳ Ejecutando en entorno aislado...";

    try {
      const res = await fetch(this.apiUrl("/api/execute"), {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ block_id: blockId, exercise_id: lessonId, code: code })
      });
      const data = await res.json();

      if (data.passed) {
        term.innerHTML = `<span style="color: #34d399;">✅ ¡TESTS PASADOS EXITOSAMENTE! (+50 XP)</span><br><br>${data.stdout ? data.stdout : 'Sin salida estándar.'}`;
        this.addXP(50, "Reto de código superado");
        
        if (!this.user.completedLessons.includes(lessonId)) {
          this.user.completedLessons.push(lessonId);
          fetch(this.apiUrl("/api/progress"), {
            method: "POST",
            headers: this.getAuthHeaders(),
            body: JSON.stringify({ block_id: blockId, lesson_id: lessonId, completed: true, score: 100, xp_earned: 50 })
          });
          this.loadBlockNodes(blockId);
          this.updateHeaderStats();
        }
      } else {
        term.innerHTML = `<span style="color: #f87171;">❌ PRUEBAS FALLIDAS:</span><br><pre style="color: #cbd5e1; margin-top: 4px;">${data.stderr || data.stdout || 'La prueba de aserción no se cumplió.'}</pre>`;
      }
    } catch (e) {
      term.innerHTML = `<span style="color: #f87171;">Error al ejecutar: ${e}</span>`;
    }
  }

  // ==================== CURSO DE SQL ====================
  async loadSqlChallenges() {
    try {
      const res = await fetch(this.apiUrl("/api/sql/challenges"));
      if (res.ok) {
        const data = await res.json();
        this.sqlChallenges = data.challenges || [];
        this.renderSqlMissions();
      }
    } catch (e) {
      console.warn("Error cargando misiones SQL:", e);
    }
  }

  renderSqlMissions() {
    const container = document.getElementById("sqlMissionsList");
    if (!container) return;

    container.innerHTML = "";
    this.sqlChallenges.forEach((m) => {
      const chip = document.createElement("div");
      chip.className = `mission-chip ${this.selectedMissionId === m.id ? 'active' : ''}`;
      chip.onclick = () => this.selectSqlMission(m.id);
      chip.innerHTML = `
        <div class="mission-header">
          <span class="mission-lvl">Nivel ${m.level}</span>
          <span class="mission-xp">+${m.xp_reward} XP</span>
        </div>
        <div class="mission-name">${m.title}</div>
      `;
      container.appendChild(chip);
    });
  }

  selectSqlMission(missionId) {
    this.selectedMissionId = missionId;
    this.renderSqlMissions();

    const mission = this.sqlChallenges.find(m => m.id === missionId);
    if (mission) {
      document.getElementById("sqlInput").value = mission.starter_query;
      alert(`🎯 Misión Seleccionada: ${mission.title}\n\nObjetivo: ${mission.objective}\n\nPista: ${mission.hints[0]}`);
    }
  }

  setSqlMode(mode) {
    this.currentSqlMode = mode;
    document.getElementById("btnModeAuto").classList.toggle("active", mode === "auto");
    document.getElementById("btnModeSql").classList.toggle("active", mode === "sql");
  }

  setSqlQuery(queryText) {
    document.getElementById("sqlInput").value = queryText;
  }

  async executeSqlQuery() {
    const query = document.getElementById("sqlInput").value.trim();
    if (!query) {
      alert("Por favor ingresa una consulta o instrucción.");
      return;
    }

    const explBox = document.getElementById("sqlExplanationBox");
    const resultsBox = document.getElementById("sqlResultsBox");
    const tableContainer = document.getElementById("sqlTableContainer");

    explBox.style.display = "block";
    resultsBox.style.display = "block";
    tableContainer.innerHTML = "<div style='padding: 14px;'>⏳ Consultando Supabase/PostgreSQL en tiempo real...</div>";

    try {
      const res = await fetch(this.apiUrl("/api/sql/execute"), {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          query: query,
          mode: this.currentSqlMode,
          challenge_id: this.selectedMissionId,
          user_id: this.user.id
        })
      });
      const data = await res.json();

      document.getElementById("sqlInterpretedQuery").textContent = data.sql_query;

      const clausesList = document.getElementById("sqlClausesList");
      clausesList.innerHTML = "";
      if (data.explanation) {
        Object.entries(data.explanation).forEach(([k, v]) => {
          const row = document.createElement("div");
          row.className = "clause-row";
          row.innerHTML = `<span class="clause-keyword">${k}:</span> ${v}`;
          clausesList.appendChild(row);
        });
      }

      document.getElementById("sqlExecutionTime").textContent = `${data.execution_ms} ms`;
      document.getElementById("sqlTotalRows").textContent = `${data.total_rows} filas`;

      if (data.success && data.rows && data.rows.length > 0) {
        let tableHtml = `<table class="data-table"><thead><tr>`;
        data.columns.forEach(col => {
          tableHtml += `<th>${col}</th>`;
        });
        tableHtml += `</tr></thead><tbody>`;

        data.rows.forEach(r => {
          tableHtml += `<tr>`;
          data.columns.forEach(col => {
            tableHtml += `<td>${r[col] !== null ? r[col] : '<em>NULL</em>'}</td>`;
          });
          tableHtml += `</tr>`;
        });
        tableHtml += `</tbody></table>`;
        tableContainer.innerHTML = tableHtml;

        if (data.passed) {
          alert(`🏆 ${data.feedback}`);
          this.addXP(data.xp_earned, "Misión SQL completada");
        }
      } else if (data.success) {
        tableContainer.innerHTML = `<div style="padding: 14px; color: var(--text-muted);">La consulta se ejecutó en ${data.execution_ms}ms, pero no devolvió filas.</div>`;
      } else {
        tableContainer.innerHTML = `<div style="padding: 14px; color: #f87171;"><strong>Error SQL:</strong> ${data.error}<br><small style="color: var(--text-muted);">${data.hint || ''}</small></div>`;
      }

    } catch (e) {
      tableContainer.innerHTML = `<div style="padding: 14px; color: #f87171;">Error de conexión con el motor SQL: ${e}</div>`;
    }
  }

  async toggleSchemaExplorer() {
    const content = document.getElementById("schemaExplorerContent");
    const isHidden = content.style.display === "none";
    content.style.display = isHidden ? "block" : "none";

    if (isHidden) {
      try {
        const res = await fetch(this.apiUrl("/api/sql/schema"));
        const data = await res.json();
        const grid = document.getElementById("schemaTablesGrid");
        grid.innerHTML = "";

        Object.entries(data.tables).forEach(([tableName, cols]) => {
          const card = document.createElement("div");
          card.className = "schema-table-card";
          card.innerHTML = `
            <div class="schema-table-name">📄 ${tableName}</div>
            ${cols.map(c => `
              <div class="schema-col-item">
                • <strong>${c.name}</strong> (${c.type}) ${c.pk ? '🔑 PK' : ''} ${c.fk ? '🔗 FK' : ''}
              </div>
            `).join("")}
          `;
          grid.appendChild(card);
        });
      } catch (e) {
        console.error(e);
      }
    }
  }

  async seedDatabase() {
    if (!confirm("¿Deseas poblar/restaurar los datos de prueba en la base de datos (Supabase/PostgreSQL)?")) return;
    try {
      const res = await fetch(this.apiUrl("/api/sql/seed"), {
        method: "POST",
        headers: this.getAuthHeaders()
      });
      const data = await res.json();
      alert(`🌱 ${data.message}`);
    } catch (e) {
      alert("Error al sembrar la base de datos: " + e);
    }
  }

  // ==================== MICRO-PROGRAMAS ====================
  async runCalculatorApp() {
    const expr = document.getElementById("calcInput").value;
    const box = document.getElementById("calcOutput");
    box.style.display = "block";
    box.innerHTML = "Calculando...";

    try {
      const res = await fetch(this.apiUrl("/api/microapps/calculator"), {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ expression: expr })
      });
      const data = await res.json();
      if (data.success) {
        box.innerHTML = `
          <strong style="color: #38bdf8; font-size: 1.1rem;">Resultado: ${data.result}</strong><br>
          <span style="color: var(--accent-gold); font-size: 0.75rem;">Tipo: &lt;class '${data.type}'&gt;</span>
          <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 6px;">${data.explanation}</p>
        `;
        this.addXP(5, "Uso de Calculadora AST");
      } else {
        box.innerHTML = `<span style="color: #f87171;">${data.error}</span>`;
      }
    } catch (e) {
      box.innerHTML = `Error: ${e}`;
    }
  }

  atmDeposit() {
    const amount = parseFloat(document.getElementById("atmAmount").value);
    if (!amount || amount <= 0) {
      alert("Ingresa un monto válido mayor a 0.");
      return;
    }
    this.atmCurrentBalance += amount;
    this.updateAtmUI(`➕ Depósito exitoso: +$${amount.toFixed(2)}`);
  }

  atmWithdraw() {
    const amount = parseFloat(document.getElementById("atmAmount").value);
    if (!amount || amount <= 0) {
      alert("Ingresa un monto válido mayor a 0.");
      return;
    }
    if (amount > this.atmCurrentBalance) {
      alert("Fondos insuficientes.");
      return;
    }
    this.atmCurrentBalance -= amount;
    this.updateAtmUI(`➖ Retiro exitoso: -$${amount.toFixed(2)}`);
  }

  updateAtmUI(logMessage) {
    document.getElementById("atmBalance").textContent = `$${this.atmCurrentBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    const log = document.getElementById("atmLog");
    const entry = document.createElement("div");
    entry.className = "log-entry";
    entry.textContent = `${logMessage} | Nuevo Saldo: $${this.atmCurrentBalance.toFixed(2)}`;
    log.prepend(entry);
    document.getElementById("atmAmount").value = "";
    this.addXP(10, "Operación en Cajero Automático");
  }

  async runIdEmailApp() {
    const nombre = document.getElementById("idNombre").value;
    const apellido = document.getElementById("idApellido").value;
    const anio = parseInt(document.getElementById("idAnio").value);
    const empresa = document.getElementById("idEmpresa").value;
    const box = document.getElementById("idEmailOutput");

    box.style.display = "block";
    box.innerHTML = "Generando...";

    try {
      const res = await fetch(this.apiUrl("/api/microapps/generate_id_email"), {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ nombre, apellido, anio_nacimiento: anio, empresa })
      });
      const data = await res.json();
      if (data.success) {
        box.innerHTML = `
          <div style="margin-bottom: 6px;">
            <span style="color: var(--accent-gold); font-size: 0.72rem; font-weight: 700;">ID ÚNICO NORMALIZADO (Reto 53):</span>
            <div style="font-family: var(--font-mono); font-size: 1rem; color: #38bdf8;">${data.id_unico}</div>
          </div>
          <div>
            <span style="color: #34d399; font-size: 0.72rem; font-weight: 700;">EMAIL INSTITUCIONAL (Reto 40):</span>
            <div style="font-family: var(--font-mono); font-size: 0.88rem; color: #f8fafc;">${data.email_corporativo}</div>
          </div>
        `;
        this.addXP(10, "Generación de ID y Email");
      } else {
        box.innerHTML = `<span style="color: #f87171;">${data.detail || data.error}</span>`;
      }
    } catch (e) {
      box.innerHTML = `Error: ${e}`;
    }
  }

  async runHotelApp() {
    const cliente = document.getElementById("hotelCliente").value;
    const habitacion = document.getElementById("hotelHabitacion").value;
    const noches = parseInt(document.getElementById("hotelNoches").value);
    const desayuno = document.getElementById("hotelDesayuno").checked;
    const box = document.getElementById("hotelOutput");

    box.style.display = "block";
    box.innerHTML = "Cotizando...";

    try {
      const res = await fetch(this.apiUrl("/api/microapps/hotel_booking"), {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ cliente, noches, tipo_habitacion: habitacion, incluye_desayuno: desayuno })
      });
      const data = await res.json();
      if (data.success) {
        box.innerHTML = `
          <strong style="color: var(--primary);">Reserva para ${data.cliente}</strong><br>
          <span style="font-size: 0.8rem;">Estancia: ${data.noches} noches • Tarifa: $${data.tarifa_noche}/noche</span><br>
          <span style="font-size: 0.8rem;">Subtotal: $${data.subtotal}</span><br>
          <span style="font-size: 0.8rem; color: #34d399;">Descuento aplicado: -$${data.descuento_aplicado}</span><br>
          <strong style="color: var(--accent-gold); font-size: 1.05rem;">Total Final: $${data.total_a_pagar}</strong>
        `;
        this.addXP(10, "Cotización de Reserva de Hotel");
      }
    } catch (e) {
      box.innerHTML = `Error: ${e}`;
    }
  }

  // ==================== CLASES BREVES ====================
  renderBriefClasses() {
    const container = document.getElementById("briefClassesList");
    if (!container) return;

    const briefTopics = [
      {
        title: "1. ¿Qué es Python y por qué CPython maneja memoria con Heap vs Stack?",
        time: "2 min",
        desc: "Variables como punteros a PyObject en Heap. Las variables primitivas enteras y de texto son inmutables."
      },
      {
        title: "2. La Verdad Oculta del GIL (Global Interpreter Lock)",
        time: "3 min",
        desc: "Solo un hilo nativo ejecuta bytecode a la vez. Usa Threading para tareas I/O Bound y Multiprocessing para CPU Bound."
      },
      {
        title: "3. El Poder de las List & Dict Comprehensions",
        time: "3 min",
        desc: "Evita bucles con .append() repetidos. Las comprehensions se compilan en C a nivel de bytecode con LIST_APPEND."
      },
      {
        title: "4. Protocolos y Métodos Mágicos (__slots__, __call__)",
        time: "4 min",
        desc: "Elimina el diccionario dinámico __dict__ en tus clases usando __slots__ para ahorrar hasta 40% de memoria RAM."
      },
      {
        title: "5. Asincronismo con Asyncio y Event Loops",
        time: "4 min",
        desc: "Cooperative Multitasking sin sobrecarga de cambio de contexto de hilos del sistema operativo."
      }
    ];

    container.innerHTML = "";
    briefTopics.forEach(b => {
      const card = document.createElement("div");
      card.className = "brief-class-card";
      card.innerHTML = `
        <div class="brief-class-header">
          <div class="brief-class-title">${b.title}</div>
          <span class="brief-class-time">${b.time}</span>
        </div>
        <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 6px;">${b.desc}</p>
      `;
      card.onclick = () => {
        alert(`📖 Clase Breve: ${b.title}\n\n${b.desc}\n\n💡 Tip Senior: La maestría proviene de comprender cómo el lenguaje interactúa con el sistema operativo y la memoria física.`);
        this.addXP(5, "Lectura de Clase Breve");
      };
      container.appendChild(card);
    });
  }

  // ==================== LOGROS ====================
  renderAchievements() {
    const container = document.getElementById("achievementsList");
    if (!container) return;

    container.innerHTML = "";
    this.user.achievements.forEach(a => {
      const card = document.createElement("div");
      card.className = `badge-card ${a.unlocked ? 'unlocked' : ''}`;
      card.innerHTML = `
        <span class="badge-icon">${a.icon}</span>
        <div>
          <h4>${a.title}</h4>
          <p>${a.description}</p>
          <span style="font-size: 0.7rem; color: ${a.unlocked ? '#34d399' : 'var(--text-muted)'}; font-weight: 700;">
            ${a.unlocked ? '✓ Desbloqueado' : '🔒 Bloqueado'}
          </span>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // ==================== UTILIDADES ====================
  toggleAccordion(id) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("open");
  }

  formatMarkdown(mdText) {
    if (!mdText) return "";
    return mdText
      .replace(/### (.*?)\n/g, '<h4 style="color: var(--primary); margin: 8px 0;">$1</h4>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code style="background: rgba(255,255,255,0.1); padding: 2px 4px; border-radius: 4px; font-family: monospace;">$1</code>')
      .replace(/\n\n/g, '<br><br>');
  }
}

const app = new AppController();
window.addEventListener("DOMContentLoaded", () => app.init());
