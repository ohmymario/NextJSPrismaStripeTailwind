import db from '@/db/db';
import { Prisma } from '@prisma/client';
import Link from 'next/link';

// Components
import PageHeader from '../_components/PageHeader';
import { DiscountCodesTable } from './_components/DiscountCodeTable';

// Shadcn
import { Button } from '@/components/ui/button';

interface DiscountCodesProps {}

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
      <DiscountCodesTable discountCodes={activeDiscountCodes} canDeactivate />

      <div>
        <h2 className='text-xl font-bold'>Expired Coupons</h2>
        <DiscountCodesTable discountCodes={expiredDiscountCodes} isInactive />
      </div>
    </>
  );
}
