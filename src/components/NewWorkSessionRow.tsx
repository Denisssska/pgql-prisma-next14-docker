'use client';
import { createWorkSession } from '@/app/actions';
import { Plus } from 'lucide-react';
import { useRef } from 'react';
import { Input } from './ui/input';

const NewWorkSessionRow = ({ accountId }: { accountId: string }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const handleAction = async (data: FormData) => {
    await createWorkSession(data);
    formRef.current?.reset();
  };
  return (
    <form ref={formRef} action={handleAction}>
      <div className='flex w-full border-b justify-between text-start items-center flex-1 hover:bg-slate-50 transition-all duration-200'>
        <div className='text-start p-4 w-[163px]'>
          <Input type='date' name='startsOn' />
          <Input type='hidden' name='accountId' value={accountId} />
        </div>
        <div className='text-start p-4 flex-grow'>
          <Input name='description' />
        </div>
        <div className='text-start p-4 flex-grow'>
          <Input type='number' step='0.25' name='hours' />
        </div>
        <div className='flex text-start w-[120px] justify-center items-center p-4 flex-none '>
          <button className='p-2 hover:bg-slate-300 transition-all duration-300'>
            <Plus />
          </button>
        </div>
      </div>
    </form>
  );
};

export default NewWorkSessionRow;
