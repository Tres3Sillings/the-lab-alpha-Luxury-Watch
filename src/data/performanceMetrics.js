export const performanceMetrics = {
  '/curiosity': {
    chapter: 'CH 01',
    title: 'Curiosity Room',
    rating: 'A+',
    accentColor: '#00f2ff',
    accentColorRgb: '0, 242, 255',
    description: '3D Scene with interactive desk objects. Optimization includes custom Draco GLTF compression and Web Audio API synthesized backing track (saving ~8.5MB of MP3 payload).',
    techs: ['React', 'Three.js', 'Draco', 'Theatre.js', 'Web Audio API'],
    assets: [
      { name: 'Desk Scene Model', path: '01-CURIOSITY-transformed.glb', type: 'model' },
      { name: 'Audio (Synthesized Chords)', size: '0.0 KB', type: 'audio' },
      { name: 'Glitch Sound Effects', path: 'glitch.mp3', type: 'audio' },
      { name: 'Code, Styles & Shaders', size: '~15.0 KB', type: 'code' },
      { name: 'External Images', size: '0.0 KB', type: 'image' }
    ]
  },
  '/experiments': {
    chapter: 'CH 02',
    title: 'Experiments Room',
    rating: 'A++',
    accentColor: '#c5a880',
    accentColorRgb: '197, 168, 208',
    description: 'A workspace displaying multiple custom WebGL configurations. The scene model features a minimal vertex budget and reuses cached audio assets from Chapter 01 to eliminate duplicate network calls.',
    techs: ['React', 'Three.js', 'Mesh Minimization', 'Cache reuse'],
    assets: [
      { name: 'Workshop Model', path: '02-EXPERERMENT-transformed.glb', type: 'model' },
      { name: 'Audio (Cached Chords)', size: '0.0 KB', type: 'audio' },
      { name: 'Code, Styles & Shaders', size: '~35.0 KB', type: 'code' },
      { name: 'External Images', size: '0.0 KB', type: 'image' }
    ]
  },
  '/materiallab': {
    chapter: 'APP',
    title: 'Material Slime Lab',
    rating: 'A++',
    accentColor: '#00ff88',
    accentColorRgb: '0, 255, 136',
    description: 'A procedural material configurator page. Models are constructed programmatically using Three.js mathematical geometries (0 KB GLB payload).',
    techs: ['React Three Fiber', 'Leva UI', 'Procedural Mesh', 'Post-processing'],
    assets: [
      { name: 'Procedural Spheres', size: '0.0 KB', type: 'model' },
      { name: 'Glitch Sound Effects', path: 'glitch.mp3', type: 'audio' },
      { name: 'Custom Shaders & Leva Controls', size: '~20.0 KB', type: 'code' }
    ]
  },
  '/building': {
    chapter: 'CH 03',
    title: 'Building (Main)',
    rating: 'A++',
    accentColor: '#ff8c42',
    accentColorRgb: '255, 140, 66',
    description: 'Highly performant HTML/CSS placeholder. Sub-apps (like the 3D Lab Hub, which has a 2.93 MB payload) are lazy-loaded on request, ensuring users don\'t download assets they don\'t interact with.',
    techs: ['React', 'CSS Grid', 'Lazy-loading', 'Vite Bundle Splits'],
    assets: [
      { name: 'Page Code & CSS', size: '8.0 KB', type: 'code' },
      { name: '3D Models (Lazy-loaded)', size: '0.0 KB', type: 'model' },
      { name: 'External Images', size: '0.0 KB', type: 'image' }
    ]
  },
  '/freelance': {
    chapter: 'CH 04',
    title: 'Freelance (Main)',
    rating: 'A++',
    accentColor: '#4ecdc4',
    accentColorRgb: '78, 205, 196',
    description: 'A lightweight portal summarizing freelance development. High-fidelity 3D sub-apps (such as the Watch Lab customizer at 28.3 MB) are separated into lazy-loaded routes with full loading screens.',
    techs: ['React', 'Code Splitting', 'Dynamic Imports'],
    assets: [
      { name: 'Page Code & CSS', size: '8.0 KB', type: 'code' },
      { name: '3D Models (Lazy-loaded)', size: '0.0 KB', type: 'model' },
      { name: 'External Images', size: '0.0 KB', type: 'image' }
    ]
  },
  '/agency': {
    chapter: 'CH 05',
    title: 'Agency (Main)',
    rating: 'A++',
    accentColor: '#7b6fff',
    accentColorRgb: '123, 111, 255',
    description: 'Pure static semantic layout summarizing professional agency experience. Built with strict SEO and accessibility protocols, featuring sub-50ms paint times.',
    techs: ['HTML5 Semantics', 'Vanilla CSS', 'SEO Meta'],
    assets: [
      { name: 'Page Code & CSS', size: '7.0 KB', type: 'code' },
      { name: '3D Models (WIP Scene)', size: '0.0 KB (Not Loaded)', type: 'model' }
    ]
  },
  '/playground': {
    chapter: 'CH 06',
    title: 'Playground (Main)',
    rating: 'A++',
    accentColor: '#00f5d4',
    accentColorRgb: '0, 245, 212',
    description: 'A playground index page. Clicking into the 3D Room Editor loads a 1.36 MB layout configurator. Furniture assets are procedurally generated in-code (0 KB model files) where possible.',
    techs: ['TypeScript', 'Code Splitting', 'Procedural Mesh Logic'],
    assets: [
      { name: 'Page Code & CSS', size: '12.0 KB', type: 'code' },
      { name: '3D Models (Lazy-loaded)', size: '0.0 KB', type: 'model' }
    ]
  },
  '/future': {
    chapter: 'CH 07',
    title: 'The Future',
    rating: 'A++',
    accentColor: '#e8e8e8',
    accentColorRgb: '232, 232, 232',
    description: 'Minimalist landing layout showcasing dynamic vector lines and GPU-accelerated glowing grid layouts.',
    techs: ['React', 'CSS Keyframes', 'GPU Composition'],
    assets: [
      { name: 'Page Code & CSS', size: '5.0 KB', type: 'code' }
    ]
  },
  '/shoe': {
    chapter: 'APP',
    title: 'Nike Customizer',
    rating: 'A',
    accentColor: '#c8102e',
    accentColorRgb: '200, 16, 46',
    description: 'Interactive shoe customizer. The high-resolution shoe model is heavily optimized using Draco compression. Clickable parts (swoosh, laces, sole) share textures to reduce duplicate payload.',
    techs: ['React Three Fiber', 'Draco Compression', 'Texture Atlas Sharing'],
    assets: [
      { name: 'Shoe Model (Draco)', path: 'Shoethelab-transformed.glb', type: 'model' },
      { name: 'Customizer Engine', size: '~25.0 KB', type: 'code' }
    ]
  },
  '/watch-lab': {
    chapter: 'APP',
    title: 'Luxury Watch Lab',
    rating: 'B',
    accentColor: '#c5a880',
    accentColorRgb: '197, 168, 128',
    description: 'A photorealistic 3D watch customizer. Features a complex, uncompressed 28.3 MB luxury watch model with detailed adjustment knobs and moving gear hands. Utilizes loading progress indicators.',
    techs: ['React Three Fiber', 'OrbitControls', 'Progressive Asset Loading'],
    assets: [
      { name: 'Luxury Watch Model', path: 'mainwatchfileforthelab.glb', type: 'model' },
      { name: 'Customizer Engine', size: '~30.0 KB', type: 'code' }
    ]
  },
  '/coffin-editor': {
    chapter: 'APP',
    title: 'Coffin Designer',
    rating: 'A',
    accentColor: '#7b6fff',
    accentColorRgb: '123, 111, 255',
    description: 'Custom configuration editor. Loads a 7.58 MB coffin model alongside a 588 KB UI preview thumbnail. Real-time material mapping allows swapping wood grains and metal trims dynamically.',
    techs: ['React Three Fiber', 'Dynamic Material Bindings', 'Asset Preloading'],
    assets: [
      { name: 'Coffin Model', path: 'Coffin-transformed.glb', type: 'model' },
      { name: 'Preview Mockup Thumbnail', path: 'Coffin-Editor.png', type: 'image', fallbackSize: '588.5 KB' },
      { name: 'Workbench Engine', size: '~15.0 KB', type: 'code' }
    ]
  },
  '/forge': {
    chapter: 'APP',
    title: "King's Forge",
    rating: 'A+',
    accentColor: '#d4af37',
    accentColorRgb: '212, 175, 55',
    description: 'Dynamic sword building forge. Blends custom hilts, blades, and guards in R3F. Note: Model asset is currently set to placeholder / offline.',
    techs: ['React Three Fiber', 'Mesh Swapping', 'Metal Reflection Shaders'],
    assets: [
      { name: 'Sword Parts Model (Est.)', path: 'SwordTheLab.glb', type: 'model', fallbackSize: '1.20 MB' },
      { name: 'Forge Logic', size: '~20.0 KB', type: 'code' }
    ]
  },
  '/3d-room': {
    chapter: 'APP',
    title: '3D Lab Hub Workspace',
    rating: 'A',
    accentColor: '#00f2ff',
    accentColorRgb: '0, 242, 255',
    description: 'Interactive portfolio hub. Loads a 2.93 MB laboratory scene featuring glowing computer monitors, neon rings, and a custom orbit camera transition engine.',
    techs: ['React Three Fiber', 'Camera Rigging', 'gsap transitions'],
    assets: [
      { name: 'Lab Hub Scene Model', path: 'TheLabHub_V2-transformed.glb', type: 'model' },
      { name: 'Workspace Code & HUD', size: '~30.0 KB', type: 'code' }
    ]
  },
  '/room-editor': {
    chapter: 'APP',
    title: 'Procedural Room Editor',
    rating: 'A',
    accentColor: '#00f5d4',
    accentColorRgb: '0, 245, 212',
    description: 'A procedural layout configurator. Standard objects like walls, floors, doors, and standard tables are constructed dynamically in JS code (0 KB GLB files), while the Tank Chair GLB loads as a rich detail model.',
    techs: ['TypeScript', 'Procedural Math Geometry', 'React Context Store'],
    assets: [
      { name: 'Tank Chair Model', path: 'Tank_chair_2-transformed.glb', type: 'model' },
      { name: 'Procedural Room Builder', size: '~40.0 KB', type: 'code' }
    ]
  }
}
