import { Body, Container, Head, Heading, Hr, Html, Preview, Tailwind } from '@react-email/components';
import OrderInformation from './_components/OrderInformation';
import React from 'react';

type OrderHistoryEmailProps = {
  orders: {
    id: string;
    pricePaidInCents: number;
    downloadVerificationId: string;
    createdAt: Date;

    product: {
      name: string;
      imagePath: string;
      description: string;
    };
  }[];
};

OrderHistoryEmail.PreviewProps = {
  orders: [
    {
      id: crypto.randomUUID(),
      pricePaidInCents: 10000,
      downloadVerificationId: crypto.randomUUID(),
      createdAt: new Date(),
      product: {
        name: 'Product name',
        description: 'Some description',
        imagePath: '/products/241884ad-1049-4990-b5d4-6517dc7c5188-qg0phb3orc7a1.jpg',
      },
    },
    {
      id: crypto.randomUUID(),
      pricePaidInCents: 12345,
      downloadVerificationId: crypto.randomUUID(),
      createdAt: new Date(),
      product: {
        name: 'Product name 2',
        description: 'Some description 2',
        imagePath: '/products/241884ad-1049-4990-b5d4-6517dc7c5188-qg0phb3orc7a1.jpg',
      },
    },
  ],
} satisfies OrderHistoryEmailProps;

export default function OrderHistoryEmail({ orders }: OrderHistoryEmailProps) {
  return (
    <Html>
      <Preview>Order History & Downloads</Preview>
      <Tailwind>
        <Head />
        <Body className='font-sans bg-white'>
          <Container className='max-w-xl'>
            <Heading>Order History</Heading>

            {orders.map((order, index) => (
              <React.Fragment key={order.id}>
                <OrderInformation
                  key={order.id}
                  order={order}
                  product={order.product}
                  downloadVerificationId={order.downloadVerificationId}
                />

                {index < orders.length - 1 && <Hr />}
              </React.Fragment>
            ))}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
