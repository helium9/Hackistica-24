"use client";
import Editor from "@monaco-editor/react";
import { useState, useRef } from "react";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@nextui-org/react";

const lang = {
  Python: {
    language: "python",
    value: `print("Hello there!")`,
  },
  HTML: {
    language: "html",
    value: "<div> </div>",
  },
  Javascript: {
    language: "javascript",
    value: `console.log("Hi")`,
  },
};

export default function Home() {
  const [fontSize, setFontSize] = useState(30);
  const editorRef = useRef(null);
  const [currLanguage, setCurrLanguage] = useState("HTML");
  // console.log(editorRef.current.getValue());
  return (
    <main>
      <div className="flex flex-row gap-4 items-center p-2">
        <span>Editor v0.1</span>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered" className="w-fit">
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
            <DropdownItem key="80" onPress={() => setFontSize(80)}>
              It's fucking big
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered" className="w-fit">
              Lang: {currLanguage}
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            {Object.keys(lang).map((Lang) => {
              return (
                <DropdownItem key={Lang} onPress={() => setCurrLanguage(Lang)}>
                  {Lang}
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        </Dropdown>
      </div>

      <div>
        <Editor
          options={{ fontSize: fontSize }}
          width="100%"
          theme="vs-dark"
          height="100vh"
          path={lang[currLanguage].language}
          defaultLanguage={lang[currLanguage].language}
          defaultValue={lang[currLanguage].value}
          onMount={(editor, monaco) => (editorRef.current = editor)}
        />
      </div>
    </main>
  );
}
