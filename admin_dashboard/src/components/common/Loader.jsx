import { Loader2 } from "lucide-react";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
        <p className="text-sm text-slate-400">{text}</p>
      </div>
    </div>
  );
};

export default Loader;
