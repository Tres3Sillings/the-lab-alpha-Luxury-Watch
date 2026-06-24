import React from 'react'
import TerminalMock from '../MockPanels/TerminalMock'
import CalculatorMock from '../MockPanels/CalculatorMock'
import WordPressMock from '../MockPanels/WordPressMock'
import ReactMock from '../MockPanels/ReactMock'
import ThreeJsMock from '../MockPanels/ThreeJsMock'

export const ELEMENT_DETAILS = {
  Book: {
    title: "01 / ACCOUNTING BOOKS",
    subtitle: "The Road I Almost Took",
    desc: "I was told I should become an accountant. So I studied it. I learned it.\n\nWanted stability. Numbers made sense. Thought it was the responsible choice.\n\nThen... AI completely changed how I viewed that career.\n\nLooking back, I remember sitting in college classrooms, staring at balance sheets and ledger entries. The double-entry bookkeeping system felt like a rigid, logical puzzle. It was reassuring in its predictability: assets must always equal liabilities plus equity. There was a clear right and wrong answer, which felt safe in a chaotic world.\n\nBut security came at a cost. The day-to-day reality of reconciling bank statements, preparing tax returns, and auditing financial reports lacked a spark of creation. You weren't building anything new; you were merely documenting what had already happened. When generative AI and advanced automation models began writing formulaic spreadsheets and coding accounts in seconds, the illusion of safety cracked. I realized that the stable road was rapidly changing, and I didn't want to spend my life doing work that could be automated by a simple script.\n\nThose heavy accounting books still sit on my shelf today. They serve as a powerful physical reminder of a different trajectory. They represent a version of me that prioritized comfort over curiosity. I keep them not because I regret the time spent, but because they remind me that changing direction isn't a failure—it's a conscious choice of growth. Every line of code I write now has its root in the realization that I wanted to create tools, not just log their transactions.",
    lesson: "Sometimes the \"safe\" career isn't the right one. Changing direction isn't failure—it's growth."
  },
  PC: {
    title: "01 / CRT COMPUTER",
    subtitle: "Curiosity",
    desc: "This shouldn't be about computers. It's about learning.\n\nBreaking websites, inspecting HTML, wondering how buttons worked, and opening DevTools for the first time.\n\nIt all started with a vintage CRT monitor and a slow dial-up connection. Back then, websites weren't just content platforms; they were mysteries waiting to be solved. I remember right-clicking on pages and selecting \"View Source Code\" for the first time. A wall of text filled the screen—nested divs, cryptic scripts, and inline styles that made no sense but somehow rendered beautiful interfaces on my screen.\n\nI began my journey by editing the HTML directly in the browser's developer console. I would change the text on a news site, alter background colors, or hide elements to see how the layout adapted. The feeling of power was immediate: with a few keystrokes, I could manipulate the pixels on my screen. I wasn't trying to become a professional software engineer; I was simply playing a game of digital lego.\n\nThis machine symbolizes that pure, unadulterated curiosity. It represents the hours spent debugging broken tags late at night, search queries on old forums, and the excitement of making a button do exactly what I wanted. It's a reminder that the best developers aren't driven by certificates, but by the irresistible urge to click \"Inspect\" and ask: \"How does this work under the hood?\"",
    lesson: "I wasn't trying to become a developer. I just couldn't stop asking \"How does this work?\""
  },
  Calculator: {
    title: "01 / CALCULATOR",
    subtitle: "The Last Time I Used This",
    desc: "Thankfully JavaScript does the math now. 😂\n\nTurns out I still use math... it's just measured in pixels instead of spreadsheets.\n\nIn my accounting days, the desktop calculator was an extension of my hand. I would punch in numbers with rapid-fire speed, checking decimal points and tallying balances. It was an analog tool for a digital chore. Today, that calculator sits as a museum piece on my desk, collecting dust while my code handles millions of floating-point operations in microseconds.\n\nBut math didn't disappear when I switched to development. It just evolved. Instead of adding interest rates and balancing depreciation schedules, I now use math to calculate vector coordinates, translate 3D quaternions, interpolate animation frames, and scale layouts. Math is no longer a chore; it's a creative brush. When you see a camera smoothly panning across a 3D canvas or a particle system exploding into a vortex of light, you are looking at mathematics in motion.\n\nHere is a quick comparison of my math workflow then versus now:\n\n• Then: Total = Principal * (1 + Rate/Time)^(Time * Years)\n• Now: position.x = Math.sin(state.clock.getElapsedTime()) * radius\n\nI swapped cell formulas for trigonometry, and I couldn't be happier.",
    lesson: "Sometimes the \"safe\" career isn't the right one."
  },
  Notebook: {
    title: "01 / NOTEBOOK",
    subtitle: "Idea Book",
    desc: "This is where ideas spend time. Inside:\n\n• First website sketches\n• Terrible logo ideas\n• Pricing notes & dreams\n• Future business names\n\nBefore I write a single line of CSS or open Figma, I grab a pencil and this physical notebook. There is something tactile and immediate about paper that digital tools can't replicate. It is a sandbox with zero latency and infinite undo states (via an eraser).\n\nMy notebooks are filled with chaotic grids, wireframes with arrows pointing in every direction, and messy lists of features that may never see the light of day. I sketch mobile navigation drawers, layout grids, and hover interactions as rough wireframes. It's a filter system: if an idea doesn't look promising in a quick paper sketch, it probably doesn't deserve hours of frontend engineering. Looking back through these pages is like walking through a graveyard of half-formed dreams and successful prototypes. It shows the evolution of my design thinking and the messy, iterative process that leads to a polished end product.\n\nEvery great product, clean interface, and complex 3D scene starts as a rough, imperfect scribble in a physical notebook. It's the bridge between imagination and code.",
    lesson: "Every finished project started as a terrible sketch."
  },
  Cup: {
    title: "01 / COFFEE MUG",
    subtitle: "Night Owl Statistics",
    desc: "Coffee Consumed (Estimated): ~2,100 cups\nLate nights: Too many\nBest ideas: Usually after midnight\n\nFavorite debugging strategy: Walk away. Drink coffee. Come back.\n\nThere is an old joke in computer science: \"A programmer is a machine for turning caffeine into code.\" While it is a cliche, my coffee mug has been my silent partner through every late-night deployment and confusing console error. It has sat beside my keyboard through countless build cycles and design iterations.\n\nSome of my most complex engineering breakthroughs didn't happen while staring at a code editor. They happened while standing in the kitchen, waiting for the coffee machine to brew. There is magic in taking a physical break from a problem. When you walk away, your brain continues to process the logic in the background. By the time you sit back down with a hot mug, the missing semicolon or architectural flaw suddenly becomes obvious.\n\nKey Coffee Analytics:\n• Peak Debugging Hours: 11:00 PM - 3:00 AM\n• Preferred Roast: Dark, strong, and black\n• Troubleshooting Efficacy: +45% post-caffeine infusion\n• Cold Coffee Tolerance: Surprisingly high (when deep in a state flow)\n\nIt's not just a drink; it's a productivity system.",
    lesson: "Estimate: 2,100 cups consumed. Best ideas usually come after midnight."
  },
  Sticker1: {
    title: "01 / PHOTOSHOP",
    subtitle: "Skill Book: Photoshop (Level 80%)",
    desc: "Started: 2022\nProjects: 100+\n\nFavorite Uses:\n✓ UI Design\n✓ Mockups\n✓ Clothing design\n✓ Client Graphics\n\nProgress to Master:\n[████████░░]\n\nMy design journey began with raster graphics. Photoshop taught me the fundamentals of composition, color theory, typography, and visual hierarchy. Long before I knew what a responsive layout was, I was manipulating layers, blending paths, and masking textures to create web graphics and branding materials.\n\nToday, I use Photoshop as a supporting pillar for my web engineering projects. Whether I'm optimizing asset textures for 3D GLTF models, creating custom high-contrast normal maps, or designing high-fidelity layouts, my familiarity with the Adobe suite gives me a major advantage. It allows me to bridge the gap between creative visual art and technical implementation. I don't just write code for layouts; I design the assets, icons, and visual elements that inhabit them. This dual capability ensures that the websites I build look exactly as the design mockup intended, down to the last pixel.",
    lesson: "Great design isn't decoration. It's communication."
  },
  Sticker2: {
    title: "01 / BLENDER",
    subtitle: "Skill Book: Blender (Current Obsession)",
    desc: "First Render → Current Render\n\nFavorite Things:\n• Architecture design\n• Lighting & Materials\n• Three.js implementation\n\nFuture Goal: Full cinematic 3D websites.\n\nWhen I first opened Blender, the three-dimensional viewport felt incredibly intimidating. There were countless shortcuts, rendering settings, shader nodes, and modifiers. But the moment I completed my first simple render, I was hooked. I realized that the browser didn't have to be a flat, two-dimensional document. It could be an interactive window into a virtual space.\n\nI spent months mastering low-poly modeling, UV unwrapping, material baking, and scene optimization. The true challenge of 3D web development is performance: taking a detailed scene and optimizing it so it loads instantly on a phone over a cellular connection. Today, I model custom assets, configure photorealistic baking sheets, and export highly optimized GLB files that integrate seamlessly with React Three Fiber. Blender has completely redefined my perspective on web design.",
    lesson: "Building immersive experiences made me rethink what a website could be."
  },
  Sticker3: {
    title: "01 / WORDPRESS",
    subtitle: "Skill Book: WordPress",
    desc: "40+ Pages Built\nCustom Plugins:\n✓ WP Updater\n✓ WP Reviewer\n✓ WP Replacer\n\nFavorite Part: Making clients happy quickly.\n\nWordPress is the workhorse of the modern web, powering over 40% of all websites. While custom React builds are great for high-end web applications, many businesses need speed, easy content management, and robust SEO out of the box. That is where WordPress shines.\n\nI have designed, built, and deployed over 40 custom WordPress sites for clients in various industries. I don't rely on heavy, bloated page builders that slow down performance. Instead, I write custom block themes, write clean PHP templates, and develop bespoke plugins to solve specific business needs. This hybrid approach gives clients the best of both worlds: a fast, secure website that is incredibly easy for their marketing teams to update without developer intervention.",
    lesson: "Speed, customer focus, and custom tooling are invaluable assets."
  },
  Sticker4: {
    title: "01 / REACT",
    subtitle: "Skill Book: React",
    desc: "Timeline:\nFirst component → Three.js R3F integration → Custom Portfolio → Forbidden Thread → CRM system → Today\n\nReact is the standard for building complex, dynamic web applications. It completely transformed my frontend workflow. By breaking down pages into modular, state-driven components, I could build scalable systems that handle user interactions and data flows with ease.\n\nMy React journey started with simple functional components and state hooks, but quickly expanded into state management libraries, custom hooks, and rendering integration. React is the bridge that allows me to mount a Three.js canvas, sync 3D models with DOM overlays, handle achievement tracking in localStorage, and manage smooth page transitions. It is the core framework that brings all my interactive ideas together in a cohesive, performant runtime environment.",
    lesson: "React is the backbone for scaling component-driven interactive user interfaces."
  },
  Sticker5: {
    title: "01 / THREE.JS",
    subtitle: "Skill Book: Three.js & Creative Coding",
    desc: "Unlocking 3D interactive graphics on the browser canvas.\n\nFavorite APIs:\n✓ Custom GLSL shaders\n✓ Physics engines\n✓ Theatre.js animations\n\nBelief: The web should be an interactive experience, not just dry papers.\n\nThree.js is where code meets art. It is the technology that allows me to render millions of polygons, control camera viewports, and program customized lighting systems directly in the browser. By combining Three.js with React Three Fiber (R3F), I can treat 3D objects as standard React components, syncing their state and hooks with normal DOM events.\n\nI specialize in creative coding: writing custom vertex and fragment shaders in GLSL, configuring cinematic animations via Theatre.js, and implementing physics simulations. The goal is to build digital experiences that feel alive, responsive, and awe-inspiring. I believe the future of the web belongs to immersive storytelling, and Three.js is the key that unlocks it.",
    lesson: "The web is evolving from dry pages into rich interactive visual experiences."
  }
}

