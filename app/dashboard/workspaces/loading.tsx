export default function WorkspacesLoading() {
  return (
    <div className="flex flex-col p-6 gap-8 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-7 w-48 bg-surface-hover rounded-lg" />
        <div className="h-10 w-36 bg-surface-hover rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-surface-hover rounded-xl" />
        ))}
      </div>
    </div>
  );
}
