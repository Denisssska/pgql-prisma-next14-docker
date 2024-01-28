import NewWorkSessionRow from '@/components/NewWorkSessionRow';
import { db } from '@/modules/db';
import { RefreshCcw, X } from 'lucide-react';

interface IAccount {
  params: { id: string };
}

export default async function AccountDetailPage({ params }: IAccount) {
  const account = await db.account.findUniqueOrThrow({
    select: {
      id: true,
      name: true,
      workSessions: {
        select: { id: true, description: true, startsOn: true, hours: true },
        orderBy: { startsOn: 'desc' },
      },
    },
    where: { id: params.id },
  });

  // console.log(account);

  return (
    <div>
      <h1 className='p-2 text-3xl font-bold uppercase'>{account.name}</h1>

      <div className='flex w-full border-b justify-between text-start items-center flex-1 hover:bg-slate-50 transition-all duration-200'>
        <div className='text-start p-4 w-[163px]'>Date</div>
        <div className='text-start p-4 flex-grow max-w-[460px]'>Description</div>
        <div className='text-start p-4 flex-grow'>Hours</div>
        <div className=' flex-none text-start w-[150px] flex justify-between items-center   p-4'></div>
      </div>
      <NewWorkSessionRow accountId={account.id} />
      {account.workSessions.map(session => (
        <div
          key={session.id}
          className='flex w-full border-b justify-between text-start items-center flex-1 hover:bg-slate-50 transition-all duration-200'
        >
          <div className='text-start p-4 w-[163px]'>{session.startsOn?.toLocaleDateString()}</div>
          <div className='text-start p-4 flex-grow max-w-[460px]'>{session.description}</div>
          <div className='text-start p-4 flex-grow'>{session.hours}</div>
          <div className='text-start w-[120px] flex justify-between items-center flex-none  p-4'>
            <button className='block p-2 hover:bg-slate-300 transition-all duration-300'>
              <RefreshCcw />
            </button>
            <button className='block p-2 hover:bg-slate-300 transition-all duration-300'>
              <X />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
