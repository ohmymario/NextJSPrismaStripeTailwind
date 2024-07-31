'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useFormState, useFormStatus } from 'react-dom';
import { emailOrderHistory } from '@/actions/orders';

export default function OrdersPage() {
  const [data, action] = useFormState(emailOrderHistory, {});

  return (
    <form action={action} className='max-2-xl mx-auto'>
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
          <CardDescription>Enter your email and we will email your order history and download links.</CardDescription>
        </CardHeader>

        <CardContent>
          <div className='space-y-2'>
            <Label>Email</Label>
            <Input type='email' name='email' id='email' required />
          </div>

          {data.error && <div className='text-destructive'>{data.error}</div>}
        </CardContent>

        <CardFooter>{data.message ? <p className='text-success'>{data.message}</p> : <SubmitButton />}</CardFooter>
      </Card>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button className='w-full' size='lg' disabled={pending}>
      {pending ? 'Sending...' : 'Send'}
    </Button>
  );
}
