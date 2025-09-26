'use server';
import { redirect } from 'next/navigation';
import { auth, signOut } from '@/auth';
import { revalidatePath } from 'next/cache';

// Simulación de base de datos
const usersDatabase: Record<string, any> = {};

export async function saveProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) return;

  const username = formData.get('username') as string;
  
  // Guardamos el username en nuestra "base de datos"
  usersDatabase[session.user.email] = { 
    ...usersDatabase[session.user.email], 
    username 
  };
  
  revalidatePath('/');
  redirect('/');
}

export async function logOut() {
  await signOut();
}