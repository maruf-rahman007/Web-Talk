import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { signIn } from 'next-auth/react';
import prisma from './prisma';
import bcrypt from "bcryptjs"
import { error } from 'console';
import { checkExistingUser, isEmailMethod } from '@/hooks/helper/authHelper';

export const NEXT_AUTH = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'text', placeholder: 'Email' },
                password: { label: 'Password', type: 'password', placeholder: 'Password' },
                name: { label: 'name', type: 'text', placeholder: 'Name' },
            },
            async authorize(credentials: any) {
                console.log("Received credentials:", credentials);

                if (credentials.isLogin === 'true') {

                    const user = await checkExistingUser(credentials.email)

                    if (user && isEmailMethod(user)) {
                        const isPasswordValid = await bcrypt.compare(credentials.password, user.password || "");
                        if (isPasswordValid) {
                            return {
                                id: user.id,
                                name: user.name,
                                email: user.email,
                            };
                        } else {
                            throw new Error("Password does not match, please try again.");
                        }
                    } else {
                        throw new Error("No user found with this email address.");
                    }
                } else {
                    const existingUser = await checkExistingUser(credentials.email)
                    if (existingUser) {
                        throw new Error("User with the same email address already exists.");
                    }
                    const hashedPassword = await bcrypt.hash(credentials.password, 10);
                    try {
                        const newUser = await prisma.user.create({
                            data: {
                                email: credentials.email,
                                name: credentials.name,
                                password: hashedPassword,
                                method: "email-cred",
                            }
                        });

                        return {
                            id: newUser.id,
                            name: newUser.name,
                            email: newUser.email,
                        };

                    } catch (error) {
                        throw new Error("Failed to create user");
                    }
                }

            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID || "",
            clientSecret: process.env.GITHUB_SECRET || "",
        })        
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        jwt: async ({ user, token }: any) => {
            if (user) {
                token.uid = user.id;
            }
            return token;
        },
        session: ({ session, token, user }: any) => {
            if (session.user) {
                session.user.id = token.uid
            }
            return session
        },
        signIn: async ({ user, account, profile }: any) => {
            if (account.provider === 'google') {
                try {
                    const { email, id, name, image } = user;
                    const existingUser = await checkExistingUser(email);
                    if (!existingUser) {
                        const newUser = await prisma.user.create({
                            data: {
                                email: email,
                                name: name,
                                googleId: id,
                                image: image,
                                method: 'google'
                            }
                        })
                    } else {
                        if (existingUser.method != 'google') {
                            throw new Error("User with same email address alredy exist in different signin method");
                        } else {
                            return true;
                        }
                    }
                } catch (error) {
                    throw new Error("Failed to create user");
                }
            }
            
            if (account.provider === 'credentials') {
                return true;
            } else {
                return false;
            }
        }
    },
    pages: {
        signIn: "/signin",
        error: '/signin'
    },
    debug: true,
}