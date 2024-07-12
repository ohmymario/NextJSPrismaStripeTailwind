import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { formatNumber, formatCurrency } from '@/lib/formatters';
import { MoreVertical } from 'lucide-react';
import { DeleteDropDownItem } from './UserActions';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface UsersBodyProps {
  users: {
    id: string;
    email: string;
    orders: {
      pricePaidInCents: number;
    }[];
  }[];
}

export default function UsersBody({ users }: UsersBodyProps) {
  return (
    <TableBody>
      {users.map((user) => (
        <TableRow key={user.id}>
          <TableCell>{user.email}</TableCell>
          <TableCell>{formatNumber(user.orders.length)}</TableCell>
          <TableCell>{formatCurrency(user.orders.reduce((sum, o) => o.pricePaidInCents + sum, 0) / 100)}</TableCell>
          <TableCell className='text-center'>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreVertical />
                <span className='sr-only'>Actions</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DeleteDropDownItem id={user.id} />
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
