import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ExpiredProps {}

export default function Expired(props: ExpiredProps) {
  return (
    <>
      <h1 className='text-4xl mb-4'>Download link expired</h1>
      <Button asChild size='lg'>
        <Link href='/orders'>Request a new download link</Link>
      </Button>
    </>
  );
}
