import React from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";

export default function FontSizeSelect() {
  const [fontSize, setFontSize] = useState(20); // Initial font size

  const fontSizes = [
    { label: "20", value: 20 },
    { label: "30", value: 30 },
    { label: "40", value: 40 },
    { label: "Too large (80)", value: 80 },
  ];

  return (
    <Select
      label="Font Size"
      className="max-w-xs"
      onChange={(event) => setFontSize(Number(event.target.value))}
      value={fontSize}
    >
      {fontSizes.map((size) => (
        <SelectItem
          key={size.value}
          value={size.value}
          onPress={() => setFontSize(size.value)}
        >
          {size.label}
        </SelectItem>
      ))}
    </Select>
  );
}
