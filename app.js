document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // --- PROCEDURAL WEB AUDIO ENGINE ---
  // ==========================================
  let isAudioEnabled = localStorage.getItem("max-portfolio-audio") === "true";

  function playHoverSound() {
    if (!isAudioEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1500, ctx.currentTime);
      gain.gain.setValueAtTime(0.004, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {}
  }

  function playClickSound() {
    if (!isAudioEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch (e) {}
  }

  function playTypewriterSound() {
    if (!isAudioEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const bufferSize = ctx.sampleRate * 0.02; // 20ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1200;
      filter.Q.value = 5;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.02);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
      noise.stop(ctx.currentTime + 0.02);
    } catch (e) {}
  }

  function attachAudioListeners() {
    const hoverables = document.querySelectorAll(
      'button, a, input, select, textarea, [class*="brutalist-shadow"], [class*="brutalist-card-shadow"]',
    );
    hoverables.forEach((el) => {
      if (el.dataset.audioBound) return;
      el.dataset.audioBound = "true";
      el.addEventListener("mouseenter", playHoverSound);
      if (
        (el.tagName === "INPUT" &&
          (el.type === "text" || el.type === "email" || el.type === "range")) ||
        el.tagName === "TEXTAREA"
      ) {
        el.addEventListener("input", playTypewriterSound);
      } else {
        el.addEventListener("click", playClickSound);
      }
    });
  }

  attachAudioListeners();
  const audioObserver = new MutationObserver(attachAudioListeners);
  audioObserver.observe(document.body, { childList: true, subtree: true });

  // ==========================================
  // --- THEME PALETTE MANAGER & CSS Presets ---
  // ==========================================
  const themes = {
    vanilla: {
      "--color-bg": "#faf9f6",
      "--color-border": "#000000",
      "--color-accent-yellow": "#fde047",
      "--color-accent-cyan": "#22d3ee",
      "--color-accent-green": "#4ade80",
      "--color-accent-pink": "#fb7185",
      "--color-text": "#000000",
      "--color-text-main": "#1f2937",
      "--color-text-muted": "#4b5563",
      "--color-card-bg": "#ffffff",
    },
    terminal: {
      "--color-bg": "#070a0e",
      "--color-border": "#39ff14",
      "--color-accent-yellow": "#00ffcc",
      "--color-accent-cyan": "#00ffff",
      "--color-accent-green": "#39ff14",
      "--color-accent-pink": "#ff0055",
      "--color-text": "#39ff14",
      "--color-text-main": "#ffffff",
      "--color-text-muted": "#88ff88",
      "--color-card-bg": "#0d131a",
    },
    cyberpunk: {
      "--color-bg": "#190225",
      "--color-border": "#00ffff",
      "--color-accent-yellow": "#ffff00",
      "--color-accent-cyan": "#00ffff",
      "--color-accent-green": "#39ff14",
      "--color-accent-pink": "#ff007f",
      "--color-text": "#ffffff",
      "--color-text-main": "#ffffff",
      "--color-text-muted": "#b19ffb",
      "--color-card-bg": "#2b093d",
    },
    retro: {
      "--color-bg": "#8bac0f",
      "--color-border": "#0f380f",
      "--color-accent-yellow": "#9bbc0f",
      "--color-accent-cyan": "#8bac0f",
      "--color-accent-green": "#306230",
      "--color-accent-pink": "#0f380f",
      "--color-text": "#0f380f",
      "--color-text-main": "#0f380f",
      "--color-text-muted": "#306230",
      "--color-card-bg": "#9bbc0f",
    },
  };

  const urlParams = new URLSearchParams(window.location.search);
  const queryTheme = urlParams.get('theme');
  if (queryTheme && themes[queryTheme]) {
    localStorage.setItem('max-portfolio-theme', queryTheme);
  }
  let currentThemeName = queryTheme || localStorage.getItem('max-portfolio-theme') || 'vanilla';

  function updateLinkThemes(themeName) {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('javascript:')) {
        try {
          // Normalize paths by converting to absolute URL, appending search param, and returning relative href
          const url = new URL(href, window.location.href);
          url.searchParams.set('theme', themeName);
          const relativeHref = url.pathname.substring(url.pathname.lastIndexOf('/') + 1) + url.search + url.hash;
          link.setAttribute('href', relativeHref);
        } catch (e) {}
      }
    });
  }

  function applyTheme(themeName) {
    const themeProps = themes[themeName] || themes.vanilla;
    const root = document.documentElement;
    Object.keys(themeProps).forEach((prop) => {
      root.style.setProperty(prop, themeProps[prop]);
    });
    localStorage.setItem("max-portfolio-theme", themeName);
    updateLinkThemes(themeName);
  }

  applyTheme(currentThemeName);

  // ==========================================
  // --- HEADER INJECTOR FOR CONTROLS ---
  // ==========================================
  const headerContainer = document.querySelector("header > div");
  const headerElement = document.querySelector("header");

  if (headerContainer) {
    // Hide whatsapp button on mobile header to optimize space
    const whatsappCta = document.getElementById("nav-cta-whatsapp");
    if (whatsappCta) {
      whatsappCta.classList.add("hidden", "md:inline-block");
    }

    const controlsWrapper = document.createElement("div");
    controlsWrapper.id = "header-controls";
    controlsWrapper.className = "flex items-center gap-2";

    // 1. Desktop Controls Wrapper (Visible only on desktop md and up)
    const desktopControls = document.createElement("div");
    desktopControls.className = "hidden md:flex items-center gap-2";

    const desktopAudioBtn = document.createElement("button");
    desktopAudioBtn.id = "header-audio-toggle";
    desktopAudioBtn.className =
      "w-8 h-8 border-2 border-black font-mono font-bold text-xs flex items-center justify-center brutalist-shadow-yellow brutalist-btn-active transition-all cursor-pointer bg-accentYellow";
    desktopAudioBtn.title = "Toggle Audio Feedback";

    const desktopThemeBtn = document.createElement("button");
    desktopThemeBtn.id = "header-theme-cycle";
    desktopThemeBtn.className =
      "w-8 h-8 border-2 border-black font-mono font-bold text-xs flex items-center justify-center brutalist-shadow-cyan brutalist-btn-active transition-all cursor-pointer bg-accentCyan";
    desktopThemeBtn.title = "Cycle Brutalist Palette";
    desktopThemeBtn.innerHTML = '<i class="fas fa-palette"></i>';

    desktopControls.appendChild(desktopAudioBtn);
    desktopControls.appendChild(desktopThemeBtn);

    // 2. Mobile Hamburger Button (Visible only on mobile)
    const hamburgerBtn = document.createElement("button");
    hamburgerBtn.id = "mobile-hamburger";
    hamburgerBtn.className =
      "md:hidden w-8 h-8 border-2 border-black font-mono font-bold text-xs flex items-center justify-center brutalist-shadow-pink brutalist-btn-active transition-all cursor-pointer bg-accentPink";
    hamburgerBtn.title = "Open Menu";
    hamburgerBtn.innerHTML = '<i class="fas fa-bars"></i>';

    controlsWrapper.appendChild(desktopControls);
    controlsWrapper.appendChild(hamburgerBtn);

    const lastChild = headerContainer.lastElementChild;
    if (lastChild) {
      if (lastChild.tagName === "DIV") {
        lastChild.classList.add("flex", "items-center", "gap-3");
        lastChild.insertBefore(controlsWrapper, lastChild.firstChild);
      } else {
        headerContainer.insertBefore(controlsWrapper, lastChild);
      }
    }

    // Mobile Menu Dropdown Injection
    if (headerElement) {
      const mobileMenu = document.createElement("div");
      mobileMenu.id = "mobile-menu-overlay";
      mobileMenu.className =
        "hidden absolute top-16 left-0 w-full border-b-4 border-black flex flex-col z-30 font-mono font-bold text-xs bg-white divide-y-2 divide-black transition-all duration-300 transform -translate-y-2 opacity-0";
      mobileMenu.innerHTML = `
        <a href="index.html#projects" class="p-4 hover:bg-accentYellow transition-colors flex justify-between items-center text-black">
          <span>PROJECTS</span> <i class="fas fa-chevron-right text-xs"></i>
        </a>
        <a href="about.html" class="p-4 hover:bg-accentCyan transition-colors flex justify-between items-center text-black">
          <span>ABOUT ME</span> <i class="fas fa-chevron-right text-xs"></i>
        </a>
        <a href="experience.html" class="p-4 hover:bg-accentGreen transition-colors flex justify-between items-center text-black">
          <span>EXPERIENCE</span> <i class="fas fa-chevron-right text-xs"></i>
        </a>
        <a href="contact.html" class="p-4 hover:bg-accentPink transition-colors flex justify-between items-center text-black">
          <span>CONTACT</span> <i class="fas fa-chevron-right text-xs"></i>
        </a>
        <div class="p-3 bg-darkbg text-zinc-500 font-mono text-[9px] uppercase tracking-wider select-none border-t border-black">
          SYSTEM CONTROLS
        </div>
        <div id="mobile-audio-toggle" class="p-4 flex justify-between items-center bg-white hover:bg-accentYellow cursor-pointer transition-colors text-black menu-toggle-row">
          <span>AUDIO FEEDBACK</span>
          <span id="mobile-audio-status" class="px-2 py-0.5 border-2 border-black bg-accentYellow text-black font-extrabold text-[10px]">ON</span>
        </div>
        <div id="mobile-theme-toggle" class="p-4 flex justify-between items-center bg-white hover:bg-accentCyan cursor-pointer transition-colors text-black menu-toggle-row">
          <span>CYCLE PALETTE</span>
          <span id="mobile-theme-status" class="px-2 py-0.5 border-2 border-black bg-accentCyan text-black font-extrabold text-[10px] uppercase">VANILLA</span>
        </div>
        <a href="https://wa.me/2348167430278" target="_blank" class="p-4 flex justify-between items-center bg-accentGreen text-black font-bold hover:bg-emerald-400 transition-colors whatsapp-btn border-t border-black">
          <span>WHATSAPP CONNECT</span>
          <i class="fab fa-whatsapp text-sm"></i>
        </a>
      `;
      headerElement.appendChild(mobileMenu);

      let isMenuOpen = false;

      function toggleMobileMenu() {
        isMenuOpen = !isMenuOpen;
        playClickSound();

        if (isMenuOpen) {
          mobileMenu.classList.remove("hidden");
          setTimeout(() => {
            mobileMenu.classList.remove("-translate-y-2", "opacity-0");
            mobileMenu.classList.add("translate-y-0", "opacity-100");
          }, 10);
          hamburgerBtn.innerHTML = '<i class="fas fa-xmark"></i>';
          hamburgerBtn.title = "Close Menu";
          hamburgerBtn.className =
            "md:hidden w-8 h-8 border-2 border-black font-mono font-bold text-xs flex items-center justify-center brutalist-shadow-yellow brutalist-btn-active transition-all cursor-pointer bg-accentYellow";
        } else {
          mobileMenu.classList.remove("translate-y-0", "opacity-100");
          mobileMenu.classList.add("-translate-y-2", "opacity-0");
          setTimeout(() => {
            if (!isMenuOpen) mobileMenu.classList.add("hidden");
          }, 300);
          hamburgerBtn.innerHTML = '<i class="fas fa-bars"></i>';
          hamburgerBtn.title = "Open Menu";
          hamburgerBtn.className =
            "md:hidden w-8 h-8 border-2 border-black font-mono font-bold text-xs flex items-center justify-center brutalist-shadow-pink brutalist-btn-active transition-all cursor-pointer bg-accentPink";
        }
      }

      hamburgerBtn.addEventListener("click", toggleMobileMenu);

      mobileMenu.querySelectorAll("a:not(.whatsapp-btn)").forEach((link) => {
        link.addEventListener("click", () => {
          if (isMenuOpen) toggleMobileMenu();
        });
      });

      // Mobile Menu Listeners
      const mobileAudioToggle = document.getElementById("mobile-audio-toggle");
      if (mobileAudioToggle) {
        mobileAudioToggle.addEventListener("click", () => {
          isAudioEnabled = !isAudioEnabled;
          localStorage.setItem("max-portfolio-audio", isAudioEnabled);
          updateAudioUI();
          playClickSound();
        });
      }

      const mobileThemeToggle = document.getElementById("mobile-theme-toggle");
      if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener("click", () => {
          const themeKeys = Object.keys(themes);
          let nextIndex =
            (themeKeys.indexOf(currentThemeName) + 1) % themeKeys.length;
          currentThemeName = themeKeys[nextIndex];
          applyTheme(currentThemeName);
          playClickSound();
          updateThemeUI();
        });
      }
    }

    function updateAudioUI() {
      if (desktopAudioBtn) {
        desktopAudioBtn.innerHTML = isAudioEnabled
          ? '<i class="fas fa-volume-high"></i>'
          : '<i class="fas fa-volume-xmark"></i>';
      }
      const mobileStatusEl = document.getElementById("mobile-audio-status");
      if (mobileStatusEl) {
        mobileStatusEl.textContent = isAudioEnabled ? "ON" : "OFF";
        if (isAudioEnabled) {
          mobileStatusEl.className =
            "px-2 py-0.5 border-2 border-black bg-accentYellow text-black font-extrabold text-[10px]";
        } else {
          mobileStatusEl.className =
            "px-2 py-0.5 border-2 border-black bg-zinc-400 text-black font-extrabold text-[10px]";
        }
      }
    }

    function updateThemeUI() {
      const statusEl = document.getElementById("mobile-theme-status");
      if (statusEl) {
        statusEl.textContent = currentThemeName;
      }
    }

    // Initialize UI states
    updateAudioUI();
    updateThemeUI();
    updateLinkThemes(currentThemeName);

    desktopAudioBtn.addEventListener("click", () => {
      isAudioEnabled = !isAudioEnabled;
      localStorage.setItem("max-portfolio-audio", isAudioEnabled);
      updateAudioUI();
      playClickSound();
    });

    desktopThemeBtn.addEventListener("click", () => {
      const themeKeys = Object.keys(themes);
      let nextIndex =
        (themeKeys.indexOf(currentThemeName) + 1) % themeKeys.length;
      currentThemeName = themeKeys[nextIndex];
      applyTheme(currentThemeName);
      playClickSound();
      updateThemeUI();
    });
  }

  // ==========================================
  // --- LIQUID NEOBRUTALIST TILT & SHADOWS ---
  // ==========================================
  function applyCardPhysics() {
    const cards = document.querySelectorAll(
      ".brutalist-card-shadow, .brutalist-shadow-yellow, .brutalist-shadow-cyan, .brutalist-shadow-green, .brutalist-shadow-pink",
    );
    cards.forEach((card) => {
      if (card.dataset.physicsBound) return;
      card.dataset.physicsBound = "true";

      const computedStyle = window.getComputedStyle(card);
      const originalShadow = computedStyle.boxShadow;
      const originalTransform = computedStyle.transform;

      const isBrutalistCardShadow = card.classList.contains(
        "brutalist-card-shadow",
      );
      const baseShadowDist = isBrutalistCardShadow ? 5 : 4;

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((centerY - y) / centerY) * 4;
        const rotateY = ((x - centerX) / centerX) * 4;

        const shadowX = baseShadowDist + ((centerX - x) / centerX) * 2.5;
        const shadowY = baseShadowDist + ((centerY - y) / centerY) * 2.5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(1)}deg) rotateY(${rotateY.toFixed(1)}deg) translateZ(3px)`;
        card.style.boxShadow = `${shadowX.toFixed(1)}px ${shadowY.toFixed(1)}px 0px 0px var(--color-border, #000000)`;
        card.style.transition = "none";
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform =
          originalTransform ||
          "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)";
        card.style.boxShadow =
          originalShadow ||
          `${baseShadowDist}px ${baseShadowDist}px 0px 0px var(--color-border, #000000)`;
        card.style.transition = "transform 0.4s ease, box-shadow 0.4s ease";
      });
    });
  }

  applyCardPhysics();
  const physicsObserver = new MutationObserver(applyCardPhysics);
  physicsObserver.observe(document.body, { childList: true, subtree: true });

  // ==========================================
  // --- TELEMETRY HEALTH MONITOR SYSTEM ---
  // ==========================================
  const btnStress = document.getElementById("btn-stress-test");
  const btnReboot = document.getElementById("btn-reboot-node");
  const telLogs = document.getElementById("telemetry-logs");
  const telLatency = document.getElementById("telemetry-latency");
  const telLoad = document.getElementById("telemetry-load");
  const telLed = document.getElementById("telemetry-led");

  const lfStatus = document.getElementById("lenderflow-status");
  const lfLed = document.getElementById("lenderflow-led");
  const zvStatus = document.getElementById("zeva-status");
  const zvLed = document.getElementById("zeva-led");
  const olStatus = document.getElementById("ollama-status");
  const olLed = document.getElementById("ollama-led");
  const dbStatus = document.getElementById("db-status");
  const dbLed = document.getElementById("db-led");

  if (telLogs) {
    let isTestBusy = false;

    function printTelLog(text, colorClass = "") {
      const line = document.createElement("div");
      if (colorClass) line.className = colorClass;
      line.textContent = `>>> ${text}`;
      telLogs.appendChild(line);
      telLogs.scrollTop = telLogs.scrollHeight;
    }

    setInterval(() => {
      if (isTestBusy) return;
      const newLatency = Math.floor(Math.random() * 8) + 10;
      const newLoad = (Math.random() * 1.2 + 2.8).toFixed(1);
      if (telLatency) telLatency.textContent = `${newLatency} ms`;
      if (telLoad) telLoad.textContent = `${newLoad} MB/s`;

      if (olStatus && olLed) {
        const state = Math.random() > 0.7 ? "RUNNING" : "IDLE";
        olStatus.textContent = state;
        olLed.className =
          state === "RUNNING"
            ? "w-2 h-2 bg-accentGreen border border-black rounded-full"
            : "w-2 h-2 bg-accentCyan border border-black rounded-full";
      }
    }, 3000);

    if (btnStress) {
      btnStress.addEventListener("click", () => {
        if (isTestBusy) return;
        isTestBusy = true;
        btnStress.disabled = true;
        btnReboot.disabled = true;

        if (telLatency) {
          telLatency.textContent = "382 ms";
          telLatency.className = "text-accentPink text-sm font-extrabold";
        }
        if (telLoad) {
          telLoad.textContent = "84.6 MB/s";
          telLoad.className = "text-accentPink text-sm font-extrabold";
        }
        if (telLed)
          telLed.className =
            "w-3 h-3 bg-accentPink border-2 border-black rounded-full animate-ping";

        if (lfStatus) {
          lfStatus.textContent = "OVERLOAD";
          lfStatus.className = "text-accentPink font-bold";
        }
        if (lfLed)
          lfLed.className =
            "w-2 h-2 bg-accentPink border border-black rounded-full animate-pulse";
        if (zvStatus) {
          zvStatus.textContent = "THROTTLED";
          zvStatus.className = "text-accentPink font-bold";
        }
        if (zvLed)
          zvLed.className =
            "w-2 h-2 bg-accentPink border border-black rounded-full";
        if (olStatus) {
          olStatus.textContent = "SPIKE";
          olStatus.className = "text-accentPink font-bold";
        }
        if (olLed)
          olLed.className =
            "w-2 h-2 bg-accentPink border border-black rounded-full animate-ping";
        if (dbStatus) {
          dbStatus.textContent = "LOCK WARN";
          dbStatus.className = "text-accentPink font-bold";
        }
        if (dbLed)
          dbLed.className =
            "w-2 h-2 bg-accentPink border border-black rounded-full";

        telLogs.innerHTML = "";
        printTelLog(
          "WARNING: MASSIVE NETWORK INBOUND SPIKE DETECTED",
          "text-red-400 font-bold",
        );
        setTimeout(
          () =>
            printTelLog(
              "CRITICAL: Paystack webhook queue capacity reached! [2,400 req/sec]",
              "text-red-400",
            ),
          500,
        );
        setTimeout(
          () =>
            printTelLog(
              "ALERT: CPU throttles active on Ollama engine.",
              "text-red-400",
            ),
          1000,
        );
        setTimeout(
          () =>
            printTelLog(
              "ALERT: Database connection lock triggers engaged.",
              "text-red-400",
            ),
          1500,
        );
        setTimeout(
          () =>
            printTelLog(
              "INFO: Balancing network traffic routes dynamically...",
              "text-yellow-400",
            ),
          2500,
        );
        setTimeout(
          () =>
            printTelLog(
              "INFO: Swapping Llama compilation to backup CPU core nodes...",
              "text-yellow-400",
            ),
          3000,
        );

        setTimeout(() => {
          printTelLog(
            "SUCCESS: Traffic balancing complete. Core nodes cleared.",
            "text-green-400 font-bold",
          );

          if (telLatency) {
            telLatency.className = "text-sm font-extrabold";
            telLatency.textContent = "12 ms";
          }
          if (telLoad) {
            telLoad.className = "text-sm font-extrabold";
            telLoad.textContent = "3.1 MB/s";
          }
          if (telLed)
            telLed.className =
              "w-3 h-3 bg-accentGreen border-2 border-black rounded-full animate-pulse";

          if (lfStatus) {
            lfStatus.textContent = "OK";
            lfStatus.className = "text-zinc-500 font-bold";
          }
          if (lfLed)
            lfLed.className =
              "w-2 h-2 bg-accentGreen border border-black rounded-full";
          if (zvStatus) {
            zvStatus.textContent = "OK";
            zvStatus.className = "text-zinc-500 font-bold";
          }
          if (zvLed)
            zvLed.className =
              "w-2 h-2 bg-accentGreen border border-black rounded-full";
          if (olStatus) {
            olStatus.textContent = "IDLE";
            olStatus.className = "text-zinc-500 font-bold";
          }
          if (olLed)
            olLed.className =
              "w-2 h-2 bg-accentCyan border border-black rounded-full";
          if (dbStatus) {
            dbStatus.textContent = "99.9%";
            dbStatus.className = "text-zinc-500 font-bold";
          }
          if (dbLed)
            dbLed.className =
              "w-2 h-2 bg-accentGreen border border-black rounded-full";

          btnStress.disabled = false;
          btnReboot.disabled = false;
          isTestBusy = false;
        }, 4500);
      });
    }

    if (btnReboot) {
      btnReboot.addEventListener("click", () => {
        if (isTestBusy) return;
        isTestBusy = true;
        btnStress.disabled = true;
        btnReboot.disabled = true;

        telLogs.innerHTML = "";
        printTelLog(
          "SYSTEM COMMAND: reboot -node integration_mesh",
          "text-yellow-400 font-bold",
        );

        const services = [
          { name: "Deduction Daemon", status: lfStatus, led: lfLed },
          { name: "Billing Splitting", status: zvStatus, led: zvLed },
          { name: "Ollama Engine", status: olStatus, led: olLed },
          { name: "Database Pool", status: dbStatus, led: dbLed },
        ];

        services.forEach((srv, idx) => {
          setTimeout(
            () => {
              if (srv.status) {
                printTelLog(
                  `Stopping service: ${srv.name}...`,
                  "text-zinc-400",
                );
                srv.status.textContent = "OFFLINE";
                srv.status.className = "text-zinc-400 font-bold";
              }
              if (srv.led)
                srv.led.className =
                  "w-2 h-2 bg-zinc-400 border border-black rounded-full";
            },
            (idx + 1) * 400,
          );
        });

        setTimeout(() => {
          printTelLog(
            "Node completely offline. Executing hardware cycles...",
            "text-yellow-400",
          );
          if (telLatency) telLatency.textContent = "0 ms";
          if (telLoad) telLoad.textContent = "0.0 MB/s";
          if (telLed)
            telLed.className =
              "w-3 h-3 bg-zinc-400 border-2 border-black rounded-full";
        }, 2000);

        setTimeout(() => {
          printTelLog(
            "Waking systems up. Starting core nodes...",
            "text-cyan-400",
          );
          if (telLed)
            telLed.className =
              "w-3 h-3 bg-accentCyan border-2 border-black rounded-full animate-ping";
        }, 3200);

        services.forEach((srv, idx) => {
          setTimeout(
            () => {
              if (srv.status) {
                printTelLog(
                  `Booting service: ${srv.name}... SUCCESS`,
                  "text-green-400",
                );
                srv.status.textContent = srv.name.includes("Ollama")
                  ? "IDLE"
                  : "OK";
                srv.status.className = "text-zinc-500 font-bold";
              }
              if (srv.led)
                srv.led.className = srv.name.includes("Ollama")
                  ? "w-2 h-2 bg-accentCyan border border-black rounded-full"
                  : "w-2 h-2 bg-accentGreen border border-black rounded-full";

              if (idx === 3) {
                printTelLog(
                  "REBOOT COMPLETE: Node active and stable.",
                  "text-green-400 font-bold",
                );
                if (dbStatus) dbStatus.textContent = "99.9%";
                if (telLed)
                  telLed.className =
                    "w-3 h-3 bg-accentGreen border-2 border-black rounded-full animate-pulse";
                btnStress.disabled = false;
                btnReboot.disabled = false;
                isTestBusy = false;
              }
            },
            3600 + idx * 400,
          );
        });
      });
    }
  }

  // ==========================================
  // --- LENDERFLOW PLATFORM SPLIT GRAPH ---
  // ==========================================
  const splitSlider = document.getElementById("split-volume");
  if (splitSlider) {
    const volVal = document.getElementById("slider-volume-val");
    const gatewayFeeEl = document.getElementById("playground-gateway-fee");
    const platformFeeEl = document.getElementById("playground-platform-fee");
    const merchantPayoutEl = document.getElementById(
      "playground-merchant-payout",
    );
    const playLatencyEl = document.getElementById("playground-latency");

    const svgMerchLabel = document.getElementById("svg-merch-label");
    const svgPlatLabel = document.getElementById("svg-plat-label");

    const flowIn = document.getElementById("flow-in");
    const flowMerch = document.getElementById("flow-merchant");
    const flowPlat = document.getElementById("flow-platform");

    function updateSplitPlayground() {
      const volume = parseFloat(splitSlider.value);
      if (volVal) volVal.textContent = `₦${volume.toLocaleString()}`;

      let gatewayFee = volume * 0.015 + 100;
      if (gatewayFee > 2000) gatewayFee = 2000;

      const platformFee = volume * 0.02;
      const merchantPayout = volume - gatewayFee - platformFee;

      if (gatewayFeeEl)
        gatewayFeeEl.textContent = `-₦${gatewayFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      if (platformFeeEl)
        platformFeeEl.textContent = `₦${platformFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      if (merchantPayoutEl)
        merchantPayoutEl.textContent = `₦${merchantPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

      if (svgMerchLabel)
        svgMerchLabel.textContent = `₦${Math.round(merchantPayout).toLocaleString()}`;
      if (svgPlatLabel)
        svgPlatLabel.textContent = `₦${Math.round(platformFee).toLocaleString()}`;

      const latency = Math.floor((volume / 500000) * 40) + 25;
      if (playLatencyEl) playLatencyEl.textContent = `${latency}ms`;

      const animationSpeed = (500000 / volume) * 1.5;
      const clampedSpeed = Math.max(0.2, Math.min(2.5, animationSpeed));

      if (flowIn) flowIn.style.animationDuration = `${clampedSpeed}s`;
      if (flowMerch) flowMerch.style.animationDuration = `${clampedSpeed}s`;
      if (flowPlat) flowPlat.style.animationDuration = `${clampedSpeed}s`;
    }

    splitSlider.addEventListener("input", updateSplitPlayground);
    updateSplitPlayground();
  }

  // ==========================================
  // --- VIBECORE LLM-CLOUD PLAYGROUND ---
  // ==========================================
  const objectivePresets = document.getElementById("objective-presets");
  const sandboxObjective = document.getElementById("sandbox-objective");
  const btnRunSandbox = document.getElementById("btn-run-sandbox");
  const sandboxStatus = document.getElementById("sandbox-run-status");
  const sandboxLogs = document.getElementById("sandbox-terminal-logs");

  if (sandboxLogs) {
    const presetsMap = {
      "PHP-Router": {
        objective:
          "Compile secure transaction router in PHP with a 2-second timeout.",
        logs: [
          {
            text: 'vc.py: Analyzing objective: "Compile secure transaction router in PHP..."',
            delay: 100,
            class: "text-zinc-400",
          },
          {
            text: "vc.py: Waking Ollama local engine (Llama-3-8B)... OK",
            delay: 600,
            class: "text-green-400",
          },
          {
            text: "vc.py: Ollama is drafting transaction_router.php in shadow_workspace...",
            delay: 1100,
            class: "text-zinc-300",
          },
          {
            text: "vc.py: Shadow script created. Appending validation unit tests...",
            delay: 1800,
            class: "text-zinc-300",
          },
          {
            text: "vc.py: Executing shadow tests: PHPUnit transaction_router_test.php",
            delay: 2400,
            class: "text-cyan-400 font-bold",
          },
          {
            text: "vc.py: [FAIL] Test 1 (Secure Timeout Headers) failed (Expected timeout 2s, got 30s).",
            delay: 3000,
            class: "text-accentPink font-bold",
          },
          {
            text: "vc.py: Calling cloud reasoning agent (Gemini 1.5 Flash) for self-healing patch...",
            delay: 3500,
            class: "text-accentYellow",
          },
          {
            text: "vc.py: Cloud agent proposed patch: set stream_context_create timeout to 2.",
            delay: 4200,
            class: "text-accentYellow",
          },
          {
            text: "vc.py: Applying self-healing script adjustments in shadow workspace...",
            delay: 4700,
            class: "text-zinc-300",
          },
          {
            text: "vc.py: Re-executing PHPUnit transaction_router_test.php... SUCCESS (4/4 tests passed)",
            delay: 5300,
            class: "text-green-400 font-bold",
          },
          {
            text: "vc.py: Merging transaction_router.php back into project master branch... DONE",
            delay: 5900,
            class: "text-green-400",
          },
          {
            text: "vc.py: Objective fully achieved. Codebase stable.",
            delay: 6400,
            class: "text-green-400 font-extrabold",
          },
        ],
      },
      "SQL-Lock": {
        objective:
          "Build pessimistic lock query for wallet debit to avoid double-spend race conditions.",
        logs: [
          {
            text: 'vc.py: Analyzing objective: "Build pessimistic lock query for wallet debit..."',
            delay: 100,
            class: "text-zinc-400",
          },
          {
            text: "vc.py: Waking Ollama local engine (Llama-3-8B)... OK",
            delay: 600,
            class: "text-green-400",
          },
          {
            text: "vc.py: Ollama is drafting db_wallet_lock.php in shadow_workspace...",
            delay: 1100,
            class: "text-zinc-300",
          },
          {
            text: "vc.py: Drafting query: SELECT balance FROM wallets WHERE id = :id FOR UPDATE;",
            delay: 1600,
            class: "text-zinc-300 font-mono",
          },
          {
            text: "vc.py: Running concurrent transaction tests (simulate 100 rapid double-spend requests)...",
            delay: 2300,
            class: "text-cyan-400 font-bold",
          },
          {
            text: "vc.py: [FAIL] Race condition detected: 2/100 requests bypassed lock due to uncommitted transaction state.",
            delay: 3000,
            class: "text-accentPink font-bold",
          },
          {
            text: "vc.py: Swapping to Cloud Architect (Gemini 1.5 Flash) to review transaction isolation level...",
            delay: 3500,
            class: "text-accentYellow",
          },
          {
            text: "vc.py: Cloud agent proposed patch: Set transaction isolation to SERIALIZABLE.",
            delay: 4200,
            class: "text-accentYellow",
          },
          {
            text: "vc.py: Injecting PDO transaction isolation headers...",
            delay: 4700,
            class: "text-zinc-300",
          },
          {
            text: "vc.py: Re-running concurrent race tests... SUCCESS (0 double-spends allowed. All transactions sequential).",
            delay: 5400,
            class: "text-green-400 font-bold",
          },
          {
            text: "vc.py: Objective fully achieved. DB schema secure.",
            delay: 6000,
            class: "text-green-400 font-extrabold",
          },
        ],
      },
      UnitTest: {
        objective:
          "Generate PHPUnit test suite for token billing cron routines.",
        logs: [
          {
            text: 'vc.py: Analyzing objective: "Generate PHPUnit test suite for token billing..."',
            delay: 100,
            class: "text-zinc-400",
          },
          {
            text: "vc.py: Waking Ollama local engine (Llama-3-8B)... OK",
            delay: 600,
            class: "text-green-400",
          },
          {
            text: "vc.py: Ollama is drafting billing_cron_test.php in shadow_workspace...",
            delay: 1100,
            class: "text-zinc-300",
          },
          {
            text: "vc.py: Shadow script created. Running validation PHPUnit suite...",
            delay: 1800,
            class: "text-cyan-400",
          },
          {
            text: "vc.py: [SUCCESS] Test 1: testCardLinkValidation passed",
            delay: 2300,
            class: "text-green-400",
          },
          {
            text: "vc.py: [SUCCESS] Test 2: testAutoDeductionCapPassed passed",
            delay: 2800,
            class: "text-green-400",
          },
          {
            text: "vc.py: [SUCCESS] Test 3: testCronStatusClearPassed passed",
            delay: 3300,
            class: "text-green-400",
          },
          {
            text: "vc.py: Objective fully achieved. Unit test suite fully drafted in 3.3 seconds.",
            delay: 4000,
            class: "text-green-400 font-extrabold",
          },
        ],
      },
    };

    if (objectivePresets && sandboxObjective) {
      objectivePresets.addEventListener("change", () => {
        const selected = objectivePresets.value;
        if (presetsMap[selected]) {
          sandboxObjective.value = presetsMap[selected].objective;
        }
      });
    }

    if (btnRunSandbox) {
      btnRunSandbox.addEventListener("click", () => {
        const currentPreset = objectivePresets.value;
        const currentPresetData = presetsMap[currentPreset] || {
          objective: sandboxObjective.value,
          logs: [
            {
              text: `vc.py: Analyzing objective: "${sandboxObjective.value}"...`,
              delay: 100,
              class: "text-zinc-400",
            },
            {
              text: "vc.py: Waking Ollama local engine (Llama-3-8B)... OK",
              delay: 600,
              class: "text-green-400",
            },
            {
              text: "vc.py: Drafting custom solution in shadow workspace...",
              delay: 1200,
              class: "text-zinc-300",
            },
            {
              text: "vc.py: Executing sandbox tests...",
              delay: 1900,
              class: "text-cyan-400",
            },
            {
              text: "vc.py: Tests passing! Shadow script successfully merged.",
              delay: 2600,
              class: "text-green-400 font-bold",
            },
            {
              text: "vc.py: Objective fully achieved.",
              delay: 3200,
              class: "text-green-400 font-extrabold",
            },
          ],
        };

        btnRunSandbox.disabled = true;
        const origBtnText = btnRunSandbox.innerHTML;
        btnRunSandbox.innerHTML = `<i class="fas fa-spinner fa-spin text-sm"></i> RUNNING TASK...`;
        if (sandboxStatus) {
          sandboxStatus.textContent = "RUNNING DIAGNOSTICS";
          sandboxStatus.className = "text-accentYellow font-bold";
        }

        sandboxLogs.innerHTML = "";

        currentPresetData.logs.forEach((logItem, idx) => {
          setTimeout(() => {
            const line = document.createElement("div");
            if (logItem.class) line.className = logItem.class;
            line.innerHTML = logItem.text;
            sandboxLogs.appendChild(line);
            sandboxLogs.scrollTop = sandboxLogs.scrollHeight;

            if (idx === currentPresetData.logs.length - 1) {
              btnRunSandbox.disabled = false;
              btnRunSandbox.innerHTML = origBtnText;
              if (sandboxStatus) {
                sandboxStatus.textContent = "OBJECTIVE COMPLETE";
                sandboxStatus.className = "text-accentGreen font-bold";
              }
            }
          }, logItem.delay);
        });
      });
    }
  }

  // ==========================================
  // --- ORIGINAL PAGE BINDERS & LOGIC ---
  // ==========================================

  // 1. Zeva Split Calculator Logic
  const ticketTierSelect = document.getElementById("ticket-tier");
  const customPriceGroup = document.getElementById("custom-price-group");
  const ticketPriceInput = document.getElementById("ticket-price");

  const displayTotalPay = document.getElementById("display-total-pay");
  const displayZevaFee = document.getElementById("display-zeva-fee");
  const displayZevaFormula = document.getElementById("display-zeva-formula");
  const displayOrganizerPayout = document.getElementById(
    "display-organizer-payout",
  );
  const displayPaystackSplit = document.getElementById(
    "display-paystack-split",
  );

  const btnGenerateTicket = document.getElementById("btn-generate-ticket");
  const generatedTicketArea = document.getElementById("generated-ticket-area");
  const ticketQrCode = document.getElementById("ticket-qr-code");
  const ticketDetailName = document.getElementById("ticket-detail-name");
  const ticketDetailPrice = document.getElementById("ticket-detail-price");

  if (ticketTierSelect) {
    function calculateZevaSplit(price) {
      let fee = 0;
      let formula = "";

      if (price <= 0) {
        return { fee: 0, formula: "N/A", payout: 0 };
      }

      if (price < 5000) {
        // 3% + ₦100
        fee = price * 0.03 + 100;
        formula = "3% + ₦100";
      } else if (price >= 5000 && price <= 150000) {
        // 3% Flat
        fee = price * 0.03;
        formula = "3% Flat";
      } else {
        // Capped at ₦5,000 max
        fee = 5000;
        formula = "Capped at ₦5,000";
      }

      let payout = price - fee;
      return {
        fee: fee,
        formula: formula,
        payout: payout,
      };
    }

    function updateZevaCalculator() {
      let price = 0;
      const selectedTier = ticketTierSelect.value;

      if (selectedTier === "regular") {
        price = 2500;
        customPriceGroup.classList.add("hidden");
      } else if (selectedTier === "vip") {
        price = 20000;
        customPriceGroup.classList.add("hidden");
      } else if (selectedTier === "custom") {
        customPriceGroup.classList.remove("hidden");
        price = parseFloat(ticketPriceInput.value) || 0;
      }

      const result = calculateZevaSplit(price);

      displayTotalPay.textContent = `₦${price.toLocaleString()}`;
      displayZevaFee.textContent = `₦${result.fee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      displayZevaFormula.textContent = `(${result.formula})`;
      displayOrganizerPayout.textContent = `₦${result.payout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

      if (price > 0) {
        displayPaystackSplit.innerHTML = `Paystack API Split Payload Output:
{
  "amount": ${price * 100}, // in kobo
  "subaccount": "ACCT_org772v3",
  "transaction_charge": ${Math.round(result.fee * 100)} // in kobo
}`;
      } else {
        displayPaystackSplit.textContent =
          "Awaiting transaction split initialization...";
      }
    }

    ticketTierSelect.addEventListener("change", updateZevaCalculator);
    ticketPriceInput.addEventListener("input", updateZevaCalculator);
    updateZevaCalculator();

    if (btnGenerateTicket) {
      btnGenerateTicket.addEventListener("click", () => {
        let price = 0;
        const selectedTier = ticketTierSelect.value;
        let tierName = "Regular Ticket";

        if (selectedTier === "regular") {
          price = 2500;
        } else if (selectedTier === "vip") {
          price = 20000;
          tierName = "VIP Access";
        } else if (selectedTier === "custom") {
          price = parseFloat(ticketPriceInput.value) || 0;
          tierName = `Standard Admission`;
        }

        if (price <= 0) return;

        btnGenerateTicket.disabled = true;
        btnGenerateTicket.textContent = "CONNECTING TO PAYSTACK SPLIT API...";

        setTimeout(() => {
          btnGenerateTicket.disabled = false;
          btnGenerateTicket.textContent = "GENERATE LIVE TICKET";

          ticketDetailName.textContent = tierName;
          ticketDetailPrice.textContent = `₦${price.toLocaleString()}`;

          const qrContent = `ZEVA-TCKT-${Math.random().toString(36).substr(2, 9).toUpperCase()}-${price}`;
          ticketQrCode.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrContent)}&color=000000&bgcolor=fde047`;

          generatedTicketArea.classList.remove("hidden");
          generatedTicketArea.scrollIntoView({ behavior: "smooth" });
        }, 1200);
      });
    }
  }

  // 2. LenderFlow Ticker & Card Binder Logic
  const lenderFlowList = document.getElementById("lenderflow-ticker");
  const btnBindCard = document.getElementById("btn-bind-card");
  const cardBindingLogs = document.getElementById("card-binding-logs");

  if (lenderFlowList) {
    const users = [
      { email: "samson.o@gmail.com", rate: 0.15, balance: 45000 },
      { email: "esther_n@coop.ng", rate: 0.2, balance: 120000 },
      { email: "femi.alabi@micro.com", rate: 0.1, balance: 15000 },
      { email: "chioma.eze@gmail.com", rate: 0.25, balance: 3500 },
    ];

    function addLenderFlowTransaction() {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const deduction = Math.min(
        randomUser.balance * randomUser.rate,
        randomUser.balance,
      );
      const postBalance = randomUser.balance - deduction;

      randomUser.balance = postBalance <= 0 ? 0 : postBalance;

      const row = document.createElement("div");
      row.className =
        "flex items-center justify-between text-xs font-mono py-2 border-b border-black/10 opacity-0 transform translate-y-1 transition-all duration-300";

      const isCleared = randomUser.balance === 0;

      row.innerHTML = `
        <div class="flex flex-col">
          <span class="font-bold text-black">${randomUser.email}</span>
          <span class="text-[9px] text-zinc-500">Post Balance: ₦${randomUser.balance.toLocaleString()}</span>
        </div>
        <div class="flex flex-col items-end">
          <span class="text-zinc-900 font-bold">-$${deduction.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span class="px-1 py-0.5 rounded text-[8px] font-bold ${isCleared ? "bg-accentCyan border border-black" : "bg-accentGreen border border-black"} mt-0.5">
            ${isCleared ? "CLEARED" : "SUCCESS"}
          </span>
        </div>
      `;

      lenderFlowList.insertBefore(row, lenderFlowList.firstChild);

      if (lenderFlowList.children.length > 4) {
        lenderFlowList.removeChild(lenderFlowList.lastChild);
      }

      setTimeout(() => {
        row.classList.remove("opacity-0", "translate-y-1");
      }, 50);

      if (isCleared) {
        randomUser.balance = Math.floor(Math.random() * 80000) + 15000;
      }
    }

    setInterval(addLenderFlowTransaction, 4000);
    for (let i = 0; i < 3; i++) {
      addLenderFlowTransaction();
    }

    if (btnBindCard) {
      btnBindCard.addEventListener("click", () => {
        btnBindCard.disabled = true;
        btnBindCard.textContent = "LAUNCHING...";

        cardBindingLogs.innerHTML = "";
        const log1 = document.createElement("div");
        log1.className = "mb-1 text-zinc-500";
        log1.textContent =
          ">> paystack_handler.php: Launching checkout verification (100 Kobo charge)...";
        cardBindingLogs.appendChild(log1);

        setTimeout(() => {
          const log2 = document.createElement("div");
          log2.className = "mb-1 text-zinc-800 font-bold";
          log2.textContent =
            ">> paystack_handler.php: Webhook RECEIVED: charge.success (Auth Token Captured)";
          cardBindingLogs.appendChild(log2);
        }, 1500);

        setTimeout(() => {
          const log3 = document.createElement("div");
          log3.className =
            "text-black font-bold border-l-2 border-black pl-2 mt-1";
          log3.textContent =
            ">> Saved card token successfully to table: lf_card_tokens.";
          cardBindingLogs.appendChild(log3);

          btnBindCard.disabled = false;
          btnBindCard.textContent = "SIMULATE LINK CARD";
        }, 2500);
      });
    }
  }

  // 3. VibeCore OS Terminal Simulator
  const runSprintBtn = document.getElementById("btn-run-sprint");
  const checkStatusBtn = document.getElementById("btn-check-status");
  const terminalLogs = document.getElementById("terminal-logs");
  const budgetCount = document.getElementById("budget-count");
  const localCallCount = document.getElementById("local-calls");
  const cloudCallCount = document.getElementById("cloud-calls");

  if (terminalLogs) {
    let budget = 10000;
    let localCalls = 42;
    let cloudCalls = 7;
    let isTerminalBusy = false;

    const sprintLogs = [
      { text: "vc.py: Waking up VibeCore OS...", delay: 200 },
      {
        text: "vc.py: Scanning local files in /shadow_workspace...",
        delay: 500,
      },
      {
        text: 'vc.py: Reading specs manifesto: "Build split payments logic"...',
        delay: 700,
      },
      {
        text: "vc.py: Triggering Local LLM (Ollama: Llama-3)... [FREE]",
        delay: 1000,
        isLocal: true,
      },
      {
        text: "vc.py: Local LLM wrote code in /shadow_workspace...",
        delay: 1500,
      },
      {
        text: "vc.py: SyntaxError detected in checkout.js:14...",
        delay: 2000,
        isError: true,
      },
      {
        text: "vc.py: Calling Cloud Architect (Gemini 1.5 Flash)... [₦145.20]",
        delay: 2400,
        isCloud: true,
      },
      {
        text: "vc.py: Gemini resolved scopes error. Appending tests...",
        delay: 3000,
      },
      { text: "vc.py: Running test suite: npm run test...", delay: 3500 },
      {
        text: "vc.py: Shadow checks successful! 4 specs green.",
        delay: 4000,
        isSuccess: true,
      },
      {
        text: "vc.py: Merging files back to project root workspace...",
        delay: 4400,
      },
      {
        text: "vc.py: SUCCESS! Sprint complete.",
        delay: 4700,
        isSuccess: true,
      },
    ];

    function printLogLine(text, isLocal, isCloud, isError, isSuccess) {
      const line = document.createElement("div");
      line.className = "mb-1";
      if (isLocal) line.className += " text-green-400 font-bold";
      else if (isCloud) line.className += " text-cyan-400 font-bold";
      else if (isError) line.className += " text-red-400 font-bold";
      else if (isSuccess) line.className += " text-yellow-300 font-bold";

      line.textContent = text;
      terminalLogs.appendChild(line);
      terminalLogs.scrollTop = terminalLogs.scrollHeight;
    }

    runSprintBtn.addEventListener("click", () => {
      if (isTerminalBusy) return;
      isTerminalBusy = true;
      runSprintBtn.disabled = true;
      checkStatusBtn.disabled = true;

      terminalLogs.innerHTML = "";
      printLogLine("$ python vc.py sprint", false, false, false, false);

      sprintLogs.forEach((log) => {
        setTimeout(() => {
          printLogLine(
            log.text,
            log.isLocal,
            log.isCloud,
            log.isError,
            log.isSuccess,
          );

          if (log.isLocal) {
            localCalls++;
            localCallCount.textContent = localCalls;
          }
          if (log.isCloud) {
            cloudCalls++;
            cloudCallCount.textContent = cloudCalls;
            budget -= 145.2;
            budgetCount.textContent = `₦${budget.toFixed(2)}`;
          }

          if (log.text.includes("SUCCESS")) {
            isTerminalBusy = false;
            runSprintBtn.disabled = false;
            checkStatusBtn.disabled = false;
          }
        }, log.delay);
      });
    });

    checkStatusBtn.addEventListener("click", () => {
      if (isTerminalBusy) return;
      terminalLogs.innerHTML = "";
      printLogLine("$ python vc.py status", false, false, false, false);
      setTimeout(() => {
        printLogLine("--- VIBECORE OS ACTIVE ---", false, false, false, true);
        printLogLine(
          `Local Ollama Engine: Running (Llama-3-8B)`,
          false,
          true,
          false,
          false,
        );
        printLogLine(
          `Active Cloud Engine: Gemini 1.5 Flash`,
          false,
          false,
          false,
          false,
        );
        printLogLine(
          `Current Monthly Limit: ₦10,000.00`,
          false,
          false,
          false,
          false,
        );
        printLogLine(
          `Remaining Spent: ₦${budget.toFixed(2)}`,
          false,
          false,
          false,
          false,
        );
        printLogLine(
          `Local Task Runs: ${localCalls}`,
          false,
          false,
          false,
          false,
        );
        printLogLine(
          `Cloud Task Runs: ${cloudCalls}`,
          false,
          false,
          false,
          false,
        );
      }, 300);
    });
  }

  // 4. Capabilities Matrix Slider Logic
  const matrixSlider = document.getElementById("matrix-slider");
  const sliderPercent = document.getElementById("slider-focus-percent");
  const barCode = document.getElementById("bar-code");
  const barDesign = document.getElementById("bar-design");
  const matrixMindset = document.getElementById("matrix-mindset");
  const matrixTooling = document.getElementById("matrix-tooling");
  const matrixLink = document.getElementById("matrix-link");

  if (matrixSlider) {
    const matrixData = {
      1: {
        percent: "Code 100% / Design 0%",
        codeWidth: "100%",
        designWidth: "0%",
        mindset:
          "Keeping database records safe, protecting payments, and controlling AI costs automatically.",
        tooling:
          "Secure databases, command-line tools, background tasks, and AI integrations.",
        linkText: "VibeCore OS",
        linkHref: "vibecore.html",
        linkColor: "text-accentPink",
      },
      2: {
        percent: "Code 75% / Design 25%",
        codeWidth: "75%",
        designWidth: "25%",
        mindset:
          "Building super-fast screen caption overlays that show speech in real-time on top of other apps.",
        tooling: "Mobile app development, audio processing, and layout design.",
        linkText: "Vibe Caption",
        linkHref: "#contact",
        linkColor: "text-accentCyan",
      },
      3: {
        percent: "Code 50% / Design 50%",
        codeWidth: "50%",
        designWidth: "50%",
        mindset:
          "Creating smart task managers that organize daily lists, prioritize goals, and send reminders.",
        tooling: "Mobile app frameworks, notifications, and AI integrations.",
        linkText: "Prompt Pal",
        linkHref: "#contact",
        linkColor: "text-accentGreen",
      },
      4: {
        percent: "Code 25% / Design 75%",
        codeWidth: "25%",
        designWidth: "75%",
        mindset:
          "Setting up secure, automatic bank transfers to help users save money on schedule.",
        tooling:
          "Automatic payment links, clean layouts, and wallet interfaces.",
        linkText: "SaveMore",
        linkHref: "#contact",
        linkColor: "text-accentYellow",
      },
      5: {
        percent: "Code 0% / Design 100%",
        codeWidth: "0%",
        designWidth: "100%",
        mindset:
          "Designing visual brand identities, clean layouts, vector logos, and beautiful graphics.",
        tooling:
          "Photoshop, Illustrator, logo design, page layouts, and typography.",
        linkText: "Yemet Grafics Certifications",
        linkHref: "#contact",
        linkColor: "text-accentPink",
      },
    };

    function updateMatrix() {
      const val = matrixSlider.value;
      const data = matrixData[val];

      sliderPercent.textContent = data.percent;

      barCode.style.width = data.codeWidth;
      barCode.textContent = data.codeWidth !== "0%" ? "CODE" : "";

      barDesign.style.width = data.designWidth;
      barDesign.textContent = data.designWidth !== "0%" ? "DESIGN" : "";

      matrixMindset.textContent = data.mindset;
      matrixTooling.textContent = data.tooling;

      matrixLink.textContent = data.linkText;
      matrixLink.href = data.linkHref;

      // Update link colors
      matrixLink.className = `underline font-bold hover:text-black transition-colors ${data.linkColor}`;
    }

    matrixSlider.addEventListener("input", updateMatrix);
    // Initialize
    updateMatrix();
  }

  // 5. System Optimization Sandbox Logic
  const optSql = document.getElementById("opt-sql");
  const optIndex = document.getElementById("opt-index");
  const optGzip = document.getElementById("opt-gzip");
  const optToken = document.getElementById("opt-token");
  const optCache = document.getElementById("opt-cache");

  const optSqlStatus = document.getElementById("opt-sql-status");
  const optIndexStatus = document.getElementById("opt-index-status");
  const optGzipStatus = document.getElementById("opt-gzip-status");
  const optTokenStatus = document.getElementById("opt-token-status");
  const optCacheStatus = document.getElementById("opt-cache-status");

  const sandboxLatency = document.getElementById("sandbox-latency");
  const sandboxPayload = document.getElementById("sandbox-payload");
  const sandboxSecurity = document.getElementById("sandbox-security");
  const sandboxWebhook = document.getElementById("sandbox-webhook");
  const sandboxCost = document.getElementById("sandbox-cost");

  if (optSql) {
    let sqlActive = false;
    let indexActive = false;
    let gzipActive = false;
    let tokenActive = false;
    let cacheActive = false;

    function renderSandbox() {
      // 1. Latency Calculations
      let baseLatency = cacheActive ? 350 : 1550;
      let latencyReduction = indexActive ? 300 : 0;
      let currentLatency = baseLatency - latencyReduction;
      sandboxLatency.textContent = `${currentLatency.toLocaleString()} ms`;
      sandboxLatency.className =
        currentLatency <= 100
          ? "font-bold text-accentGreen"
          : currentLatency <= 350
            ? "font-bold text-accentCyan"
            : "font-bold text-yellow-300";

      // 2. Payload Weight Calculations
      let currentPayload = gzipActive ? 12 : 120;
      sandboxPayload.textContent = `${currentPayload} KB`;
      sandboxPayload.className = gzipActive
        ? "font-bold text-accentGreen"
        : "font-bold text-yellow-300";

      // 3. Security Level
      if (sqlActive) {
        sandboxSecurity.textContent = "SECURE (Prepared)";
        sandboxSecurity.className = "font-bold text-accentGreen";
      } else {
        sandboxSecurity.textContent = "HIGH (SQLi Risk)";
        sandboxSecurity.className = "font-bold text-accentPink";
      }

      // 4. Financial Webhook State
      if (tokenActive) {
        sandboxWebhook.textContent = "SECURE (Token Vault)";
        sandboxWebhook.className = "font-bold text-accentGreen";
      } else {
        sandboxWebhook.textContent = "Unsecured Callbacks";
        sandboxWebhook.className = "font-bold text-accentPink";
      }

      // 5. AI Cloud Cost
      if (cacheActive) {
        sandboxCost.textContent = "₦0.00 / run (Cached)";
        sandboxCost.className = "text-accentGreen";
      } else {
        sandboxCost.textContent = "₦145.20 / run (Gemini)";
        sandboxCost.className = "text-accentPink";
      }

      // Update button visual states
      toggleBtnVisual(
        optSql,
        optSqlStatus,
        sqlActive,
        "ON (SECURE)",
        "OFF (SQLi RISK)",
        "bg-accentGreen",
      );
      toggleBtnVisual(
        optIndex,
        optIndexStatus,
        indexActive,
        "ON (-300ms)",
        "OFF (+300ms)",
        "bg-accentCyan",
      );
      toggleBtnVisual(
        optGzip,
        optGzipStatus,
        gzipActive,
        "ON (12 KB)",
        "OFF (120 KB)",
        "bg-accentGreen",
      );
      toggleBtnVisual(
        optToken,
        optTokenStatus,
        tokenActive,
        "ON (SECURE)",
        "OFF (UNSECURED)",
        "bg-accentCyan",
      );
      toggleBtnVisual(
        optCache,
        optCacheStatus,
        cacheActive,
        "ON (₦0.00)",
        "OFF (₦145.20)",
        "bg-accentYellow",
      );
    }

    function toggleBtnVisual(
      btn,
      statusEl,
      isActive,
      onText,
      offText,
      activeBgClass,
    ) {
      if (isActive) {
        btn.classList.remove("bg-zinc-100");
        btn.classList.add(activeBgClass, "translate-x-0.5", "translate-y-0.5");
        statusEl.textContent = onText;
        statusEl.className = "font-bold text-[10px] text-black";
      } else {
        btn.classList.add("bg-zinc-100");
        btn.classList.remove(
          "bg-accentGreen",
          "bg-accentCyan",
          "bg-accentYellow",
          "translate-x-0.5",
          "translate-y-0.5",
        );
        statusEl.textContent = offText;
        statusEl.className = "font-bold text-[10px] text-red-500";
      }
    }

    optSql.addEventListener("click", () => {
      sqlActive = !sqlActive;
      renderSandbox();
    });
    optIndex.addEventListener("click", () => {
      indexActive = !indexActive;
      renderSandbox();
    });
    optGzip.addEventListener("click", () => {
      gzipActive = !gzipActive;
      renderSandbox();
    });
    optToken.addEventListener("click", () => {
      tokenActive = !tokenActive;
      renderSandbox();
    });
    optCache.addEventListener("click", () => {
      cacheActive = !cacheActive;
      renderSandbox();
    });

    // Initialize
    renderSandbox();
  }

  // 6. JSON Contact Payload Builder Logic
  const leadName = document.getElementById("lead-name");
  const leadEmail = document.getElementById("lead-email");
  const leadCompany = document.getElementById("lead-company");
  const leadBudget =
    document.getElementById("lead-budget") ||
    document.getElementById("purpose");
  const leadScope = document.getElementById("lead-scope");
  const jsonPreview = document.getElementById("json-preview");
  const btnWhatsapp = document.getElementById("transmit-whatsapp");
  const btnEmail = document.getElementById("transmit-email");
  const statusMsg = document.getElementById("status-message");

  if (leadName && jsonPreview) {
    function updateLeadJSON() {
      const payload = {
        node: "inbound_lead",
        client_name: leadName.value.trim() || "Omobayonle (Sample)",
        email: leadEmail
          ? leadEmail.value.trim() || "client@company.com"
          : "client@company.com",
        company: leadCompany
          ? leadCompany.value.trim() || "SmartTeller Tech"
          : "SmartTeller Tech",
      };

      if (leadBudget) {
        const keyName =
          leadBudget.id === "purpose" ? "connect_purpose" : "budget_tier";
        payload[keyName] = leadBudget.value || "N/A";
      } else {
        payload.budget_tier = "N/A";
      }

      payload.scope = leadScope
        ? leadScope.value.trim() || "Build a secure fintech application..."
        : "Build a secure fintech application...";

      jsonPreview.textContent = JSON.stringify(payload, null, 2);
    }

    function getPayloadText() {
      const name = leadName.value.trim() || "Anonymous";
      const email = leadEmail ? leadEmail.value.trim() || "N/A" : "N/A";
      const company = leadCompany ? leadCompany.value.trim() || "N/A" : "N/A";

      let budgetLabel = "Budget";
      let budgetVal = "N/A";
      if (leadBudget) {
        budgetLabel = leadBudget.id === "purpose" ? "Purpose" : "Budget";
        budgetVal = leadBudget.value || "N/A";
      }

      const scope = leadScope ? leadScope.value.trim() || "N/A" : "N/A";

      return (
        `[OMOBAYONLE // LEAD NODE]\n` +
        `---------------------------------\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Company: ${company}\n` +
        `${budgetLabel}: ${budgetVal}\n` +
        `Scope: ${scope}\n` +
        `-----------------\n` +
        `Generated via OMOBAYONLE (MAXDEDEV)`
      );
    }

    function showStatus(message, bgClass) {
      if (!statusMsg) return;
      statusMsg.className = `border-3 border-black p-4 font-mono text-xs font-bold text-black brutalist-card-shadow transition-all duration-300 ${bgClass}`;
      statusMsg.textContent = message;
      statusMsg.classList.remove("hidden");
      statusMsg.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function hideStatus() {
      if (statusMsg) {
        statusMsg.classList.add("hidden");
      }
    }

    function validateForm() {
      const nameVal = leadName.value.trim();
      const emailVal = leadEmail ? leadEmail.value.trim() : "";
      const scopeVal = leadScope ? leadScope.value.trim() : "";

      if (!nameVal) {
        showStatus(
          "ERROR: Client / Contact Name is required.",
          "bg-accentPink",
        );
        leadName.focus();
        return false;
      }
      if (!emailVal || !validateEmail(emailVal)) {
        showStatus(
          "ERROR: A valid Email Address is required.",
          "bg-accentPink",
        );
        if (leadEmail) leadEmail.focus();
        return false;
      }
      if (!scopeVal) {
        showStatus("ERROR: Project Scope is required.", "bg-accentPink");
        if (leadScope) leadScope.focus();
        return false;
      }
      return true;
    }

    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }

    leadName.addEventListener("input", () => {
      updateLeadJSON();
      hideStatus();
    });
    if (leadEmail) {
      leadEmail.addEventListener("input", () => {
        updateLeadJSON();
        hideStatus();
      });
    }
    if (leadCompany) {
      leadCompany.addEventListener("input", () => {
        updateLeadJSON();
        hideStatus();
      });
    }
    if (leadBudget) {
      leadBudget.addEventListener("change", () => {
        updateLeadJSON();
        hideStatus();
      });
    }
    if (leadScope) {
      leadScope.addEventListener("input", () => {
        updateLeadJSON();
        hideStatus();
      });
    }

    // Initialize preview
    updateLeadJSON();

    if (btnWhatsapp) {
      btnWhatsapp.addEventListener("click", () => {
        const nameVal = leadName.value.trim();
        const scopeVal = leadScope ? leadScope.value.trim() : "";

        if (!nameVal) {
          showStatus(
            "ERROR: Client / Contact Name is required.",
            "bg-accentPink",
          );
          leadName.focus();
          return;
        }
        if (!scopeVal) {
          showStatus("ERROR: Project Scope is required.", "bg-accentPink");
          if (leadScope) leadScope.focus();
          return;
        }

        hideStatus();
        const text = encodeURIComponent(getPayloadText());
        window.open(`https://wa.me/2348167430278?text=${text}`, "_blank");
      });
    }

    if (btnEmail) {
      btnEmail.addEventListener("click", () => {
        if (!validateForm()) return;

        // Disable buttons & update text
        btnEmail.disabled = true;
        const originalText = btnEmail.innerHTML;
        btnEmail.innerHTML = `<i class="fas fa-spinner fa-spin text-sm"></i> TRANSMITTING...`;
        if (btnWhatsapp) btnWhatsapp.disabled = true;

        hideStatus();

        const name = leadName.value.trim();
        const email = leadEmail ? leadEmail.value.trim() : "";
        const company = leadCompany ? leadCompany.value.trim() : "N/A";
        const budgetKey =
          leadBudget && leadBudget.id === "purpose"
            ? "connect_purpose"
            : "budget_tier";
        const budgetVal = leadBudget ? leadBudget.value : "N/A";
        const scope = leadScope ? leadScope.value.trim() : "N/A";

        // Submit via FormSubmit AJAX API
        fetch("https://formsubmit.co/ajax/27design.max@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: name,
            email: email,
            company: company,
            [budgetKey]: budgetVal,
            scope: scope,
            _subject: `Project Integration Node: ${company}`,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            // Enable buttons
            btnEmail.disabled = false;
            btnEmail.innerHTML = originalText;
            if (btnWhatsapp) btnWhatsapp.disabled = false;

            if (data.success === "true" || data.success === true) {
              showStatus(
                "SUCCESS: Project payload successfully transmitted to Omobayonle's integration mesh! Verification email triggered.",
                "bg-accentGreen",
              );

              // Clear form fields
              leadName.value = "";
              if (leadEmail) leadEmail.value = "";
              leadCompany.value = "";
              leadScope.value = "";
              updateLeadJSON();
            } else {
              showStatus(
                `ERROR: Transmission rejected. ${data.message || "Please try again."}`,
                "bg-accentPink",
              );
            }
          })
          .catch((error) => {
            // Enable buttons
            btnEmail.disabled = false;
            btnEmail.innerHTML = originalText;
            if (btnWhatsapp) btnWhatsapp.disabled = false;

            showStatus(
              `ERROR: API node unreachable. ${error.message || "Please check your connection and try again."}`,
              "bg-accentPink",
            );
          });
      });
    }
  }

  // ==========================================
  // --- RETRO PRELOADER ENGINE ---
  // ==========================================
  const preloader = document.getElementById("preloader");
  if (preloader) {
    document.body.classList.add("overflow-hidden");
    
    const logsContainer = document.getElementById("preloader-logs");
    const progressBar = document.getElementById("preloader-progress-bar");
    const led = document.getElementById("preloader-led");
    
    const logStatements = [
      ">>>> [INIT] CHECKING ARCHITECTURAL INTEGRITY...",
      ">>>> [NET] INTEGRATION LAYER MESH... ONLINE",
      ">>>> [AUDIO] LOADING WEB AUDIO PIPELINES...",
      ">>>> [STORAGE] CONNECTING THEME STORAGE... COMPLETE",
      ">>>> [UI] COMPILING CAPABILITIES MARQUEE...",
      ">>>> [SYS] LOAD COMPLETE. COMPILE BOOT CORE..."
    ];
    
    let logIndex = 0;
    let progress = 0;
    
    function addLog() {
      if (logIndex < logStatements.length) {
        const div = document.createElement("div");
        div.textContent = logStatements[logIndex];
        logsContainer.appendChild(div);
        logsContainer.scrollTop = logsContainer.scrollHeight;
        logIndex++;
      }
    }
    
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Final log
        const div = document.createElement("div");
        div.className = "text-accentGreen font-bold font-mono";
        div.textContent = ">>>> COMPILE COMPLETE. BOOTING CORE NODE...";
        logsContainer.appendChild(div);
        logsContainer.scrollTop = logsContainer.scrollHeight;
        
        progressBar.style.width = "100%";
        if (led) {
          led.classList.remove("bg-accentPink");
          led.classList.add("bg-accentGreen");
        }
        
        setTimeout(() => {
          preloader.classList.add("fade-out");
          document.body.classList.remove("overflow-hidden");
          
          // Play starting synth sound
          if (isAudioEnabled) {
            try {
              const ctx = new (window.AudioContext || window.webkitAudioContext)();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = "sine";
              osc.frequency.setValueAtTime(220, ctx.currentTime);
              osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
              gain.gain.setValueAtTime(0.04, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start();
              osc.stop(ctx.currentTime + 0.4);
            } catch (e) {}
          }
        }, 500);
      } else {
        progressBar.style.width = `${progress}%`;
        if (progress > (logIndex + 1) * (100 / (logStatements.length + 1))) {
          addLog();
        }
      }
    }, 80);
  }

  // ==========================================
  // --- ROTATING HERO STATEMENTS ---
  // ==========================================
  const rotatingStatementEl = document.getElementById("hero-rotating-statement");
  if (rotatingStatementEl) {
    const statements = [
      "I love building clean websites and apps.",
      "I am passionate about payment security and reliability.",
      "I enjoy designing tactile and interactive user interfaces.",
      "I automate development tasks using smart scripts.",
      "I mentor young programming students in Abeokuta."
    ];
    let statementIndex = 0;
    
    // Set initial text and trigger transition
    rotatingStatementEl.textContent = statements[0];
    rotatingStatementEl.classList.remove("opacity-0", "translate-y-2");
    rotatingStatementEl.classList.add("opacity-100", "translate-y-0");
    
    setInterval(() => {
      // Fade out
      rotatingStatementEl.classList.remove("opacity-100", "translate-y-0");
      rotatingStatementEl.classList.add("opacity-0", "translate-y-2");
      
      setTimeout(() => {
        statementIndex = (statementIndex + 1) % statements.length;
        rotatingStatementEl.textContent = statements[statementIndex];
        
        // Force layout engine reflow
        void rotatingStatementEl.offsetWidth;
        
        // Fade in
        rotatingStatementEl.classList.remove("opacity-0", "translate-y-2");
        rotatingStatementEl.classList.add("opacity-100", "translate-y-0");
      }, 500);
    }, 4000);
  }

  // ==========================================
  // --- EXPERIENCE DETAILS OS MODAL ---
  // ==========================================
  const expModalOverlay = document.getElementById("exp-modal-overlay");
  const expModal = document.getElementById("exp-modal");
  const expDetailsBtns = document.querySelectorAll(".exp-details-btn");
  
  if (expModalOverlay && expModal) {
    const expData = {
      smartteller: {
        title: "SmartTeller Tech",
        role: "Business Technical Officer (BTO) & Lead Engineer",
        duration: "2023 - PRESENT",
        responsibilities: [
          "Direct the migration of the core microfinance billing engines, processing over ₦150M in transactions securely.",
          "Implement database row locking to prevent double-billing errors during payment network drops.",
          "Build lightweight agent banking mobile interfaces with React Native and Expo, optimized to run reliably in poor network regions.",
          "Supervise software updates and lead a development team of 4 engineers, overseeing testing and deployments."
        ],
        shipped: [
          "Agent Banking Field Portal",
          "Automated Deductions Scheduler",
          "Paystack Custom Settlement Engine"
        ],
        tech: ["PHP OOP", "MySQL", "React Native", "Expo", "REST APIs", "Git", "GitHub"]
      },
      loadedapp: {
        title: "LoadedApp Nig.",
        role: "CTO & Senior Developer",
        duration: "JAN 2024 - PRESENT",
        responsibilities: [
          "Scale VTU (Virtual Top-Up) delivery system for instant automated airtime, data, and bill payments.",
          "Implement automatic transaction failovers, switching gateway nodes in under 2 seconds during timeout events.",
          "Build centralized administrative dashboards for transaction ledger verification and account mapping.",
          "Manage Linux servers (Ubuntu/CentOS), configure Nginx reverse proxies, and optimize Cloudflare cache routing."
        ],
        shipped: [
          "LoadedApp VTU API Core",
          "Utility Billing Interface",
          "FinTech Merchant Dashboard"
        ],
        tech: ["PHP PDO", "MySQL", "Linux", "Nginx", "Cloudflare", "Bootstrap", "REST APIs"]
      },
      maxdesign: {
        title: "Max Design & Tech",
        role: "Technical & Creative Lead / Director",
        duration: "NOV 2022 - PRESENT",
        responsibilities: [
          "Establish a boutique design and engineering agency, creating bespoke websites and web systems.",
          "Create vectors, visual brand guides, mockups, and layouts in Photoshop, Figma, and CorelDraw.",
          "Configure secure shared hosting, domain naming systems, email routes, and database panels via cPanel.",
          "Perform search engine optimization (SEO) configurations, boosting client traffic by up to 45%."
        ],
        shipped: [
          "2Glitz Real Estate Portal",
          "OKV RSVP Verification Portal",
          "12+ Client Graphic Portfolios"
        ],
        tech: ["HTML/CSS", "JavaScript", "PHP", "MySQL", "cPanel", "Figma", "Photoshop", "CorelDraw"]
      },
      mercyland: {
        title: "Mercyland Pacific School",
        role: "Tech Expert",
        duration: "FEB 2024 - JUL 2024",
        responsibilities: [
          "Manage student record databases and grade processing pipelines, writing automated PDF report card templates.",
          "Install and maintain classroom projector systems, Local Area Networks (LAN), and school computing laboratories."
        ],
        shipped: [
          "Automated Report Card Compiler",
          "Laboratory Network Architecture"
        ],
        tech: ["Database Design", "phpMyAdmin", "LAN Networking", "Hardware Maintenance"]
      },
      yemet: {
        title: "Yemet Grafics",
        role: "Graphic Designer",
        duration: "FEB 2023 - OCT 2023",
        responsibilities: [
          "Complete professional graphic design certifications and deliver high-quality commercial assets.",
          "Design corporate logo identities, banners, billboards, and vector templates with strict print grid alignment.",
          "Manage pre-press file validation, CMYK layout setups, and target print resolutions."
        ],
        shipped: [
          "50+ Business Print Identities",
          "Promotional Billboard Layouts"
        ],
        tech: ["Photoshop", "CorelDraw", "Adobe XD", "Canva", "Design Thinking"]
      }
    };
    
    const modalTitle = document.getElementById("exp-modal-title");
    const modalRole = document.getElementById("exp-modal-role");
    const modalDuration = document.getElementById("exp-modal-duration");
    const modalResp = document.getElementById("exp-modal-responsibilities");
    const modalShipped = document.getElementById("exp-modal-shipped");
    const modalTech = document.getElementById("exp-modal-tech");
    
    function openModal(key) {
      const data = expData[key];
      if (!data) return;
      
      modalTitle.textContent = `${data.title.toUpperCase()} // SYSTEM MODULE`;
      modalRole.textContent = data.role;
      modalDuration.textContent = data.duration;
      
      // Clean and populate responsibilities
      modalResp.innerHTML = "";
      data.responsibilities.forEach(resp => {
        const li = document.createElement("li");
        li.textContent = resp;
        modalResp.appendChild(li);
      });
      
      // Clean and populate shipped
      modalShipped.innerHTML = "";
      data.shipped.forEach(ship => {
        const li = document.createElement("li");
        li.textContent = ship;
        modalShipped.appendChild(li);
      });
      
      // Clean and populate tech
      modalTech.innerHTML = "";
      data.tech.forEach(tech => {
        const span = document.createElement("span");
        span.className = "px-2 py-0.5 border border-black bg-zinc-100 font-mono text-[9px] font-bold text-black rounded";
        span.textContent = tech;
        modalTech.appendChild(span);
      });
      
      // Play opening/tactile sound
      if (isAudioEnabled) playClickSound();
      
      // Show modal
      expModalOverlay.classList.add("active");
      document.body.classList.add("overflow-hidden");
    }
    
    function closeModal() {
      if (isAudioEnabled) playClickSound();
      expModalOverlay.classList.remove("active");
      document.body.classList.remove("overflow-hidden");
    }
    
    expDetailsBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-exp");
        openModal(key);
      });
    });
    
    const closeBtn = document.getElementById("exp-modal-close-btn");
    const closeFooter = document.getElementById("exp-modal-close-footer");
    
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (closeFooter) closeFooter.addEventListener("click", closeModal);
    
    // Close on overlay background click
    expModalOverlay.addEventListener("click", (e) => {
      if (e.target === expModalOverlay) {
        closeModal();
      }
    });
    
    // Close on Escape key press
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && expModalOverlay.classList.contains("active")) {
        closeModal();
      }
    });
  }
});
