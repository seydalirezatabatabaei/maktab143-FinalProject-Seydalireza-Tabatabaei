export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div >
   
    <p className="w-full bg-blue-200 h-12">ApplicationLayout</p>
      <main className=" p-3 w-full bg-amber-100">
        {children}
      </main>

  
    </div>
  );
}