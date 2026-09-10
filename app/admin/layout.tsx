

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<div className="flex flex-col bg-gray-200">

    <p className="w-full h-12 bg-emerald-600">AdminLayout</p>


        <main className="p-6">
          {children}
        </main>

 </div>

  
  );
}