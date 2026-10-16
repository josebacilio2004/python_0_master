/**
 * Python & SQL Master - Game Edition
 * Frontend Single Page Application (Compatible con iPhone 7 / Safari iOS 15 & GitHub Pages)
 */

// ==================== WEB AUDIO API SYNTHESIZER (ZERO-ASSETS) ====================
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem("PYTHON_MASTER_SOUND") !== "false";
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem("PYTHON_MASTER_SOUND", this.enabled ? "true" : "false");
    return this.enabled;
  }

  playTap() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(80, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.02);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.02);
      if (navigator.vibrate) navigator.vibrate(10);
    } catch (e) {}
  }

  playSnap() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(340, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(680, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
      if (navigator.vibrate) navigator.vibrate(15);
    } catch (e) {}
  }

  playRemove() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.03);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch (e) {}
  }

  playIndent() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(950, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.015);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.015);
    } catch (e) {}
  }

  playSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.07);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.07 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.07);
        osc.stop(this.ctx.currentTime + i * 0.07 + 0.25);
      });
      if (navigator.vibrate) navigator.vibrate([20, 50, 20]);
    } catch (e) {}
  }

  playQuizCorrect() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const notes = [587.33, 739.99, 880.00]; // D5, F#5, A5
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.06);
        gain.gain.setValueAtTime(0.18, this.ctx.currentTime + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.06 + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.06);
        osc.stop(this.ctx.currentTime + i * 0.06 + 0.2);
      });
    } catch (e) {}
  }

  playError() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(130, this.ctx.currentTime);
      osc.frequency.setValueAtTime(110, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
      if (navigator.vibrate) navigator.vibrate(40);
    } catch (e) {}
  }
}

// ==================== ZERO-DOM HIGH PERFORMANCE CANVAS PARTICLES ====================
class FXParticleEngine {
  constructor(canvasId = "fxCanvas") {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
    this.particles = [];
    this.texts = [];
    this.animId = null;

    if (this.canvas) {
      this.resize();
      window.addEventListener("resize", () => this.resize());
    }
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  spawn(x, y, count = 35, colors = ["#f59e0b", "#38bdf8", "#10b981", "#ffffff"]) {
    if (!this.canvas || !this.ctx) return;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      this.particles.push({
        x: x || window.innerWidth / 2,
        y: y || window.innerHeight / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.025 + 0.015,
        gravity: 0.15
      });
    }
    this.startLoop();
  }

  spawnText(x, y, text, color = "#f59e0b") {
    if (!this.canvas || !this.ctx) return;
    this.texts.push({
      x: x || window.innerWidth / 2,
      y: y || window.innerHeight / 2,
      text: text,
      color: color,
      alpha: 1,
      vy: -1.8,
      decay: 0.018
    });
    this.startLoop();
  }

  startLoop() {
    if (!this.animId) {
      this.animId = requestAnimationFrame(() => this.loop());
    }
  }

  loop() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.98;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 6;
      this.ctx.shadowColor = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    for (let i = this.texts.length - 1; i >= 0; i--) {
      const t = this.texts[i];
      t.y += t.vy;
      t.alpha -= t.decay;

      if (t.alpha <= 0) {
        this.texts.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, t.alpha);
      this.ctx.font = "bold 20px 'Inter', sans-serif";
      this.ctx.fillStyle = t.color;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = t.color;
      this.ctx.textAlign = "center";
      this.ctx.fillText(t.text, t.x, t.y);
      this.ctx.restore();
    }

    if (this.particles.length > 0 || this.texts.length > 0) {
      this.animId = requestAnimationFrame(() => this.loop());
    } else {
      this.animId = null;
    }
  }
}

class AppController {
  constructor() {
    // Detección de URL base de la API
    const isGitHubPages = window.location.hostname.includes("github.io");
    const savedApi = localStorage.getItem("PYTHON_MASTER_API_URL");
    
    // Si el usuario configuró una URL la usa; si está en GitHub Pages y no hay configurada, conecta a Render automáticamente
    if (savedApi) {
      this.apiBaseUrl = savedApi.replace(/\/$/, "");
    } else if (isGitHubPages) {
      this.apiBaseUrl = "https://python-master-game-nigw.onrender.com";
    } else {
      this.apiBaseUrl = ""; // Mismo origen por defecto en local
    }

    this.token = localStorage.getItem("PYTHON_MASTER_TOKEN") || null;
    this.currentUser = JSON.parse(localStorage.getItem("PYTHON_MASTER_USER") || "null");

    this.user = {
      id: this.currentUser ? this.currentUser.username : "default_user",
      username: this.currentUser ? this.currentUser.username : "Invitado",
      fullName: this.currentUser ? this.currentUser.full_name : "Python Master",
      xp: this.currentUser ? (this.currentUser.xp || 150) : 150,
      level: this.currentUser ? (this.currentUser.level || 1) : 1,
      rankTitle: this.currentUser ? (this.currentUser.rank_title || "Recluta del Byte") : "Recluta del Byte",
      nextLevelXp: 200,
      streak: 3,
      completedLessons: JSON.parse(localStorage.getItem("PYTHON_MASTER_COMPLETED") || "[]"),
      achievements: []
    };

    this.modules = [];
    this.sqlChallenges = [];
    this.currentSqlMode = "auto";
    this.selectedMissionId = null;
    this.currentBlockId = null;
    this.currentLessonId = null;
    this.isBackendOnline = false;

    // Motores de Audio y Partículas
    this.sound = new SoundFX();
    this.fx = null;
    this.ghostDuel = null;

    // Estado del Sistema de Rompecabezas (Parsons Problems)
    this.currentPuzzleLesson = null;
    this.puzzleState = {
      pool: [],
      assembled: []
    };

    this.atmCurrentBalance = 1000.00;
  }

  async init() {
    this.fx = new FXParticleEngine("fxCanvas");
    this.updateSoundButtonUI();

    // Desbloquear audio en la primera interacción (iOS / Safari)
    document.addEventListener("click", () => this.sound.init(), { once: true });
    document.addEventListener("touchstart", () => this.sound.init(), { once: true });

    this.updateAuthButtonUI();
    this.updateHeaderStats();
    
    // Intentar verificar conectividad con el backend
    await this.checkBackendHealth();

    // Cargar módulos (con fallback inmediato para que NUNCA aparezca en blanco)
    await this.loadModules();
    await this.loadUserProfile();
    await this.loadSqlChallenges();
    
    this.renderRoadmap();
    this.renderBriefClasses();
  }

