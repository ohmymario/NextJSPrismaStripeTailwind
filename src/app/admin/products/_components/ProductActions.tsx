'use client';

// react
import { useTransition } from 'react';

// shadcn
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

// actions
import { deleteProduct, toggleProductAvailability } from '../_actions/products';

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

  const handleTransition = () => {
    startTransition(async () => {
      await toggleProductAvailability(id, !isAvailableForPurchase);
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

  const handleTransition = () => {
    startTransition(async () => {
      await deleteProduct(id);
    });
  };

  return (
    <DropdownMenuItem onClick={handleTransition} disabled={disabled || isPending}>
      Delete
    </DropdownMenuItem>
  );
}
