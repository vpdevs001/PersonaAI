export interface Persona {
  id: string;
  name: string;
  tagline: string;
  avatar: string;
  accent: string;
}

export const PERSONAS: Persona[] = [
  {
    id: "hitesh",
    name: "Hitesh Choudhary",
    tagline: "Teaching with clarity and momentum",
    avatar: "HC",
    accent: "#ff7a1a",
  },
  {
    id: "piyush",
    name: "Piyush Garg",
    tagline: "Building practical product intuition",
    avatar: "PG",
    accent: "#ff9a3c",
  },
];
