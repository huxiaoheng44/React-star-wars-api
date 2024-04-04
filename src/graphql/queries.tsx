import { gql } from "@apollo/client";

export const GET_ALL_PEOPLE = gql`
  query GetAllPeople {
    allPeople {
      people {
        height
        eyeColor
        gender
        species {
          name
        }
        name
        homeworld {
          name
        }
        mass
      }
    }
  }
`;
