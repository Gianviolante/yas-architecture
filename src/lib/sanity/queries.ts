// GROQ queries per Sanity

export const allProjectsQuery = `
  *[_type == "project"] | order(featured desc, year desc) {
    _id, title, slug, location, year, area, typology, status, featured,
    coverImage, "coverImageUrl": coverImage.asset->url + "?w=1200&q=80&auto=format&dpr=2",
    hoverImage, "hoverImageUrl": hoverImage.asset->url + "?w=600&q=80&auto=format&dpr=2"
  }
`;

export const projectBySlugQuery = `
  *[_type == "project" && slug.current == $slug][0] {
    _id, title, slug, location, year, area, typology, status,
    concept, projectTeam, photographer, rendering,
    description, heroImage,
    gallery[]{ ..., caption },
    teamMembers[]->{ name, role }
  }
`;

export const allTeamMembersQuery = `
  *[_type == "teamMember"] | order(name asc) {
    _id, name, role, photo, bio, type
  }
`;

export const allEventsQuery = `
  *[_type == "event"] | order(date desc) {
    _id, title, slug, type, date,
    coverImage, "coverImageUrl": coverImage.asset->url + "?w=1200&q=80&auto=format&dpr=2"
  }
`;

export const eventBySlugQuery = `
  *[_type == "event" && slug.current == $slug][0] {
    _id, title, slug, type, date,
    location, area, timeline, typology,
    coverImage, "coverImageUrl": coverImage.asset->url + "?w=1200&q=80&auto=format&dpr=2",
    description, body,
    gallery[]{ ..., "url": asset->url + "?w=1440&q=80&auto=format&dpr=2" }
  }
`;

export const homeQuery = `
  *[_type == "home"][0] {
    introDescription, bodyLeft, bodyRight, studioDescription,
    heroSubtitleLeft, heroTitleMain, heroSubtitleRight, heroAddress,
    studioImage{ ..., "url": asset->url + "?w=1200&q=80&auto=format&dpr=2" }
  }
`;

// crescitaDescription/crescitaImages non fetchati: la sezione "Crescita e
// innovazione" è nascosta dal frontend (richiesta cliente), ma il campo
// resta nello schema Sanity — il cliente ha già caricato foto lì, recuperabile
// in 2 minuti se la sezione torna visibile.
export const studioQuery = `
  *[_type == "studio"][0] {
    description, spaziDescription, teamDescription, progettiDescription,
    heroImage, teamPortrait, mainImage,
    spaziImages[]{ ..., caption }
  }
`;

export const progettiIntroQuery = `
  *[_type == "progettiIntro"][0] {
    _id, text
  }
`;
