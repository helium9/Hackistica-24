"use client"
import React, { useState, useRef, useMemo } from "react";
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
  
  // Generate a stable UUID that doesn't change on re-renders
  const myRoomID = useMemo(() => uuidv4(), [isOpen]);
  
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
                  type="text"
                  label="Your Room ID (Share this)"
                  value={myRoomID}
                  endContent={
                    <CopyToClipboard
                      text={myRoomID}
                      onCopy={() => {
                        setCopied(true);
                        alert("Room ID copied to clipboard!");
                        setTimeout(() => setCopied(false), 2000);
                      }}
                    >
                      <ContentCopy
                        className="text-2xl m-2 pt-1 cursor-pointer hover:text-blue-500"
                        sx={{ color: copied ? "#4CAF50" : "#757575" }}
                      />
                    </CopyToClipboard>
                  }
                />
                <div className="text-sm text-gray-400 -mt-2">
                  {roomID ? `Currently in room: ${roomID}` : "Not in any room yet"}
                </div>
                <Input
                  autoFocus
                  label="Join Existing Room"
                  placeholder="Paste Room ID here to join"
                  variant="bordered"
                  value={value}
                  onValueChange={setValue}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" ref={exitButtonRef} variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button 
                  color="success" 
                  onPress={() => {
                    setRoomID(myRoomID);
                    if(exitButtonRef.current !== null){
                      exitButtonRef.current.click();
                    }
                  }}
                >
                  Create Room
                </Button>
                <Button 
                  color="primary" 
                  isDisabled={!value.trim()}
                  onPress={() => {
                    setRoomID(value.trim());
                    if(exitButtonRef.current !== null){
                      exitButtonRef.current.click();
                    }
                  }}
                >
                  Join Room
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
