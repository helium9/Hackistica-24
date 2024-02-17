import React from "react";
export const ListboxWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full h-max px-1 py-2 rounded-small overflow-auto scrollbar-hide">
    {children}
  </div>
);
