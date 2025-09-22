import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

// Función asíncrona para verificar la sesión del usuario en el servidor
async function checkUserSession() {
  // Usamos 'await' para esperar a que las cookies estén disponibles
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token')?.value; // O el nombre de tu cookie

  if (!sessionToken) {
    return null; // No hay sesión
  }

  // Aquí puedes añadir lógica para validar el token si es necesario
  // Si es válido, devolvemos un objeto que representa al usuario
  return { isLoggedIn: true };
}

// El componente Layout ahora es 'async'
export default async function EquipoLayout({ children }: { children: ReactNode }) {
  const user = await checkUserSession();

  // Si la comprobación falla, redirigimos a la página de login
  if (!user) {
    redirect('/signin');
  }

  // Si todo es correcto, simplemente renderizamos el contenido de la página
  return (
    <>
      {children}
    </>
  );
}