'use server';

import { revalidatePath } from 'next/cache';
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
  redirect(`/accounts/${account.id}`);
};
const createWorkSessionSchema = z.object({
  accountId: z.string(),
  startsOn: z.coerce.date().optional(),
  description: z.string().min(1).max(120).optional(),
  hours: z.coerce.number().min(0).max(24).optional(),
});
export const createWorkSession = async (rawData: FormData) => {
  const data = createWorkSessionSchema.parse({
    accountId: rawData.get('accountId'),
    startsOn: rawData.get('startsOn'),
    description: rawData.get('description'),
    hours: rawData.get('hours'),
  });
  const workSession = await db.workSession.create({ data });
  revalidatePath(`/accounts/${workSession.accountId}`);
};
