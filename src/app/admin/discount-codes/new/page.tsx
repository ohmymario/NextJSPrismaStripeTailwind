import db from '@/db/db';
import PageHeader from '../../_components/PageHeader';
import DiscountCodeForm from '../_components/DiscountCodeForm';

interface NewDiscountCodePageProps {}

export default async function NewDiscountCodePage(props: NewDiscountCodePageProps) {
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: 'asc' },
  });

  console.log(products);

  return (
    <>
      <PageHeader>Add DiscountCode</PageHeader>
      <DiscountCodeForm products={products} />
    </>
  );
}
