"use client"; // Make sure this is a client component
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export const Appbar = () => {
    const router = useRouter();
    const { data: session } = useSession();

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push('/');
    };

    return (
        <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
            <h1 className="text-xl font-bold">
                <Link href="/">Web Talk</Link>
            </h1>
            <div className="flex items-center space-x-4">
                {session?.user ? (
                    <div className="flex items-center">
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded hidden md:block mr-4"
                            onClick={handleSignOut}
                        >
                            Logout
                        </button>
                        <Image
                            src={session.user.image || 'https://ui-avatars.com/api/?name=User&size=40&background=007BFF&color=fff'}
                            alt="User Avatar"
                            width={40}
                            height={40}
                            className="rounded-full cursor-pointer ml-2"
                            onClick={handleSignOut}
                        />
                    </div>
                ) : (
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                        onClick={() => signIn()} // Sign in on button click
                    >
                        Get Started
                    </button>
                )}
            </div>

            {/* Responsive Logout Button */}
            {session?.user && (
                <button
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded md:hidden"
                    onClick={handleSignOut}
                >
                    Logout
                </button>
            )}
        </nav>
    );
};
