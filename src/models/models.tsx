export type CharacterProperties = {
  key: string;
  name: string;
  height: string;
  weight: string;
  homePlanet: string;
  species: string;
  gender: string;
  eyeColor: string;
};

export interface FilterCategory {
  id: string;
  gender: string | null;
  eyeColor: string | null;
  species: { name: string } | null;
  filmConnection: { films: { title: string }[] } | null;
}
