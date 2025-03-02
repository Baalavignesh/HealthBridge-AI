import { Fade, Container, Card, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import RingLoader from "react-spinners/RingLoader";
import UserInfoCard from "../components/userInfoCard";
import NavBar from "../shared/navbar";
import { useNavigate } from "react-router-dom";

const Doctor: React.FC = () => {
  const navigate = useNavigate();

  let [loading, setLoading] = useState<boolean>(true);
  let [userInfo, setUserInfo] = useState<any>(null);

  const initializeUserInfo = async () => {
    const localUserInfo = localStorage.getItem("userinfo");
    if (localUserInfo) {
      const userInfo = JSON.parse(localUserInfo);
      setUserInfo(userInfo);
      console.log("userInfo", userInfo);
      setLoading(false);
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    initializeUserInfo();
  }, []);

  return (
    <Fade in={true} timeout={1000}>
      {loading ? (
        <div>
          <RingLoader color="#000000" size={20} />
        </div>
      ) : (
        <div>
          <NavBar />
          <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Card sx={{ padding: 4, backgroundColor: "#f5f5f5", boxShadow: 3 }}>
              <UserInfoCard userInfo={userInfo} />
            </Card>
            <Card sx={{ padding: 4, backgroundColor: "#f5f5f5", boxShadow: 1, mt: 2 }} >

              <Typography variant="h5" sx={{ fontWeight: "bold" }}>Active Patients</Typography>
              
            </Card>
          </Container>
        </div>
      )}
    </Fade>
  );
};

export default Doctor;
