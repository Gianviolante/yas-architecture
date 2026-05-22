export type Typology = "Architettura" | "Interior Design" | "Residenziale" | "Commerciale" | "Altro";
export type ProjectStatus = "In corso" | "In approvazione" | "Realizzato";
export type TeamMemberType = "Studio" | "Designer" | "Partner";

export interface SanityImage {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  alt?: string;
  caption?: string;
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
  featured?: boolean;
  coverImage?: SanityImage;
  coverImageUrl?: string;
  hoverImage?: SanityImage;
  hoverImageUrl?: string;
  teamMembers?: TeamMember[];
  subtitle?: string;
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

export type EventType = "News" | "Evento";

export interface Event {
  _id: string;
  title: string;
  slug: { current: string };
  type?: EventType;
  date?: string;
  coverImage?: SanityImage;
  coverImageUrl?: string;
  location?: string;
  area?: string;
  timeline?: string;
  typology?: string;
  description?: unknown; // PortableText (intro)
  body?: unknown;        // PortableText (body)
  gallery?: (SanityImage & { url?: string })[];
}

export interface Home {
  introDescription?: unknown; // PortableText
  bodyLeft?:         unknown; // PortableText
  bodyRight?:        unknown; // PortableText
  studioDescription?:unknown; // PortableText
}

export interface Studio {
  description?:         unknown; // PortableText
  spaziDescription?:    unknown;
  crescitaDescription?: unknown;
  teamDescription?:     unknown;
  progettiDescription?: unknown;
  heroImage?:           SanityImage;
  teamPortrait?:        SanityImage;
  mainImage?:           SanityImage;
  spaziImages?:         SanityImage[];
  crescitaImages?:      SanityImage[];
}
