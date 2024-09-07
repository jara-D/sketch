import { fail } from '@sveltejs/kit';
import prisma from '$lib/db/prisma';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const validateEmail = (email: string) => {
	return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const name = data.get('name');
		const userEmail = data.get('email');
		const password = data.get('password');

		if (!name || !userEmail || !password) {
			return fail(400, { name, userEmail, missing: true });
		}
		if (typeof name != 'string' || typeof userEmail != 'string' || typeof password != 'string') {
			return fail(400, { incorrect: true });
		}
		if (!validateEmail(userEmail)) {
			return fail(400, { name, incorrect: true });
		}

		const userPassord = await prisma.users.findUnique({
			where: {
				email: userEmail
			},
			select: {
				password: true
			}
		});

		if (!userPassord) {
			return fail(400, { email: userEmail, exists: true });
		}
		// compare pass to hash
		if (!(await bcrypt.compare(password, userPassord.password))) {
			console.log('password fail');
			return fail(400, { password: true });
		}
		// create 256 bit token
		const token = crypto.randomBytes(256);
		// create a entry in the db
		await prisma.sessions.create({
			data: {
				token: token.toString('hex'),
				user: {
					connect: {
						email: userEmail
					}
				},
				// cookie expires in 7 days
				expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
			}
		});
		// set the cookie
		cookies.delete('session', { path: '/' });
		cookies.set('session', token.toString('hex'), {
			path: '/',
			maxAge: 60 * 60 * 24 * 7,
			secure: true,
			sameSite: 'strict',
			httpOnly: true
		});

		return redirect(303, `/sketch`);
	}
} satisfies Actions;
