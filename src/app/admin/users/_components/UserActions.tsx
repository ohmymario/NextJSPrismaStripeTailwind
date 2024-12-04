'use client';

// react and next
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

// shadcn
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

// actions
import { deleteUser } from '@/actions/admin/users';

export function DeleteDropDownItem({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <DropdownMenuItem
      variant='destructive'
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await deleteUser(id);
          router.refresh();
        })
      }
    >
      Delete
    </DropdownMenuItem>
  );
}
