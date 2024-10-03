import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { signIn } from 'next-auth/react';
import prisma from './prisma';
import bcrypt from "bcryptjs"
import { error } from 'console';

export const NEXT_AUTH = {
    providers: [
        CredentialsProvider({
            name: 'Email',
            credentials: {
                email: { label: 'Email', type: 'text', placeholder: 'Email' },
                password: { label: 'Password', type: 'password', placeholder: 'Password' },
                name: { label: 'name', type: 'text', placeholder: 'Name' },
            },
            async authorize(credentials: any) {
                console.log(credentials)

                let user = await prisma.user.findUnique({
                    where:{
                        email:  credentials.email
                    }
                })

                if(user) {
                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password || "");
                    if(isPasswordValid) {
                        return {
                            id: user.id,
                            name: credentials.name,
                            email: credentials.email
                        };
                    }
                    else {
                        throw new Error("Password does not match, please try again");
                    }
                }

                else {
                    const hashedpassword = await bcrypt.hash(credentials.password,10)
                    try {
                        user = await prisma.user.create({
                            data: {
                                email:credentials.email,
                                name: credentials.name,
                                password: hashedpassword
                            }
                        })

                        return {
                            id: user.id,
                            name: credentials.name,
                            email: credentials.email
                        };

                    } catch (error) {
                        throw new Error("Failed to create user");
                    }
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID || "",
            clientSecret: process.env.GITHUB_SECRET || ""
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
        }
    },
    pages: {
        signIn:"/signin"
    },
    debug: true,
}