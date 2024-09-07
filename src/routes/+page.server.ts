import prisma from '$lib/db/prisma';

export async function load({cookies}) {
  const Cookietoken = cookies.get('token');
  if (!Cookietoken) 
    return;

  await prisma.sessions.findUnique({
    where: {
      token: Cookietoken
    }
  });

}
