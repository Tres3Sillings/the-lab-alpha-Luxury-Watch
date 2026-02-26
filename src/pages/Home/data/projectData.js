export const PROJECT_DATA = {
  shoe: {
    title: 'Nike Air Max',
    subtitle: 'Alpha Configurator',
    overview: 'The goal was to build a high-fidelity, interactive 3D product configurator for a custom sneaker ("Nike Air Max Alpha"). The experience mimics high-end brand configurators with a focus on sleek UI, real-time interactivity, and premium visual fidelity.',
    approach: [
      { title: 'Modeling', text: 'Real-world scale (0.3m), segmented parts (Swoosh, Sole) for independent coloring.' },
      { title: 'Dev', text: 'Built with React Three Fiber. Custom state management for part colors and color.lerp transitions.' },
      { title: 'UX', text: 'Split-screen layout with 9+ customizable zones and seamless hub navigation.' }
    ],
    tech: ['React Three Fiber', 'Blender', 'Tailwind CSS', 'Zustand'],
    credits: 'Model by DeezVertz (modified).',
    link: '/shoe'
  },
  watch: {
    title: 'Chronos Watch',
    subtitle: 'S-Tier Storytelling',
    overview: 'The goal was to create a cinematic, scroll-driven "storytelling" experience for a luxury skeleton watch. The project focuses on high-end visual transitions, utilizing "exploded view" mechanics to showcase internal engineering.',
    approach: [
      { title: 'Modeling', text: 'Centered pivots for rotation. Organized hierarchy (Sapphire, Dial) for Z-axis explosion.' },
      { title: 'Dev', text: 'Implemented physics-based damping (MathUtils.damp) for fluid animation.' },
      { title: 'UX', text: 'Minimalist hero transition, scroll-synced overlays, and interactive CTA.' }
    ],
    tech: ['React Three Fiber', 'MathUtils.damp', 'ScrollControls', 'Tailwind'],
    credits: 'Model by The Vipron.',
    link: '/watch'
  },
  project_03: {
    title: 'AWEBCO',
    subtitle: 'Space Portfolio',
    overview: 'The goal was to build a high-end, immersive digital experience for AWEBCO. The project features a 3D scene with interactive elements, custom animations, and a cohesive design language.',
    approach: [
      { title: 'Modeling', text: 'Created a 3D scene with multiple interactive elements and custom geometry.' },
      { title: 'Dev', text: 'Built with React Three Fiber and Three.js. Implemented custom controls and animations.' },
      { title: 'UX', text: 'Designed an intuitive interface with clear navigation and visual feedback.' }
    ],
    tech: ['React Three Fiber', 'Three.js', 'Tailwind CSS'],
    credits: 'Custom 3D assets created for AWEBCO.',
    link: '/awebco'
  },
}