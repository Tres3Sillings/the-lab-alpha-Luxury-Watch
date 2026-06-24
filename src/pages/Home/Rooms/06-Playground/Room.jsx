import RoomPlaceholder from '../RoomPlaceholder'

const CHAPTER = {
  id: '06',
  title: 'Playground',
  theme: 'Everything I\'m building today.',
  story: `This room is your brain.\n\nNothing is assigned.\nEverything exists because you wanted to learn.\n\nThis chapter never really ends.`,
  color: '#00f5d4',
  highlights: ['Luxury Watch', 'Forbidden.Thread', 'TFT Companion', 'CRM', 'Three.js', 'Blender', 'AI', 'Photography'],
}

export default function PlaygroundRoom() {
  return <RoomPlaceholder chapter={CHAPTER} />
}
