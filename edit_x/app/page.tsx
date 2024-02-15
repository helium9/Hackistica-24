"use client";
// import Image from "next/image";
import Editor from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client"
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@nextui-org/react";
import e from "express";



const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export default function Home() {
  const [fontSize, setFontSize] = useState(30);
  const [users,setUsers] = useState([]);
  const [socketInstance,setSocketInstance] = useState(null);
  const editorRef = useRef(null);
  const [document,setDocument] = useState("//some comment");
  const [location,setLocation] = useState(null);
  function handleEditorDidMount(editor,monaco){
    editorRef.current = editor;
    console.log(editorRef.current?editorRef.current.getValue():"");
    setDocument(editorRef.current?editorRef.current.getValue():"");
    console.log(document);
  }
  function handleChange(value,event){
    setDocument(value);
    // console.log(editorRef.current.getPosition());
  }
  function showValue(){
    if(editorRef.current){
      alert(editorRef.current.getValue());
      alert(username);
      console.log(editorRef.current);
      console.log(editorRef.current.getPosition())
      // console.log(editorRef.current.getLineCount());
    }
  }
  useEffect(()=>{
    console.log("Hello")
    if(editorRef.current){
      console.log(editorRef.current.getValue());
      // console.log(editorRef.current);
      // console.log(editorRef.current.getPosition())
    }
  },[])
  function generateString(length){
    let result = ' ';
    const charactersLength = characters.length;
    for(let i=0;i<length;i++){
      result +=characters.charAt(Math.floor(Math.random()*charactersLength));
    }
    return result;
  }
  const roomId = "new-room#123";
  const username = generateString(5);

  useEffect(()=>{
    console.log(document);
    const socket = io.connect("http://localhost:8001");
    setSocketInstance(socket);
    socket.on('connect',()=>{
      console.log(roomId);
      socket.emit('join-room',{ roomId,username});
    })
    console.log("user joined");
    socket.on('user-joined',(username)=>{
      setUsers(prev => [...prev,username]);
      // alert(` congrated ${username} joined the room`)
      socket.emit('connected-users', users);
    })
    console.log(document);
    console.log((editorRef.current?editorRef.current.getValue():"no input yet"));
    // socket.emit('get_document',{document: (editorRef.current? editorRef.current.getValue():"//some comment")} );

  },[]);
  useEffect(()=>{
    console.log("socketInstatnce");
    // alert("handle change")
    // alert(socketInstance);
    console.log("handle Changes");
    if(socketInstance){
      console.log(socketInstance);
      socketInstance.emit('get_document',{document,roomId});
      // alert(`document: ${document}`);
    }
  },[handleChange]);
  useEffect(()=>{
    if(socketInstance){
      socketInstance.on('get_value',(content)=>{
        console.log(content);
        if(editorRef.current){
          console.log(editorRef.current.getValue());
          setLocation(editorRef.current.getPosition());
          // console.log(editorRef.current.getPosition());
          // editorRef.current.setValue(content);
          // editorRef.current.setPosition(location);
          console.log(content);
        }
      })
    }
  },[handleChange]);
  // useEffect(()=>{
  //   if(socketInstance){
  //     console.log(socketInstance);
  //     if(socketInstance){
        
  //       socketInstance.on('get_value',(content)=>{
  //         alert("get value");
  //         setDocument(content);
  //         editorRef.current.setValue(content);
  //         console.log(editorRef.current.getValue());
  //       });
  //       console.log(editorRef.current);
  //     }
      
  //     // alert(`document: ${document}`);
  //   }
  // })
  
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
          </DropdownMenu>
        </Dropdown>
        <div>
          <button onClick={showValue}>showValue</button>
          {document}
        </div>
      </div>
      
      <div>
        <Editor
          options={{ fontSize: fontSize }}
          width="100%"
          theme="vs-dark"
          height="100vh"
          defaultLanguage="javascript"
          defaultValue={ document}
          onChange = {handleChange}
          onMount = {handleEditorDidMount}
        />
        <div>

        </div>
      </div>
    </main>
  );
}
