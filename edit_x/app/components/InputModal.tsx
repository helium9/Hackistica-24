"use client"
import React, { useState, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';
import CopyToClipboard from "react-copy-to-clipboard";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Link,
  Card,
  CardBody,
} from "@nextui-org/react";
import { ContentCopy } from "@mui/icons-material";

export default function InputModal({roomID, setRoomID}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [value, setValue] = useState("");
  const [copied, setCopied] = useState(false);
  const exitButtonRef = useRef(null);
  return (
    <>
      <Button onPress={onOpen} color="primary">
        Share
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Join or Create Room
              </ModalHeader>

              <ModalBody>
              <Input
                  variant="bordered"
                  isReadOnly
                  type="email"
                  label="Your ID"
                  defaultValue={uuidv4()}
                  endContent={
                    <CopyToClipboard
                      text="junior@nextui.org" // Text to copy - Use a variable if dynamic
                      onCopy={() => {
                        setCopied(true);
                        alert("Copied!");
                      }}
                    >
                      <ContentCopy
                        className="text-2xl m-2 pt-1"
                        sx={{ color: "#757575" }}
                      />
                    </CopyToClipboard>
                  }
                />
                <Input
                  autoFocus
                  label="Id"
                  placeholder="Enter Room ID"
                  variant="bordered"
                  value={value}
                  onValueChange={setValue}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" ref={exitButtonRef} variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={()=>{
                  setRoomID(value);
                  if(exitButtonRef.current!==null){
                    exitButtonRef.current.click();
                  }
                }}>
                  Join Now
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
