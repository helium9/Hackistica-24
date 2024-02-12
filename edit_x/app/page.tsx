"use client";
import Image from "next/image";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@nextui-org/react";
// import {Button, ButtonGroup} from "@nextui-org/react";
import DropdownLanguage from "./components/languageDropDown";
import { languageOptions } from "./Constants/languages";
import axios from "axios";
import { Source_Code_Pro } from "next/font/google";

export default function Home() {
  const [fontSize, setFontSize] = useState(30);
  return (
    <main>
      <nav className="flex flex-row gap-4 items-center h-10">
        <span>Editor v0.1</span>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered" className="w-20">
              Font Size: {fontSize}
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="20" onPress={() => setFontSize(20)}>
              20
            </DropdownItem>
            <DropdownItem key="30" onPress={() => setFontSize(30)}>
              30
            </DropdownItem>
            <DropdownItem key="40" onPress={() => setFontSize(40)}>
              40
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </nav>
      <div>
        <Editor
          options={{ fontSize: fontSize }}
          width="100%"
          theme="vs-dark"
          height="100vh"
          defaultLanguage="javascript"
          defaultValue="// some comment"
        />
      </div>
      <DropdownLanguage />
    </main>
  );
}
