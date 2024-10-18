import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/formatters';
import { Minus, MoreVertical } from 'lucide-react';
import { DeleteDropDownItem } from './OrderActions';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface OrdersBodyProps {
  orders: {
    id: string;
    pricePaidInCents: number;
    product: { name: string };
    user: { email: string };
    discountCode: { code: string } | null;
  }[];
}

export default function OrdersBody({ orders }: OrdersBodyProps) {
  return (
    <TableBody>
      {orders.map((order) => (
        <TableRow key={order.id}>
          <TableCell>{order.product.name}</TableCell>
          <TableCell>{order.user.email}</TableCell>
          <TableCell>{formatCurrency(order.pricePaidInCents / 100)}</TableCell>
          <TableCell>{order.discountCode === null ? <Minus /> : order.discountCode.code}</TableCell>
          {/* MENU */}
          <TableCell className='text-center'>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreVertical />
                <span className='sr-only'>Actions</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DeleteDropDownItem id={order.id} />
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
