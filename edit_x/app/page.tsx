"use client";
import Editor from "@monaco-editor/react";
import type * as Monaco from 'monaco-editor';
import Filemanager from "./components/Filemanager"
import { io } from "socket.io-client";
import Link from 'next/link';
import { PlayArrow } from "@mui/icons-material";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { useUser, SignInButton } from "@clerk/nextjs";
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
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
});

export default function Home() {
  const { user, isLoaded, isSignedIn } = useUser();

  const [fontSize, setFontSize] = useState(30);
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const currTimeStamp = useRef(Date.now());
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  // const [editorText, setEditorText] = useState("");




  // const [fontSize, setFontSize] = useState(30);
  // const editorRef = useRef(null);
  const [roomID, setRoomID] = useState("");
  const [currLanguage, setCurrLanguage] = useState(0);
  const [sizes, setsizes] = useState([100, "30%", "auto"]);
  const [nestedSizes, setNestedSizes] = useState([70, 30]);
  const [stdinValue, setStdinValue] = useState("");
  const [executionResult, setExecutionResult] = useState("");
  const [pane2Sizes, setPane2Sizes] = useState([50, 50]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeComponent, setActiveComponent] = useState<"git" | "extension" | "filemanager" | null>(null);
  const [filecontent, setFilecontent] = useState("");
  const [isLayoutVertical, setIsLayoutVertical] = useState(true);
  const [layout2Sizes, setLayout2Sizes] = useState([275, "70%", "auto"]);
  const [editorAndRightPaneSizes, setEditorAndRightPaneSizes] = useState([
    50, 50,
  ]);


  // console.log(languageOptions);
  // console.log((editorRef.current==null)?("null"):(editorRef.current.getValue()));

  // github tasks







  const chek = async () => {
    // Skip check if user is not signed in
    if (!isSignedIn || !user) {
      console.log("User not signed in, skipping user check");
      return null;
    }
    
    try {
      const response = await fetch(`/api/checkuser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: user })
      });
      
      if (!response.ok) {
        console.error("Check user API failed:", response.status);
        return null;
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error checking user:", error);
      return null;
    }
  }
  
  useEffect(() => {
    if (isLoaded) {
      chek();
    }
  }, [isLoaded, isSignedIn, user]);


  useEffect(() => {
    socket.connect();
    
    socket.on("connect", () => {
      console.log("Socket.io connected successfully:", socket.id);
      setIsSocketConnected(true);
    });
    
    socket.on("disconnect", () => {
      console.log("Socket.io disconnected");
      setIsSocketConnected(false);
    });
    
    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setIsSocketConnected(false);
    });
    
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (roomID !== "") {
      console.log("Joining room:", roomID);
      socket.emit("join-room", roomID);
      
      // Request current state from room after a short delay
      setTimeout(() => {
        console.log("Requesting room state...");
        socket.emit("request-room-state", roomID);
      }, 500);
    }
  }, [roomID]);

  useEffect(() => {
    const handleTextUpdate = (res: string, timeStamp: number) => {
      console.log("✅ Received text update at:", timeStamp, "Current time:", currTimeStamp.current);
      console.log("Text preview:", res.substring(0, 50));
      if (editorRef.current && timeStamp > currTimeStamp.current && res !== editorRef.current.getValue()) {
        console.log("📝 Updating editor with received text");
        const cursorInfo = editorRef.current.getPosition();
        editorRef.current.setValue(res);
        if (cursorInfo) {
          editorRef.current.setPosition(cursorInfo);
        }
      } else {
        console.log("⏭️ Skipping update - timestamp check failed or text unchanged");
      }
    };
    
    const handleRoomState = (state: any) => {
      console.log("🔄 Received room state:", state);
      if (state.code && editorRef.current) {
        console.log("📝 Syncing editor with room code");
        editorRef.current.setValue(state.code);
        currTimeStamp.current = state.timestamp || Date.now();
      }
      if (state.languageIndex !== undefined) {
        console.log("🔄 Syncing language to index:", state.languageIndex);
        setCurrLanguage(state.languageIndex);
      }
    };
    
    const handleLanguageUpdate = (languageIndex: number) => {
      console.log("🔄 Received language update:", languageIndex);
      setCurrLanguage(languageIndex);
    };
    
    const handleStateRequest = (requesterId: string) => {
      console.log("📤 State requested by:", requesterId);
      if (editorRef.current) {
        const currentCode = editorRef.current.getValue();
        socket.emit("send-state", requesterId, currentCode, currLanguage, roomID);
      }
    };
    
    const handleUserJoined = (userId: string) => {
      console.log("👋 User joined room:", userId);
    };
    
    socket.on("text-update", handleTextUpdate);
    socket.on("room-state", handleRoomState);
    socket.on("language-update", handleLanguageUpdate);
    socket.on("state-request", handleStateRequest);
    socket.on("user-joined", handleUserJoined);
    
    return () => {
      socket.off("text-update", handleTextUpdate);
      socket.off("room-state", handleRoomState);
      socket.off("language-update", handleLanguageUpdate);
      socket.off("state-request", handleStateRequest);
      socket.off("user-joined", handleUserJoined);
    };
  }, [currLanguage, roomID]);
  
  const handleEditorChange = (value: any, event: any) => {
    currTimeStamp.current = Date.now();
    if (isSocketConnected) {
      console.log("📤 Sending code update to room:", roomID || "broadcast", "at:", currTimeStamp.current);
      socket.emit("code-value", value, roomID, currTimeStamp.current);
    } else {
      console.warn("⚠️ Socket not connected, cannot send update");
    }
  };
  const func = async () => {
    try {
      const response = await fetch(`/api/test12`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: "hiiji" })
      });
      
      if (!response.ok) {
        console.error("Test12 API failed:", response.status);
        return null;
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error in func:", error);
      return null;
    }
  }
  const submitCode = () => {
    if (!editorRef.current) {
      console.error("Editor not initialized");
      return;
    }
    
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
        if (editorRef.current) {
          console.log(editorRef.current.getPosition());
        }
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

  const handleFilemangerPress = () => {
    setActiveComponent("filemanager");
  };


  const toggleLayout = () => {
    setIsLayoutVertical(!isLayoutVertical);
  };

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <Spinner size="lg" />
        <p>Loading authentication...</p>
      </div>
    );
  }

  // Show sign-in prompt if not authenticated
  if (!isSignedIn) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '2.5rem',
        textAlign: 'center',
        padding: '2rem',
        background: 'linear-gradient(to bottom, #1a1a1a, #2d2d2d)'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '3rem', 
            marginBottom: '1rem', 
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #60a5fa, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Welcome to Edit-X
          </h1>
          <p style={{ fontSize: '1.3rem', color: '#aaa', marginBottom: '0.5rem' }}>
            A collaborative real-time code editor
          </p>
          <p style={{ fontSize: '1rem', color: '#777' }}>
            Sign in to start coding with others in real-time
          </p>
        </div>
        
        <div style={{ fontSize: '5rem' }}>�‍💻</div>
        
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          flexDirection: 'column',
          minWidth: '300px'
        }}>
          <SignInButton mode="modal">
            <button style={{
              padding: '1.1rem 3rem',
              fontSize: '1.2rem',
              fontWeight: '600',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.6rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 10px rgba(59, 130, 246, 0.4)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(59, 130, 246, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 10px rgba(59, 130, 246, 0.4)';
            }}
            >
              🔑 Sign In to Continue
            </button>
          </SignInButton>
          
          <p style={{ 
            color: '#777', 
            fontSize: '0.85rem', 
            marginTop: '0.5rem',
            fontStyle: 'italic'
          }}>
            Coding becomes easy!!
          </p>
        </div>
        
        <div style={{ 
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '0.75rem',
          maxWidth: '600px'
        }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#60a5fa' }}>
            ✨ Features
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
            textAlign: 'left',
            color: '#999',
            fontSize: '0.9rem'
          }}>
            <div>🚀 Real-time collaboration</div>
            <div>💻 Multiple languages</div>
            <div>🔄 Live code sync</div>
            <div>⚡ Fast execution</div>
          </div>
        </div>
      </div>
    );
  }

  return (

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
          
          {/* User Welcome Message */}
          {user && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-900/30">
              <span className="text-xs">👋 Welcome, {user.firstName || user.username || 'User'}!</span>
            </div>
          )}
          
          {/* Socket Connection Status */}
          <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${isSocketConnected ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
            <div className={`w-2 h-2 rounded-full ${isSocketConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-xs">{isSocketConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
          
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered" className="w-fit">
                Font Size: {fontSize}
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem key="16" onPress={() => setFontSize(20)}>
                16
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
                80
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
                  onPress={() => {
                    setCurrLanguage(index);
                    // Sync language change to room
                    if (isSocketConnected && roomID) {
                      console.log("📤 Broadcasting language change to room:", index);
                      socket.emit("language-change", index, roomID);
                    }
                  }}
                >
                  {Lang.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <InputModal setRoomID={setRoomID} roomID={roomID} />
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
          {/* Sign out button removed - now in header via Clerk UserButton */}
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
                      onPress={handleFilemangerPress}
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
                  {activeComponent === "git" && <Git filecontent={editorRef.current} />}
                  {activeComponent === "extension" && <Extension />}
                  {activeComponent === "filemanager" && <Filemanager />}
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
                  {activeComponent === "git" && <Git filecontent={filecontent} />}
                  {activeComponent === "extension" && <Extension />}
                  {activeComponent === "filemanager" && <Filemanager />}
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
