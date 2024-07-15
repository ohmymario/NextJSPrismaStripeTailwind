import { TableHeader, TableRow, TableHead } from '@/components/ui/table';

interface OrdersHeaderProps {}

export default function OrdersHeader(props: OrdersHeaderProps) {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Product</TableHead>
        <TableHead>Customer</TableHead>
        <TableHead>Price Paid</TableHead>
        <TableHead className='w-0'>
          <span className='sr-only'>Actions</span>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}
