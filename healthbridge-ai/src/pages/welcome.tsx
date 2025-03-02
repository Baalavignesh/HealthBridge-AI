import { useEffect } from "react";
//Change the name after vanta. based on the vanta.d.ts
import { Fade, Card, CardContent, Typography, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Welcome:React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("login screen");
  }, []);

  return (
    <div className="bg-white" >
      <Fade in={true} timeout={1000}>
        <div className="px-12 pt-12 h-screen text-gray-800 flex flex-col items-center justify-center">
          <h1 className="text-6xl font-bold mb-8 text-center">Welcome to AnyHealth</h1>
          <Grid 
            container 
            spacing={4} 
            justifyContent="center" 
            alignItems="center" 
            style={{ minHeight: '40vh' }}
          >
            <Grid item xs={12} md={6}>
              <Card 
                onClick={() => {
                  localStorage.setItem("usertype", "Patient");
                  navigate("/login");
                }}
                className="flex flex-col items-center justify-center h-full"
                sx={{ 
                  cursor: 'pointer',
                  minHeight: '300px',
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    transform: 'scale(1.02)',
                    transition: 'all 0.3s ease-in-out'
                  }
                }}
              >
                <CardContent className="flex flex-col items-center justify-center h-full">
                  <Typography variant="h4" component="div" color="black">
                    Patient
                  </Typography>
                  <Typography variant="body1" color="gray" sx={{ mt: 2 }}>
                    Click to access patient portal
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card 
                onClick={() => {
                  localStorage.setItem("usertype", "Doctor");
                  navigate("/login");
                }}  
                className="flex flex-col items-center justify-center h-full"
                sx={{ 
                  cursor: 'pointer',
                  minHeight: '300px',
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    transform: 'scale(1.02)',
                    transition: 'all 0.3s ease-in-out'
                  }
                }}
              >
                <CardContent className="flex flex-col items-center justify-center h-full">
                  <Typography variant="h4" component="div" color="black">
                    Doctor
                  </Typography>
                  <Typography variant="body1" color="gray" sx={{ mt: 2 }}>
                    Click to access doctor portal
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      </Fade>
    </div>
  );
};

export default Welcome;
