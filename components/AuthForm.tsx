"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface AuthFormProps {
    isSignUp: boolean; // true for signup, false for signin
}


const AuthForm: React.FC<AuthFormProps> = ({ isSignUp }) => {
    const router = useRouter();
    const { toast } = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState(isSignUp ? "" : undefined);
    const session = useSession()

    if (session.data?.user) {
        router.push('/user')
    }
    const handleEmailSignIn = async () => {
        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
            name: isSignUp ? name : undefined,
            isLogin: !isSignUp,
        });

        if (res?.error) {
            toast({ title: "Error", description: res.error, variant: "destructive" }); 
            console.log("Email sign-in error:", res.error);
        } else {
            router.push("/user");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
                <h2 className="text-2xl font-bold text-center mb-6 text-black">
                    {isSignUp ? "Sign Up" : "Sign In"}
                </h2>
                <form className="space-y-4">
                    {isSignUp && (
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                id="name"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    )}
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
                    <button
                        type="button"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
                        onClick={handleEmailSignIn}
                    >
                        {isSignUp ? "Signup with Email" : "Login with Email"}
                    </button>
                </form>
                <div className="my-4 text-center text-black">or</div>
                <div className="flex flex-col space-y-2">
                    {/* Google Button */}
                    <button
                        onClick={async () => {
                            const res = await signIn("google", {
                                redirect: false,
                                callbackUrl: "/user",
                            });
                            if (res?.error) {
                                toast({ title: "Error", description: res.error, variant: "destructive" });
                                console.log("Google sign-in error:", res.error);
                            } else {
                                router.push("/user");
                            }
                        }}
                        className="w-full bg-white border border-gray-300 rounded-md flex items-center justify-center py-2 hover:bg-gray-100"
                    >
                        <svg className="mr-1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
                            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                        </svg>
                        <span className="text-black">Login with Google</span>
                    </button>
                    {/* GitHub Button */}
                    <button
                        onClick={async () => {
                            const res = await signIn("github", {
                                redirect: false,
                                callbackUrl: "/user",
                            });
                            if (res?.error) {
                                toast({ title: "Error", description: res.error, variant: "destructive" });
                                console.log("GitHub sign-in error:", res.error);
                            } else {
                                router.push("/user");
                            }
                        }}
                        className="w-full bg-gray-800 text-white rounded-md flex items-center justify-center py-2 hover:bg-gray-700"
                    >
                        <svg
                            xmlns="http://github.com/favicon.ico"
                            viewBox="0 0 24 24"
                            fill="none"
                            width="20"
                            height="20"
                            className="mr-2"
                        >
                            <path d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.111.82-.261.82-.577 0-.285-.011-1.046-.017-2.051-3.338.724-4.043-1.6-4.043-1.6-.546-1.387-1.333-1.757-1.333-1.757-1.086-.743.083-.728.083-.728 1.202.084 1.832 1.237 1.832 1.237 1.067 1.826 2.8 1.297 3.48.991.107-.772.418-1.297.76-1.597-2.664-.303-5.467-1.33-5.467-5.922 0-1.311.469-2.383 1.239-3.22-.124-.303-.537-1.528.117-3.176 0 0 1.007-.322 3.303 1.23A11.473 11.473 0 0112 3.024c1.014.004 2.042.137 3.003.404 2.296-1.552 3.303-1.23 3.303-1.23.654 1.648.243 2.873.12 3.176.771.837 1.239 1.909 1.239 3.22 0 4.605-2.81 5.619-5.474 5.917.43.373.81 1.103.81 2.224 0 1.607-.014 2.906-.014 3.293 0 .316.22.694.825.577C20.563 21.799 24 17.304 24 12c0-6.627-5.373-12-12-12z" fill="#ffffff" />
                        </svg>
                        <span className="text-white">Login with GitHub</span>
                    </button>
                    <div className="text-black flex items-center pt-1 ml-12">
                        {isSignUp ? (
                            <>Already have an account? <a className="underline font-bold pl-1" href="/signin">Signin</a></>
                        ) : (
                            <>Don't have an account? <a className="underline font-bold pl-1" href="/signup">Signup</a></>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
