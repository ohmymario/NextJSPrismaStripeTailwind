// shadcn/ui 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import db from '@/db/db';
import { formatCurrency, formatNumber } from '@/lib/formatters';

interface AdminDashboardProps {}
interface DashboardCardProps {
  title: string;
  subtitle: string;
  body: string;
}

async function getSalesData() {
  const data = await db.order.aggregate({
    _sum: {
      pricePaidInCents: true,
    },
    _count: true,
  });

  return {
    amount: (data._sum.pricePaidInCents || 0) / 100,
    numberOfSales: data._count,
  };
}

const DashboardCard = (props: DashboardCardProps) => {
  const { title, subtitle, body } = props;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
    </Card>
  );
};

const AdminDashboard = async (props: AdminDashboardProps) => {
  // Fetch Data
  const [salesData, customerData] = await Promise.all([getSalesData(), getCustomerData()]);
  const { amount, numberOfSales } = salesData;
  // Formatted Data
  const formattedAmount = formatCurrency(amount);
  const formattedNumberOfSales = formatNumber(numberOfSales);
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4'>
      <DashboardCard title='Sales' subtitle={`${formattedNumberOfSales} Orders`} body={formattedAmount} />
    </div>
  );
};

export default AdminDashboard;
