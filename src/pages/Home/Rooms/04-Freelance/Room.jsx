import RoomPlaceholder from '../RoomPlaceholder'

const CHAPTER = {
  id: '04',
  title: 'Freelance',
  theme: 'Helping other people build.',
  story: `After building your own projects, you realized\nhelping others succeed was just as rewarding.\n\nChurches. Friends. Businesses. Real estate.\nRestaurants. Contractors.\n\nYou became someone who solves problems.`,
  color: '#4ecdc4',
  highlights: ['Client Work', 'WordPress', 'Marketing', 'Branding', 'Communication', 'Discovery', 'Relationships', 'Real Estate'],
}

export default function FreelanceRoom() {
  return <RoomPlaceholder chapter={CHAPTER} />
}