  apiUrl(endpoint) {
    if (endpoint.startsWith("http")) return endpoint;
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    if (!this.apiBaseUrl) return cleanEndpoint;
    return `${this.apiBaseUrl}${cleanEndpoint}`;
  }

  getAuthHeaders(extraHeaders = {}) {
    const headers = { "Content-Type": "application/json", ...extraHeaders };
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async checkBackendHealth() {
    const dot = document.getElementById("apiStatusDot");
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      
      const res = await fetch(this.apiUrl("/health"), { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (res.ok) {
        this.isBackendOnline = true;
        if (dot) {
          dot.classList.add("online");
          dot.title = "Backend Conectado & Operativo";
        }
        return true;
      }
    } catch (e) {
      this.isBackendOnline = false;
      if (dot) {
        dot.classList.remove("online");
        dot.title = "Modo Local / Backend Desconectado (Pulsa ⚙️ para conectar Render)";
      }
    }
    return false;
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

    // 1. Intentar iniciar sesión en el backend si está disponible
    try {
      const res = await fetch(this.apiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: ident, password: pwd })
      });
      const data = await res.json();

      if (res.ok && data.token) {
        this.setAuthenticatedUser(data.token, data.user);
        alert(`🎉 ¡Bienvenido de nuevo, ${this.user.fullName || this.user.username}!`);
        return;
      } else if (res.status === 401 || res.status === 400) {
        statusMsg.style.color = "#f87171";
        statusMsg.textContent = data.detail || "Credenciales incorrectas.";
        return;
      }
    } catch (e) {
      console.warn("Backend no respondió, activando fallback local:", e);
    }

