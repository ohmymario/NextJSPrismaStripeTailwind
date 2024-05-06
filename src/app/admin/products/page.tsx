import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import db from '@/db/db';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import { CheckCircle2, MoreVertical, XCircle } from 'lucide-react';
import Link from 'next/link';
import PageHeader from '../_components/PageHeader';
import { ActiveToggleDropdownItem, DeleteDropdownItem } from './_components/ProductActions';

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

      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className='w-0'>{product.isAvailableForPurchase ? <CheckCircle2 /> : <XCircle />}</TableCell>
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
                    <a href={`/admin/products/${product.id}/download`}>Download (non functional)</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href={`/admin/products/${product.id}/download`}>Edit (non functional)</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href={`/admin/products/${product.id}/download`}>Delete (non functional) </a>
                  </DropdownMenuItem>

                  <ActiveToggleDropdownItem id={product.id} isAvailableForPurchase={product.isAvailableForPurchase} />
                  <DeleteDropdownItem id={product.id} disabled={product._count.orders > 0} />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
