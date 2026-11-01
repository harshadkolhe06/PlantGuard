
const input = document.getElementById("batchInput");
const slider = document.getElementById("batchSlider");
const results = document.getElementById("calcResults");
const caption = document.getElementById("batchCaption");
const presets = [...document.querySelectorAll("[data-size]")];

const recipe = [
  { name: "Neem extract powder", q: 2, u: "g", role: "Potential pest-management ingredient" },
  { name: "Garlic extract powder", q: 0.5, u: "g", role: "Plant-derived ingredient" },
  { name: "Reetha extract powder", q: 0.5, u: "g", role: "Natural surfactant source" },
  { name: "Aloe vera powder/extract", q: 0.5, u: "g", role: "Supporting ingredient" },
  { name: "Glycerin", q: 1, u: "ml", role: "Humectant" }
];

function norm(value) {
  let number = Number(value);

  if (!Number.isFinite(number)) {
    number = 100;
  }

  return Math.max(50, Math.min(1000, Math.round(number / 50) * 50));
}

function render(value) {
  const batch = norm(value);

  input.value = batch;
  slider.value = batch;

  presets.forEach(button => {
    button.classList.toggle("selected", Number(button.dataset.size) === batch);
  });

  // Calculate pricing & packaging metrics
  const estimatedValue = (batch / 100) * 65;
  const completeBottles = Math.floor(batch / 100);
  const remainingVolume = batch % 100;
  const bottleEquivalents = +(batch / 100).toFixed(2);

  const valTotalValue = document.getElementById("valTotalValue");
  const valEquivalents = document.getElementById("valEquivalents");
  const valCompleteBottles = document.getElementById("valCompleteBottles");
  const valRemainingVolume = document.getElementById("valRemainingVolume");
  const batchVolumeDisplay = document.getElementById("batchVolumeDisplay");

  if (valTotalValue) {
    valTotalValue.textContent = `₹${estimatedValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (valEquivalents) {
    valEquivalents.textContent = `${bottleEquivalents} eq`;
  }
  if (valCompleteBottles) {
    valCompleteBottles.textContent = `${completeBottles} ${completeBottles === 1 ? 'bottle' : 'bottles'}`;
  }
  if (valRemainingVolume) {
    valRemainingVolume.textContent = remainingVolume > 0 ? `${remainingVolume} ml (partial fill)` : `0 ml (exact fill)`;
  }
  if (batchVolumeDisplay) {
    batchVolumeDisplay.textContent = `${batch} ml`;
  }

  results.innerHTML = recipe.map(item => `
    <article class="calc-card">
      <span>${item.name}</span>
      <strong>${+(item.q * batch / 100).toFixed(3)} ${item.u}</strong>
      <small>${item.role}</small>
    </article>
  `).join("") + `
    <article class="calc-card">
      <span>Distilled water</span>
      <strong>To ${batch} ml</strong>
      <small>Add after mixing and filtration to reach final volume.</small>
    </article>
  `;

  caption.textContent = `Showing proposed quantities and valuation for ${batch} ml`;
}

input.addEventListener("change", () => render(input.value));

input.addEventListener("input", () => {
  if (input.value !== "") {
    render(input.value);
  }
});

slider.addEventListener("input", () => render(slider.value));

presets.forEach(button => {
  button.addEventListener("click", () => render(button.dataset.size));
});

render(100);

// Interactive preparation process
const steps = [
  {
    icon: "⚖️",
    title: "Measure materials",
    desc: "Measure the proposed quantities accurately using clean laboratory equipment."
  },
  {
  icon: "🧪",
  title: "Initial mixing",
  desc: "Take a clean mixing vessel and add a measured portion of distilled water. Gradually add the neem, garlic, Reetha and aloe vera ingredients while stirring continuously to distribute them evenly. Add the measured glycerine and continue stirring gently until the mixture appears uniform. Avoid vigorous shaking to minimize foaming and splashing. Record any visible changes in colour, consistency or undissolved particles."
},
  {
    icon: "💧",
    title: "Hydration",
    desc: "Allow the mixture to stand briefly so the ingredients can hydrate and disperse."
  },
  {
    icon: "🧻",
    title: "Filtration",
    desc: "Filter through clean filter material to remove undissolved particles that may clog the nozzle."
  },
  {
    icon: "📏",
    title: "Volume adjustment",
    desc: "Add distilled water to the filtered mixture until the final volume reaches the selected batch size."
  },
  {
    icon: "🧴",
    title: "Packaging",
    desc: "Transfer to a clean, labelled spray bottle for supervised testing."
  }
];

let current = 0;

const stepButtons = [
  ...document.querySelectorAll(".process-step")
];

function showStep(index) {
  current = Math.max(0, Math.min(steps.length - 1, index));

  const step = steps[current];

  document.getElementById("processIcon").textContent = step.icon;

  document.getElementById("processCount").textContent =
    `STEP ${String(current + 1).padStart(2, "0")} OF 06`;

  document.getElementById("processTitle").textContent = step.title;

  document.getElementById("processDescription").textContent = step.desc;

  document.getElementById("progressFill").style.width =
    `${((current + 1) / steps.length) * 100}%`;

  stepButtons.forEach((button, index) => {
    button.classList.toggle("active", index === current);
    button.querySelector("i").textContent =
      index === current ? "−" : "＋";
  });

  document.getElementById("prevStep").disabled = current === 0;

  document.getElementById("nextStep").textContent =
    current === 5 ? "Start again ↺" : "Next step →";
}

stepButtons.forEach(button => {
  button.addEventListener("click", () => {
    showStep(Number(button.dataset.step));
  });
});

document.getElementById("prevStep").addEventListener("click", () => {
  showStep(current - 1);
});

document.getElementById("nextStep").addEventListener("click", () => {
  showStep(current === 5 ? 0 : current + 1);
});

showStep(0);

// Status message
let timer;

function toast(message) {
  const element = document.getElementById("toast");

  element.textContent = message;
  element.classList.add("show");

  clearTimeout(timer);

  timer = setTimeout(() => {
    element.classList.remove("show");
  }, 2200);
}

// Copy formula & pricing
const copyRecipeBtn = document.getElementById("copyRecipe");
if (copyRecipeBtn) {
  copyRecipeBtn.addEventListener("click", async () => {
    const batch = norm(input.value);
    const estimatedValue = ((batch / 100) * 65).toFixed(2);
    const completeBottles = Math.floor(batch / 100);
    const remainingVolume = batch % 100;

    const text =
      `PlantGuard Proposed Experimental Formula (${batch} ml)\n` +
      `Estimated Selling Value: ₹${estimatedValue} (at listed ₹65 / 100 ml)\n` +
      `Standard Packaging: ${completeBottles} bottle(s)${remainingVolume > 0 ? ` + ${remainingVolume} ml partial fill` : ''}\n\n` +
      `Raw Materials:\n` +
      recipe.map(item =>
        `- ${item.name}: ${+(item.q * batch / 100).toFixed(3)} ${item.u} (${item.role})`
      ).join("\n") +
      `\n- Distilled water: add to final volume of ${batch} ml\n\n` +
      "Academic chemical prototype only. Safety, efficacy, pest repellent action, and shelf life are not scientifically validated.";

    try {
      await navigator.clipboard.writeText(text);
      toast("Formula & pricing copied to clipboard");
    } catch {
      toast("Clipboard unavailable; please copy the values manually");
    }
  });
}

// Print report
const printBtn = document.getElementById("printBtn");
if (printBtn) {
  printBtn.addEventListener("click", () => {
    window.print();
  });
}

// Mobile navigation
const toggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

toggle.addEventListener("click", () => {
  nav.classList.toggle("open");

  toggle.textContent =
    nav.classList.contains("open") ? "✕" : "☰";
});

nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.textContent = "☰";
  });
});


/* ==========================================================================
   Interactive PlantGuard Spray Animation Controller
   ========================================================================== */

(function initPlantGuardDemo() {
  const sceneStage = document.getElementById("sceneStage");
  const sprayCanvas = document.getElementById("sprayCanvas");
  const bottleWrapper = document.getElementById("bottleWrapper");
  const nozzleTip = document.getElementById("nozzleTip");
  const plantWrapper = document.getElementById("plantWrapper");
  const insectsLayer = document.getElementById("insectsLayer");
  const statusDot = document.getElementById("statusDot");
  const statusMessage = document.getElementById("statusMessage");
  const demoTaglineWrap = document.getElementById("demoTaglineWrap");
  const sprayBtn = document.getElementById("sprayBtn");
  const sprayBtnText = document.getElementById("sprayBtnText");
  const sprayBtnIcon = document.getElementById("sprayBtnIcon");

  if (!sceneStage || !sprayCanvas || !sprayBtn) return;

  const ctx = sprayCanvas.getContext("2d");
  let animationState = "idle"; // "idle" | "spraying" | "complete"
  let particles = [];
  let isEmitting = false;
  let animFrameId = null;

  // Handle high-DPI Canvas sizing
  function resizeCanvas() {
    const rect = sceneStage.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    sprayCanvas.width = rect.width * dpr;
    sprayCanvas.height = rect.height * dpr;
    sprayCanvas.style.width = `${rect.width}px`;
    sprayCanvas.style.height = `${rect.height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // Natural Procedural Spray Audio Effect using Web Audio API
  function playSprayAudio() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const actx = new AudioCtx();
      if (actx.state === "suspended") {
        actx.resume();
      }

      // Generate natural white noise buffer for fine aerosol mist
      const bufferSize = Math.floor(actx.sampleRate * 2.0);
      const buffer = actx.createBuffer(1, bufferSize, actx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = actx.createBufferSource();
      whiteNoise.buffer = buffer;

      // Bandpass filter to sculpt fine mist sound
      const filter = actx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(2800, actx.currentTime);
      filter.Q.setValueAtTime(1.4, actx.currentTime);

      // Volume envelope for trigger pump bursts
      const gain = actx.createGain();
      gain.gain.setValueAtTime(0.001, actx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, actx.currentTime + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.06, actx.currentTime + 0.55);
      gain.gain.linearRampToValueAtTime(0.22, actx.currentTime + 0.72);
      gain.gain.exponentialRampToValueAtTime(0.08, actx.currentTime + 1.2);
      gain.gain.linearRampToValueAtTime(0.19, actx.currentTime + 1.35);
      gain.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + 2.1);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(actx.destination);

      whiteNoise.start();
      whiteNoise.stop(actx.currentTime + 2.15);
    } catch (e) {
      // Audio autoplay gracefully suppressed or unsupported in environment
    }
  }

  // Get current nozzle tip position relative to stage
  function getNozzlePosition() {
    if (!nozzleTip || !sceneStage) {
      return { x: 140, y: 170 };
    }
    const tipRect = nozzleTip.getBoundingClientRect();
    const stageRect = sceneStage.getBoundingClientRect();
    return {
      x: tipRect.left - stageRect.left + tipRect.width / 2,
      y: tipRect.top - stageRect.top + tipRect.height / 2
    };
  }

  // Particle Class for Realistic Droplets and Fine Mist
  function spawnParticle(origin) {
    // Conical mist plume directed towards the right (+X) toward the plant
    const angle = (Math.random() - 0.42) * 0.48; // slight downward fan angle
    const speed = 7.5 + Math.random() * 7.5;
    const isTinyDroplet = Math.random() < 0.65;

    return {
      x: origin.x + (Math.random() - 0.5) * 4,
      y: origin.y + (Math.random() - 0.5) * 4,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: isTinyDroplet ? 1.0 + Math.random() * 1.6 : 2.5 + Math.random() * 2.2,
      alpha: 0.55 + Math.random() * 0.35,
      decay: 0.007 + Math.random() * 0.012,
      drag: 0.982,
      gravity: 0.045,
      // Color variations: pure white droplets and soft translucent mint water droplets
      color: Math.random() > 0.4 ? "255, 255, 255" : "210, 245, 230"
    };
  }

  // Particle Physics and Render Loop
  function updateParticles() {
    ctx.clearRect(0, 0, sprayCanvas.width, sprayCanvas.height);

    if (isEmitting) {
      const origin = getNozzlePosition();
      // Emit 10-16 particles per frame during active spraying
      const count = Math.floor(10 + Math.random() * 7);
      for (let i = 0; i < count; i++) {
        particles.push(spawnParticle(origin));
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;
      p.vx *= p.drag;
      p.vy = p.vy * p.drag + p.gravity;
      p.alpha -= p.decay;

      if (p.alpha <= 0.01 || p.x > sprayCanvas.width || p.y > sprayCanvas.height) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${Math.max(0, p.alpha)})`;
      ctx.fill();
      ctx.restore();
    }

    if (particles.length > 0 || isEmitting) {
      animFrameId = requestAnimationFrame(updateParticles);
    } else {
      animFrameId = null;
    }
  }

  function startMistStream() {
    isEmitting = true;
    if (!animFrameId) {
      animFrameId = requestAnimationFrame(updateParticles);
    }
  }

  function stopMistStream() {
    isEmitting = false;
  }

  // Scene 2: Execute Spray Animation Sequence
  function initiateSpraySequence() {
    animationState = "spraying";

    // Disable button and update UI for Scene 2
    sprayBtn.disabled = true;
    sprayBtnIcon.textContent = "⏳";
    sprayBtnText.textContent = "Spraying PlantGuard...";
    statusDot.className = "status-indicator-dot active";
    statusMessage.textContent = "Applying natural botanical mist onto foliage...";

    // Play subtle spray sound
    playSprayAudio();

    // Scene 2: Bottle moves toward plant and tilts; trigger pumps
    bottleWrapper.classList.add("is-spraying");
    sceneStage.classList.add("spraying");

    // Realistic fine mist spray starts flowing from nozzle to plant
    startMistStream();

    // After 1.1s: Spray visibly envelopes plant, startling the insects
    setTimeout(() => {
      if (animationState !== "spraying") return;
      statusMessage.textContent = "Botanical mist reaches plant · Repelling insects...";
      // Scene 3 trigger: insects fly away from plant and disappear
      insectsLayer.classList.add("escaping");
    }, 1100);

    // After 2.3s: Spray concludes, transition to Scene 3
    setTimeout(() => {
      stopMistStream();
      bottleWrapper.classList.remove("is-spraying");
      sceneStage.classList.remove("spraying");

      // Scene 3: After spraying
      completeSpraySequence();
    }, 2350);
  }

  // Scene 3: After Spraying - Completion State
  function completeSpraySequence() {
    animationState = "complete";

    // Keep plant green, swaying, and add subtle glow & glistening dew
    plantWrapper.classList.add("plant-protected");

    // Update status text to exact required string: "Animation Complete!"
    statusDot.className = "status-indicator-dot complete";
    statusMessage.textContent = "Animation Complete!";

    // Display the exact required tagline: "Your Plants Deserve a Natural Touch."
    demoTaglineWrap.classList.add("visible");

    // Update button to exact required string: "Replay Animation"
    sprayBtn.disabled = false;
    sprayBtn.classList.add("replay-mode");
    sprayBtnIcon.textContent = "↺";
    sprayBtnText.textContent = "Replay Animation";
  }

  // Reset to Scene 1: Before Spraying
  function resetToSceneOne() {
    animationState = "idle";

    // Reset button
    sprayBtn.classList.remove("replay-mode");
    sprayBtnIcon.textContent = "💧";
    sprayBtnText.textContent = "Spray PlantGuard";

    // Reset status
    statusDot.className = "status-indicator-dot";
    statusMessage.textContent = "Ready to spray · Insects resting on foliage";

    // Hide Scene 3 tagline
    demoTaglineWrap.classList.remove("visible");

    // Remove plant glow
    plantWrapper.classList.remove("plant-protected");

    // Smoothly return insects to resting positions
    insectsLayer.style.opacity = "0";
    insectsLayer.classList.remove("escaping");
    setTimeout(() => {
      insectsLayer.style.transition = "opacity 0.6s ease";
      insectsLayer.style.opacity = "1";
      setTimeout(() => {
        insectsLayer.style.transition = "";
      }, 650);
    }, 150);
  }

  // Interactive Button Click Handler
  sprayBtn.addEventListener("click", () => {
    if (animationState === "idle") {
      initiateSpraySequence();
    } else if (animationState === "complete") {
      resetToSceneOne();
    }
  });

})();
