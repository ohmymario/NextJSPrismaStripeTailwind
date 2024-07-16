import { Table } from '@/components/ui/table';
import OrdersHeader from './OrdersHeader';
import OrdersBody from './OrdersBody';
import db from '@/db/db';

function getOrders() {
  return db.order.findMany({
    select: {
      id: true,
      pricePaidInCents: true,
      product: { select: { name: true } },
      user: { select: { email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function OrdersTable() {
  const orders = await getOrders();

  if (orders.length === 0) return <p>No sales found</p>;

  return (
    <Table>
      <OrdersHeader />
      <OrdersBody orders={orders} />
    </Table>
  );
}
