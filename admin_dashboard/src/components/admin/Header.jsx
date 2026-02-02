import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback , AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { SidebarContent } from "./Sidebar";
import { useLogout } from "../../hooks/mutations/useLogout";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useMe } from "../../hooks/queries/useMe";

const Header = () => {
  const navigate = useNavigate();
  const { data } = useMe();
  const user = data?.data?.user || data?.data;

  // React Query logout hook
  const { mutate: logout, isPending } = useLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: (res) => {
        toast.success(res.data.message);
        navigate("/login");
      },
      onError: () => {
        toast.error("Logout failed. Please try again.");
      },
    });
  };

  return (
    <header className="h-14 bg-slate-900 text-white flex items-center justify-between px-4 lg:px-6">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <button className="lg:hidden">
              <Menu />
            </button>
          </SheetTrigger>

          {/* Mobile sidebar */}
          <SheetContent side="top" className="p-4 bg-slate-900 text-white">
            <h2 className="mb-4 font-semibold">Admin Dashboard</h2>
            <SidebarContent />
          </SheetContent>
        </Sheet>

        <h1 className="text-lg font-semibold hidden sm:block">
          Admin Dashboard
        </h1>
      </div>

      {/* Right side */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar>
            <AvatarImage src={user?.imageUrl || "/default-avatar.png"} />
            <AvatarFallback>{user?.userName?.charAt(0) || "A"}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => navigate("/admin/profile")}
          >Edit Profile</DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleLogout}
            disabled={isPending}
            className="text-red-500 focus:text-red-500"
          >
            {isPending ? "Logging out..." : "Logout"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default Header;
