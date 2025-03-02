import { useNavigate } from "react-router-dom";

const NavBar: React.FC  = () => {
  let navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="p-4 pl-24 pr-24 flex justify-between items-center bg-custom-black text-white">
      <h2 onClick={() => navigate("/")} className="cursor-pointer">
        HealthBridge AI
      </h2>
      <div className="flex gap-12">
        <h4 onClick={handleLogout} className="cursor-pointer">
          Logout
        </h4>
      </div>
    </div>
  );
};
export default NavBar;
