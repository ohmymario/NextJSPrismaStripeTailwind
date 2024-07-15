import PageHeader from '@/app/admin/_components/PageHeader';
import { UsersTable } from './_components/UsersTable';

export default function UsersPage() {
  return (
    <>
      <PageHeader>Customers</PageHeader>
      <UsersTable />
    </>
  );
}
