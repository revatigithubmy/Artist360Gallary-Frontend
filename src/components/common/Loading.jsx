import { Loader2 } from 'lucide-react';

const Loading = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] w-full gap-4">
    <Loader2 className="w-12 h-12 text-violet-500 animate-spin" />
    <p className="text-slate-400 text-sm font-medium animate-pulse">Fetching Masterpieces...</p>
  </div>
);

export default Loading;