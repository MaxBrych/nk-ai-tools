import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ToolProps, tools } from "./Tools";

interface ToolPageProps {
  tool: ToolProps;
}

const Subheader: React.FC<ToolPageProps> = ({ tool }) => {
  return (
    <header className="flex items-center justify-between w-full px-4 bg-white border-b lg:max-w-5xl h-14 lg:rounded-t-lg border-dark-95 sm:px-4">
      <Link
        href={"/"}
        className="flex items-center justify-center border rounded-full h-9 w-9 border-dark-90 md:w-11 md:h-11"
      >
        <Image
          src={"/../public/icons/chevron.png"}
          width={24}
          height={24}
          alt={""}
        />
      </Link>

      <h1 className="ml-2 font-bold tracking-tight text-md sm:text-lg">
        {tool.name}
      </h1>

      <div></div>
    </header>
  );
};

export default Subheader;