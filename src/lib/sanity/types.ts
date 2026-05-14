export type Typology = "Architettura" | "Interior Design" | "Residenziale" | "Commerciale" | "Altro";
export type ProjectStatus = "In corso" | "In approvazione" | "Realizzato";
export type TeamMemberType = "Studio" | "Designer" | "Partner";

export interface SanityImage {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  alt?: string;
}

export interface Project {
  _id: string;
  title: string;
  slug: { current: string };
  location: string;
  year: number;
  area?: number;
  typology: Typology;
  status: ProjectStatus;
  description?: unknown; // PortableText
  heroImage?: SanityImage;
  gallery?: SanityImage[];
  coverImage?: SanityImage;
  teamMembers?: TeamMember[];
}

export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  photo?: SanityImage;
  bio?: unknown; // PortableText
  type: TeamMemberType;
}

export interface Partner {
  _id: string;
  name: string;
  address?: string;
  website?: string;
}

export interface Studio {
  description?: unknown; // PortableText
  images?: SanityImage[];
}
