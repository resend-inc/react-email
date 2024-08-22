import { MousePointer2Icon } from "lucide-react";

const IllustrationButtons: React.FC = () => (
  <div className="relative flex h-6 w-[24%] items-center justify-center rounded-sm bg-[#236380] p-1 shadow-sm transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:rotate-6">
    <div className="h-2 w-[80%] rounded-sm bg-black/30" />
    <MousePointer2Icon
      className="absolute -bottom-4 left-[80%]"
      fill="currentColor"
      stroke="currentColor"
    />
  </div>
);

export default IllustrationButtons;
