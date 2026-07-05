import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { PERSONAS } from "@/constants";
import { ChatWindow } from "@/features/chat/components/ChatWindow";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  return <ChatWindow initialPersona={PERSONAS[0]} />;
}
