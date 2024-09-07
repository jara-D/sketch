import prisma from '$lib/db/prisma';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
  const CookieSession = cookies.get('session');
  if (!CookieSession) {
    console.log('no cookie');
    return redirect(301, '/login');
  }

  console.log('Executing query with token:', CookieSession);
  console.log('CookieSession length:', CookieSession.length);

  const session = await prisma.sessions.findUnique({
    where: {
      token: CookieSession
    }
  });

  if (!session) {
    console.log('no session found for token:', CookieSession);
    return redirect(301, '/login');
  }

  console.log('CookieSession:', CookieSession);
  console.log('Database Session:', session);

  if (!session.token || new Date(session.expires) < new Date()) {
    console.log('session expired or invalid token');
    return redirect(301, '/login');
  }

  // Add your code here to check if the user is logged in
}