export default function FolderModal({
  selectedSticker,
  handleBackToHome,
  handleStickerClick
}) {
  if (!selectedSticker) return null

  const details = ELEMENT_DETAILS[selectedSticker] || { title: '01 / SYSTEM', subtitle: '', desc: '', lesson: '' }

  return (
    <div className="folder-backdrop" onClick={handleBackToHome}>
      <div className="folder-modal" onClick={(e) => e.stopPropagation()}>

        {/* Folder Tab Header */}
        <div className="folder-tab-bar">
          {selectedSticker.startsWith('Sticker') ? (
            ['Sticker1', 'Sticker2', 'Sticker3', 'Sticker4', 'Sticker5'].map((stickId) => {
              const isActive = selectedSticker === stickId
              const tabTitle = stickId === 'Sticker1' ? 'Photoshop' :
                stickId === 'Sticker2' ? 'Blender' :
                  stickId === 'Sticker3' ? 'WordPress' :
                    stickId === 'Sticker4' ? 'React' :
                      stickId === 'Sticker5' ? 'Three.js' : 'Skill'
              return (
                <div
                  key={stickId}
                  className={`folder-tab ${isActive ? 'active' : 'inactive'}`}
                  onClick={() => handleStickerClick(stickId)}
                  style={{ cursor: isActive ? 'default' : 'pointer' }}
                >
                  <span className="folder-tab-icon">📕</span>
                  <span className="folder-tab-title">{tabTitle.toUpperCase()}</span>
                </div>
              )
            })
          ) : (
            <div className="folder-tab active">
              <span className="folder-tab-icon">📁</span>
              <span className="folder-tab-title">
                {details.subtitle.toUpperCase() || 'DOCUMENT'}
              </span>
            </div>
          )}
          <button className="folder-close-btn" onClick={handleBackToHome}>
            <span>×</span> CLOSE FOLDER
          </button>
        </div>

        {/* Folder Scrollable Sheet */}
        <div className="folder-scroll-body">
          <div className="folder-grid">

            {/* Left Column: Narrative & Insights */}
            <div className="folder-col-left">
              <div className="folder-header-title">
                <h1>{details.title}</h1>
                <h2>{details.subtitle}</h2>
              </div>

              <p className="folder-desc" style={{ whiteSpace: 'pre-line' }}>
                {details.desc}
              </p>

              {details.lesson && (
                <div className="folder-lesson-box">
                  <span className="folder-lesson-tag">🔑 What I Learned</span>
                  <p className="folder-lesson-text">{details.lesson}</p>
                </div>
              )}
            </div>

            {/* Right Column: Custom Visual / Graphics / Interactive Panels */}
            <div className="folder-col-right">
              {/* Retro Terminal Shell for PC */}
              {selectedSticker === 'PC' && <TerminalMock />}

              {/* Book Stack Image */}
              {selectedSticker === 'Book' && (
                <div className="folder-media-container">
                  <img src="/accounting_stack.png" alt="Accounting books stack" className="folder-media-img" />
                  <div className="folder-media-caption">Historical Ledger stack sitting in storage.</div>
                </div>
              )}

              {/* Calculator equations */}
              {selectedSticker === 'Calculator' && <CalculatorMock />}

              {/* Coffee statistics visual */}
              {selectedSticker === 'Cup' && (
                <div className="folder-media-container">
                  <img src="/coffee_desk.png" alt="Steaming coffee desk setup" className="folder-media-img" />
                  <div className="folder-media-caption">Late night fuel. Est. 2,100 cups consumed.</div>
                </div>
              )}

              {/* Notebook scan sketches */}
              {selectedSticker === 'Notebook' && (
                <div className="folder-media-container">
                  <img src="/notebook_sketch.png" alt="Notebook design sketch" className="folder-media-img" />
                  <div className="folder-media-caption">Page scan from idea sketches. All big projects start rough.</div>
                </div>
              )}

              {/* Photoshop UI skill render */}
              {selectedSticker === 'Sticker1' && (
                <div className="folder-media-container">
                  <img src="/photoshop_ui.png" alt="Photoshop interface design mockup" className="folder-media-img" />
                  <div className="folder-media-caption">UI mockups, graphics, and apparel designs catalog.</div>
                </div>
              )}

              {/* Blender 3D scene render */}
              {selectedSticker === 'Sticker2' && (
                <div className="folder-media-container">
                  <img src="/blender_render.png" alt="Blender workspace cyberpunk rendering" className="folder-media-img" />
                  <div className="folder-media-caption">Blender space design render. Building cinematic worlds.</div>
                </div>
              )}

              {/* WordPress stats visual */}
              {selectedSticker === 'Sticker3' && <WordPressMock />}

              {/* React components visual */}
              {selectedSticker === 'Sticker4' && <ReactMock />}

              {/* Three.js interactive visual */}
              {selectedSticker === 'Sticker5' && <ThreeJsMock />}
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
