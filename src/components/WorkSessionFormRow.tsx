'use client';
import { createWorkSession, updateWorkSession } from '@/app/actions';
import { ArrowDownToLine, Plus, X } from 'lucide-react';
import { Dispatch, SetStateAction, useRef } from 'react';
import { ISession } from './WorkSession';
import { Input } from './ui/input';
interface IWorkSessionForm {
  accountId: string;
  session?: ISession;
  onCancelClick?: Dispatch<SetStateAction<boolean>>;
}
const WorkSessionFormRow: React.FC<IWorkSessionForm> = ({ accountId, session, onCancelClick }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const handleAction = async (data: FormData) => {
    if (session) await updateWorkSession(data);
    else await createWorkSession(data);
    formRef.current?.reset();
  };
  return (
    <form ref={formRef} action={handleAction}>
      <div className='flex w-full border-b justify-between text-start items-center flex-1 hover:bg-slate-50 transition-all duration-200'>
        <div className='text-start p-4 w-[163px]'>
          <Input type='date' name='startsOn' defaultValue={session?.startsOn || undefined} />
          <Input type='hidden' name='id' value={session?.id} />
          <Input type='hidden' name='accountId' value={accountId} />
        </div>
        <div className='text-start p-4 flex-grow'>
          <Input name='description' defaultValue={session?.description || undefined} />
        </div>
        <div className='text-start p-4 flex-grow'>
          <Input type='number' step='0.25' name='hours' defaultValue={session?.hours || undefined} />
        </div>
        <div className='flex text-start w-[120px] justify-center items-center p-4 flex-none '>
          <button className='p-2 hover:bg-slate-300 transition-all duration-300'>
            {session ? <ArrowDownToLine /> : <Plus />}
          </button>
          {session ? (
            <button
              onClick={() => onCancelClick && onCancelClick(false)}
              type='button'
              className='p-2 hover:bg-slate-300 transition-all duration-300'
            >
              <X />
            </button>
          ) : null}
        </div>
      </div>
    </form>
  );
};

export default WorkSessionFormRow;
