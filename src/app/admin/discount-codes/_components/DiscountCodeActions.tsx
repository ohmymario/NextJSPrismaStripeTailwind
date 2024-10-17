'use client';

// react
import { useTransition } from 'react';

// next
import { useRouter } from 'next/navigation';

// shadcn
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

// server actions
import { deleteDiscountCode, toggleDiscountCode } from '../../_actions/discountCodes';

interface ActiveToggleDropdownItemProps {
  id: string;
  isActive: boolean;
}

interface DeleteDropdownItemProps {
  id: string;
  disabled: boolean;
}

// Toggle Product Availability
export function ActiveToggleDropdownItem({ id, isActive }: ActiveToggleDropdownItemProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleDiscountCode(id, !isActive);
      router.refresh();
    });
  };

  return (
    <DropdownMenuItem onClick={handleToggle} disabled={isPending}>
      {isActive ? 'Deactivate' : 'Activate'}
    </DropdownMenuItem>
  );
}

// Delete Single Product
export function DeleteDropdownItem({ id, disabled }: DeleteDropdownItemProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteDiscountCode(id);
      router.refresh();
    });
  };

  return (
    <DropdownMenuItem variant='destructive' onClick={handleDelete} disabled={isPending || disabled}>
      Delete
    </DropdownMenuItem>
  );
}
