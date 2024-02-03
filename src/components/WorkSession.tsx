'use client';
import { deleteWorkSession } from '@/app/actions';
import { PencilIcon, X } from 'lucide-react';
import { useState } from 'react';
import WorkSessionFormRow from './WorkSessionFormRow';
export interface ISession {
  id: string;
  accountId: string;
  startsOn: Date | null;
  description: string | null;
  hours: number | null;
}
interface IWorkSession {
  session: ISession;
}
const WorkSession = ({ session }: IWorkSession) => {
  const [editMode, setEditMode] = useState(false);
  if (editMode)
    return <WorkSessionFormRow accountId={session.accountId} session={session} onCancelClick={setEditMode} />;
  return (
    <div className='flex w-full border-b justify-between text-start items-center flex-1 hover:bg-slate-50 transition-all duration-200'>
      <div className='text-start p-4 w-[163px]'>{session.startsOn?.toDateString()}</div>
      <div className='text-start p-4 flex-grow max-w-[460px]'>{session.description}</div>
      <div className='text-start p-4 flex-grow'>{session.hours}</div>
      <div className='text-start w-[120px] flex justify-between items-center flex-none  p-4'>
        <button
          className='block p-2 hover:bg-slate-300 transition-all duration-300'
          onClick={() => setEditMode(true)}
        >
          <PencilIcon />
        </button>
        <form action={deleteWorkSession}>
          <input type='hidden' name='id' value={session.id} />
          <button className='block p-2 hover:bg-slate-300 transition-all duration-300'>
            <X />
          </button>
        </form>
      </div>
    </div>
  );
};

export default WorkSession;
