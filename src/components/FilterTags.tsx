import React from "react";
import { Tag } from "antd";

interface FilterTagsProps {
  title: string;
  tags: Set<string>;
  selectedTags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  onChange: (
    tag: string,
    checked: boolean,
    tagsSet: string[],
    setTagsSet: React.Dispatch<React.SetStateAction<string[]>>
  ) => void;
}

const FilterTags: React.FC<FilterTagsProps> = ({
  title,
  tags,
  selectedTags,
  setTags,
  onChange,
}) => {
  return (
    <div className="mb-4 flex flex-row">
      <div className="w-28">{title}: </div>
      <div className="flex-grow-0">
        {Array.from(tags).map((tag) => (
          <Tag.CheckableTag
            className="border-1 border-gray-300"
            key={tag}
            checked={selectedTags.includes(tag)}
            onChange={(checked) =>
              onChange(tag, checked, selectedTags, setTags)
            }
          >
            {tag}
          </Tag.CheckableTag>
        ))}
      </div>
    </div>
  );
};

export default FilterTags;
