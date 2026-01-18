import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function Home() {
  const { user, setUser } = useContext(UserContext);

  return (
    <div className="page">
      <h2>Home</h2>
      <p>Current User: {user}</p>
      <button onClick={() => setUser("Darshit")}>
        Login as Darshit
      </button>
    </div>
  );
}
