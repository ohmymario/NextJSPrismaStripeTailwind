import PageHeader from '../../_components/PageHeader';
import DiscountCodeForm from '../_components/DiscountCodeForm';

interface NewDiscountCodePageProps {}

export default function NewDiscountCodePage(props: NewDiscountCodePageProps) {
  return (
    <>
      <PageHeader>Add DiscountCode</PageHeader>
      <DiscountCodeForm />
    </>
  );
}
