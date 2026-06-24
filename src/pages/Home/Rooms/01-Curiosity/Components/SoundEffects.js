/**
 * SoundEffects.js — Procedural Web Audio API UI sounds
 * All sounds generated entirely in code, no external files needed.
 * Volume is intentionally low — subtle, tactile, premium.
 */

let audioCtx = null

function getCtx() {
  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  // Resume if browser suspended it (autoplay policy)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

/**
 * Soft high-frequency "tick" — played on button hover.
 * Duration: ~55ms, very subtle.
 */
export function playHover() {
  if (!soundsAttached) return
  try {
    const ctx = getCtx()
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(1400, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.05)
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 0.006)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.055)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.06)
  } catch (_) { /* silently fail if Web Audio isn't available */ }
}

/**
 * Satisfying short downward sweep "pop" — played on click.
 * Duration: ~90ms, slightly punchier than hover.
 */
export function playClick() {
  if (!soundsAttached) return
  try {
    const ctx = getCtx()

    // Primary tone — fast downward sweep
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(520, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 0.07)
    gain.gain.setValueAtTime(0.08, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.09)

    // Subtle noise click transient on top
    const bufferSize = ctx.sampleRate * 0.02
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
    }
    const noise = ctx.createBufferSource()
    const noiseGain = ctx.createGain()
    noise.buffer = buffer
    noise.connect(noiseGain)
    noiseGain.connect(ctx.destination)
    noiseGain.gain.setValueAtTime(0.04, ctx.currentTime)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02)
    noise.start(ctx.currentTime)
  } catch (_) { /* silently fail */ }
}

// ── Global event delegation ───────────────────────────────────────────────────

let soundsAttached = false
let lastHoverTime  = 0  // debounce hover so it doesn't fire 60× a second

function onGlobalMouseOver(e) {
  const btn = e.target.closest('button, [role="button"], .timeline-node, .rp-timeline-node, .shop-item-actions button')
  if (btn && Date.now() - lastHoverTime > 90) {
    lastHoverTime = Date.now()
    playHover()
  }
}

function onGlobalClick(e) {
  const btn = e.target.closest('button, [role="button"]')
  if (btn) {
    playClick()
  }
}

/**
 * Call once when the Sound Effects shop item is purchased.
 * Attaches document-level listeners so every button gets sounds automatically.
 */
export function enableSoundEffects() {
  if (soundsAttached) return
  soundsAttached = true
  document.addEventListener('mouseover', onGlobalMouseOver)
  document.addEventListener('click',     onGlobalClick)
}

export function disableSoundEffects() {
  soundsAttached = false
  document.removeEventListener('mouseover', onGlobalMouseOver)
  document.removeEventListener('click',     onGlobalClick)
}
