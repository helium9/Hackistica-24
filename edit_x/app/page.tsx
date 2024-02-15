"use client";
import Editor from "@monaco-editor/react";
import { useState, useRef, useEffect } from "react";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@nextui-org/react";
import SplitPane, { Pane } from "split-pane-react";
import "split-pane-react/esm/themes/default.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

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
  const [sizes, setsizes] = useState([100, "30%", "auto"]);
  const [nestedSizes, setNestedSizes] = useState([50, 50]);

  const layoutCSS = {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

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

      <div style={{ height: "100vh" }}>
        <SplitPane
          split="horizontal"
          sizes={sizes}
          onChange={setsizes}
          sashRender={() => <div className="sash" />}
        >
          <SplitPane
            split="vertical"
            sizes={nestedSizes}
            onChange={setNestedSizes}
            sashRender={() => <div className="sash" />}
          >
            <Pane style={{ ...layoutCSS, background: "#d5d7d9" }} minSize={200}>
              pane1
            </Pane>
            <Pane minSize={200}>
              <Editor
                options={{ fontSize: fontSize }}
                width="100%"
                theme="vs-dark"
                height="100vh"
                path={lang[currLanguage as keyof typeof lang].language}
                defaultLanguage={
                  lang[currLanguage as keyof typeof lang].language
                }
                defaultValue={lang[currLanguage as keyof typeof lang].value}
                onMount={(editor) => (editorRef.current = editor)}
              />
            </Pane>
          </SplitPane>
          <Pane style={{ ...layoutCSS, background: "#a1a5a9" }} minSize={200}>
            pane2
          </Pane>
        </SplitPane>
      </div>
    </main>
  );
}
