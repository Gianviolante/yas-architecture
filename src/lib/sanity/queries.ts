// GROQ queries per Sanity

export const allProjectsQuery = `
  *[_type == "project"] | order(featured desc, year desc) {
    _id, title, slug, location, year, area, typology, status, featured,
    coverImage, "coverImageUrl": coverImage.asset->url,
    hoverImage, "hoverImageUrl": hoverImage.asset->url
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

export const allPartnersQuery = `
  *[_type == "partner"] { _id, name, address, website }
`;

export const allEventsQuery = `
  *[_type == "event"] | order(date desc) {
    _id, title, slug, type, date,
    coverImage, "coverImageUrl": coverImage.asset->url
  }
`;

export const eventBySlugQuery = `
  *[_type == "event" && slug.current == $slug][0] {
    _id, title, slug, type, date,
    location, area, timeline, typology,
    coverImage, "coverImageUrl": coverImage.asset->url,
    description, body,
    gallery[]{ ..., "url": asset->url }
  }
`;

export const homeQuery = `
  *[_type == "home"][0] {
    introDescription, bodyLeft, bodyRight, studioDescription
  }
`;

export const studioQuery = `
  *[_type == "studio"][0] {
    description, spaziDescription, crescitaDescription, teamDescription, progettiDescription,
    heroImage, teamPortrait, mainImage,
    spaziImages[]{ ..., caption },
    crescitaImages[]{ ... }
  }
`;
