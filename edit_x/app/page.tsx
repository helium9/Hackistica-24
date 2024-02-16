"use client";
import Editor from "@monaco-editor/react";
import { PlayArrow } from "@mui/icons-material";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { languageOptions } from "./Constants/languages";
import {
  Textarea,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Spinner,
  Listbox,
  ListboxSection,
  ListboxItem,
} from "@nextui-org/react";
import SplitPane, { Pane } from "split-pane-react";
import "split-pane-react/esm/themes/default.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import DescriptionIcon from "@mui/icons-material/Description";
import { ListboxWrapper } from "./components/ListWrapper";
import InputModal from "./components/InputForn";
import Extensions from "./components/Extensions";
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
  const [sizes, setsizes] = useState([350, "30%", "auto"]);
  const [nestedSizes, setNestedSizes] = useState([20, 80]);
  const [stdinValue, setStdinValue] = useState("");
  const [executionResult, setExecutionResult] = useState("");
  const [pane2Sizes, setPane2Sizes] = useState([50, 50]);
  const [isLoading, setIsLoading] = useState(false);

  // console.log(languageOptions);
  // console.log((editorRef.current==null)?("null"):(editorRef.current.getValue()));
  const submitCode = () => {
    axios
      .post("http://localhost:2358/submissions", {
        source_code: editorRef.current.getValue(),
        language_id: languageOptions[currLanguage].id,
        number_of_runs: null,
        stdin: stdinValue,
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
          axios.get(`http://localhost:2358/submissions/${res}`).then((res) => {
            setExecutionResult(res.data.stdout);
            setIsLoading(false);
          });
        }, 5000);
      });
  };
  return (
    <main>
      <div className="flex flex-row gap-4 items-center p-4">
        <span>Editor v0.1</span>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered" className="w-fit">
              Font Size: {fontSize}
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="15" onPress={() => setFontSize(15)}>
              15
            </DropdownItem>
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
              Too large
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        {/* <FontSizeSelect /> */}

        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered" className="w-fit">
              {languageOptions[currLanguage].name}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Static Actions"
            classNames={{ base: "h-96 overflow-auto scrollbar-hide" }}
          >
            {languageOptions.map((Lang, index) => (
              <DropdownItem
                key={Lang.id}
                onPress={() => setCurrLanguage(index)}
              >
                {Lang.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>

        {/* <LanguageSelect /> */}

        <InputModal />

        <Button
          variant="bordered"
          className="ml-auto w-fit"
          onPress={() => {
            setIsLoading(true);
            submitCode();
          }}
        >
          {/* <Spinner/> */}
          <PlayArrow />
        </Button>
      </div>

      <div style={{ height: "88vh" }}>
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
            <Pane
              minSize={200}
              className="bg-gray-900 rounded-lg p-4 overflow-auto scrollbar-hide"
            >
              {/* <ListboxWrapper>
                <Listbox>
                  <ListboxItem key="new">
                    <DescriptionIcon className="mr-2" /> New file
                  </ListboxItem>
                  <ListboxItem key="copy">
                    <DescriptionIcon className="mr-2" /> Copy link
                  </ListboxItem>
                  <ListboxItem key="edit">
                    <DescriptionIcon className="mr-2" /> Edit file
                  </ListboxItem>
                </Listbox>
              </ListboxWrapper> */}
              <Extensions />
            </Pane>
            <Pane className="flex" minSize={200}>
              <Editor
                options={{ fontSize: fontSize }}
                width="100%"
                theme="vs-dark"
                height="100vh"
                path={languageOptions[currLanguage].name}
                defaultLanguage={languageOptions[currLanguage].value}
                defaultValue={""}
                onMount={(editor, monaco) => (editorRef.current = editor)}
              />
            </Pane>
          </SplitPane>
          <SplitPane
            split="vertical"
            sizes={pane2Sizes}
            onChange={setPane2Sizes}
            sashRender={() => <div className="sash" />}
          >
            <Pane
              className="p-4 pr-2 flex justify-center items-center h-full"
              minSize={100}
            >
              {" "}
              {/*  pane2a */}
              <Textarea
                classNames={{ base: "h-full", innerWrapper: "h-lvh" }}
                placeholder="Input"
                size="lg"
                fullWidth={true}
                value={stdinValue}
                onValueChange={setStdinValue}
              />
            </Pane>
            <Pane
              className="p-4 pl-2 flex justify-center items-center h-full"
              minSize={100}
            >
              {" "}
              {/* pane2b */}
              <Textarea
                classNames={{ base: "h-full", innerWrapper: "h-lvh" }}
                placeholder="Output"
                size="lg"
                fullWidth={true}
                value={executionResult}
                isReadOnly
              >
                {isLoading ? <Spinner size="sm" /> : executionResult}
              </Textarea>
            </Pane>
          </SplitPane>
        </SplitPane>
      </div>
    </main>
  );
}
