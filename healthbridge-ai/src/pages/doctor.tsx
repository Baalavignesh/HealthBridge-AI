import {
  Fade,
  Container,
  Card,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import RingLoader from "react-spinners/RingLoader";
import UserInfoCard from "../components/userInfoCard";
import NavBar from "../shared/navbar";
import { useNavigate } from "react-router-dom";
import { fetchActivePatients } from "../services/dynamodb";

const Doctor: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedPaitent, setSelectedPaitent] = useState<any>(null);

  const handleDialogOpen = (paitent: any) => {
    setSelectedPaitent(paitent);
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  let [loading, setLoading] = useState<boolean>(true);
  let [userInfo, setUserInfo] = useState<any>(null);
  let [paitentData, setPaitentData] = useState<any[]>([]);

  const initializeUserInfo = async () => {
    const localUserInfo = localStorage.getItem("userinfo");
    if (localUserInfo) {
      const userInfo = JSON.parse(localUserInfo);
      setUserInfo(userInfo);
      console.log("userInfo", userInfo);
      let paitentDataResponse = await fetchActivePatients(userInfo.email);
      console.log("paitentData", paitentDataResponse);
      setPaitentData(paitentDataResponse);
      console.log("paitentData", paitentData);
      setLoading(false);
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    initializeUserInfo();
    console.log("userInfo", userInfo);
  }, []);

  const handleEmergency = (patient: any) => {
    console.log('Emergency suggested for patient:', patient);
  };

  const handleGuideUser = (patient: any) => {
    console.log('Guiding patient:', patient);
  };

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
            <Card
              sx={{
                padding: 4,
                backgroundColor: "#f5f5f5",
                boxShadow: 1,
                mt: 2,
              }}
            >
              <div className="bg-white shadow-md rounded-lg p-4">
                <h5 className="font-bold text-lg my-4">Active Patients</h5>
                <div className="space-y-2 w-56">
                  {paitentData.length > 0 && <div>
                    {
                      paitentData[1].map((paitent: any) => (
                        <div
                          className="border p-2 rounded-md"
                          key={paitent.email}
                          onClick={() => handleDialogOpen(paitent)}
                        >
                          <p className="font-bold text-lg">{paitent.user_name}</p>
                          <p>{paitent.age}</p>
                          <p>{paitent.mobile}</p>
                          <p>{paitent.address}</p>
                        </div>
                      ))
                    }
                  </div>
                  
                  }
                </div>
              </div>
              <Dialog open={open} onClose={handleDialogClose}>
                <DialogTitle>Patient Information</DialogTitle>
                <DialogContent>
                  <UserInfoCard userInfo={selectedPaitent} />
                  {
                    paitentData.length > 0 && <div>
                    {paitentData[0].map((paitent: any, index: number) => {
                      return (
                        <div className="border p-2 rounded-md flex flex-col gap-2" key={index}>
                          <div className="font-bold">
                            User Concern {index + 1}
                          </div>
                          <div>
                            {paitent.user_enquiry_questions.map(
                              (question: any, index: number) => {
                                return <div key={index}>{index + 1}. {question}</div>;
                              }
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  }
                  {paitentData.length > 0 && paitentData[0].map((paitent: any, index: number) => {
                    return (
                      <div className="border p-2 rounded-md flex flex-col gap-2" key={index}>
                        <p className="font-bold">
                          AI Enquiry Questions/Response {index + 1}
                        </p>
                        <p>
                          {paitent.ai_enquiry_questions.map(
                            (question: any, index: number) => {
                              return <div key={index}>{index + 1}. {question}</div>;
                            }
                          )}
                        </p>
                      </div>
                    );
                  })}
                  <div className="flex gap-2 mt-4">
                    <button 
                      className="bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
                      onClick={() => handleEmergency(paitentData[1][selectedPaitent.email])}
                    >
                      Suggest Emergency
                    </button>
                    <button 
                      className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
                      onClick={() => handleGuideUser(paitentData[1][selectedPaitent.email])}
                    >
                      Guide User
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            </Card>
          </Container>
        </div>
      )}
    </Fade>
  );
};

export default Doctor;
