export default function ProfileLayout({
  children,
  following,
}: {
  children: React.ReactNode;
  following: React.ReactNode;
}) {
  return (
    <div className=" px-4">
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Following sidebar */}
        <aside className="lg:col-span-5">
          <div className="bg-white rounded-lg shadow p-6 ">{following}</div>
        </aside>
        {/* Main profile content */}
        <div className="lg:col-span-7 space-y-6">{children}</div>

      </div>
    </div>
  );
}
