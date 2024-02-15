import React from "react";
import { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { languageOptions } from "../constants/languages";

export default function DropdownLanguage() {
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
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered">Select Language</Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        {languageOptions.map((option) => (
          <DropdownItem
            key={option.value}
            onClick={() => handleLanguageChange(option.value)}
          >
            {option.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
