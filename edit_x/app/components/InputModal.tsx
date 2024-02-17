import React from "react";
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

export default function InputModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
                  label="ID"
                  defaultValue="junior@nextui.org"
                  endContent={
                    <ContentCopy
                      className="text-2xl m-2 pt-1"
                      sx={{ color: "#757575" }}
                    />
                  }
                />
                <Input
                  autoFocus
                  label="Id"
                  placeholder="Enter your id"
                  variant="bordered"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
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
