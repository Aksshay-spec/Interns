import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUsers } from "../hooks/useUser";


const Home = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useUsers();

   useEffect(() => {
    if (!isLoading && isError) {
      navigate("/login");
    }
  }, [isLoading, isError, navigate]);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <p className="text-slate-300 text-lg">
          Loading users...
        </p>
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <p className="text-red-400">
          Failed to load user
        </p>
      </div>
    );

  return  (
    <div className="min-h-screen bg-[#0f172a] p-6">
      
      <div className="max-w-4xl mx-auto bg-slate-900/70 backdrop-blur
                      border border-slate-800 rounded-xl shadow-lg">
        <ul className="divide-y divide-slate-800">
        
            <li
              
              className="px-6 py-4 hover:bg-slate-800/60 transition"
            >
              <p className="text-slate-200">
                {data.data.user.userName}
              </p>
            </li>
          
        </ul>
      </div>
    </div>
  );
};

export default Home;
