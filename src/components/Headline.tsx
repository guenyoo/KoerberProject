interface HeadlineProps {
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  content: string;
}

const Headline = ({ type, content }: HeadlineProps) => {
  const Comp = type;
  return <Comp>{content}</Comp>;
};

export { Headline };
