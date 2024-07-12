import { TableHeader, TableRow, TableHead } from '@/components/ui/table';

interface UsersHeaderProps {}

export default function UsersHeader(props: UsersHeaderProps) {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Email</TableHead>
        <TableHead>Orders</TableHead>
        <TableHead>Value</TableHead>
        <TableHead className='w-0'>
          <span className='sr-only'>Actions</span>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}
