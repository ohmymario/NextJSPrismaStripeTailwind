'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ComponentProps } from 'react';

export function Nav(props: { children: React.ReactNode }) {
  return <nav className='bg-primary text-primary-foreground flex justify-center px-4'>{props.children}</nav>;
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, 'className'>) {
  const pathname = usePathname();

  return (
    <Link
      {...props}
      className={cn(
        'p-4 hover:bg-secondary hover:text-secondary-foreground focus:bg-secondary focus:text-secondary-foreground',
        pathname === props.href && 'bg-secondary text-foreground'
      )}
    />
  );
}