    // 2. Fallback Modo Local (Offline o sin backend configurado)
    const localUser = {
      id: ident,
      username: ident,
      email: `${ident}@local.app`,
      full_name: ident.charAt(0).toUpperCase() + ident.slice(1),
      xp: this.user.xp || 150,
      level: this.user.level || 1,
      rank_title: this.user.rankTitle || "Recluta del Byte"
    };
    this.setAuthenticatedUser("local_token_" + Date.now(), localUser);
    alert(`🎉 ¡Bienvenido, ${localUser.full_name}! Has ingresado en Modo Local.`);
  }

  async submitRegister() {
    const username = document.getElementById("regUser").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const fullName = document.getElementById("regFullName").value.trim();
    const pwd = document.getElementById("regPwd").value.trim();
    const statusMsg = document.getElementById("authStatusMsg");

    statusMsg.style.display = "block";
    statusMsg.style.color = "var(--primary)";
    statusMsg.textContent = "Creando cuenta de usuario...";

    // 1. Intentar registrar en el backend si está configurado
    try {
      const res = await fetch(this.apiUrl("/api/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, full_name: fullName, password: pwd })
      });
      const data = await res.json();

      if (res.ok && data.token) {
        this.setAuthenticatedUser(data.token, data.user);
        alert(`🚀 ¡Registro exitoso en Supabase! Tienes +150 XP de bienvenida.`);
        return;
      } else if (res.status === 400) {
        statusMsg.style.color = "#f87171";
        statusMsg.textContent = data.detail || "Error en el registro.";
        return;
      }
    } catch (e) {
      console.warn("Backend no disponible para registro, activando modo local:", e);
    }

    // 2. Fallback de Registro Local Inteligente (Garantiza que el usuario NUNCA quede bloqueado)
    const localUser = {
      id: username,
      username: username,
      email: email,
      full_name: fullName || username,
      xp: 150,
      level: 1,
      rank_title: "Recluta del Byte"
    };

    this.setAuthenticatedUser("local_token_" + Date.now(), localUser);
    alert(`🎉 ¡Bienvenido al Reino, ${localUser.full_name}!\n\nTu cuenta se ha activado en Modo Local con +150 XP.\n\nPara sincronizar con Supabase en la nube, pulsa el botón ⚙️ en el encabezado e ingresa tu enlace de Render.`);
  }

  setAuthenticatedUser(token, userData) {
    this.token = token;
    this.currentUser = userData;
    localStorage.setItem("PYTHON_MASTER_TOKEN", token);
    localStorage.setItem("PYTHON_MASTER_USER", JSON.stringify(userData));

    this.user.id = userData.username;
    this.user.username = userData.username;
    this.user.fullName = userData.full_name;
    this.user.xp = userData.xp || 150;
    this.user.level = userData.level || 1;
    this.user.rankTitle = userData.rank_title || "Recluta del Byte";

    this.updateAuthButtonUI();
    this.closeAuthModal();
    this.updateHeaderStats();
  }

  logout() {
    this.token = null;
    this.currentUser = null;
    localStorage.removeItem("PYTHON_MASTER_TOKEN");
    localStorage.removeItem("PYTHON_MASTER_USER");
    this.user.id = "default_user";
    this.user.username = "Invitado";
    this.user.fullName = "Python Master";
    this.updateAuthButtonUI();
    this.updateHeaderStats();
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
    const fb = document.getElementById("apiTestFeedback");
    fb.style.display = "none";
    document.getElementById("viewApiModal").style.display = "flex";
  }

  closeApiModal() {
    document.getElementById("viewApiModal").style.display = "none";
  }

  async testAndSaveApiUrl() {
    const input = document.getElementById("inputApiBaseUrl");
    const rawVal = input.value.trim().replace(/\/$/, "");
    const fb = document.getElementById("apiTestFeedback");
    
    fb.style.display = "block";
    fb.style.color = "var(--primary)";
    fb.textContent = "Probando conexión con el servicio web...";

    if (!rawVal) {
      this.setLocalApi();
      return;
    }

    try {
      const res = await fetch(`${rawVal}/health`, { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        this.apiBaseUrl = rawVal;
        localStorage.setItem("PYTHON_MASTER_API_URL", rawVal);
        this.isBackendOnline = true;
        
        fb.style.color = "#34d399";
        fb.innerHTML = `✅ ¡Conexión exitosa con Render! Servicio: <strong>${data.app || 'Python Master'}</strong>`;
        
        setTimeout(() => {
          this.closeApiModal();
          this.init();
        }, 1200);
        return;
      }
    } catch (e) {
      console.warn("Prueba fallida de URL:", e);
    }

    // Si falló pero el usuario quiere guardarla (por si Render está en cold start)
    if (confirm("El servidor no respondió de inmediato (los servicios gratuitos en Render tardan ~40 seg en arrancar si estaban inactivos).\n\n¿Deseas guardar esta URL de todos modos?")) {
      this.apiBaseUrl = rawVal;
      localStorage.setItem("PYTHON_MASTER_API_URL", rawVal);
      this.closeApiModal();
      this.init();
    } else {
      fb.style.color = "#f87171";
      fb.textContent = "No se pudo conectar a la URL. Verifica que sea correcta y que el servicio en Render haya terminado de compilar.";
    }
  }

  setLocalApi() {
    this.apiBaseUrl = "";
    localStorage.removeItem("PYTHON_MASTER_API_URL");
    const fb = document.getElementById("apiTestFeedback");
    fb.style.display = "block";
    fb.style.color = "var(--accent-gold)";
    fb.textContent = "Configurado en Modo Local (Mismo Origen).";
    setTimeout(() => {
      this.closeApiModal();
      this.init();
    }, 800);
  }

  // ==================== PERFIL & GAMIFICACIÓN ====================
  async loadUserProfile() {
    try {
      const res = await fetch(this.apiUrl("/api/progress"), {
        headers: this.getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        this.user.xp = data.xp || this.user.xp;
        this.user.level = data.level || this.user.level;
        this.user.rankTitle = data.rank_title || this.user.rankTitle;
        this.user.nextLevelXp = data.next_level_xp || 200;
        this.user.streak = data.streak_days || 3;
        this.user.completedLessons = data.completed_lessons || this.user.completedLessons;
        this.user.achievements = data.achievements || [];
        this.updateHeaderStats();
        return;
      }
    } catch (e) {
      console.warn("Perfil cargado desde almacenamiento local.");
    }
    this.updateHeaderStats();
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

    const pct = Math.min(100, Math.round((this.user.xp / this.user.nextLevelXp) * 100));
    document.getElementById("levelProgressFill").style.width = `${pct}%`;
  }

  async addXP(amount, reason = "Reto superado") {
    const oldLevel = this.user.level;
    this.user.xp += amount;
    
    // Efectos audiovisuales instantáneos (Web Audio API + Canvas Partículas)
    if (this.sound) this.sound.playSuccess();
    if (this.fx) {
      this.fx.spawn(window.innerWidth / 2, 90, 35, ["#f59e0b", "#38bdf8", "#10b981", "#ffffff"]);
      this.fx.spawnText(window.innerWidth / 2, 130, `+${amount} XP!`, "#f59e0b");
    }

    // Cálculo de nivel local
    if (this.user.xp >= 3200) {
      this.user.level = 6;
      this.user.rankTitle = "Staff Engineer & Arquitecto";
    } else if (this.user.xp >= 2000) {
      this.user.level = 5;
      this.user.rankTitle = "Titán de SQL & Datos";
    } else if (this.user.xp >= 1200) {
      this.user.level = 4;
      this.user.rankTitle = "Mago de la POO";
    } else if (this.user.xp >= 600) {
      this.user.level = 3;
      this.user.rankTitle = "Maestro de Estructuras";
    } else if (this.user.xp >= 200) {
      this.user.level = 2;
      this.user.rankTitle = "Explorador de Bucles";
    }

    if (this.user.level > oldLevel && this.fx) {
      this.fx.spawn(window.innerWidth / 2, window.innerHeight / 2, 60, ["#f59e0b", "#38bdf8", "#10b981", "#ffffff"]);
      this.fx.spawnText(window.innerWidth / 2, window.innerHeight / 2 - 30, `¡SUBISTE A NIVEL ${this.user.level}!`, "#38bdf8");
    }

    if (this.currentUser) {
      this.currentUser.xp = this.user.xp;
      this.currentUser.level = this.user.level;
      this.currentUser.rank_title = this.user.rankTitle;
      localStorage.setItem("PYTHON_MASTER_USER", JSON.stringify(this.currentUser));
    }

    this.updateHeaderStats();

    // Intentar sincronizar con el servidor
    try {
      await fetch(this.apiUrl("/api/progress/add_xp"), {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ user_id: this.user.id, xp_amount: amount, reason: reason })
      });
    } catch (e) {
      // Guardado localmente sin problemas
    }
  }

  // ==================== ROADMAP & LECCIONES (NUNCA EN BLANCO) ====================
  async loadModules() {
    let loadedFromApi = false;
    try {
      const res = await fetch(this.apiUrl("/api/modules"));
      if (res.ok) {
        const data = await res.json();
        if (data.modules && data.modules.length > 0) {
          this.modules = data.modules;
          loadedFromApi = true;
        }
      }
    } catch (e) {
      console.warn("No se pudo obtener módulos desde API. Usando base local incorporada...");
    }

    // Respaldo inmediato si el API no responde o está en blanco
    if (!loadedFromApi && window.CURRICULUM_FALLBACK) {
      this.modules = window.CURRICULUM_FALLBACK.map(block => ({
        id: block.id,
        title: block.title,
        days: block.days,
        icon: block.icon,
        description: block.description,
        lessons_count: block.lessons.length
      }));
    }
  }

  renderRoadmap() {
    const container = document.getElementById("gameRoadmap");
    if (!container) return;

    if (!this.modules || this.modules.length === 0) {
      // Si por alguna razón está vacío, usar el fallback directamente
      if (window.CURRICULUM_FALLBACK) {
        this.modules = window.CURRICULUM_FALLBACK.map(block => ({
          id: block.id,
          title: block.title,
          days: block.days,
          icon: block.icon,
          description: block.description,
          lessons_count: block.lessons.length
        }));
      }
    }

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
    const container = document.getElementById(`nodes_block_${blockId}`);
    if (!container) return;

    let lessons = [];

    // Intentar desde API
    try {
      const res = await fetch(this.apiUrl(`/api/modules/${blockId}`));
      if (res.ok) {
        const data = await res.json();
        lessons = data.block.lessons || [];
      }
    } catch (e) {
      // Ignorar error de red
    }

    // Fallback local garantizado
    if (lessons.length === 0 && window.CURRICULUM_FALLBACK) {
      const blockData = window.CURRICULUM_FALLBACK.find(b => b.id === blockId);
      if (blockData) lessons = blockData.lessons;
    }

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
  }

  async openBlockQuests(blockId) {
    let firstLesson = null;
    try {
      const res = await fetch(this.apiUrl(`/api/modules/${blockId}`));
      if (res.ok) {
        const data = await res.json();
        firstLesson = data.block.lessons[0];
      }
    } catch (e) {
      // Fallback
    }

    if (!firstLesson && window.CURRICULUM_FALLBACK) {
      const blk = window.CURRICULUM_FALLBACK.find(b => b.id === blockId);
      if (blk && blk.lessons.length > 0) firstLesson = blk.lessons[0];
    }

    if (firstLesson) {
      this.openLessonModal(blockId, firstLesson.id);
    }
  }

  async openLessonModal(blockId, lessonId) {
    this.currentBlockId = blockId;
    this.currentLessonId = lessonId;

    let lesson = null;

    try {
      const res = await fetch(this.apiUrl(`/api/modules/${blockId}/lesson/${lessonId}`));
      if (res.ok) {
        const data = await res.json();
        lesson = data.lesson;
      }
    } catch (e) {
      // Fallback local
    }

    if (!lesson && window.CURRICULUM_FALLBACK) {
      const blk = window.CURRICULUM_FALLBACK.find(b => b.id === blockId);
      if (blk) lesson = blk.lessons.find(l => l.id === lessonId);
    }

    if (!lesson) {
      alert("No se pudo cargar la información de la lección.");
      return;
    }

    if (this.sound) this.sound.playTap();

    const hasPuzzle = lesson.exercise && Array.isArray(lesson.exercise.puzzle_pieces) && lesson.exercise.puzzle_pieces.length > 0;
    if (hasPuzzle) {
      this.currentPuzzleLesson = lesson;
      const rawPieces = [
        ...lesson.exercise.puzzle_pieces,
        ...(lesson.exercise.puzzle_distractors || [])
      ];
      this.puzzleState = {
        pool: rawPieces.map((p, idx) => {
          const m = p.match(/^(\s+)/);
          const rawSpaces = m ? m[1].length : 0;
          const initialIndent = Math.min(3, Math.floor(rawSpaces / 4));
          return {
            id: `p_${idx}`,
            text: p.trim(),
            indent: initialIndent
          };
        }).sort(() => Math.random() - 0.5),
        assembled: []
      };
    }

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

        ${hasPuzzle ? `
          <div class="editor-mode-tabs" style="margin-top: 12px; margin-bottom: 10px;">
            <button id="btnModePuzzle" class="editor-mode-btn active" onclick="app.switchEditorMode('puzzle')">🧩 Armar Rompecabezas (2D Bloques)</button>
            <button id="btnModeCode" class="editor-mode-btn" onclick="app.switchEditorMode('code')">💻 Escribir Código Libre</button>
          </div>

          <!-- Modo Rompecabezas de Código 2D -->
          <div id="puzzleViewSection" class="puzzle-container">
            <div class="puzzle-section-label">
              <span>📦 Piezas Disponibles (Toca para agregar):</span>
              <button class="btn-secondary" style="font-size: 0.7rem; padding: 2px 8px;" onclick="app.resetPuzzle()">🔄 Reiniciar</button>
            </div>
            <div id="puzzlePool" class="puzzle-pool"></div>

            <div class="puzzle-section-label" style="margin-top: 12px;">
              <span>🧩 Función Ensamblada (Usa ◀ / ▶ para ajustar la indentación):</span>
            </div>
            <div id="puzzleDropzone" class="puzzle-dropzone"></div>

            <div style="margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap;">
              <button class="btn-primary" style="flex: 1;" onclick="app.testPuzzleSolution('${blockId}', '${lessonId}')">⚡ Probar Solución del Rompecabezas</button>
              <button class="btn-secondary" onclick="app.transferPuzzleToEditor()">Editar como Texto →</button>
            </div>
          </div>
        ` : ''}

        <!-- Modo Editor de Código Libre -->
        <div id="codeViewSection" style="${hasPuzzle ? 'display: none;' : ''}">
          <!-- Barra Ergonómica de Símbolos Python para Móvil -->
          <div class="code-accessory-bar">
            <button type="button" class="acc-btn" onclick="app.insertSymbol('    ')">Tab</button>
            <button type="button" class="acc-btn" onclick="app.insertSymbol(':')">:</button>
            <button type="button" class="acc-btn" onclick="app.insertSymbol('()', 1)">( )</button>
            <button type="button" class="acc-btn" onclick="app.insertSymbol('\'\'', 1)">' '</button>
            <button type="button" class="acc-btn" onclick="app.insertSymbol('\"\"', 1)">" "</button>
            <button type="button" class="acc-btn" onclick="app.insertSymbol('[]', 1)">[ ]</button>
            <button type="button" class="acc-btn" onclick="app.insertSymbol(' == ')">==</button>
            <button type="button" class="acc-btn" onclick="app.insertSymbol('def ')">def</button>
            <button type="button" class="acc-btn" onclick="app.insertSymbol('return ')">return</button>
            <button type="button" class="acc-btn" onclick="app.insertSymbol(' -> ')">-&gt;</button>
            <button type="button" class="acc-btn" onclick="app.insertSymbol('print()', 1)">print()</button>
          </div>
          <textarea id="lessonCodeEditor" class="code-editor-area">${lesson.exercise.starter_code}</textarea>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
            <button class="btn-primary" onclick="app.executeLessonCode('${blockId}', '${lessonId}')">⚡ Ejecutar Código</button>
          </div>
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

    if (hasPuzzle) {
      this.renderPuzzleUI();
    }

    modal.style.display = "flex";
  }

  closeLessonModal() {
    document.getElementById("viewLessonModal").style.display = "none";
  }

  submitQuizAnswer(selectedIdx, correctIdx, explanation) {
    const feedback = document.getElementById("quizFeedbackBox");
    feedback.style.display = "block";

    if (selectedIdx === correctIdx) {
      if (this.sound) this.sound.playQuizCorrect();
      if (this.fx) {
        this.fx.spawn(window.innerWidth / 2, window.innerHeight / 2, 35, ["#34d399", "#f59e0b", "#ffffff"]);
        this.fx.spawnText(window.innerWidth / 2, window.innerHeight / 2 - 40, "¡RESPUESTA CORRECTA!", "#34d399");
      }
      feedback.style.background = "rgba(16, 185, 129, 0.15)";
      feedback.style.border = "1px solid rgba(16, 185, 129, 0.4)";
      feedback.style.color = "#34d399";
      feedback.innerHTML = `<strong>✅ ¡Correcto! (+20 XP)</strong><br>${explanation}`;
      this.addXP(20, "Respuesta correcta en Quizz");
    } else {
      if (this.sound) this.sound.playError();
      feedback.style.background = "rgba(239, 68, 68, 0.15)";
      feedback.style.border = "1px solid rgba(239, 68, 68, 0.4)";
      feedback.style.color = "#f87171";
      feedback.innerHTML = `<strong>❌ No es correcto.</strong><br>${explanation}`;
    }
  }

  async executeLessonCode(blockId, lessonId) {
    if (this.sound) this.sound.playTap();
    const code = document.getElementById("lessonCodeEditor").value;
    const term = document.getElementById("codeTerminalOutput");
    term.style.display = "block";
    term.innerHTML = "⏳ Ejecutando en sandbox aislado de CPython...";

    try {
      const res = await fetch(this.apiUrl("/api/execute"), {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ block_id: blockId, exercise_id: lessonId, code: code })
      });
      const data = await res.json();

      if (data.passed) {
        if (this.sound) this.sound.playSuccess();
        if (this.fx) {
          this.fx.spawn(window.innerWidth / 2, window.innerHeight / 2, 50, ["#38bdf8", "#f59e0b", "#10b981", "#ffffff"]);
          this.fx.spawnText(window.innerWidth / 2, window.innerHeight / 2 - 50, "¡TESTS PASADOS! +50 XP", "#38bdf8");
        }
        term.innerHTML = `<span style="color: #34d399; font-weight: 800;">✅ ¡TESTS PASADOS EXITOSAMENTE! (+50 XP)</span><br><br>${data.stdout ? data.stdout : 'Sin salida estándar.'}`;
        this.addXP(50, "Reto de código superado");
        
        if (!this.user.completedLessons.includes(lessonId)) {
          this.user.completedLessons.push(lessonId);
          localStorage.setItem("PYTHON_MASTER_COMPLETED", JSON.stringify(this.user.completedLessons));
          
          fetch(this.apiUrl("/api/progress"), {
            method: "POST",
            headers: this.getAuthHeaders(),
            body: JSON.stringify({ block_id: blockId, lesson_id: lessonId, completed: true, score: 100, xp_earned: 50 })
          }).catch(() => {});

          this.loadBlockNodes(blockId);
          this.updateHeaderStats();
        }
      } else {
        if (this.sound) this.sound.playError();
        term.innerHTML = `<span style="color: #f87171; font-weight: 700;">❌ PRUEBAS FALLIDAS:</span><br><pre style="color: #cbd5e1; margin-top: 4px;">${data.stderr || data.stdout || 'La prueba de aserción no se cumplió.'}</pre>`;
      }
    } catch (e) {
      if (this.sound) this.sound.playError();
      term.innerHTML = `<span style="color: #f87171;">Nota: Para ejecutar código Python real en el servidor se requiere conectar el Backend en Render (pulsa ⚙️).</span>`;
    }
  }

  // ==================== MÉTODOS DEL MODO ROMPECABEZAS (PARSONS 2D) ====================
  switchEditorMode(mode) {
    if (this.sound) this.sound.playTap();
    const btnPuzzle = document.getElementById("btnModePuzzle");
    const btnCode = document.getElementById("btnModeCode");
    const puzzleSec = document.getElementById("puzzleViewSection");
    const codeSec = document.getElementById("codeViewSection");

    if (mode === "puzzle") {
      if (btnPuzzle) btnPuzzle.classList.add("active");
      if (btnCode) btnCode.classList.remove("active");
      if (puzzleSec) puzzleSec.style.display = "block";
      if (codeSec) codeSec.style.display = "none";
    } else {
      if (btnPuzzle) btnPuzzle.classList.remove("active");
      if (btnCode) btnCode.classList.add("active");
      if (puzzleSec) puzzleSec.style.display = "none";
      if (codeSec) codeSec.style.display = "block";
    }
  }

  renderPuzzleUI() {
    const poolEl = document.getElementById("puzzlePool");
    const dropEl = document.getElementById("puzzleDropzone");
    if (!poolEl || !dropEl) return;

    // Renderizar piezas disponibles
    poolEl.innerHTML = "";
    if (this.puzzleState.pool.length === 0) {
      poolEl.innerHTML = `<span style="font-size: 0.75rem; color: var(--text-muted); font-style: italic; padding: 4px;">¡Todas las piezas han sido agregadas a la solución!</span>`;
    } else {
      this.puzzleState.pool.forEach((piece) => {
        const item = document.createElement("div");
        item.className = "puzzle-piece";
        item.innerHTML = `
          <code>${this.escapeHtml(piece.text)}</code>
          <span style="font-size: 0.72rem; color: var(--primary); font-weight: 700;">+ Agregar</span>
        `;
        item.onclick = () => this.selectPuzzlePiece(piece.id);
        poolEl.appendChild(item);
      });
    }

    // Renderizar piezas ensambladas con controles 2D de indentación
    dropEl.innerHTML = "";
    if (this.puzzleState.assembled.length === 0) {
      dropEl.innerHTML = `<span style="font-size: 0.75rem; color: var(--text-muted); font-style: italic; padding: 8px;">Toca piezas arriba para ensamblar. Usa ◀ / ▶ para ajustar la indentación de Python.</span>`;
    } else {
      this.puzzleState.assembled.forEach((piece, idx) => {
        const item = document.createElement("div");
        item.className = "puzzle-piece-assembled";
        const indentGuide = piece.indent > 0 
          ? `margin-left: ${piece.indent * 20}px; border-left: 3px solid #38bdf8;` 
          : `border-left: 3px solid #10b981;`;
        item.style = indentGuide;

        item.innerHTML = `
          <div class="puzzle-piece-content">
            <span style="color: var(--accent-gold); font-weight: 700; font-size: 0.72rem; min-width: 18px;">${idx + 1}.</span>
            <code>${this.escapeHtml(piece.text)}</code>
          </div>
          <div class="indent-controls">
            <button type="button" class="btn-indent" onclick="event.stopPropagation(); app.adjustPuzzleIndent('${piece.id}', -1)" title="Reducir sangría">◀</button>
            <span class="indent-level-badge">${piece.indent === 0 ? 'Base' : 'Niv ' + piece.indent}</span>
            <button type="button" class="btn-indent" onclick="event.stopPropagation(); app.adjustPuzzleIndent('${piece.id}', 1)" title="Aumentar sangría">▶</button>
            <button type="button" class="btn-remove-piece" onclick="event.stopPropagation(); app.removePuzzlePiece('${piece.id}')" title="Quitar pieza">✖</button>
          </div>
        `;
        dropEl.appendChild(item);
      });
    }
  }

  selectPuzzlePiece(pieceId) {
    const idx = this.puzzleState.pool.findIndex(p => p.id === pieceId);
    if (idx !== -1) {
      if (this.sound) this.sound.playSnap();
      const [piece] = this.puzzleState.pool.splice(idx, 1);
      this.puzzleState.assembled.push(piece);
      this.renderPuzzleUI();
    }
  }

  removePuzzlePiece(pieceId) {
    const idx = this.puzzleState.assembled.findIndex(p => p.id === pieceId);
    if (idx !== -1) {
      if (this.sound) this.sound.playRemove();
      const [piece] = this.puzzleState.assembled.splice(idx, 1);
      this.puzzleState.pool.push(piece);
      this.renderPuzzleUI();
    }
  }

  adjustPuzzleIndent(pieceId, delta) {
    const piece = this.puzzleState.assembled.find(p => p.id === pieceId);
    if (piece) {
      piece.indent = Math.max(0, Math.min(3, (piece.indent || 0) + delta));
      if (this.sound) this.sound.playIndent();
      this.renderPuzzleUI();
    }
  }

  resetPuzzle() {
    if (this.sound) this.sound.playTap();
    if (!this.currentPuzzleLesson || !this.currentPuzzleLesson.exercise) return;
    const rawPieces = [
      ...this.currentPuzzleLesson.exercise.puzzle_pieces,
      ...(this.currentPuzzleLesson.exercise.puzzle_distractors || [])
    ];
    this.puzzleState = {
      pool: rawPieces.map((p, idx) => {
        const m = p.match(/^(\s+)/);
        const rawSpaces = m ? m[1].length : 0;
        const initialIndent = Math.min(3, Math.floor(rawSpaces / 4));
        return {
          id: `p_${idx}`,
          text: p.trim(),
          indent: initialIndent
        };
      }).sort(() => Math.random() - 0.5),
      assembled: []
    };
    this.renderPuzzleUI();
  }

  getAssembledPuzzleCode() {
    return this.puzzleState.assembled.map(p => '    '.repeat(p.indent || 0) + p.text.trim()).join("\n");
  }

  transferPuzzleToEditor() {
    if (this.sound) this.sound.playTap();
    const code = this.getAssembledPuzzleCode();
    const editor = document.getElementById("lessonCodeEditor");
    if (editor && code.trim()) {
      editor.value = code;
    }
    this.switchEditorMode("code");
  }

  async testPuzzleSolution(blockId, lessonId) {
    if (this.sound) this.sound.playTap();
    const code = this.getAssembledPuzzleCode();
    if (!code.trim()) {
      alert("Arma al menos una o más piezas antes de probar la solución.");
      return;
    }
    const editor = document.getElementById("lessonCodeEditor");
    if (editor) {
      editor.value = code;
    }
    await this.executeLessonCode(blockId, lessonId);
  }

  insertSymbol(symbol, cursorOffset = 0, targetId = "lessonCodeEditor") {
    if (this.sound) this.sound.playTap();
    const textarea = document.getElementById(targetId);
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const val = textarea.value;

    textarea.value = val.substring(0, start) + symbol + val.substring(end);
    const newPos = start + symbol.length - cursorOffset;
    textarea.selectionStart = newPos;
    textarea.selectionEnd = newPos;
    textarea.focus();
  }

  toggleSound() {
    const isEnabled = this.sound.toggle();
    this.updateSoundButtonUI();
    if (isEnabled && this.sound) this.sound.playTap();
  }

  updateSoundButtonUI() {
    const btn = document.getElementById("btnSoundToggle");
    if (btn) {
      btn.innerText = this.sound.enabled ? "🔊" : "🔇";
      btn.classList.toggle("muted", !this.sound.enabled);
    }
  }

  // ==================== ARENA DE DUELOS FANTASMA (GHOST DUELS) ====================
  openGhostDuelModal() {
    if (this.sound) this.sound.playTap();
    const modal = document.getElementById("viewDuelModal");
    if (!modal) return;

    this.ghostDuel = {
      active: true,
      seconds: 0,
      playerProgress: 0,
      ghostProgress: 0,
      ghostSpeed: Math.random() * 5 + 6,
      timerInterval: null,
      ghostInterval: null
    };

    const timerBadge = document.getElementById("duelTimerBadge");
    const playerBar = document.getElementById("playerProgressBar");
    const ghostBar = document.getElementById("ghostProgressBar");
    const playerPct = document.getElementById("playerProgressPct");
    const ghostPct = document.getElementById("ghostProgressPct");
    const playerName = document.getElementById("duelPlayerName");
    const ticker = document.getElementById("ghostStatusTicker");
    const term = document.getElementById("duelTerminalOutput");

    if (timerBadge) timerBadge.innerText = "⏱️ 00:00";
    if (playerBar) playerBar.style.width = "0%";
    if (ghostBar) ghostBar.style.width = "0%";
    if (playerPct) playerPct.innerText = "0%";
    if (ghostPct) ghostPct.innerText = "0%";
    if (playerName) playerName.innerText = this.user.username;
    if (ticker) ticker.innerText = "👻 ShadowCoder_89 está analizando el enunciado...";
    if (term) term.style.display = "none";

    this.ghostDuel.timerInterval = setInterval(() => {
      if (!this.ghostDuel || !this.ghostDuel.active) return;
      this.ghostDuel.seconds++;
      const m = String(Math.floor(this.ghostDuel.seconds / 60)).padStart(2, "0");
      const s = String(this.ghostDuel.seconds % 60).padStart(2, "0");
      if (timerBadge) timerBadge.innerText = `⏱️ ${m}:${s}`;
    }, 1000);

    const ghostPhrases = [
      "👻 ShadowCoder_89 definió la signatura invertir_texto...",
      "👻 El rival escribió el operador de paso [::-1]...",
      "👻 ShadowCoder_89 está ejecutando sus aserciones...",
      "👻 ¡El fantasma casi termina! Apresúrate..."
    ];

    let phraseIdx = 0;
    this.ghostDuel.ghostInterval = setInterval(() => {
      if (!this.ghostDuel || !this.ghostDuel.active) return;
      this.ghostDuel.ghostProgress = Math.min(100, this.ghostDuel.ghostProgress + this.ghostDuel.ghostSpeed);
      if (ghostBar) ghostBar.style.width = `${this.ghostDuel.ghostProgress}%`;
      if (ghostPct) ghostPct.innerText = `${Math.round(this.ghostDuel.ghostProgress)}%`;

      if (phraseIdx < ghostPhrases.length && ticker) {
        ticker.innerText = ghostPhrases[phraseIdx++];
      }

      if (this.ghostDuel.ghostProgress >= 100) {
        clearInterval(this.ghostDuel.ghostInterval);
        if (ticker) ticker.innerText = "⚠️ ¡El fantasma completó su código! Tienes pocos segundos para superarlo...";
      }
    }, 1800);

    modal.style.display = "flex";
  }

  closeGhostDuelModal() {
    if (this.sound) this.sound.playTap();
    if (this.ghostDuel) {
      this.ghostDuel.active = false;
      clearInterval(this.ghostDuel.timerInterval);
      clearInterval(this.ghostDuel.ghostInterval);
    }
    const modal = document.getElementById("viewDuelModal");
    if (modal) modal.style.display = "none";
  }

  async submitDuelCode() {
    if (this.sound) this.sound.playTap();
    const code = document.getElementById("duelCodeEditor").value;
    const term = document.getElementById("duelTerminalOutput");
    const playerBar = document.getElementById("playerProgressBar");
    const playerPct = document.getElementById("playerProgressPct");
    term.style.display = "block";
    term.innerHTML = "⏳ Verificando solución en el sandbox de duelos...";

    const duelTest = `
assert invertir_texto('python') == 'nohtyp', 'Esperado nohtyp'
assert invertir_texto('reconocer') == 'reconocer'
assert invertir_texto('') == ''
print('¡Duelo superado exitosamente!')
`;

    try {
      const res = await fetch(this.apiUrl("/api/execute"), {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ block_id: "bloque_1", lesson_id: "duel_reversal", code: code + "\n" + duelTest })
      });
      const data = await res.json();

      if (data.passed) {
        const playerWon = this.ghostDuel && this.ghostDuel.ghostProgress < 100;
        if (this.ghostDuel) {
          this.ghostDuel.active = false;
          clearInterval(this.ghostDuel.timerInterval);
          clearInterval(this.ghostDuel.ghostInterval);
        }

        if (playerBar) playerBar.style.width = "100%";
        if (playerPct) playerPct.innerText = "100%";

        if (playerWon) {
          if (this.sound) this.sound.playSuccess();
          if (this.fx) {
            this.fx.spawn(window.innerWidth / 2, window.innerHeight / 2, 60, ["#f59e0b", "#38bdf8", "#10b981", "#ffffff"]);
            this.fx.spawnText(window.innerWidth / 2, window.innerHeight / 2 - 40, "¡VICTORIA EN DUELO! +100 XP", "#34d399");
          }
          this.addXP(100, "Victoria en Duelo Fantasma");
          term.innerHTML = `<span style="color: #34d399; font-weight: 800;">🏆 ¡VICTORIA APLASTANTE! DERROTASTE AL FANTASMA (+100 XP)</span><br><br>${data.stdout}`;
        } else {
          if (this.sound) this.sound.playSuccess();
          this.addXP(30, "Completado tras el fantasma");
          term.innerHTML = `<span style="color: #f59e0b; font-weight: 700;">🥈 ¡Bien jugado! Tu solución es correcta, aunque el fantasma fue más veloz (+30 XP).</span><br><br>${data.stdout}`;
        }
      } else {
        if (this.sound) this.sound.playError();
        term.innerHTML = `<span style="color: #f87171;">❌ PRUEBAS DEL DUELO FALLIDAS:</span><br><pre style="color: #cbd5e1; margin-top: 4px;">${data.stderr || data.stdout || 'Verifica la aserción.'}</pre>`;
      }
    } catch (e) {
      if (this.sound) this.sound.playError();
      term.innerHTML = `<span style="color: #f87171;">Nota: Conecta el backend en Render para validar duelos con ejecución de código.</span>`;
    }
  }

  escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ==================== CURSO DE SQL ====================
  async loadSqlChallenges() {
    let loaded = false;
    try {
      const res = await fetch(this.apiUrl("/api/sql/challenges"));
      if (res.ok) {
        const data = await res.json();
        this.sqlChallenges = data.challenges || [];
        loaded = true;
      }
    } catch (e) {
      // Ignorar
    }

    if (!loaded && window.SQL_CHALLENGES_FALLBACK) {
      this.sqlChallenges = window.SQL_CHALLENGES_FALLBACK;
    }
    this.renderSqlMissions();
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
      tableContainer.innerHTML = `<div style="padding: 14px; color: #f87171;">Para consultar la base de datos de Supabase en vivo necesitas conectar tu servicio en Render (pulsa ⚙️).</div>`;
    }
  }

  async toggleSchemaExplorer() {
    const content = document.getElementById("schemaExplorerContent");
    const isHidden = content.style.display === "none";
    content.style.display = isHidden ? "block" : "none";

    if (isHidden) {
      let tablesData = null;
      try {
        const res = await fetch(this.apiUrl("/api/sql/schema"));
        if (res.ok) {
          const data = await res.json();
          tablesData = data.tables;
        }
      } catch (e) {
        // Fallback schema
      }

      if (!tablesData) {
        tablesData = {
          "usuarios": [
            {"name": "id", "type": "INTEGER", "pk": true},
            {"name": "nombre", "type": "VARCHAR"},
            {"name": "email", "type": "VARCHAR"},
            {"name": "rol", "type": "VARCHAR"},
            {"name": "saldo", "type": "NUMERIC"},
            {"name": "activo", "type": "BOOLEAN"}
          ],
          "productos": [
            {"name": "id", "type": "INTEGER", "pk": true},
            {"name": "nombre", "type": "VARCHAR"},
            {"name": "categoria", "type": "VARCHAR"},
            {"name": "precio", "type": "NUMERIC"},
            {"name": "stock", "type": "INTEGER"}
          ],
          "reservas_hotel": [
            {"name": "id", "type": "INTEGER", "pk": true},
            {"name": "cliente_nombre", "type": "VARCHAR"},
            {"name": "habitacion_tipo", "type": "VARCHAR"},
            {"name": "noches", "type": "INTEGER"},
            {"name": "total", "type": "NUMERIC"}
          ]
        };
      }

      const grid = document.getElementById("schemaTablesGrid");
      grid.innerHTML = "";

      Object.entries(tablesData).forEach(([tableName, cols]) => {
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
      alert("Para sembrar datos en Supabase se requiere conectar la API en Render (pulsa ⚙️).");
    }
  }

  // ==================== MICRO-PROGRAMAS ====================
  async runCalculatorApp() {
    const expr = document.getElementById("calcInput").value;
    const box = document.getElementById("calcOutput");
    box.style.display = "block";
    box.innerHTML = "Calculando...";

    // Evaluar expresión en backend si está disponible o con JS seguro
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
        return;
      }
    } catch (e) {
      // Fallback evaluación matemática simple en cliente
      try {
        const clean = expr.replace(/\*\*/g, "^");
        const val = Function(`'use strict'; return (${expr.replace(/\*\*/g, '**').replace(/\/\//g, '/')})`)();
        box.innerHTML = `
          <strong style="color: #38bdf8; font-size: 1.1rem;">Resultado: ${val}</strong><br>
          <span style="color: var(--accent-gold); font-size: 0.75rem;">Modo de cálculo local</span>
          <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 6px;">Evaluado de acuerdo con la precedencia PEMDAS.</p>
        `;
        this.addXP(5, "Uso de Calculadora AST");
        return;
      } catch (err) {
        box.innerHTML = `<span style="color: #f87171;">Expresión matemática no válida.</span>`;
      }
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
    const nombre = document.getElementById("idNombre").value.trim();
    const apellido = document.getElementById("idApellido").value.trim();
    const anio = parseInt(document.getElementById("idAnio").value);
    const empresa = document.getElementById("idEmpresa").value.trim() || "globalmentoring";
    const box = document.getElementById("idEmailOutput");

    if (!nombre || !apellido) {
      alert("Por favor ingresa nombre y apellido.");
      return;
    }

    box.style.display = "block";
    box.innerHTML = "Generando...";

    try {
      const res = await fetch(this.apiUrl("/api/microapps/generate_id_email"), {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ nombre, apellido, anio_nacimiento: anio || 1995, empresa })
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
        return;
      }
    } catch (e) {
      // Fallback local instantáneo con slicing
      const idUnico = `${nombre.slice(0, 2).toUpperCase()}${apellido.slice(0, 2).toUpperCase()}${String(anio || 95).slice(-2)}${Math.floor(1000 + Math.random() * 9000)}`;
      const email = `${nombre.toLowerCase()}.${apellido.toLowerCase()}@${empresa.toLowerCase()}.com`;
      box.innerHTML = `
        <div style="margin-bottom: 6px;">
          <span style="color: var(--accent-gold); font-size: 0.72rem; font-weight: 700;">ID ÚNICO NORMALIZADO (Reto 53):</span>
          <div style="font-family: var(--font-mono); font-size: 1rem; color: #38bdf8;">${idUnico}</div>
        </div>
        <div>
          <span style="color: #34d399; font-size: 0.72rem; font-weight: 700;">EMAIL INSTITUCIONAL (Reto 40):</span>
          <div style="font-family: var(--font-mono); font-size: 0.88rem; color: #f8fafc;">${email}</div>
        </div>
      `;
      this.addXP(10, "Generación de ID y Email");
    }
  }

  async runHotelApp() {
    const cliente = document.getElementById("hotelCliente").value;
    const habitacion = document.getElementById("hotelHabitacion").value;
    const noches = parseInt(document.getElementById("hotelNoches").value) || 1;
    const desayuno = document.getElementById("hotelDesayuno").checked;
    const box = document.getElementById("hotelOutput");

    box.style.display = "block";
    box.innerHTML = "Cotizando...";

    const precios = { estandar: 75.0, vista_mar: 180.0, presidencial: 320.0 };
    const tarifa = precios[habitacion] || 75.0;
    const subtotal = tarifa * noches;
    const desc = (noches > 3) ? subtotal * 0.10 : 0.0;
    const costDesayuno = desayuno ? 20.0 * noches : 0.0;
    const total = subtotal - desc + costDesayuno;

    box.innerHTML = `
      <strong style="color: var(--primary);">Reserva para ${cliente}</strong><br>
      <span style="font-size: 0.8rem;">Estancia: ${noches} noches • Tarifa: $${tarifa}/noche</span><br>
      <span style="font-size: 0.8rem;">Subtotal: $${subtotal.toFixed(2)}</span><br>
      <span style="font-size: 0.8rem; color: #34d399;">Descuento aplicado: -$${desc.toFixed(2)}</span><br>
      <strong style="color: var(--accent-gold); font-size: 1.05rem;">Total Final: $${total.toFixed(2)}</strong>
    `;
    this.addXP(10, "Cotización de Reserva de Hotel");
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

    let achList = this.user.achievements;
    if ((!achList || achList.length === 0) && window.ACHIEVEMENTS_FALLBACK) {
      achList = window.ACHIEVEMENTS_FALLBACK;
    }

    container.innerHTML = "";
    (achList || []).forEach(a => {
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

  // ==================== NAVEGACIÓN ====================
  switchTab(tabKey) {
    if (this.sound) this.sound.playTap();
    const tabs = {
      camino: "tabCamino",
      sql: "tabSql",
      apps: "tabApps",
      clases: "tabClases",
      logros: "tabLogros"
    };

    const targetTab = document.getElementById(tabs[tabKey]);
    if (!targetTab) return;

    // Transición suave por hardware para iOS 15 / Desktop
    const main = document.getElementById("mainApp");
    if (main) {
      main.style.opacity = "0.7";
      main.style.transform = "scale(0.99)";
      setTimeout(() => {
        main.style.opacity = "1";
        main.style.transform = "scale(1)";
      }, 90);
    }

    document.querySelectorAll(".view-tab").forEach(tab => tab.classList.remove("active"));
    targetTab.classList.add("active");

    document.querySelectorAll(".mobile-nav .nav-item").forEach(item => item.classList.remove("active"));
    const navButtons = document.querySelectorAll(".mobile-nav .nav-item");
    const tabIndex = Object.keys(tabs).indexOf(tabKey);
    if (navButtons[tabIndex]) navButtons[tabIndex].classList.add("active");

    window.scrollTo({ top: 0, behavior: "smooth" });
    if (tabKey === "logros") this.renderAchievements();
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
