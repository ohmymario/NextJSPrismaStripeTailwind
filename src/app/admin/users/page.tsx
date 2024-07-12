import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import db from '@/db/db';

import PageHeader from '@/app/admin/_components/PageHeader';
import UsersBody from '@/app/admin/users/_components/UsersBody';
import UsersHeader from './_components/UsersHeader';

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

export default function UsersPage() {
  return (
    <>
      <PageHeader>Customers</PageHeader>
      <UsersTable />
    </>
  );
}

async function UsersTable() {
  const users = await getUsers();

  if (users.length === 0) return <p>No customers found</p>;

  return (
    <Table>
      <UsersHeader />
      <UsersBody users={users} />
    </Table>
  );
}
