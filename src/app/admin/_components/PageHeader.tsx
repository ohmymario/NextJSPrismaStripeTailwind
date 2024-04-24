interface PageHeaderProps {
  children: React.ReactNode;
}

export default function PageHeader(props: PageHeaderProps) {
  const { children } = props;
  return <h1 className='text-4xl mb-4'>{children}</h1>;
}
