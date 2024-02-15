"use client";
import Editor from "@monaco-editor/react";
import { PlayArrow } from "@mui/icons-material";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {languageOptions} from "./constants/languages";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Spinner,
} from "@nextui-org/react";
import SplitPane, { Pane } from "split-pane-react";
import "split-pane-react/esm/themes/default.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

// const lang = {
//   Python: {
//     language: "python",
//     value: `print("Hello there!")`,
//   },
//   HTML: {
//     language: "html",
//     value: "<div> </div>",
//   },
//   Javascript: {
//     language: "javascript",
//     value: `console.log("Hi")`,
//   },
// };

export default function Home() {
  const [fontSize, setFontSize] = useState(30);
  const editorRef = useRef(null);
  const [currLanguage, setCurrLanguage] = useState(0);
  const [sizes, setsizes] = useState([100, "30%", "auto"]);
  const [nestedSizes, setNestedSizes] = useState([50, 50]);

  const layoutCSS = {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  // console.log(languageOptions);
  // console.log((editorRef.current==null)?("null"):(editorRef.current.getValue()));
  const submitCode = () => {
    axios
      .post("http://localhost:2358/submissions", {
        source_code: editorRef.current.getValue(),
        language_id: languageOptions[currLanguage].id,
        number_of_runs: null,
        stdin: "",
        expected_output: null,
        cpu_time_limit: null,
        cpu_extra_time: null,
        wall_time_limit: null,
        memory_limit: null,
        stack_limit: null,
        max_processes_and_or_threads: null,
        enable_per_process_and_thread_time_limit: null,
        enable_per_process_and_thread_memory_limit: null,
        max_file_size: null,
        enable_network: null,
      })
      .then((res) => {
        return res.data.token;
      })
      .then((res) => {
        setTimeout(() => {
          axios
            .get(`http://localhost:2358/submissions/${res}`)
            .then((res) => console.log(res));
        }, 5000);
      });
  };
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
              {languageOptions[currLanguage].name}
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            {languageOptions.map((Lang, index) => {
              return (
                <DropdownItem key={Lang.id} onPress={() => setCurrLanguage(index)}>
                  {Lang.name}
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        </Dropdown>
        <Button
          variant="bordered"
          className="ml-auto w-fit"
          onPress={submitCode}
        >
          {/* <Spinner/> */}
          <PlayArrow />
        </Button>
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
                path={languageOptions[currLanguage].name}
                defaultLanguage={
                  languageOptions[currLanguage].value
                }
                defaultValue={""}
                onMount={(editor, monaco) => (editorRef.current = editor)}
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
