import { Table } from '@/components/ui/table';
import UsersHeader from './UsersHeader';
import UsersBody from './UsersBody';
import db from '@/db/db';

interface UsersTableProps {}

function getUsers() {
  return db.user.findMany({
    select: {
      id: true,
      email: true,
      orders: { select: { pricePaidInCents: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function UsersTable() {
  const users = await getUsers();

  if (users.length === 0) return <p>No customers found</p>;

  return (
    <Table>
      <UsersHeader />
      <UsersBody users={users} />
    </Table>
  );
}
