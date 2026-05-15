export function MockModeNotice() {
  return (
    <div className="rounded border border-[#d4c4ac] bg-[#f7f4e9] p-4 text-sm text-[#504533]">
      <p className="font-semibold tracking-[0.08em] text-[#1c1c15] uppercase">Preview Notice</p>
      <p className="mt-1">
        Cart interactions are available for preview. Orders and payment are not processed in this build.
      </p>
    </div>
  );
}
