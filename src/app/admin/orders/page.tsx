import PageHeader from '@/app/admin/_components/PageHeader';
import { OrdersTable } from './_components/OrdersTable';

export default function OrdersPage() {
  return (
    <>
      <PageHeader>Sales</PageHeader>
      <OrdersTable />
    </>
  );
}
