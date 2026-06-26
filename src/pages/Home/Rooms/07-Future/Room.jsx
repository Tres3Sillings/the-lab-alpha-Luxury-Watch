import RoomPlaceholder from '../RoomPlaceholder'
import IntroContent from './IntroContent'

const CHAPTER = {
  id: '07',
  title: 'The Future',
  theme: 'I\'m just getting started.',
  story: `No grand ending.\nNo "I've made it."\nJust possibility.\n\nThe best project is always the next one.\n\nWhat's next?`,
  color: '#e8e8e8',
  highlights: ['AI', 'Interactive Experiences', 'Creative Direction', 'Startups', '3D', 'Real-time Web', 'Products', 'Freedom'],
}

export default function FutureRoom() {
  return <RoomPlaceholder chapter={CHAPTER} IntroComponent={IntroContent} />
}
