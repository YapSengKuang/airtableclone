import Link from "next/link";
import { getUserBases } from "~/server/queries/getUserBases";

export default async function BaseCards() {
  const bases = await getUserBases();

  if (!bases.length) {
    return (
      <div className="text-gray-500 text-center py-10">
        You haven’t created any bases yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {bases.map((base) => (
        <Link
          key={base.id}
          href={`/base/${base.id}`}
          className="border rounded-xl p-6 shadow-sm hover:shadow-md transition bg-white"
        >
          <h2 className="text-xl font-semibold">{base.base_name}</h2>
          <p className="text-sm text-gray-500 mt-2">
            Base ID: {base.id}
          </p>
        </Link>
      ))}
    </div>
  );
}
