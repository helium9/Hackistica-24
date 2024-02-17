"use client";
import Editor from "@monaco-editor/react";
import { io } from "socket.io-client";
import { PlayArrow } from "@mui/icons-material";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
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
  Tooltip
} from "@nextui-org/react";
import "split-pane-react/esm/themes/default.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import SplitPane, { Pane } from "split-pane-react";
import InputModal from "./components/InputModal";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import GitHubIcon from "@mui/icons-material/GitHub";
import ExtensionIcon from "@mui/icons-material/Extension";
import Git from "./components/Git";
import Extension from "./components/Extensions";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";


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
  const {data: session} = useSession({
    required: true,
    onUnauthenticated(){
      redirect('api/auth/signin');
    }
  });
  console.log(session?.user);
  const [files,setfiles]=useState({content:[{path:"ne",content:"hiu  updated",encoding:"utf-8"},{path:"hiu",content:"This is y",encoding:"utf-8"}]});
  const [branch1,setbranch1]=useState("main");
  const [branch2,setbranch2]=useState("yu");
  const [token_git,settoken_git]=useState("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");
  const [repo,setrepo]=useState("hackistica_test");
  const [branch,setbranch]=useState("main2");
  const [username,setusername]=useState("xenom2004");
  const inputref=useRef(null);
  const [activated,setactivated]=useState(false);

  const [fontSize, setFontSize] = useState(30);
  const editorRef = useRef(null);
  const currTimeStamp = useRef(Date.now());
  // const [editorText, setEditorText] = useState("");
 



  // const [fontSize, setFontSize] = useState(30);
  // const editorRef = useRef(null);
  const [currLanguage, setCurrLanguage] = useState(0);
  const [sizes, setsizes] = useState([100, "30%", "auto"]);
  const [nestedSizes, setNestedSizes] = useState([70, 30]);
  const [stdinValue, setStdinValue] = useState("");
  const [executionResult, setExecutionResult] = useState("");
  const [pane2Sizes, setPane2Sizes] = useState([50, 50]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeComponent, setActiveComponent] = useState(null);
  const [isLayoutVertical, setIsLayoutVertical] = useState(true);
  const [layout2Sizes, setLayout2Sizes] = useState([275, "70%", "auto"]);
  const [editorAndRightPaneSizes, setEditorAndRightPaneSizes] = useState([
    50, 50,
  ]);


  if (editorRef.current != null) {
    editorRef.current.onKeyDown(() => console.log("keyPress"));
  }
  // console.log(languageOptions);
  // console.log((editorRef.current==null)?("null"):(editorRef.current.getValue()));

  // github tasks
  const onCloses=async ()=>{

    console.log(token_git, username, repo);
    const response = await fetch(`/api/githubs/${token_git}/${username}/${repo}/${branch}/create`).then(
      response => response.json())
    .then(data =>{
      console.log(data);

      if(data.status==200){
        inputref.current.click();
      }
      else{
      setactivated(true);
      inputref.current.click();} 
    })
    .catch(error => {
      inputref.current.click();
      console.error(error)});
  }
  const activate = async  ()=>{
    onOpen();
    
    
  }
  const commit_func=async ()=>{
    // settoken_git(process.env.NEXT_PUBLIC_API_GITHUB_TOKEN);
    // setusername("xenom2004");
    // setrepo("hackistica_test");
    console.log(token_git);
    console.log(repo);
    console.log(username);
    console.log(branch);


   
    // connectToMongoDB();
    console.log("client",files);
    console.log(JSON.stringify(files));

    const response = await fetch(`/api/githubs/${token_git}/${username}/${repo}/${branch}/commit`,
    {method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(files)})
    const data=await response.json();
    console.log(data)
    alert(data.message);
    return data
    

    // Useraccount.createCollection().then(function (collection) { 
    //   console.log('Collection is created!'); 
    // });
    
  }

  const merge_func=async ()=>{

    console.log(token_git);
    console.log(repo);
    console.log(username);
    console.log(branch);


   
    // connectToMongoDB();
    // console.log("client",files);
    // console.log(JSON.stringify(files));

    const response = await fetch(`/api/githubs/${token_git}/${username}/${repo}/${branch}/merge`,
    {method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({content:[branch1,branch2]})})
    const data=await response.json();
    console.log(data)
    alert(data.message);
    return data
    
  }

  const list_branch_func=async ()=>{
    const response = await fetch(`/api/githubs/${token_git}/${username}/${repo}/${branch}/listBranch`).then(
      response => response.json())
    .then(data =>{
      console.log(data);
    })
    .catch(error => {
      
      console.error(error)});
  }


 
  





  const chek=async ()=>{
    console.log("gygyy",session?.user)

    const response = await fetch(`/api/checkuser`,
    {method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({content:session?.user})});
    const data=await response.json();
    console.log(data)
    
    return data
  }
  useEffect( () => {
    socket.connect();
    socket.on("connect", () => {
      console.log("checker");
    chek();
      console.log("socket.io connected successfully");
    });
    

    

    return () => {
      socket.disconnect();
    };
  }, [session?.user]);

  useEffect(() => {
    socket.on("text-update", (res, timeStamp) => {
      console.log(res, timeStamp, currTimeStamp.current);
      if (timeStamp>currTimeStamp.current && res !== editorRef.current.getValue()) { //timestamp saved from infinite loop glitch on continous character press
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
  const func=async ()=>{

    console.log("on func")
    

    const response = await fetch(`/api/test12`,
    {method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({content:"hiiji"})})
    console.log("er",response)
    const data=await response.json();
    return data;
  }
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

  const handleGitPress = () => {
    setActiveComponent("git");
  };

  const handleExtensionPress = () => {
    setActiveComponent("extension");
  };

  const toggleLayout = () => {
    setIsLayoutVertical(!isLayoutVertical);
  };


  return (
    // <main>
    //   <div className="flex flex-row gap-4 items-center p-2">
    //     <span>Editor v0.1</span>
    //     <Dropdown>
    //       <DropdownTrigger>
    //         <Button variant="bordered" className="w-fit">
    //           Font Size: {fontSize}
    //         </Button>
    //       </DropdownTrigger>
    //       <DropdownMenu aria-label="Static Actions">
    //         <DropdownItem key="20" onPress={() => setFontSize(20)}>
    //           20
    //         </DropdownItem>
    //         <DropdownItem key="30" onPress={() => setFontSize(30)}>
    //           30
    //         </DropdownItem>
    //         <DropdownItem key="40" onPress={() => setFontSize(40)}>
    //           40
    //         </DropdownItem>
    //         <DropdownItem key="80" onPress={() => setFontSize(80)}>
    //           It's fucking big
    //         </DropdownItem>
    //       </DropdownMenu>
    //     </Dropdown>

    //     <Dropdown>
    //       <DropdownTrigger>
    //         <Button variant="bordered" className="w-fit">
    //           {languageOptions[currLanguage].name}
    //         </Button>
    //       </DropdownTrigger>
    //       <DropdownMenu
    //         aria-label="Static Actions"
    //         classNames={{ base: "h-96 overflow-auto scrollbar-hide" }}
    //       >
    //         {languageOptions.map((Lang, index) => (
    //           <DropdownItem
    //             key={Lang.id}
    //             onPress={() => setCurrLanguage(index)}
    //           >
    //             {Lang.name}
    //           </DropdownItem>
    //         ))}
    //       </DropdownMenu>
    //     </Dropdown>
    //     <InputModal />
    //     <Button
    //       variant="bordered"
    //       className="ml-auto w-fit"
    //       onPress={() => {
    //         setIsLoading(true);
    //         submitCode();
    //       }}
    //     >
    //       {/* <Spinner/> */}
    //       <PlayArrow />
    //     </Button>
    //   </div>

    //   <div style={{ height: "92.5vh" }}>
    //     <SplitPane
    //       split="horizontal"
    //       sizes={sizes}
    //       onChange={setsizes}
    //       sashRender={() => <div className="sash" />}
    //     >
    //       <SplitPane
    //         split="vertical"
    //         sizes={nestedSizes}
    //         onChange={setNestedSizes}
    //         sashRender={() => <div className="sash" />}
    //       >
    //         <Pane
    //           className="p-4 flex justify-center items-center h-full"
    //           minSize={200}
    //         >
    //           pane1
    //         </Pane>
    //         <Pane minSize={200}>
    //           <Editor
    //             options={{ fontSize: fontSize }}
    //             width="100%"
    //             theme="vs-dark"
    //             height="100vh"
    //             path={languageOptions[currLanguage].name}
    //             defaultLanguage={languageOptions[currLanguage].value}
    //             defaultValue={languageOptions[currLanguage].boilerplateCode}
    //             onMount={(editor, monaco) => (editorRef.current = editor)}
    //             onChange={handleEditorChange}
    //           />
    //         </Pane>
    //       </SplitPane>
    //       <SplitPane
    //         split="vertical"
    //         sizes={pane2Sizes}
    //         onChange={setPane2Sizes}
    //         sashRender={() => <div className="sash" />}
    //       >
    //         <Pane
    //           className="p-4 pr-2 flex justify-center items-center h-full"
    //           minSize={100}
    //         >
    //           {" "}
    //           {/*  pane2a */}
    //           <Textarea
    //             classNames={{ base: "h-full", innerWrapper: "h-lvh" }}
    //             placeholder="Input"
    //             size="lg"
    //             fullWidth={true}
    //             value={stdinValue}
    //             onValueChange={setStdinValue}
    //           />
    //         </Pane>
    //         <Pane
    //           className="p-4 pl-2 flex justify-center items-center h-full"
    //           minSize={100}
    //         >
    //           {" "}
    //           {/* pane2b */}
    //           {(isLoading)?(
    //           <Card className="h-full w-full">
    //             <CardBody className="flex justify-center items-center">
    //             <Spinner size="lg" />
    //             </CardBody>
    //           </Card>
    //           ):(
    //           <Textarea
    //             classNames={{ base: "h-full", innerWrapper: "h-lvh" }}
    //             placeholder="Output"
    //             size="lg"
    //             fullWidth={true}
    //             value={executionResult}
    //             isReadOnly
    //           />
    //           )}
    //         </Pane>
    //       </SplitPane>
    //     </SplitPane>
    //     <Button onPress={func}>clickkk</Button>
    //   </div>
    // </main>
    <main>
      <div className=" sm:hidden h-screen flex  flex-col justify-center items-center bg-gradient-to-r from-zinc-800 via-zinc-500 to-slate-400">
        <LaptopMacIcon className="text-9xl mb-4" />
        <p className="font-semibold text-2xl text-wrap text-center mx-2">
          This Website is not supported on mobile devices
        </p>
      </div>
      <div className="hidden sm:block bg-gradient-to-t from-gray-800 via-zinc-600 to-gray-800">
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
          <Button onClick={toggleLayout}>Change layout</Button>
        </div>

        <div style={{ height: "92.5vh" }}>
          {isLayoutVertical ? (
            <SplitPane
              split="vertical"
              sizes={sizes}
              onChange={setsizes}
              sashRender={() => <div className="sash" />}
            >
              <Pane
                className=" pt-1 pb-4 pr-4 pl-4 flex justify-center items-center"
                minSize={200}
                maxSize={550}
              >
                <div
                  className="h-full w-20 rounded-l-lg bg-[#27272a] flex flex-col justify-start items-center
              "
                >
                  <Tooltip
                    placement="right"
                    content={
                      <div className="px-1 py-2">
                        <div className="text-small font-bold">Files</div>
                        <div className="text-tiny">File Manager</div>
                      </div>
                    }
                  >
                    <Button
                      isIconOnly
                      aria-label="Like"
                      className="mt-2 bg-[#71717a]"
                      variant="shadow"
                    >
                      <InsertDriveFileIcon />
                    </Button>
                  </Tooltip>
                  <Tooltip
                    placement="right"
                    content={
                      <div className="px-1 py-2">
                        <div className="text-small font-bold">
                          Version COntrol{" "}
                        </div>
                        <div className="text-tiny">
                          Open Git via Version Control
                        </div>
                      </div>
                    }
                  >
                    <Button
                      isIconOnly
                      aria-label="Like"
                      className="mt-3 bg-[#71717a]"
                      variant="shadow"
                      onPress={handleGitPress}
                    >
                      <GitHubIcon />
                    </Button>
                  </Tooltip>
                  <Tooltip
                    placement="right"
                    content={
                      <div className="px-1 py-2">
                        <div className="text-small font-bold">Extensions</div>
                        <div className="text-tiny">
                          Download and install extensions
                        </div>
                      </div>
                    }
                  >
                    <Button
                      isIconOnly
                      aria-label="Like"
                      className="mt-3 bg-[#71717a]"
                      variant="shadow"
                      onPress={handleExtensionPress}
                    >
                      <ExtensionIcon />
                    </Button>
                  </Tooltip>
                </div>
                <div className="h-full w-full rounded-r-lg bg-[#1d1d20] overflow-auto scrollbar-hide">
                  {activeComponent === "git" && <Git />}
                  {activeComponent === "extension" && <Extension />}
                </div>
              </Pane>
              <SplitPane
                split="horizontal"
                sizes={nestedSizes}
                onChange={setNestedSizes}
                sashRender={() => <div className="sash" />}
              >
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
                    className="pt-1"
                  />
                </Pane>
                <SplitPane
                  split="vertical"
                  sizes={pane2Sizes}
                  onChange={setPane2Sizes}
                  sashRender={() => <div className="sash" />}
                >
                  <Pane
                    className="pt-4 pb-4 pr-2 flex justify-center items-center h-full"
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
                    className="pt-4 pb-4 pr-2 pl-2 flex justify-center items-center h-full"
                    minSize={100}
                  >
                    {" "}
                    {/* pane2b */}
                    {isLoading ? (
                      <Card isBlurred className="h-full w-full">
                        <CardBody className="flex justify-center items-center">
                          <Spinner size="lg" />
                        </CardBody>
                      </Card>
                    ) : (
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
            </SplitPane>
          ) : (
            <SplitPane
              split="vertical"
              sizes={layout2Sizes}
              onChange={setLayout2Sizes}
              sashRender={() => <div className="sash" />}
            >
              {/* THis is the second layout  */}
              <Pane
                className=" pt-1 pb-4 pr-4 pl-4 flex justify-center items-center"
                minSize={200}
                maxSize={550}
              >
                <div
                  className="h-full w-20 rounded-l-lg bg-[#27272a] flex flex-col justify-start items-center
              "
                >
                  <Tooltip
                    placement="right"
                    content={
                      <div className="px-1 py-2">
                        <div className="text-small font-bold">Files</div>
                        <div className="text-tiny">File Manager</div>
                      </div>
                    }
                  >
                    <Button
                      isIconOnly
                      aria-label="Like"
                      className="mt-2 bg-[#71717a]"
                      variant="shadow"
                    >
                      <InsertDriveFileIcon />
                    </Button>
                  </Tooltip>
                  <Tooltip
                    placement="right"
                    content={
                      <div className="px-1 py-2">
                        <div className="text-small font-bold">
                          Version COntrol{" "}
                        </div>
                        <div className="text-tiny">
                          Open Git via Version Control
                        </div>
                      </div>
                    }
                  >
                    <Button
                      isIconOnly
                      aria-label="Like"
                      className="mt-3 bg-[#71717a]"
                      variant="shadow"
                      onPress={handleGitPress}
                    >
                      <GitHubIcon />
                    </Button>
                  </Tooltip>
                  <Tooltip
                    placement="right"
                    content={
                      <div className="px-1 py-2">
                        <div className="text-small font-bold">Extensions</div>
                        <div className="text-tiny">
                          Download and install extensions
                        </div>
                      </div>
                    }
                  >
                    <Button
                      isIconOnly
                      aria-label="Like"
                      className="mt-3 bg-[#71717a]"
                      variant="shadow"
                      onPress={handleExtensionPress}
                    >
                      <ExtensionIcon />
                    </Button>
                  </Tooltip>
                </div>
                <div className="h-full w-full rounded-r-lg bg-[#1d1d20] overflow-auto scrollbar-hide">
                  {activeComponent === "git" && <Git />}
                  {activeComponent === "extension" && <Extension />}
                </div>
              </Pane>
              {/* Pane ends here */}
              <Pane minSize={200} maxSize={1100}>
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
                  className="pt-1"
                />
              </Pane>
              <SplitPane
                split="horizontal"
                sizes={editorAndRightPaneSizes}
                onChange={setEditorAndRightPaneSizes}
                sashRender={() => <div className="sash" />}
              >
                <Pane
                  className="pt-1 pr-2 pl-2 pb-2 flex justify-center items-center h-full"
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
                  className="pt-1 pr-2 pl-2 pb-2 flex justify-center items-center h-full"
                  minSize={100}
                >
                  {" "}
                  {/* pane2b */}
                  {isLoading ? (
                    <Card className="h-full w-full">
                      <CardBody className="flex justify-center items-center bg-black">
                        <Spinner size="lg" />
                      </CardBody>
                    </Card>
                  ) : (
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
          )}
        </div>
      </div>
    </main>
  );
}
