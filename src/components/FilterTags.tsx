import React from "react";
import { Tag } from "antd";

interface FilterTagsProps {
  title: string;
  tags: Set<string>;
  selectedTags: string[];
  onChange: (tag: string, checked: boolean) => void;
}

const FilterTags: React.FC<FilterTagsProps> = ({
  title,
  tags,
  selectedTags,
  onChange,
}) => {
  return (
    <div className="mb-4">
      <div>{title}:</div>
      {Array.from(tags).map((tag) => (
        <Tag.CheckableTag
          key={tag}
          checked={selectedTags.includes(tag)}
          onChange={(checked) => onChange(tag, checked)}
        >
          {tag}
        </Tag.CheckableTag>
      ))}
    </div>
  );
};

export default FilterTags;
