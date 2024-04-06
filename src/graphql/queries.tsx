import { gql } from "@apollo/client";

export const GET_ALL_PEOPLE = gql`
  query GetAllPeople($first: Int, $after: String) {
    allPeople(first: $first, after: $after) {
      edges {
        node {
          id
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
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_FILTER_DATA = gql`
  query Query {
    allPeople {
      people {
        id
        eyeColor
        gender
        species {
          name
        }
        filmConnection {
          films {
            title
          }
        }
      }
    }
  }
`;
