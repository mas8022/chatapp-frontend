const Loader = () => {
  return (
    <div className="space-y-3 p-3">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-2xl p-3 animate-pulse bg-white/3"
        >
          <div className="size-12 rounded-full bg-zinc-700/50 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 rounded bg-zinc-700/50" />
            <div className="h-3 w-2/3 rounded bg-zinc-700/30" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loader;
