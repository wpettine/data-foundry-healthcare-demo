export default function ScreenContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-8 py-6 max-w-[1400px]">
      {children}
    </div>
  );
}
