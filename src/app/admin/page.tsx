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

async function getCustomerData() {
  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: {
        pricePaidInCents: true,
      },
    }),
  ]);

  const averageValuePerUser = userCount > 0 ? (orderData._sum.pricePaidInCents || 0) / userCount : 0;

  return {
    userCount,
    averageValuePerUser,
  };
}

async function getProductData() {
  const [activeProducts, inactiveProducts] = await Promise.all([
    db.product.count({
      where: {
        isAvailableForPurchase: true,
      },
    }),
    db.product.count({
      where: {
        isAvailableForPurchase: false,
      },
    }),
  ]);

  return {
    activeProducts,
    inactiveProducts,
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
  const [salesData, customerData, productData] = await Promise.all([
    getSalesData(),
    getCustomerData(),
    getProductData(),
  ]);

  // Data
  const { amount, numberOfSales } = salesData;
  const { userCount, averageValuePerUser } = customerData;

  // Formatted Data
  const formattedAmount = formatCurrency(amount);
  const formattedNumberOfSales = formatNumber(numberOfSales);
  const formattedAverageValuePerUser = formatCurrency(averageValuePerUser);
  const formattedUserCount = formatNumber(userCount);
  const formattedActiveProductCount = formatNumber(productData.activeProducts);
  const formattedInactiveProductCount = formatNumber(productData.inactiveProducts);

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4'>
      <DashboardCard title='Sales' subtitle={`${formattedNumberOfSales} Orders`} body={formattedAmount} />

      <DashboardCard
        title='Customers'
        subtitle={`${formattedAverageValuePerUser} Average Value`}
        body={formattedUserCount}
      />
      <DashboardCard
        title='Active Products'
        subtitle={`${formattedInactiveProductCount} inactive`}
        body={formattedActiveProductCount}
      />
    </div>
  );
};

export default AdminDashboard;
