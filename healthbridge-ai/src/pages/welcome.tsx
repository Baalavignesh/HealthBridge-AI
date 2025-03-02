import { useEffect } from "react";
//Change the name after vanta. based on the vanta.d.ts
import { Fade, Card, CardContent, Typography, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Welcome:React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("login screen");
    navigate("/login");
  }, []);

  return (
    <div className="bg-white" >

    </div>
  );
};

export default Welcome;
