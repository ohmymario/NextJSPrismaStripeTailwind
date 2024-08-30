// Components
import PageHeader from '../_components/PageHeader';

// Shadcn
import { Button } from '@/components/ui/button';
import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import db from '@/db/db';
import { Prisma } from '@prisma/client';
import Link from 'next/link';

interface DiscountCodesProps {}

const WHERE_EXPIRED: Prisma.DiscountCodeWhereInput = {
  // any of these are true will be included in the results
  // not: null = is not expired
  // or
  // lte: 1 = has 1 or less uses
  OR: [{ limit: { not: null, lte: 1 } }, { expiresAt: { not: null, lte: new Date() } }],
};

function getExpiredDiscountCodes() {
  return db.discountCode.findMany({
    // select: {},
    where: WHERE_EXPIRED,
    orderBy: { createdAt: 'asc' },
  });
}

function getActiveDiscountCodes() {
  return db.discountCode.findMany({
    // select: {},
    where: { NOT: WHERE_EXPIRED },
    orderBy: { createdAt: 'asc' },
  });
}

export default async function DiscountCodes(props: DiscountCodesProps) {
  const [expiredDiscountCodes, activeDiscountCodes] = await Promise.all([
    getExpiredDiscountCodes(),
    getActiveDiscountCodes(),
  ]);

  return (
    <>
      <div className='flex justify-between items-center gap-4 '>
        <PageHeader>Coupons</PageHeader>
        <Button>
          <Link href='/admin/discount-codes/new'>Add Coupon</Link>
        </Button>
      </div>
      <DiscountCodesTable discountCodes={activeDiscountCodes} />

      <div>
        <h2 className='text-xl font-bold'>Expired Coupons</h2>
        <DiscountCodesTable discountCodes={expiredDiscountCodes} />
      </div>
    </>
  );
}

function DiscountCodesTable() {
  return null;

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
