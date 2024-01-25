'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '../modules/db';

const CreateAccountSchema = z.object({
  name: z.string().min(3).max(40),
});

export const createAccount = async (rawData: FormData) => {
  const data = CreateAccountSchema.parse({
    name: rawData.get('name'),
  });
  const account = await db.account.create({ data: data });
  redirect(`accounts/${account.id}`);
};
