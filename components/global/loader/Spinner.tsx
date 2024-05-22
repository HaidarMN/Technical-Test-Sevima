const Spinner = () => {
  return (
    <div className="inset-0 flex h-full w-full items-center justify-center bg-black/25">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-slate-950"></div>
    </div>
  );
};

export default Spinner;
