import React from "react";
import {
  Accordion,
  AccordionItem,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";
import { useState } from "react";
import { ListboxWrapper } from "./ListboxWrapper";
import DescriptionIcon from "@mui/icons-material/Description";

export default function Filemanager() {
  return (
    <Accordion variant="shadow">
      <AccordionItem key="1" aria-label="Accordion 1" title="Folder 1">
        <ListboxWrapper>
          <Listbox aria-label="Actions" onAction={(key) => alert(key)}>
            <ListboxItem key="file1">
              <div className="flex items-center gap-2">
                <DescriptionIcon />
                File1.txt
              </div>
            </ListboxItem>
            <ListboxItem key="file2">
              <div className="flex items-center gap-2">
                <DescriptionIcon />
                File2.txt
              </div>
            </ListboxItem>
            <ListboxItem key="file3">
              <div className="flex items-center gap-2">
                <DescriptionIcon />
                File3.txt
              </div>
            </ListboxItem>
          </Listbox>
        </ListboxWrapper>
      </AccordionItem>
    </Accordion>
  );
}
