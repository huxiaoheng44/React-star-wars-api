import React from "react";

interface CharacterDetailProps {
  label: string;
  value?: string | number;
}

const CharacterDetail: React.FC<CharacterDetailProps> = ({ label, value }) => (
  <span className=" my-1">
    <p className="font-bold text-lg">{label}:</p> <p>{value}</p>
  </span>
);

export default CharacterDetail;
