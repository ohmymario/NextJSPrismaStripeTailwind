'use client';

// react and next
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

// shadcn
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

// actions
import { deleteOrder } from '@/actions/admin/orders';

export function DeleteDropDownItem({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <DropdownMenuItem
      variant='destructive'
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await deleteOrder(id);
          router.refresh();
        })
      }
    >
      Delete
    </DropdownMenuItem>
  );
}
