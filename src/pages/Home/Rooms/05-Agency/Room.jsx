import RoomPlaceholder from '../RoomPlaceholder'

const CHAPTER = {
  id: '05',
  title: 'Agency',
  theme: 'Learning from professionals.',
  story: `Freelancing taught you how to build.\nAgency life taught you how teams build.\n\nDeadlines. Systems. Large projects.\nProfessional workflows. Code quality.\nAccessibility. Production.`,
  color: '#7b6fff',
  highlights: ['AWEBCO', 'WordPress', 'React', 'Custom Plugins', 'Git', 'Code Review', 'Accessibility', 'Large Projects'],
}

export default function AgencyRoom() {
  return <RoomPlaceholder chapter={CHAPTER} />
}
