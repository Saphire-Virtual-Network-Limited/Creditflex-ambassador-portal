
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white flex w-full">
      <div className="flex w-full">
        <div className="bg-[red] border border-[#EFEEEE] h-full">
          {/* <Nav /> */}
          <h1>SAY CHEESEE</h1>
        </div>
        <div className="w-full">
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
