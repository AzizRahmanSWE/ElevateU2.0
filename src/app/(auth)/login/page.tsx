"use client"; // Add this directive at the top

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { login } from "./actions";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Show error/success messages from URL params (if any)
  useEffect(() => {
    const error = searchParams.get("error");
    const message = searchParams.get("message");
    if (error) toast.error(error);
    if (message) toast.success(message);
  }, [searchParams]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await login(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Logged in successfully");
        router.push("/dashboard");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-black/50 p-8 rounded-2xl backdrop-blur-lg border border-gray-800">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Sign in to your account
        </h2>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-t-md relative block w-full px-3 py-4 border border-gray-700 bg-gray-900/50 placeholder-gray-500 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-b-md relative block w-full px-3 py-4 border border-gray-700 bg-gray-900/50 placeholder-gray-500 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isPending}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Signing in..." : "Sign in"}
            </button>
          </div>
          <div className="text-center">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-purple-500 hover:text-purple-400"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
