import { PERSONAS } from "@/constants";
import { ChatWindow } from "@/features/chat/components/ChatWindow";

export default function Home() {
  return <ChatWindow initialPersona={PERSONAS[0]} />;
}
