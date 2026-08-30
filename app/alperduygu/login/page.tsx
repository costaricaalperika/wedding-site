import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import {
  ADMIN_SESSION_COOKIE,
  verifySessionToken,
} from "@/lib/admin-session";
import LoginForm from "./LoginForm";

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (await verifySessionToken(token)) {
    redirect("/alperduygu");
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-paper-cream flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-rose border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
