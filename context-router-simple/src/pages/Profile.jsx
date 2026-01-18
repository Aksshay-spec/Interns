import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function Profile() {
  const { user } = useContext(UserContext);

  return (
    <div className="page">
      <h2>Profile</h2>
      <p>Welcome, {user}</p>
    </div>
  );
}
