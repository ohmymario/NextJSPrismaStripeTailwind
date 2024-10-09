import db from '@/db/db';
import { $Enums, Prisma, Product } from '@prisma/client';
import Link from 'next/link';

// Components
import PageHeader from '../_components/PageHeader';

// Shadcn
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Formatters
import { formatDateTime, formatDiscountType, formatNumber } from '@/lib/formatters';
import { CheckCircle2, Globe, Infinity, Minus, MoreVertical, XCircle } from 'lucide-react';

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
        allProducts: Product[];
        createdAt: Date;
        limit: number | null;
        expiresAt: Date | null;
        _count: {
          orders: number;
        };
        products: {
          id: string;
          name: string;
        }[];
      }[]
    >
  >;
}

const WHERE_EXPIRED: Prisma.DiscountCodeWhereInput = {
  OR: [
    {
      limit: { not: null, lte: db.discountCode.fields.uses },
    },
    { expiresAt: { not: null, lte: new Date() } },
  ],
};

const SELECT_FIELDS: Prisma.DiscountCodeSelect = {
  id: true,
  allProducts: true,
  code: true,
  discountAmount: true,
  discountType: true,
  expiresAt: true,
  limit: true,
  uses: true,
  isActive: true,
  products: { select: { id: true, name: true } },
  _count: { select: { orders: true } },
};

function getExpiredDiscountCodes() {
  return db.discountCode.findMany({
    select: SELECT_FIELDS,
    where: WHERE_EXPIRED,
    orderBy: { createdAt: 'asc' },
  });
}

function getActiveDiscountCodes() {
  return db.discountCode.findMany({
    select: SELECT_FIELDS,
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
            <span className='sr-only'>Activate</span>
            <span className='sr-only'>Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {discountCodes.map(
          ({
            id,
            code,
            discountAmount,
            discountType,
            isActive,
            expiresAt,
            limit,
            uses,
            _count,
            products,
            allProducts,
          }) => (
            <TableRow key={id}>
              {/* Discount Code Status */}

              <TableCell className='w-0'>
                {isActive ? (
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
              <TableCell>{code}</TableCell>
              <TableCell>{formatDiscountType({ discountAmount, discountType }) as string}</TableCell>
              <TableCell>{expiresAt === null ? <Minus /> : formatDateTime(expiresAt)}</TableCell>
              <TableCell>{limit === null ? <Infinity /> : `${limit - uses}`}</TableCell>
              <TableCell>{formatNumber(_count.orders)}</TableCell>
              <TableCell>{formatNumber(_count.orders)}</TableCell>
              <TableCell>{allProducts ? <Globe /> : products.map(({ name }) => name).join(', ')}</TableCell>

              {/* Discount Code Actions */}
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVertical />
                    <span className='sr-only'>Actions</span>
                  </DropdownMenuTrigger>

                  {/* Dropdown menu inside */}
                  <DropdownMenuContent>
                    {/* <ActiveToggleDropdownItem
                    id={id}
                    isAvailableForPurchase={isAvailableForPurchase}
                  /> */}

                    <DropdownMenuSeparator />

                    {/* <DeleteDropdownItem id={id} disabled={_count.orders > 0} /> */}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          )
        )}
      </TableBody>
    </Table>
  );
}
