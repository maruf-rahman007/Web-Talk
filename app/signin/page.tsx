"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleEmailSignIn = async () => {
        const res = await signIn("credentials", {
            redirect: false,
            email: email, 
            password: password,
        });

        if (res?.error) {
            setError(res.error); 
            console.log("Email sign-in error:", res.error);
        } else {
            router.push("/user");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
                <h2 className="text-2xl font-bold text-center mb-6 text-black">Sign In</h2>
                <form className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="button"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md" // Adjusted color
                        onClick={handleEmailSignIn}
                    >
                        Login with Email
                    </button>
                </form>
                <div className="my-4 text-center text-black	">or</div>
                <div className="flex flex-col space-y-2">
                    <button
                        onClick={async () => {
                            const res = await signIn("google", {
                                redirect: true,
                                callbackUrl: "/user",
                            });
                        }}
                        className="w-full bg-white border border-gray-300 rounded-md flex items-center justify-center py-2 hover:bg-gray-100"
                    >
                        <svg
                            xmlns="https://icons8.com/icon/JvOSspDsPpwP/google"
                            viewBox="0 0 32 32"
                            width="20"
                            height="20"
                            className="mr-2"
                        >
                            <path d="M28.05 14.17c0-.89-.08-1.75-.23-2.58H16v5.25h6.88c-.3 1.57-1.67 4.26-5.1 4.26-3.06 0-5.57-2.55-5.57-5.7 0-3.16 2.5-5.7 5.57-5.7 1.68 0 3.21.56 4.44 1.49l3.54-3.54C24.87 5.44 20.59 3 16 3 8.65 3 3 8.65 3 16c0 7.36 5.65 13 12.94 13 7.56 0 12.56-5.62 12.56-13.83z" fill="black" /> {/* Changed fill color to black */}
                        </svg>
                        <span className="text-black">Login with Google</span>
                    </button>
                    <button
                        onClick={async () => {
                            const res = await signIn("github", {
                                redirect: false,
                                callbackUrl: "/user"
                            });
                            if (res?.error) {
                                console.log("GitHub sign-in error:", res.error);
                            } else {
                                router.push("/user");
                            }
                        }}
                        className="w-full bg-gray-800 text-white rounded-md flex items-center justify-center py-2 hover:bg-gray-700"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            width="20"
                            height="20"
                            className="mr-2"
                        >
                            <path d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.111.82-.261.82-.577 0-.285-.011-1.046-.017-2.051-3.338.724-4.043-1.6-4.043-1.6-.546-1.387-1.333-1.757-1.333-1.757-1.086-.743.083-.728.083-.728 1.202.084 1.832 1.237 1.832 1.237 1.067 1.826 2.8 1.297 3.48.991.107-.772.418-1.297.76-1.597-2.664-.303-5.467-1.33-5.467-5.922 0-1.311.469-2.383 1.239-3.22-.124-.303-.537-1.528.117-3.176 0 0 1.007-.322 3.303 1.23A11.473 11.473 0 0112 3.024c1.014.004 2.042.137 3.003.404 2.296-1.552 3.303-1.23 3.303-1.23.654 1.648.243 2.873.12 3.176.771.837 1.239 1.909 1.239 3.22 0 4.605-2.81 5.619-5.474 5.917.43.373.81 1.103.81 2.224 0 1.607-.014 2.906-.014 3.293 0 .316.22.694.825.577C20.563 21.799 24 17.304 24 12c0-6.627-5.373-12-12-12z" fill="#ffffff" />
                        </svg>
                        <span className="text-white">Login with GitHub</span> {/* Text color adjusted */}
                    </button>
                </div>
            </div>
        </div>
    );
}
