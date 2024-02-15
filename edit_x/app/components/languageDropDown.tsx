import React from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { languageOptions } from "../constants/languages";
import { useState } from "react";

export default function LanguageSelect() {
  const [selectedLanguage, setSelectedLanguage] = useState(
    languageOptions[0].value
  );

  const handleLanguageChange = (value: string) => {
    const selectedOption = languageOptions.find(
      (option) => option.value === value
    );
    setSelectedLanguage(selectedOption!.value);
  };

  return (
    <Select
      label="Select Language"
      className="max-w-xs"
      onChange={(event) => handleLanguageChange(event.target.value)}
      value={selectedLanguage}
    >
      {languageOptions.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          {option.name}
        </SelectItem>
      ))}
    </Select>
  );
}
