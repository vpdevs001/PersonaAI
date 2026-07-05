export interface Persona {
  id: string;
  name: string;
  tagline: string;
  avatar: string;
  accent: string;
  gradient: [string, string];
  /**
   * Optional path under /public to a real photo, e.g. "/personas/hitesh.jpg".
   * Drop a licensed image at that path and the UI will use it automatically —
   * until then, PersonaAvatar falls back to the gradient + initials below.
   */
  photo?: string;
  suggestedPrompts: string[];
}

export const PERSONAS: Persona[] = [
  {
    id: "hitesh",
    name: "Hitesh Choudhary",
    tagline: "Teaching with clarity and momentum",
    avatar: "HC",
    accent: "#ff7a1a",
    photo:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNDI76H57cfbjnBoEh1CNSjqmp-e9-CSRL7ig_8qir1w&s",
    gradient: ["#ff7a1a", "#7a2e00"],
    suggestedPrompts: [
      "Explain closures like I'm just starting out",
      "What should I learn after JavaScript basics?",
      "How do I stay consistent while learning to code?",
    ],
  },
  {
    id: "piyush",
    name: "Piyush Garg",
    tagline: "Building practical product intuition",
    avatar: "PG",
    accent: "#ff9a3c",
    photo:
      "https://yt3.googleusercontent.com/3acddexuFlA5yKRS2--11NeqhCiik-0cntUPjk_QjlsA4ScmQUPWNmeBLweVUQjWXTCLT26lsw=s900-c-k-c0x00ffffff-no-rj",
    gradient: ["#ff9a3c", "#8a3d00"],
    suggestedPrompts: [
      "How do I validate a SaaS idea quickly?",
      "What should my MVP actually include?",
      "How do I pick a tech stack for a side project?",
    ],
  },
];

export function getPersonaById(id: string): Persona | undefined {
  return PERSONAS.find((persona) => persona.id === id);
}
