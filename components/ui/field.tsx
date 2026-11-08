export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[0.68rem] uppercase tracking-[0.22em] text-espresso/60">{label}</span>
      {children}
      {error ? <span className="mt-2 block text-sm text-red">{error}</span> : null}
    </label>
  );
}
