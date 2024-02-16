import React, { ReactNode } from "react";

type ListboxWrapperProps = {
  children: ReactNode;
};

export const ListboxWrapper = ({ children }: ListboxWrapperProps) => (
  <div className="w-full max-w-[260px] px-1 py-2 ">{children}</div>
);
