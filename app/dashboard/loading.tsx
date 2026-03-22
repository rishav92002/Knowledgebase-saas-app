export default function DashboardLoading() {
  return (
    <div className="flex flex-col p-6 gap-8 animate-pulse">
      <div className="h-8 w-64 bg-surface-hover rounded-lg" />
      <div className="flex gap-6">
        <div className="h-24 w-52 bg-surface-hover rounded-xl" />
        <div className="h-24 w-52 bg-surface-hover rounded-xl" />
      </div>
    </div>
  );
}
