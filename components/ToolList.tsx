import { tools, ToolProps } from "./Tools";
import Link from "next/link";
import Image from "next/image";

interface ToolListProps {
  tools: ToolProps[];
}

const ToolList: React.FC<ToolListProps> = ({ tools }) => (
  <>
    <div className="grid w-full grid-cols-3 px-4 py-4 md:space-x-4 md:space-y-4">
      {tools.map((tool) => (
        <Link
          href="/tools/[slug]"
          as={`/tools/${tool.slug}`}
          key={tool.id}
          className="flex flex-col items-center justify-center h-full gap-2 p-2 cursor-pointer md:p-4 md:justify-start md:items-start md:border md:border-dark-95 md:hover:bg-dark-99 rounded-xl"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-xl md:rounded-lg bg-cyan-95">
            <Image src={tool.icon} alt={tool.name} width={32} height={32} />
          </div>
          <div>
            <h1 className="text-sm font-semibold leading-4 md:text-base md:text-left">
              {tool.name}
            </h1>
            <p className="invisible text-sm md:text-left md:visible">
              {tool.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  </>
);

export default ToolList;