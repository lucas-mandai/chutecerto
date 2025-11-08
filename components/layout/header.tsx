import { getUser } from "@/lib/actions/auth";
import { UserMenu } from "./user-menu";

export async function Header() {
  const user = await getUser();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Chute Certo</h1>
        {user && <UserMenu user={user} />}
      </div>
    </header>
  );
}
