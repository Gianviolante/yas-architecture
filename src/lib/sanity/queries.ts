// GROQ queries per Sanity

export const allProjectsQuery = `
  *[_type == "project"] | order(year desc) {
    _id, title, slug, location, year, area, typology, status,
    coverImage, "coverImageUrl": coverImage.asset->url
  }
`;

export const projectBySlugQuery = `
  *[_type == "project" && slug.current == $slug][0] {
    _id, title, slug, location, year, area, typology, status,
    description, heroImage, gallery, teamMembers[]->{ name, role }
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

export const studioQuery = `
  *[_type == "studio"][0] { description, images }
`;
