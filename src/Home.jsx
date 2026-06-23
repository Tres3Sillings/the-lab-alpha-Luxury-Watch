import React, { useState, useRef, useEffect, useMemo, Suspense } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Download, Code, FileText, Puzzle, Rocket, Globe, ArrowRight, 
  ExternalLink, ArrowDown, CheckCircle, Brain, Sparkles, Zap, ChevronRight 
} from 'lucide-react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { motion, AnimatePresence } from 'framer-motion'
import VaporCursor from './components/VaporCursor'
import StoryScene from './components/StoryScene'

// --- CASE STUDY DATA (For detail popups) ---
const CASE_STUDIES = {
  forbidden_thread: {
    title: 'Forbidden Thread',
    subtitle: 'Headless E-Commerce System',
    tags: ['React', 'MedusaJS', 'Tailwind', 'Stripe'],
    overview: 'Forbidden Thread required a seamless, blazing-fast web checkout experience. By decoupling the frontend from the transactional layer using MedusaJS, we achieved sub-500ms page load speeds and complete layout control, solving conversion bottlenecks seen on traditional e-commerce platforms.',
    challenge: 'Handling complex cart state synchronization and managing webhooks securely for Stripe multi-step authentication without degrading Client-Side performance.',
    solution: 'Designed a lightweight custom React Context state machine to process checkout updates locally and synchronize asynchronously, leveraging Redis caching on Server-Side requests to drastically reduce DB strain.',
    metrics: [
      { label: 'Checkout Load Time', value: '< 340ms' },
      { label: 'Conversion Increase', value: '+ 24%' },
      { label: 'Server Strain Reduction', value: '70%' }
    ],
    code: `// React MedusaJS Custom Checkout State Machine Hook
export function useCheckout() {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(false)

  const updateShippingAddress = async (address) => {
    setLoading(true)
    try {
      const updatedCart = await medusa.carts.update(cart.id, {
        shipping_address: address
      })
      // Optimistic client-side state update before sync resolves
      setCart(prev => ({ ...prev, ...updatedCart }))
    } catch (err) {
      console.error("Cart update failed", err)
    } finally {
      setLoading(false)
    }
  }

  return { cart, loading, updateShippingAddress }
}`,
    architectureSvg: (
      <svg viewBox="0 0 800 300" className="w-full h-full text-white fill-none stroke-current" strokeWidth="1.5">
        <rect x="50" y="110" width="140" height="60" rx="8" className="stroke-zinc-700 fill-zinc-900/50" />
        <text x="120" y="145" className="fill-white text-xs font-mono font-bold text-center" textAnchor="middle">React Frontend</text>

        <rect x="330" y="110" width="140" height="60" rx="8" className="stroke-[#00f2ff] fill-zinc-900/50" />
        <text x="400" y="145" className="fill-[#00f2ff] text-xs font-mono font-bold text-center" textAnchor="middle">MedusaJS API</text>

        <rect x="610" y="40" width="140" height="50" rx="8" className="stroke-zinc-700 fill-zinc-900/50" />
        <text x="680" y="70" className="fill-white text-[11px] font-mono text-center" textAnchor="middle">Stripe Gateway</text>

        <rect x="610" y="115" width="140" height="50" rx="8" className="stroke-zinc-700 fill-zinc-900/50" />
        <text x="680" y="145" className="fill-white text-[11px] font-mono text-center" textAnchor="middle">Redis Cache</text>

        <rect x="610" y="190" width="140" height="50" rx="8" className="stroke-zinc-700 fill-zinc-900/50" />
        <text x="680" y="220" className="fill-white text-[11px] font-mono text-center" textAnchor="middle">PostgreSQL</text>

        <path d="M 190 140 L 330 140" className="stroke-[#00f2ff]" />
        <path d="M 470 140 L 530 140 L 530 65 L 610 65" className="stroke-zinc-600" />
        <path d="M 470 140 L 610 140" className="stroke-[#00f2ff]" />
        <path d="M 470 140 L 530 140 L 530 215 L 610 215" className="stroke-zinc-600" />
        
        <text x="260" y="130" className="fill-zinc-500 text-[10px] font-mono" textAnchor="middle">REST / JSON</text>
        <text x="545" y="110" className="fill-zinc-500 text-[10px] font-mono" textAnchor="middle">Sync</text>
      </svg>
    )
  },
  copyforge: {
    title: 'CopyForge',
    subtitle: 'AI Content Generation SaaS',
    tags: ['React', 'Firebase', 'NodeJS', 'Gemini API'],
    overview: 'CopyForge is an AI SaaS platform designed to generate high-converting promotional copy and product descriptions. Built around dynamic template parameters and secure credit balances, it gives marketers instant generation capacities.',
    challenge: 'Optimizing token streaming response times while keeping precise trace logs of generated data to prevent API abuse and leakage.',
    solution: 'Engineered a Node.js streaming middleware hosted on Firebase Cloud Functions to parse LLM tokens incrementally, updating client-side states chunk-by-chunk while validating user authorization balances dynamically.',
    metrics: [
      { label: 'Avg Generation Time', value: '1.2s' },
      { label: 'Client Sync Accuracy', value: '100%' },
      { label: 'Prompt Templates', value: '35+' }
    ],
    code: `// Firebase Cloud Function for Stream Generation API
exports.generateCopy = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new HttpsError('unauthenticated', 'Login required');
  
  const userRef = db.collection('users').doc(context.auth.uid);
  const credits = (await userRef.get()).data().credits;
  if (credits < 1) throw new HttpsError('resource-exhausted', 'Out of credits');

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  const result = await model.generateContentStream(data.prompt);
  
  // Decrement credits atomically
  await userRef.update({ credits: admin.firestore.FieldValue.increment(-1) });
  return result;
});`,
    architectureSvg: (
      <svg viewBox="0 0 800 300" className="w-full h-full text-white fill-none stroke-current" strokeWidth="1.5">
        <rect x="50" y="110" width="140" height="60" rx="8" className="stroke-zinc-700 fill-zinc-900/50" />
        <text x="120" y="145" className="fill-white text-xs font-mono font-bold text-center" textAnchor="middle">React Dashboard</text>

        <rect x="330" y="110" width="140" height="60" rx="8" className="stroke-[#d4af37] fill-zinc-900/50" />
        <text x="400" y="145" className="fill-[#d4af37] text-xs font-mono font-bold text-center" textAnchor="middle">Cloud Functions</text>

        <rect x="610" y="40" width="140" height="50" rx="8" className="stroke-zinc-700 fill-zinc-900/50" />
        <text x="680" y="70" className="fill-white text-[11px] font-mono text-center" textAnchor="middle">Gemini LLM API</text>

        <rect x="610" y="115" width="140" height="50" rx="8" className="stroke-zinc-700 fill-zinc-900/50" />
        <text x="680" y="145" className="fill-white text-[11px] font-mono text-center" textAnchor="middle">Firestore DB</text>

        <rect x="610" y="190" width="140" height="50" rx="8" className="stroke-zinc-700 fill-zinc-900/50" />
        <text x="680" y="220" className="fill-white text-[11px] font-mono text-center" textAnchor="middle">Firebase Auth</text>

        <path d="M 190 140 L 330 140" className="stroke-[#d4af37]" />
        <path d="M 470 140 L 530 140 L 530 65 L 610 65" className="stroke-zinc-600" />
        <path d="M 470 140 L 610 140" className="stroke-[#d4af37]" />
        <path d="M 470 140 L 530 140 L 530 215 L 610 215" className="stroke-zinc-600" />
        
        <text x="260" y="130" className="fill-zinc-500 text-[10px] font-mono" textAnchor="middle">HTTPS Callable</text>
        <text x="545" y="110" className="fill-zinc-500 text-[10px] font-mono" textAnchor="middle">Secure</text>
      </svg>
    )
  },
  plugin_suite: {
    title: 'WordPress Plugin Suite',
    subtitle: 'Business Automation Tools',
    tags: ['PHP', 'Javascript', 'REST APIs', 'SQL'],
    overview: 'A suite of custom, enterprise-level plugins developed to bypass heavy third-party system bloat on WordPress installations. Engineered to solve lead sync, custom product metrics, and live visual rendering queries.',
    challenge: 'WordPress action hooks and cron schedules run blocking queries that easily timeout when interacting with slow external CRM nodes.',
    solution: 'Designed an asynchronous REST callback mechanism. WP database queries queue requests locally, while background processes handle network queries in a detached, multi-threaded worker fashion.',
    metrics: [
      { label: 'DB Query Count', value: '- 45%' },
      { label: 'Lead Sync Accuracy', value: '99.9%' },
      { label: 'Client Nodes Active', value: '15+' }
    ],
    code: `<?php
// Async Lead Capture Sync Process to External CRM node
add_action('wp_ajax_nopriv_sync_crm_lead', 'async_crm_lead_sync');

function async_crm_lead_sync() {
    check_ajax_referer('crm-sync-nonce', 'security');
    $lead_data = array(
        'name'  => sanitize_text_field($_POST['name']),
        'email' => sanitize_email($_POST['email']),
    );

    // Queue instead of sending directly to avoid slow response times
    global $wpdb;
    $wpdb->insert('wp_crm_sync_queue', array(
        'lead_payload' => json_encode($lead_data),
        'status' => 'pending'
    ));

    wp_send_json_success(array('message' => 'Lead safely queued'));
}`,
    architectureSvg: (
      <svg viewBox="0 0 800 300" className="w-full h-full text-white fill-none stroke-current" strokeWidth="1.5">
        <rect x="50" y="110" width="140" height="60" rx="8" className="stroke-zinc-700 fill-zinc-900/50" />
        <text x="120" y="145" className="fill-white text-xs font-mono font-bold text-center" textAnchor="middle">WP Core Hook</text>

        <rect x="330" y="110" width="140" height="60" rx="8" className="stroke-[#00ff88] fill-zinc-900/50" />
        <text x="400" y="145" className="fill-[#00ff88] text-xs font-mono font-bold text-center" textAnchor="middle">Bespoke Handler</text>

        <rect x="610" y="40" width="140" height="50" rx="8" className="stroke-zinc-700 fill-zinc-900/50" />
        <text x="680" y="70" className="fill-white text-[11px] font-mono text-center" textAnchor="middle">WP Database</text>

        <rect x="610" y="115" width="140" height="50" rx="8" className="stroke-zinc-700 fill-zinc-900/50" />
        <text x="680" y="145" className="fill-white text-[11px] font-mono text-center" textAnchor="middle">REST API Node</text>

        <rect x="610" y="190" width="140" height="50" rx="8" className="stroke-zinc-700 fill-zinc-900/50" />
        <text x="680" y="220" className="fill-white text-[11px] font-mono text-center" textAnchor="middle">External CRM</text>

        <path d="M 190 140 L 330 140" className="stroke-[#00ff88]" />
        <path d="M 470 140 L 530 140 L 530 65 L 610 65" className="stroke-zinc-600" />
        <path d="M 470 140 L 610 140" className="stroke-[#00ff88]" />
        <path d="M 470 140 L 530 140 L 530 215 L 610 215" className="stroke-zinc-600" />
        
        <text x="260" y="130" className="fill-zinc-500 text-[10px] font-mono" textAnchor="middle">Action Bind</text>
        <text x="545" y="110" className="fill-zinc-500 text-[10px] font-mono" textAnchor="middle">Asynchronous</text>
      </svg>
    )
  }
}

