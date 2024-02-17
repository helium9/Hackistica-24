"use client"
import React from "react";
import { useState,useRef } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,  useDisclosure} from "@nextui-org/react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Button,
} from "@nextui-org/react";

import {
  Textarea,
  
} from "@nextui-org/react";

interface Props {
  name: string;
  age: number;
}

export default function Git(prop) {


  const [files,setfiles]=useState({content:[{path:"myfile",content:prop.filename,encoding:"utf-8"},{path:"hiu",content:"This is y",encoding:"utf-8"}]});
  const [branch1,setbranch1]=useState("main");
  const [branch2,setbranch2]=useState("another");
  const [token_git,settoken_git]=useState("");
  const [repo,setrepo]=useState("");
  const [branch,setbranch]=useState("");
  const [username,setusername]=useState("");
  const inputref=useRef(null);
  const [activated,setactivated]=useState(false);
  
  const {isOpen, onOpen, onOpenChange} = useDisclosure();


  const onCloses=async ()=>{

    // console.log(token_git, username, repo);
    const response = await fetch(`/api/githubs/${token_git}/${username}/${repo}/${branch}/create`).then(
      response => response.json())
    .then(data =>{
      // console.log(data);

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


 



  return (
    <div>
    <Card className="max-w-[400px]">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-md">Github</p>
          <p className="text-small text-default-500">github.com</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        {!activated && (
        <Button onPress={activate} color="primary" variant="bordered">
          Version Control
        </Button>)}

        {activated && (<div className="flex flex-col gap-4">
        <Button onPress={commit_func} variant="bordered" className="w-fit">
              commit
            </Button>
        <Button onPress={activate} variant="bordered" className="w-fit">
              push
            </Button>

        <Button onPress={activate} variant="bordered" className="w-fit">
          pull
          </Button>    


        </div>)} 
      </CardBody>
      <Divider />
      <CardFooter></CardFooter>
      
    </Card>
    
    

    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
              <ModalBody>
              <Textarea
                      label="API Token"
                      placeholder="Enter your API_Token"
                      className="max-w-xs"
                      onChange={(e) => settoken_git(e.target.value)}
                    />
              <Textarea
                      label="github username"
                      placeholder="Enter your github username"
                      className="max-w-xs"
                      onChange={(e) => setusername(e.target.value)}
                    />
              <Textarea
                      label="github repo"
                      placeholder="Enter the repo where all th files will be updated"
                      className="max-w-xs"
                      onChange={(e) => setrepo(e.target.value)}
                    />      
              <Textarea
                      label="github branch"
                      placeholder="Enter the Branch where all th files will be updated"
                      className="max-w-xs"
                      onChange={(e) => setbranch(e.target.value)}
                    />         
                          
               
                
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>

                <Button color="primary" onPress={onCloses}>
                  Action
                </Button>
                <Button className="hidden" ref={inputref} color="primary" onPress={onClose}>
                  Action2
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>


    </div>
  );
}
