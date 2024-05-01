import { Button } from '@/components/ui/button';
import db from '@/db/db';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import Link from 'next/link';
import PageHeader from '../_components/PageHeader';

interface ProductsProps {}

export default function Products(props: ProductsProps) {
  return (
    <>
      <div className='flex justify-between items-center gap-4 '>
        <PageHeader>Products</PageHeader>
        <Button>
          <Link href='/admin/products/new'>Add Product</Link>
        </Button>
      </div>
      <ProductsTable />
    </>
  );
}

async function ProductsTable() {
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
      priceInCents: true,
      isAvailableForPurchase: true,
      _count: {
        select: { orders: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  if (products.length === 0) {
    return <p>No products found</p>;
  }

  console.log(products);

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
    </Table>
  );
}