export default function Home() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState(0)
  const [selectedCaseStudyKey, setSelectedCaseStudyKey] = useState(null)
  const [modalTab, setModalTab] = useState('overview')

  const portalBarRef = useRef(null)
  const portalStatusRef = useRef(null)
  const portalOverlayRef = useRef(null)

  const activeCaseStudy = selectedCaseStudyKey ? CASE_STUDIES[selectedCaseStudyKey] : null

  // Determine if the current section renders the interactive 3D WebGL Canvas
  const is3DSection = useMemo(() => [0, 2, 4, 6].includes(activeSection), [activeSection])

  // Track scroll position to update active index dynamically
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY
      const height = window.innerHeight
      if (height === 0) return

      const fractionalSection = scrollPos / height
      const roundedSection = Math.round(fractionalSection)
      const clamped = Math.max(0, Math.min(6, roundedSection))
      setActiveSection(clamped)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Smooth scroll helper
  const scrollToSection = (index) => {
    const el = document.getElementById(`section-${index}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Pinned Portal Auto-charge logic (tied to absolute bottom)
  useGSAP(() => {
    let charge = 0
    let triggered = false
    let animationId

    const tick = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const currentScroll = window.scrollY
      const isAtBottom = maxScroll - currentScroll <= 50
      
      if (isAtBottom && maxScroll > 0) {
        if (!triggered) {
          charge += 1.0 // Fills in ~1.6s
          if (charge >= 100) {
            charge = 100
            triggered = true
            
            document.body.style.overflow = 'hidden'

            gsap.timeline({
              onComplete: () => {
                document.body.style.overflow = ''
                navigate('/lab', { state: { fromLanding: true } })
              }
            })
            .to(portalOverlayRef.current, {
              opacity: 1,
              pointerEvents: 'auto',
              duration: 0.5,
              ease: 'power2.out'
            })
            .to(portalOverlayRef.current.querySelector('span'), {
              scale: 1.15,
              letterSpacing: '0.3em',
              duration: 1.2,
              ease: 'power1.inOut'
            }, '-=0.3')
          }
        }
      } else {
        charge = Math.max(0, charge - 3.0)
      }

      const percent = Math.floor(charge)
      if (portalBarRef.current) {
        portalBarRef.current.style.width = `${percent}%`
      }
      if (portalStatusRef.current) {
        portalStatusRef.current.innerText = `${percent}%`
      }

      animationId = requestAnimationFrame(tick)
    }

    animationId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animationId)
  }, [navigate])

  // Custom glows representing the active section - Unified Cyan
  const sectionGlowStyles = useMemo(() => [
    'border-[#00f2ff]/20 shadow-[0_0_50px_rgba(0,242,255,0.03)]', // Hero
    '', // Web Dev (Clean HTML)
    'border-[#00f2ff]/20 shadow-[0_0_50px_rgba(0,242,255,0.03)]', // Watch/3D
    '', // Ecom/Marketing (Clean HTML)
    'border-[#00f2ff]/20 shadow-[0_0_50px_rgba(0,242,255,0.03)]', // Projects
    '', // Soft Skills (Clean HTML)
    'border-[#00f2ff]/20 shadow-[0_0_50px_rgba(0,242,255,0.03)]'  // Portal
  ], [])

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-[#00f2ff] selection:text-black font-sans overflow-x-hidden">
      
      {/* Vapor Trail Cursor Shader */}
      <VaporCursor />

      {/* --- LAYER 1: FIXED R3F 3D CANVAS (FADES OUT ON NORMAL HTML PAGES) --- */}
      <div 
        className={`fixed inset-0 w-full h-screen z-0 transition-all duration-1000 ease-in-out
          ${is3DSection ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
      >
        <Canvas 
          shadows 
          camera={{ position: [0, 0, 7], fov: 45 }}
          gl={{ toneMapping: THREE.AgXToneMapping, toneMappingExposure: 0.8 }}
        >
          <Suspense fallback={null}>
            <StoryScene activeSection={activeSection} />
          </Suspense>
        </Canvas>
      </div>

      {/* --- LAYER 2: TOP NAVIGATION BAR --- */}
      <nav className="fixed top-0 left-0 w-full z-30 flex justify-between items-center px-6 md:px-12 py-5 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 pointer-events-auto">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection(0)}>
          <svg className="w-7 h-7 text-[#00f2ff]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="44" stroke="#00f2ff" strokeWidth="2.5" />
            <path d="M50 28V72" stroke="#00f2ff" strokeWidth="5" strokeLinecap="round" />
            <path d="M30 28H70" stroke="#00f2ff" strokeWidth="5" strokeLinecap="round" />
            <path d="M42 72H58" stroke="#00f2ff" strokeWidth="5" strokeLinecap="round" />
            <path d="M60 40C60 32, 40 32, 40 48C40 60, 60 60, 60 70C60 78, 40 78, 40 70" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-xs font-black tracking-[0.25em] text-white">TRES SILLINGS</span>
        </div>

        <div className="hidden lg:flex items-center gap-6">
          {[
            { label: 'INTRO', index: 0 },
            { label: 'WEB DEV', index: 1 },
            { label: '3D SCENES', index: 2 },
            { label: 'MARKETING', index: 3 },
            { label: 'PROJECTS', index: 4 },
            { label: 'SKILLS', index: 5 },
            { label: 'ENTER LAB', index: 6 }
          ].map(link => (
            <button
              key={link.label}
              onClick={() => scrollToSection(link.index)}
              className={`text-[10px] font-bold tracking-widest transition-colors relative py-1 bg-transparent border-0 rounded-none p-0 cursor-pointer
                ${activeSection === link.index ? 'text-[#00f2ff]' : 'text-zinc-400 hover:text-white'}`}
            >
              {link.label}
              {activeSection === link.index && (
                <motion.span 
                  layoutId="navLine" 
                  className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#00f2ff]" 
                />
              )}
            </button>
          ))}
        </div>

        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 border border-white/20 hover:border-[#00f2ff] hover:text-[#00f2ff] text-white text-[10px] font-bold tracking-widest uppercase rounded transition-all duration-300"
        >
          <span>Resume</span>
          <Download size={10} />
        </a>
      </nav>

      {/* --- LAYER 3: SCROLLABLE SECTIONS (ALTERNATING LAYOUTS) --- */}
      <div className="relative z-10 w-full flex flex-col items-center pt-20">
        
        {/* SECTION 0: HERO (3D) */}
        <section id="section-0" className="h-screen min-h-screen w-full flex items-center lg:justify-start justify-center px-6 md:px-12 lg:px-20 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className={`pointer-events-auto bg-[#0a0a0a]/90 border rounded-2xl p-8 max-w-xl transition-all duration-300 ${sectionGlowStyles[0]}`}
          >
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#00f2ff] uppercase mb-3 block">CREATIVE TECHNOLOGIST</span>
            <h1 className="font-condensed text-5xl md:text-6xl font-bold tracking-wide leading-[0.95] text-white uppercase mb-4">
              I Build Digital <span className="text-[#00f2ff]">Experiences</span> That Perform
            </h1>
            <p className="text-zinc-300 text-xs md:text-sm leading-relaxed mb-6 font-mono">
              Full-Stack Developer // 3D Artist // Automation Engineer
            </p>
            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mb-8">
              I coordinate fast, responsive coding architectures with custom 3D web spaces and business-focused marketing automations to launch products that convert.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => scrollToSection(1)}
                className="flex items-center gap-2 px-6 py-3.5 bg-[#00f2ff] text-black font-black uppercase text-[11px] tracking-widest rounded hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(0,242,255,0.3)] border-0 cursor-pointer"
              >
                <span>Read My Story</span>
                <ArrowRight size={14} />
              </button>
            </div>
            <div className="mt-8 flex items-center gap-2 text-zinc-500 font-mono text-[9px] tracking-widest uppercase animate-pulse">
              <ArrowDown size={10} /> Scroll down
            </div>
          </motion.div>
        </section>

        {/* SECTION 1: WEB DEVELOPMENT (NORMAL - CLEAN FULL-WIDTH HTML) */}
        <section id="section-1" className="min-h-screen py-28 w-full flex justify-center bg-[#050505] px-6 md:px-12 lg:px-20 border-y border-white/5 relative z-20">
          <div className="max-w-5xl w-full flex flex-col justify-center">
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.7 }}
              className="text-left"
            >
              <div className="flex items-center gap-2 text-[#00f2ff] font-mono text-[10px] tracking-[0.3em] uppercase mb-4">
                <Code size={12} /> 01 / FULL-STACK DEVELOPMENT
              </div>
              
              <h2 className="font-condensed text-5xl md:text-6xl font-bold tracking-wide uppercase text-white mb-6">
                Engineered for speed, built for results.
              </h2>
              
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-12 max-w-3xl">
                I focus on architecting lightweight, modular structures. By decoupling frontends, implementing robust APIs, and optimizing database queries, I create digital products that load instantly and perform under load.
              </p>

              {/* Stack Details Grid */}
              <div className="grid md:grid-cols-3 gap-8 mb-12 border-t border-white/10 pt-10">
                <div>
                  <h3 className="text-[#00f2ff] font-mono text-xs tracking-widest uppercase mb-4">Frontend Frameworks</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                    Clean, structured client logic with dynamic rendering state management.
                  </p>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-center gap-2"><CheckCircle size={12} className="text-[#00f2ff]" /> React + Vite</li>
                    <li className="flex items-center gap-2"><CheckCircle size={12} className="text-[#00f2ff]" /> TypeScript & ES6+</li>
                    <li className="flex items-center gap-2"><CheckCircle size={12} className="text-[#00f2ff]" /> Tailwind CSS</li>
                    <li className="flex items-center gap-2"><CheckCircle size={12} className="text-[#00f2ff]" /> Framer Motion</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-[#00f2ff] font-mono text-xs tracking-widest uppercase mb-4">Backend & Serverless</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                    Secure databases, authentication mechanisms, and serverless logic loops.
                  </p>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-center gap-2"><CheckCircle size={12} className="text-[#00f2ff]" /> Firebase (Auth, Firestore)</li>
                    <li className="flex items-center gap-2"><CheckCircle size={12} className="text-[#00f2ff]" /> Supabase</li>
                    <li className="flex items-center gap-2"><CheckCircle size={12} className="text-[#00f2ff]" /> Railway & Vercel deployments</li>
                    <li className="flex items-center gap-2"><CheckCircle size={12} className="text-[#00f2ff]" /> Custom REST API mapping</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-[#00f2ff] font-mono text-xs tracking-widest uppercase mb-4">WordPress Core</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                    Custom themes, site migrations, performance speedups, and bespoke plugins.
                  </p>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-center gap-2"><CheckCircle size={12} className="text-[#00f2ff]" /> PHP Plugin Development</li>
                    <li className="flex items-center gap-2"><CheckCircle size={12} className="text-[#00f2ff]" /> Elementor customization</li>
                    <li className="flex items-center gap-2"><CheckCircle size={12} className="text-[#00f2ff]" /> Site migrations & speedups</li>
                    <li className="flex items-center gap-2"><CheckCircle size={12} className="text-[#00f2ff]" /> Custom theme hooks</li>
                  </ul>
                </div>
              </div>

              {/* Bespoke Plugin Highlights */}
              <div className="bg-[#0b0b0b] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h4 className="text-white font-mono text-xs tracking-widest uppercase mb-2">Bespoke WordPress Plugins Created</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed max-w-2xl">
                    I developed **WP Updater** (secure core automation), **WP Reviewer** (custom client reviews engine), and **WP Replacer** (database search and replace loops) to eliminate bloat.
                  </p>
                </div>
                <button
                  onClick={() => { setSelectedCaseStudyKey('plugin_suite'); setModalTab('overview'); }}
                  className="flex items-center gap-2 px-5 py-3 bg-[#00f2ff] hover:bg-white text-black font-bold text-[10px] tracking-widest uppercase rounded-full transition-colors border-0 shrink-0 cursor-pointer"
                >
                  <span>Read Case Study</span>
                  <ExternalLink size={12} />
                </button>
              </div>

            </motion.div>

          </div>
        </section>

        {/* SECTION 2: 3D DESIGN (3D) */}
        <section id="section-2" className="h-screen min-h-screen w-full flex items-center lg:justify-start justify-center px-6 md:px-12 lg:px-20 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className={`pointer-events-auto bg-[#0a0a0a]/90 border rounded-2xl p-8 max-w-xl transition-all duration-300 ${sectionGlowStyles[2]}`}
          >
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#00f2ff] uppercase mb-3 block">02 / SPATIAL TECH</span>
            <h2 className="font-condensed text-4xl font-bold tracking-wide uppercase text-white mb-4">
              3D & Creative Coding
            </h2>
            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mb-6">
              My biggest differentiator is my ability to bridge professional 3D graphic design with WebGL code. I model, texture, and light assets in Blender, then render them interactively in real-time.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6 text-xs text-zinc-300">
              <div>
                <h4 className="font-bold text-white mb-2 font-mono text-[9px] tracking-widest uppercase">Blender Pipeline</h4>
                <ul className="space-y-1 text-zinc-400 text-[11px]">
                  <li>• High-Poly Modeling</li>
                  <li>• Material creation & UVs</li>
                  <li>• Environment setups</li>
                  <li>• Static Light Baking</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2 font-mono text-[9px] tracking-widest uppercase">WebGL Engineering</h4>
                <ul className="space-y-1 text-zinc-400 text-[11px]">
                  <li>• Three.js scene builds</li>
                  <li>• React Three Fiber</li>
                  <li>• Spline scene setups</li>
                  <li>• Framerate Optimization</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <Link
                to="/watch"
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#00f2ff] text-black font-black uppercase text-[10px] tracking-widest rounded hover:bg-white transition-all duration-300"
              >
                <span>Interact with Watch</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </motion.div>
        </section>

        {/* SECTION 3: ECOMMERCE & MARKETING (NORMAL - CLEAN FULL-WIDTH HTML) */}
        <section id="section-3" className="min-h-screen py-28 w-full flex justify-center bg-[#050505] px-6 md:px-12 lg:px-20 border-y border-white/5 relative z-20">
          <div className="max-w-5xl w-full flex flex-col justify-center">
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-2 text-[#00f2ff] font-mono text-[10px] tracking-[0.3em] uppercase mb-4">
                <Rocket size={12} /> 03 / ECOMMERCE & BRANDING
              </div>
              
              <h2 className="font-condensed text-5xl md:text-6xl font-bold tracking-wide uppercase text-white mb-6">
                Forbidden Thread, Shopify, & Conversion.
              </h2>
              
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-12 max-w-3xl">
                I build digital brand architectures. By taking complete ownership of the creative assets, product photography, conversion marketing tactics, and underlying shopping pipelines, I make stores sell.
              </p>

              {/* Columns for Founder Roles vs. Agency */}
              <div className="grid md:grid-cols-2 gap-8 mb-12 border-t border-white/10 pt-10 text-left">
                <div className="bg-[#0b0b0b] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-[#00f2ff] font-mono text-[10px] tracking-widest uppercase mb-2 block font-bold">BRAND FOUNDER</span>
                    <h3 className="text-xl font-bold text-white mb-3">Forbidden.Thread</h3>
                    <p className="text-zinc-400 text-xs leading-relaxed mb-6">
                      Conceived, designed, and constructed the brand. Handled apparel graphic vectors, custom Shopify templates, pricing strategy, digital marketing campaigns, and product photography.
                    </p>
                  </div>
                  <button
                    onClick={() => { setSelectedCaseStudyKey('forbidden_thread'); setModalTab('overview'); }}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#00f2ff] text-black font-bold font-mono text-[10px] tracking-widest uppercase rounded hover:bg-white transition-colors border-0 cursor-pointer w-full text-center"
                  >
                    <span>Medusa Headless Checkout Plan</span>
                    <ChevronRight size={12} />
                  </button>
                </div>

                <div className="bg-[#0b0b0b] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-[#00f2ff] font-mono text-[10px] tracking-widest uppercase mb-2 block font-bold">AGENCY DEVELOPER</span>
                    <h3 className="text-xl font-bold text-white mb-3">AWEBCO Marketing</h3>
                    <p className="text-zinc-400 text-xs leading-relaxed mb-6">
                      Worked inside a marketing agency environment. Maintained production websites, optimized organic SEO tags and metadata, integrated Google Analytics tracking, and managed client support requests.
                    </p>
                  </div>
                  <button
                    onClick={() => { setSelectedCaseStudyKey('copyforge'); setModalTab('overview'); }}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white text-black font-bold font-mono text-[10px] tracking-widest uppercase rounded hover:bg-[#00f2ff] transition-colors border-0 cursor-pointer w-full text-center"
                  >
                    <span>CopyForge AI SaaS Case Study</span>
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>

              {/* Marketing Tag Cloud */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-zinc-400 bg-zinc-950/40 border border-white/5 p-4 rounded-xl">
                <span className="text-[#00f2ff]">✓ Shopify Themes</span>
                <span className="text-zinc-600">|</span>
                <span className="text-[#00f2ff]">✓ Google Analytics</span>
                <span className="text-zinc-600">|</span>
                <span className="text-[#00f2ff]">✓ On-Page SEO / Meta</span>
                <span className="text-zinc-600">|</span>
                <span className="text-[#00f2ff]">✓ Lead Gen Integrations</span>
              </div>

            </motion.div>

          </div>
        </section>

        {/* SECTION 4: PROJECTS (3D) */}
        <section id="section-4" className="h-screen min-h-screen w-full flex items-center lg:justify-start justify-center px-6 md:px-12 lg:px-20 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className={`pointer-events-auto bg-[#0a0a0a]/90 border rounded-2xl p-8 max-w-xl transition-all duration-300 ${sectionGlowStyles[4]}`}
          >
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#00f2ff] uppercase mb-3 block">04 / SOFTWARE UTILITIES</span>
            <h2 className="font-condensed text-4xl font-bold tracking-wide uppercase text-white mb-4">
              Core Code Projects
            </h2>
            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mb-6">
              I build complex utilities that require custom JSON architectures and third-party API hookups.
            </p>

            <div className="space-y-4 mb-6">
              <div className="bg-[#121212] border border-white/5 p-3.5 rounded-lg">
                <h4 className="text-white font-mono text-[10px] font-bold tracking-widest uppercase mb-1">TFT Companion App</h4>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  React application packaged inside a Tauri desktop frame, featuring an overlays engine and a custom JSON data editor.
                </p>
              </div>
              <div className="bg-[#121212] border border-white/5 p-3.5 rounded-lg">
                <h4 className="text-white font-mono text-[10px] font-bold tracking-widest uppercase mb-1">CRM Status Manager</h4>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Bespoke status tracking dashboards connecting directly to external CRMs and Google Spreadsheet APIs.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Link
                to="/lab"
                state={{ fromLanding: true }}
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#00f2ff] text-black font-black uppercase text-[10px] tracking-widest rounded hover:bg-white transition-colors"
              >
                <span>Enter 3D Lab Hub</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </motion.div>
        </section>

        {/* SECTION 5: LEARNING (NORMAL - CLEAN FULL-WIDTH HTML) */}
        <section id="section-5" className="min-h-screen py-28 w-full flex justify-center bg-[#050505] px-6 md:px-12 lg:px-20 border-y border-white/5 relative z-20">
          <div className="max-w-5xl w-full flex flex-col justify-center">
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-2 text-[#00f2ff] font-mono text-[10px] tracking-[0.3em] uppercase mb-4">
                <Brain size={12} /> 05 / HUMAN SKILLS & OUTREACH
              </div>
              
              <h2 className="font-condensed text-5xl md:text-6xl font-bold tracking-wide uppercase text-white mb-6">
                The Self-Taught Engine.
              </h2>
              
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-12 max-w-3xl">
                I teach myself what I need to know to build products. I have taught myself React, Blender modeling, Three.js coordinates, and CRM database integrations out of interest and persistent practice.
              </p>

              {/* Grid: Self-Taught vs Outreach */}
              <div className="grid md:grid-cols-3 gap-8 mb-12 border-t border-white/10 pt-10 text-left">
                <div>
                  <h3 className="text-white font-mono text-xs tracking-widest uppercase mb-4">Self-Taught Stack</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                    Technologies I have successfully taught myself through building real-world projects:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'Blender', 'Three.js', 'Tauri', 'WordPress'].map(tech => (
                      <span key={tech} className="px-2.5 py-1 bg-zinc-900 border border-white/10 rounded text-zinc-300 font-mono text-[10px]">{tech}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-mono text-xs tracking-widest uppercase mb-4">Current Horizons</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                    Business practices I am actively learning to establish and scale agency workflows:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Sales', 'Cold Outreach', 'Networking', 'Business Dev'].map(skill => (
                      <span key={skill} className="px-2.5 py-1 bg-zinc-900 border border-white/10 rounded text-zinc-300 font-mono text-[10px]">{skill}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-mono text-xs tracking-widest uppercase mb-4">Professional Skills</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                    Core client management and pricing capabilities gathered while building PorchWeb:
                  </p>
                  <ul className="space-y-1.5 font-mono text-[10px] text-zinc-300">
                    <li className="flex items-center gap-1.5"><CheckCircle size={10} className="text-[#00f2ff]" /> Client Communication</li>
                    <li className="flex items-center gap-1.5"><CheckCircle size={10} className="text-[#00f2ff]" /> Requirements Gathering</li>
                    <li className="flex items-center gap-1.5"><CheckCircle size={10} className="text-[#00f2ff]" /> Deployments & Hosting</li>
                    <li className="flex items-center gap-1.5"><CheckCircle size={10} className="text-[#00f2ff]" /> Pricing & Sales pitches</li>
                  </ul>
                </div>
              </div>

              {/* Core Strengths Banner */}
              <div className="bg-[#0b0b0b] border border-white/5 rounded-2xl p-6 text-center">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">CORE PERSONAL VALUES</span>
                <p className="text-white text-xs md:text-sm max-w-xl mx-auto leading-relaxed italic">
                  "Curiosity, a strong work ethic, long-term thinking, a willingness to ask questions, and relentless persistence."
                </p>
              </div>

            </motion.div>

          </div>
        </section>

        {/* SECTION 6: PORTAL GATEWAY (3D) */}
        <section id="section-6" className="h-screen min-h-screen w-full flex items-center lg:justify-start justify-center px-6 md:px-12 lg:px-20 pointer-events-none pb-24">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className={`pointer-events-auto bg-[#0a0a0a]/90 border rounded-2xl p-8 max-w-xl transition-all duration-300 ${sectionGlowStyles[6]}`}
          >
            <span className="text-[10px] font-mono tracking-[0.3em] text-white uppercase mb-3 block">06 / PORTAL GATEWAY</span>
            <h2 className="font-condensed text-4xl font-bold tracking-wide uppercase text-white mb-4">
              Enter The 3D Lab
            </h2>
            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mb-8">
              Scroll further down to charge the portal core and launch, or click the direct gateway command below to load the 3D sandbox.
            </p>

            {/* Glowing progress bar */}
            <div className="w-full h-2 bg-zinc-900 border border-white/10 rounded-full overflow-hidden relative shadow-[0_0_10px_rgba(0,0,0,0.5)] mb-6">
              <div 
                ref={portalBarRef}
                className="h-full bg-gradient-to-r from-[#b89565] to-[#c5a880] rounded-full transition-all duration-75 shadow-[0_0_15px_rgba(197,168,128,0.5)]"
                style={{ width: '0%' }}
              />
            </div>
            
            <div className="text-[10px] font-mono text-zinc-500 mb-8 tracking-widest uppercase">
              Core Charge: <span ref={portalStatusRef} className="text-[#c5a880] font-bold">0%</span>
            </div>

            <button
              onClick={() => navigate('/lab', { state: { fromLanding: true } })}
              className="flex items-center gap-2 px-6 py-3.5 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded hover:bg-[#00f2ff] transition-colors border-0 cursor-pointer"
            >
              <span>Launch 3D Lab ↗</span>
            </button>
          </motion.div>
        </section>

      </div>

      {/* FOOTER */}
      <footer className="w-full py-12 px-6 bg-[#050505] border-t border-white/10 relative z-20 pointer-events-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-white">TRES SILLINGS</span>
            <span className="text-[9px] font-mono text-zinc-500 mt-1">© 2026 Tres Sillings. All rights reserved.</span>
          </div>
          
          <div className="flex gap-6">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-zinc-400 hover:text-white transition-colors">GitHub</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-zinc-400 hover:text-white transition-colors">LinkedIn</a>
            <Link to="/lab" className="text-xs font-mono text-[#00f2ff] hover:underline">Launch Lab</Link>
          </div>
        </div>
      </footer>

      {/* Full-screen Portal Transition Overlay */}
      <div 
        ref={portalOverlayRef}
        className="portal-transition-overlay opacity-0 pointer-events-none fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center transition-opacity duration-300"
      >
        <div className="relative flex items-center justify-center">
          <div className="absolute w-32 h-32 rounded-full bg-[#00f2ff]/20 blur-2xl animate-ping" />
          <div className="absolute w-64 h-64 rounded-full bg-[#00f2ff]/10 blur-3xl animate-pulse" />
          <span className="font-condensed text-4xl md:text-5xl text-[#00f2ff] tracking-[0.2em] uppercase animate-pulse">
            LOADING EXPERIENCE...
          </span>
        </div>
      </div>

      {/* --- LAYER 4: CASE STUDY DETAIL MODAL --- */}
      <AnimatePresence>
        {activeCaseStudy && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8 pointer-events-auto">
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto shadow-2xl p-6 md:p-8 relative scrollbar-thin"
            >
              
              <button 
                onClick={() => setSelectedCaseStudyKey(null)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white text-2xl font-bold bg-zinc-900 border border-white/5 w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer"
              >
                ×
              </button>

              <div className="mb-8">
                <span className="text-[10px] font-mono text-[#00f2ff] uppercase tracking-widest">{activeCaseStudy.subtitle}</span>
                <h2 className="text-3xl md:text-4xl font-black italic uppercase text-white tracking-tight mt-1">{activeCaseStudy.title}</h2>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {activeCaseStudy.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-zinc-900 border border-white/5 rounded-full text-[10px] font-mono text-zinc-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex border-b border-white/10 mb-8 overflow-x-auto no-scrollbar">
                {[
                  { key: 'overview', label: 'Overview' },
                  { key: 'architecture', label: 'Architecture' },
                  { key: 'code', label: 'Technical Solution' },
                  { key: 'metrics', label: 'Metrics' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setModalTab(tab.key)}
                    className={`py-3 px-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all mr-4 flex-none cursor-pointer border-0 rounded-none bg-transparent
                      ${modalTab === tab.key 
                        ? 'border-[#00f2ff] text-[#00f2ff]' 
                        : 'border-transparent text-zinc-500 hover:text-white'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="min-h-[250px]">
                
                {modalTab === 'overview' && (
                  <div className="space-y-6 animate-fade-in text-left">
                    <div>
                      <h4 className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest mb-2">The Objectives</h4>
                      <p className="text-zinc-200 text-sm leading-relaxed">{activeCaseStudy.overview}</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                      <div>
                        <h4 className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest mb-2">The Core Challenge</h4>
                        <p className="text-zinc-400 text-xs leading-relaxed">{activeCaseStudy.challenge}</p>
                      </div>
                      <div>
                        <h4 className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest mb-2">Our Engineering Solution</h4>
                        <p className="text-zinc-400 text-xs leading-relaxed">{activeCaseStudy.solution}</p>
                      </div>
                    </div>
                  </div>
                )}

                {modalTab === 'architecture' && (
                  <div className="space-y-4 animate-fade-in flex flex-col justify-center items-center">
                    <h4 className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest mb-2 self-start">System Flows & Nodes</h4>
                    <div className="w-full max-w-2xl bg-zinc-900/50 border border-white/5 rounded-xl p-4 md:p-6">
                      {activeCaseStudy.architectureSvg}
                    </div>
                    <p className="text-[10px] font-mono text-zinc-600 mt-2 text-center">
                      An architectural roadmap showing system connectivity, credentials management, and DB synchronization cycles.
                    </p>
                  </div>
                )}

                {modalTab === 'code' && (
                  <div className="space-y-4 animate-fade-in text-left">
                    <h4 className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest mb-2">Key Integration Handler</h4>
                    <div className="relative text-left">
                      <pre className="bg-zinc-900 border border-white/5 p-4 rounded-xl text-xs overflow-x-auto text-[#00f2ff] font-mono leading-relaxed max-h-[350px]">
                        <code>{activeCaseStudy.code}</code>
                      </pre>
                    </div>
                  </div>
                )}

                {modalTab === 'metrics' && (
                  <div className="space-y-6 animate-fade-in">
                    <h4 className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest mb-4">Measured Engineering Outcomes</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {activeCaseStudy.metrics.map((metric, index) => (
                        <div key={index} className="bg-zinc-900 border border-white/5 rounded-xl p-6 text-center hover:border-zinc-800 transition-colors">
                          <span className="text-3xl font-black text-white block mb-2">{metric.value}</span>
                          <span className="text-[10px] font-mono text-[#00f2ff] uppercase tracking-widest">{metric.label}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-zinc-500 text-xs mt-6 leading-relaxed">
                      Metrics were validated using industry-standard tracing tools, network bandwidth analyzers, and client checkout conversion dashboards.
                    </p>
                  </div>
                )}

              </div>

              <div className="border-t border-white/10 mt-10 pt-6 flex justify-between items-center">
                <span className="text-[9px] font-mono text-zinc-600">CONFIDENTIAL EXPERIMENT · TRES SILLINGS PORTFOLIO</span>
                <button 
                  onClick={() => setSelectedCaseStudyKey(null)}
                  className="px-6 py-2 bg-zinc-900 border border-white/5 hover:border-white text-white text-[10px] font-bold uppercase tracking-widest rounded-full transition-all cursor-pointer"
                >
                  Close Case Study
                </button>
              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  )
}