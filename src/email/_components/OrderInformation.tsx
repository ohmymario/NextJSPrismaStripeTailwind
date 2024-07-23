import { formatCurrency } from '@/lib/formatters';
import { Button, Column, Img, Row, Section, Text } from '@react-email/components';

interface OrderInformationProps {
  order: { id: string; createdAt: Date; pricePaidInCents: number };
  product: { name: string; imagePath: string; description: string };
  downloadVerificationId: string;
}

export default function OrderInformation(props: OrderInformationProps) {
  const { order, product, downloadVerificationId } = props;

  const dateFormatted = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(order.createdAt);
  const priceFormatted = formatCurrency(order.pricePaidInCents / 100);
  const downloadUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/products/download/${downloadVerificationId}`;

  return (
    <>
      <Section>
        <Row>
          <Column>
            <Text className='mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4'>Order ID</Text>
            <Text className='mt-0 mr-4'>{order.id}</Text>
          </Column>
          <Column>
            <Text className='mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4'>Purchased On</Text>
            <Text className='mt-0 mr-4'>{dateFormatted}</Text>
          </Column>
          <Column>
            <Text className='mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4'>Price Paid</Text>
            <Text className='mt-0 mr-4'>{priceFormatted}</Text>
          </Column>
        </Row>
      </Section>

      <Text>
        {process.env.NEXT_PUBLIC_SERVER_URL}${product.imagePath}
      </Text>

      <Section className='border border-solid border-gray-500 rounded-lg p-4 md:p-4 my-4'>
        {/* Image */}
        <Img src={`${process.env.NEXT_PUBLIC_SERVER_URL}${product.imagePath}`} alt={product.name} width={'100%'} />

        {/* Product Name and Description */}
        <Row className='mt-8'>
          <Column className='align-bottom'>
            <Text className='text-lg font-bold m-0 mr-4'>{product.name}</Text>
            <Text>{product.description}</Text>
          </Column>

          {/* Download Button */}
          <Column align='right'>
            <Button href={downloadUrl} className='bg-black text-white px-6 py-4 rounded text-lg'>
              Download
            </Button>
          </Column>
        </Row>

        {/* Expiration */}
        <Row>
          <Column>
            <Text className='text-gray-500 mb-0'>Download link expires in 24 hours</Text>
          </Column>
        </Row>
      </Section>
    </>
  );
}
