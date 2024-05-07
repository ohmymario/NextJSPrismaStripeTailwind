'use client';

// react
import { useTransition } from 'react';

// shadcn
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

// actions
import { deleteProduct, toggleProductAvailability } from '../_actions/products';
import { useRouter } from 'next/navigation';

interface ActiveToggleDropdownItemProps {
  id: string;
  isAvailableForPurchase: boolean;
}

interface DeleteDropdownItemProps {
  id: string;
  disabled: boolean;
}

// Toggle Product Availability
export function ActiveToggleDropdownItem(props: ActiveToggleDropdownItemProps) {
  const { id, isAvailableForPurchase } = props;

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleTransition = () => {
    startTransition(async () => {
      await toggleProductAvailability(id, !isAvailableForPurchase);
      router.refresh();
    });
  };

  return (
    <DropdownMenuItem onClick={handleTransition} disabled={isPending}>
      {isAvailableForPurchase ? 'Deactivate' : 'Activate'}
    </DropdownMenuItem>
  );
}

// Delete Single Product
export function DeleteDropdownItem(props: DeleteDropdownItemProps) {
  const { id, disabled } = props;

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleTransition = () => {
    startTransition(async () => {
      await deleteProduct(id);
      router.refresh();
    });
  };

  return (
    <DropdownMenuItem variant='destructive' onClick={handleTransition} disabled={disabled || isPending}>
      Delete
    </DropdownMenuItem>
  );
}
