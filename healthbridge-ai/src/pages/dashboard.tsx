import { useEffect } from "react";
import { Container, Fade } from "@mui/material";
import NavBar from "../shared/navbar";

const Dashboard : React.FC =() => {
  useEffect(() => {
    console.log('dashboard screen');
  }, [])

  return (
    <div>
      <NavBar />
      <Fade in={true} timeout={1500}>
      <Container maxWidth="xl">
      <h1 className="mt-8 mb-8">Dashboard Screen</h1>


      </Container>
      </Fade>


    </div>
  );
};

export default Dashboard;
