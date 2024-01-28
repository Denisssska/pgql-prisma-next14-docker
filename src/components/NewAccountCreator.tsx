'use client';
import { createAccount } from '@/app/actions';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const NewAccountCreator = () => {
  const [editMode, setEditMode] = useState(false);
  if (!editMode) return <Button onClick={() => setEditMode(true)}>+ New Account</Button>;
  return (
    <form action={createAccount} onSubmit={() => setEditMode(false)} className='flex flex-wrap gap-2 '>
      <Input className='text-slate-900' name='name' type='text' id='accountName' placeholder='Account Name' />
      <label className='hidden' htmlFor='accountName'></label>
      <Button className='flex-1'>Create</Button>
      <Button type='button' className='flex-1' onClick={() => setEditMode(false)}>
        Cancel
      </Button>
    </form>
  );
};

export default NewAccountCreator;
