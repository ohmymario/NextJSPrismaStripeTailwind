import { Loader2Icon } from 'lucide-react';

interface AdminLoadingProps {}

const AdminLoading = (props: AdminLoadingProps) => {
  return (
    <div className='flex justify-center'>
      <Loader2Icon className='size-24 animate-spin' />
    </div>
  );
};

export default AdminLoading;
