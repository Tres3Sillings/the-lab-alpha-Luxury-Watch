import RoomPlaceholder from '../RoomPlaceholder'

const CHAPTER = {
  id: '03',
  title: 'Building',
  theme: 'I realized what I actually loved.',
  story: `Running businesses wasn't your favorite part.\nStarting them was.\n\nYou love creating, launching, designing, and solving problems.\n\nThis is where your identity forms.`,
  color: '#ff8c42',
  highlights: ['Forbidden.Thread', 'React', 'Three.js', 'Blender', '3D Printing', 'Laser Engraving', 'Physical Products', 'Problem Solving'],
}

export default function BuildingRoom() {
  return <RoomPlaceholder chapter={CHAPTER} />
}
