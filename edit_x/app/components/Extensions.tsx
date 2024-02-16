import React from "react";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { ListboxWrapper } from "./ListBoxWrapper";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
  Button,
} from "@nextui-org/react";
import { useState } from "react";

interface languageOptions {
  id: number;
  name: string;
  label: string;
  value: string;
}

const languageOptions: languageOptions[] = [
  {
    id: 63,
    name: "JavaScript (Node.js 12.14.0)",
    label: "JavaScript (Node.js 12.14.0)",
    value: "javascript",
  },
  {
    id: 45,
    name: "Assembly (NASM 2.14.02)",
    label: "Assembly (NASM 2.14.02)",
    value: "assembly",
  },
  // ... rest of the language options
];

const InstallButton = () => {
  const [newLanguage, setNewLanguage] = useState({
    id: 63, // Placeholder - get these dynamically
    name: "JavaScript (Node.js 12.14.0)",
    label: "JavaScript (Node.js 12.14.0)",
    value: "javascript",
  });
};

export default function App() {
  return (
    <ListboxWrapper>
      <Listbox
        aria-label="Actions"
        className="h-96 overflow-auto scrollbar-hide"
      >
        <ListboxItem key="C++">
          <Card className="max-w-[400px]">
            <CardHeader className="flex gap-3">
              <Image
                alt="nextui logo"
                height={40}
                radius="sm"
                src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                width={40}
              />
              <div className="flex flex-col">
                <p className="text-md">C++ extension</p>
                <p className="text-small text-default-500">Microsoft.org</p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="overflow-auto scrollbar-hide h-16">
              <p>C++ Extension</p>
            </CardBody>
            <Divider />
            <CardFooter>
              <Button size="sm">Install</Button>
            </CardFooter>
          </Card>
        </ListboxItem>
        <ListboxItem key="Python">
          <Card className="max-w-[400px]">
            <CardHeader className="flex gap-3">
              <Image
                alt="nextui logo"
                height={40}
                radius="sm"
                src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                width={40}
              />
              <div className="flex flex-col">
                <p className="text-md">Python extension</p>
                <p className="text-small text-default-500">Microsoft.org</p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="overflow-auto scrollbar-hide h-16">
              <p>Python Extension</p>
            </CardBody>
            <Divider />
            <CardFooter>
              <Button size="sm">Install</Button>
            </CardFooter>
          </Card>
        </ListboxItem>
        <ListboxItem key="new">
          <Card className="max-w-[400px]">
            <CardHeader className="flex gap-3">
              <Image
                alt="nextui logo"
                height={40}
                radius="sm"
                src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                width={40}
              />
              <div className="flex flex-col">
                <p className="text-md">C++ extension</p>
                <p className="text-small text-default-500">Microsoft.org</p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="overflow-auto scrollbar-hide h-16">
              <p>C++ Extension</p>
            </CardBody>
            <Divider />
            <CardFooter>
              <Button size="sm">Install</Button>
            </CardFooter>
          </Card>
        </ListboxItem>
        <ListboxItem key="delete" className="text-danger" color="danger">
          Delete file
        </ListboxItem>
      </Listbox>
    </ListboxWrapper>
  );
}
