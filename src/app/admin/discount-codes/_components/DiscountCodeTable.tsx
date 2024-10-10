import { $Enums, Prisma } from '@prisma/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDateTime, formatDiscountType, formatNumber } from '@/lib/formatters';
import { CheckCircle2, Globe, Infinity, Minus, MoreVertical, XCircle } from 'lucide-react';
import { ActiveToggleDropdownItem, DeleteDropdownItem } from './DiscountCodeActions';

interface DiscountCodesTableProps {
  discountCodes: Awaited<
    Prisma.PrismaPromise<
      {
        id: string;
        code: string;
        discountAmount: number;
        discountType: $Enums.DiscountCodeType;
        uses: number;
        isActive: boolean;
        allProducts: boolean;
        createdAt: Date;
        limit: number | null;
        expiresAt: Date | null;
        _count: {
          orders: number;
        };
        products: {
          id: string;
          name: string;
        }[];
      }[]
    >
  >;
  isInactive?: boolean;
  canDeactivate?: boolean;
}

export function DiscountCodesTable({
  discountCodes,
  isInactive = false,
  canDeactivate = false,
}: DiscountCodesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-0'>
            <span className='sr-only'>Activated Discount Codes</span>
          </TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Discount</TableHead>
          <TableHead>Expires</TableHead>
          <TableHead>Remaining Uses</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Products</TableHead>
          <TableHead className='w-0'>
            <span className='sr-only'>Deleting</span>
            <span className='sr-only'>Activate</span>
            <span className='sr-only'>Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {discountCodes.map(
          ({
            id,
            code,
            discountAmount,
            discountType,
            isActive,
            expiresAt,
            limit,
            uses,
            _count,
            products,
            allProducts,
          }) => (
            <TableRow key={id}>
              {/* Discount Code Status */}
              <TableCell className='w-0'>
                {isActive && !isInactive ? (
                  <>
                    <span className='sr-only'>Active</span>
                    <CheckCircle2 />
                  </>
                ) : (
                  <>
                    <span className='sr-only'>Inactive</span>
                    <XCircle className='stroke-destructive' />
                  </>
                )}
              </TableCell>
              <TableCell>{code}</TableCell>
              <TableCell>{formatDiscountType({ discountAmount, discountType }) as string}</TableCell>
              <TableCell>{expiresAt === null ? <Minus /> : formatDateTime(expiresAt)}</TableCell>
              <TableCell>{limit === null ? <Infinity /> : `${limit - uses}`}</TableCell>
              <TableCell>{formatNumber(_count.orders)}</TableCell>
              <TableCell>{allProducts ? <Globe /> : products.map(({ name }) => name).join(', ')}</TableCell>

              {/* Discount Code Actions */}
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVertical />
                    <span className='sr-only'>Actions</span>
                  </DropdownMenuTrigger>

                  {/* Dropdown menu inside */}
                  <DropdownMenuContent>
                    {canDeactivate && (
                      <>
                        <ActiveToggleDropdownItem id={id} isActive={isActive} />
                        <DropdownMenuSeparator />
                      </>
                    )}

                    <DeleteDropdownItem id={id} disabled={_count.orders > 0} />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          )
        )}
      </TableBody>
    </Table>
  );
}
