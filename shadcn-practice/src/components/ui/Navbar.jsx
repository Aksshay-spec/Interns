import { useState } from "react";
import { useLogout } from "../../hooks/useLogout";
import { useNavigate , Link } from "react-router-dom";
import { useUsers } from "../../hooks/useUser";


const Navbar = () => {
    const navigate = useNavigate();
  const [open, setOpen] = useState(false);
   const { mutate} = useLogout();
   const {data} = useUsers();

   const user = data?.data?.user || data?.data;
  const handleLogout = () => {
    mutate(null, {
      onSuccess: () => {
        navigate("/login");
      },
    });
  };

  return (
   <nav className="w-full h-16  bg-slate-800 text-white flex items-center px-6">
  
  {/* Left */}
  <h1 className="text-xl font-semibold">MyApp</h1>

  {/* Right */}
  <div className="ml-auto flex items-center gap-6">
    
    <Link to="/" className="hover:text-amber-400 transition">
      Home
    </Link>

    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <img
        src={user?.imageUrl || "/avatar-holder.avif"}
        alt="profile"
        className="w-10 h-10 rounded-full cursor-pointer border-2 border-slate-600"
      />

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-slate-700 rounded-md shadow-lg overflow-hidden">
          <Link
            to="/profile"
            className="block text-amber-50 px-4 py-2 hover:bg-slate-800/60 transition"
          >
            Edit Profile
          </Link>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 hover:bg-slate-800/60 transition text-red-500"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  </div>
</nav>

  );
};

export default Navbar;
