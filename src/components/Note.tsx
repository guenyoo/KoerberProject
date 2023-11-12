import { Headline } from './Headline';

interface NoteProps {
  type: 'error' | 'success' | 'warning';
  headline: string;
  content: string;
  className?: string;
}

const Note = ({ type, headline, content, className }: NoteProps) => {
  return (
    <div
      className={[
        type === 'success' && 'bg-green-500 border-green-400 bg-opacity-50 border-solid border-[1px]',
        type === 'warning' && 'bg-yellow-500 border-yellow-500',
        type === 'error' && 'bg-red-500 border-red-500',
        className,
        'rounded-lg p-2',
      ].join(' ')}
    >
      <Headline type="h2" content={headline} className="text-2xl" />
      <p>{content}</p>
    </div>
  );
};

export { Note };
