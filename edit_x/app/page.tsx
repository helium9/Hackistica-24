"use client";
import Editor from "@monaco-editor/react";
import { io } from "socket.io-client";
import { PlayArrow } from "@mui/icons-material";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { languageOptions } from "./constants/languages";
import {
  Textarea,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Spinner,
  Card,
  CardBody,
} from "@nextui-org/react";
import SplitPane, { Pane } from "split-pane-react";
import "split-pane-react/esm/themes/default.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import InputModal from "./components/InputModal";

// import LanguageSelect from "./components/languageDropDown";
// import FontSizeSelect from "./components/Fontsize";

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

const socket = io("http://localhost:8000", {
  autoConnect: false,
});

export default function Home() {
  const [fontSize, setFontSize] = useState(30);
  const editorRef = useRef(null);
  const currTimeStamp = useRef(Date.now());
  // const [editorText, setEditorText] = useState("");
  const [currLanguage, setCurrLanguage] = useState(0);
  const [sizes, setsizes] = useState([350, "30%", "auto"]);
  const [nestedSizes, setNestedSizes] = useState([20, 80]);
  const [stdinValue, setStdinValue] = useState("");
  const [executionResult, setExecutionResult] = useState("");
  const [pane2Sizes, setPane2Sizes] = useState([50, 50]);
  const [isLoading, setIsLoading] = useState(false);
  // console.log(languageOptions);
  // console.log((editorRef.current==null)?("null"):(editorRef.current.getValue()));

  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {
      console.log("socket.io connected successfully");
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on("text-update", (res, timeStamp) => {
      console.log(res, timeStamp, currTimeStamp.current);
      if (timeStamp>currTimeStamp.current && res !== editorRef.current.getValue()) {
        const cursorInfo = editorRef.current.getPosition();
        console.log(cursorInfo);
        editorRef.current.setValue(res);
        editorRef.current.setPosition(cursorInfo);
      }
    });
  }, [socket]);
  const handleEditorChange = (value, event) => {
    currTimeStamp.current = Date.now();
    socket.emit("code-value", value, currTimeStamp.current);
  };
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
        console.log(editorRef.current.getPosition());
        setTimeout(() => {
          axios.get(`http://localhost:2358/submissions/${res}`).then((res) => {
            setIsLoading(false);
            setExecutionResult(res.data.stdout);
          });
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

      <div style={{ height: "92.5vh" }}>
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
              className="p-4 flex justify-center items-center h-full"
              minSize={200}
            >
              pane1
            </Pane>
            <Pane minSize={200}>
              <Editor
                options={{ fontSize: fontSize }}
                width="100%"
                theme="vs-dark"
                height="100vh"
                path={languageOptions[currLanguage].name}
                defaultLanguage={languageOptions[currLanguage].value}
                defaultValue={languageOptions[currLanguage].boilerplateCode}
                onMount={(editor, monaco) => (editorRef.current = editor)}
                onChange={handleEditorChange}
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
              {(isLoading)?(
              <Card className="h-full w-full">
                <CardBody className="flex justify-center items-center">
                <Spinner size="lg" />
                </CardBody>
              </Card>
              ):(
              <Textarea
                classNames={{ base: "h-full", innerWrapper: "h-lvh" }}
                placeholder="Output"
                size="lg"
                fullWidth={true}
                value={executionResult}
                isReadOnly
              />
              )}
            </Pane>
          </SplitPane>
        </SplitPane>
      </div>
    </main>
  );
}
