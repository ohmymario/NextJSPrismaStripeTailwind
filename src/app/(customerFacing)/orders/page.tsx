'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useFormStatus } from 'react-dom';

export default function OrdersPage() {
  return (
    <form className='max-2-xl mx-auto'>
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
          <CardDescription>Enter your email and we will email your order history and download links.</CardDescription>
        </CardHeader>

        <CardContent>
          <div className='space-y-2'>
            <Label>Email</Label>
            <Input type='email' />
          </div>
        </CardContent>

        <CardFooter>
          <SubmitButton />
        </CardFooter>
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
