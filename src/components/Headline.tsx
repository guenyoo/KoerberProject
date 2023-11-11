interface HeadlineProps {
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  content: string;
  className?: string;
}

const Headline = ({ type, content, className }: HeadlineProps) => {
  const Comp = type;
  return <Comp className={className}>{content}</Comp>;
};

export { Headline };
