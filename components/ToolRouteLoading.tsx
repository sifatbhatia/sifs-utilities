export default function ToolRouteLoading() {
  return (
    <main className="min-h-dvh bg-background p-safe-page relative overflow-hidden flex flex-col">
      <div className="max-w-[1760px] mx-auto w-full flex-1 flex flex-col">
        <div className="h-11 w-36 rounded-xl bg-black/5 animate-pulse" />
        <div className="mt-3 space-y-3">
          <div className="h-14 w-64 rounded-2xl bg-black/5 animate-pulse sm:h-20 sm:w-96" />
          <div className="h-7 w-72 rounded-xl bg-black/5 animate-pulse sm:w-[32rem]" />
        </div>
        <div className="mt-4 flex-1 min-h-[24rem] rounded-2xl border border-black/5 bg-black/[0.03] animate-pulse" />
      </div>
    </main>
  );
}
