import { TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { formatCurrency, formatNumber } from '@/lib/formatters';

import { Button } from '@react-email/components';
import { Link, Table, CheckCircle2, XCircle, MoreVertical } from 'lucide-react';
import PageHeader from '../_components/PageHeader';
import { ActiveToggleDropdownItem, DeleteDropdownItem } from '../products/_components/ProductActions';
import db from '@/db/db';

interface DiscountCodesProps {}

function getExpiredDiscountCodes() {
  db.discountCode.findMany({
    select: {},
    where: {
      OR: [{ limit: { not: null, lte: 1 } }, { expiresAt: { not: null, lte: new Date() } }],
    },
    orderBy: { createdAt: 'desc' },
  });

  return [];
}

function getActiveDiscountCodes() {
  return [];
}

export default function DiscountCodes(props: DiscountCodesProps) {
  return (
    <>
      <div className='flex justify-between items-center gap-4 '>
        <PageHeader>Coupons</PageHeader>
        <Button>
          <Link href='/admin/products/new'>Add Product</Link>
        </Button>
      </div>
      <DiscountCodesTable />

      <div>
        <h2 className='text-xl font-bold'>Expired Coupons</h2>
        <DiscountCodesTable />
      </div>
    </>
  );
}

function DiscountCodesTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-0'>
            <span className='sr-only'>Available for Purchase</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead className='w-0'>
            <span className='sr-only'>Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      {/* 
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className='w-0'>
              {product.isAvailableForPurchase ? (
                <>
                  <span className='sr-only'>Available</span>
                  <CheckCircle2 />
                </>
              ) : (
                <>
                  <span className='sr-only'>Unavailable</span>
                  <XCircle className='stroke-destructive' />
                </>
              )}
            </TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{formatCurrency(product.priceInCents / 100)}</TableCell>
            <TableCell>{formatNumber(product._count.orders)}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className='sr-only'>Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <a href={`/admin/products/${product.id}/download`}>Download</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href={`/admin/products/${product.id}/edit`}>Edit</a>
                  </DropdownMenuItem>

                  <ActiveToggleDropdownItem id={product.id} isAvailableForPurchase={product.isAvailableForPurchase} />

                  <DropdownMenuSeparator />

                  <DeleteDropdownItem id={product.id} disabled={product._count.orders > 0} />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody> */}
    </Table>
  );
}
