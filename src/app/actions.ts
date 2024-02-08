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
const CreateWorkSessionSchema = z.object({
  accountId: z.string(),
  startsOn: z.coerce.date().optional(),
  description: z.string().min(1).max(120).optional(),
  hours: z.coerce.number().min(0).max(24).optional(),
});
export const createWorkSession = async (rawData: FormData) => {
  const data = CreateWorkSessionSchema.parse({
    accountId: rawData.get('accountId'),
    startsOn: rawData.get('startsOn'),
    description: rawData.get('description'),
    hours: rawData.get('hours'),
  });
  const workSession = await db.workSession.create({ data });
  revalidatePath(`/accounts/${workSession.accountId}`);
};
const DeleteWorkSessionSchema = z.object({
  id: z.string(),
});
export const deleteWorkSession = async (rawData: FormData) => {
  const { id } = DeleteWorkSessionSchema.parse({
    id: rawData.get('id'),
  });
  const session = await db.workSession.delete({ where: { id: id } });
  revalidatePath(`/accounts/${session.accountId}`);
};
const UpdateWorkSessionSchema = CreateWorkSessionSchema.extend({
  id: z.string(),
}).omit({ accountId: true });

export const updateWorkSession = async (rawData: FormData) => {
  const data = UpdateWorkSessionSchema.parse({
    id: rawData.get('id'),
    startsOn: rawData.get('startsOn'),
    description: rawData.get('description'),
    hours: rawData.get('hours'),
  });
  const workSession = await db.workSession.update({
    data: {
      startsOn: data.startsOn,
      description: data.description,
      hours: data.hours,
    },
    where: { id: data.id },
  });
  revalidatePath(`/accounts/${workSession.accountId}`);
};

/////////////////////////////////
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const secretKey = 'secret';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('10 sec from now')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload;
}

export async function login(formData: FormData) {
  // Verify credentials && get the user

  const user = { email: formData.get('email'), password: formData.get('password'), name: 'John' };

  // Create the session
  const expires = new Date(Date.now() + 10 * 1000);
  const session = await encrypt({ user, expires });

  // Save the session in a cookie
  cookies().set('session', session, { expires, httpOnly: true });
}

export async function logout() {
  // Destroy the session
  cookies().set('session', '', { expires: new Date(0) });
}

export async function getSession() {
  const session = cookies().get('session')?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 10 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: 'session',
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}
