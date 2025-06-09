import sadIcon from '../assets/icons/sad.svg';
import happyIcon from '../assets/icons/happy.svg';
import neutralIcon from '../assets/icons/normal.svg';

export type SentimentEmoji = '🙁' | '🙂' | '😐';

export const sentimentIcon: Record<SentimentEmoji, string> = {
  '🙁': sadIcon,
  '🙂': happyIcon,
  '😐': neutralIcon,
};

const sentimentName: Record<SentimentEmoji, string> = {
  '🙁': 'Sad',
  '🙂': 'Happy',
  '😐': 'Neutral',
};

export default sentimentName;
