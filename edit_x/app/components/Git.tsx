import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Button,
} from "@nextui-org/react";

interface Props {
  name: string;
  age: number;
}

export default function Git() {
  return (
    <Card className="max-w-[400px]">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-md">Github</p>
          <p className="text-small text-default-500">github.com</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <Button color="primary" variant="bordered">
          Version Control
        </Button>
      </CardBody>
      <Divider />
      <CardFooter></CardFooter>
    </Card>
  );
}
