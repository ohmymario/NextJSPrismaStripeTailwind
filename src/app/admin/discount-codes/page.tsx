// Components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import PageHeader from '../_components/PageHeader';

// Shadcn
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import db from '@/db/db';
import { $Enums, Prisma } from '@prisma/client';
import Link from 'next/link';
import { formatCurrency, formatDiscountType, formatNumber } from '@/lib/formatters';
import { CheckCircle2, XCircle, MoreVertical } from 'lucide-react';
import { ActiveToggleDropdownItem, DeleteDropdownItem } from '../products/_components/ProductActions';

interface DiscountCodesProps {}

interface DiscountCodesTableProps {
  discountCodes: Awaited<
    Prisma.PrismaPromise<
      {
        id: string;
        code: string;
        discountAmount: number;
        discountType: $Enums.DiscountCodeType;
        uses: number;
        isActive: boolean;
        allProducts: boolean;
        createdAt: Date;
        limit: number | null;
        expiresAt: Date | null;
      }[]
    >
  >;
}

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

function DiscountCodesTable({ discountCodes }: DiscountCodesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-0'>
            <span className='sr-only'>Activated Discount Codes</span>
          </TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Discount</TableHead>
          <TableHead>Expires</TableHead>
          <TableHead>Remaining Uses</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Products</TableHead>
          <TableHead className='w-0'>
            <span className='sr-only'>Deleting</span>
            <span className='sr-only'>Activating</span>
            <span className='sr-only'>Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {discountCodes.map((discountCode) => (
          <TableRow key={discountCode.id}>
            <TableCell className='w-0'>
              {discountCode.isActive ? (
                <>
                  <span className='sr-only'>Active</span>
                  <CheckCircle2 />
                </>
              ) : (
                <>
                  <span className='sr-only'>Inactive</span>
                  <XCircle className='stroke-destructive' />
                </>
              )}
            </TableCell>
            <TableCell>{discountCode.code}</TableCell>
            <TableCell>{formatDiscountType(discountCode) as string}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className='sr-only'>Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <a href={`/admin/discountCodes/${discountCode.id}/download`}>Download</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href={`/admin/discountCodes/${discountCode.id}/edit`}>Edit</a>
                  </DropdownMenuItem>

                  {/* <ActiveToggleDropdownItem
                    id={discountCode.id}
                    isAvailableForPurchase={discountCode.isAvailableForPurchase}
                  /> */}

                  <DropdownMenuSeparator />

                  {/* <DeleteDropdownItem id={discountCode.id} disabled={discountCode._count.orders > 0} /> */}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
