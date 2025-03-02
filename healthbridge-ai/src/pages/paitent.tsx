import React, { useState, useEffect, useRef } from "react";
import NavBar from "../shared/navbar";
import { Container, Card, Typography, Fade } from "@mui/material";
import OpenAI from "openai";
import UserInfoCard from "../components/userInfoCard";
import { createThread, runThread } from "../services/assistant";
import TranslateService from "../services/translation";
import RingLoader from "react-spinners/RingLoader";
import { useNavigate } from "react-router-dom";
import fetchDoctors from "../services/fetch_doctors";

const Patient: React.FC = () => {
  const chunksRef = useRef<BlobPart[]>([]);

  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [isListening, setIsListening] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [threadId, setThreadId] = useState<string>("");
  const [sourceLanguage, setSourceLanguage] = useState("ta");

  const [userResponse, setUserResponse] = useState<string[]>([]);
  const [translatedUserText, setTranslatedUserText] = useState<string[]>([]);
  const [aiResponse, setAiResponse] = useState<string[]>([]);
  const [translatedAiText, setTranslatedAiText] = useState<string[]>([]);

  const [aiLoader, setAiLoader] = useState(false);

  const transcribeAudio = async (responseNumber: number) => {
    console.log("transcribeAudio");
    if (!audioBlob) return;

    let client = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    try {
      const res = await client.audio.transcriptions.create({
        model: "whisper-1",
        file: new File([audioBlob], "audio.webm", { type: "audio/webm" }),
        language: sourceLanguage,
        response_format: "json",
      });

      setUserResponse((prev) => [...prev, res.text]);

      const translatedUserText = await TranslateService(res.text, "en");
      if (translatedUserText) {
        setTranslatedUserText((prev) => [...prev, translatedUserText]);
      }

      // Loading state for AI response
      setAiResponse((prev) => [...prev, " "]);
      setAiLoader(true);

      let aiResponse = await runThread(
        threadId,
        res.text, // Pass the transcribed text,
        responseNumber
      );
      console.log("aiResponse", aiResponse);
      if (aiResponse) {
        // Check if aiResponse is defined

        setAiResponse((prev) => {
          const newResponses = [...prev];
          newResponses.pop(); // Remove the last element
          newResponses.push(aiResponse); // Append the new response
          return newResponses;
        });
        const translatedAiText = await TranslateService(aiResponse, "en");
        if (translatedAiText) {
          setTranslatedAiText((prev) => [...prev, translatedAiText]);
        }
        setAiLoader(false);
      }

      // // Start the assistant stream with the transcribed text
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const recordAudio = async () => {
    if (!isListening) {
      if (threadId === "") {
        let threadId = await createThread();
        setThreadId(threadId);
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        chunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          setAudioBlob(blob);
          chunksRef.current = [];
        };

        mediaRecorder.start();
        setIsListening(true);
      } catch (error) {
        console.error("Error accessing microphone:", error);
        alert(
          "Error accessing microphone. Please ensure microphone permissions are granted."
        );
      }
    } else {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      }
      setIsListening(false);
    }
  };

  useEffect(() => {
    if (audioBlob) {
      transcribeAudio(aiResponse.length);
    }
  }, [audioBlob]);

  useEffect(() => {
    initializeUserInfo();
    const language = localStorage.getItem("language");
    if (language) {
      setSourceLanguage(language);
    }

    if (threadId === "") {
      createThread();
    }
  }, []);

  useEffect(() => {
    if(translatedUserText.length === 3 && translatedAiText.length === 3){

      console.log("all responses are done");
      // create user enquiry questions and ai enquiry questions
      let userEnquiryQuestions: any = {};
      let aiEnquiryQuestions: any = {};
      for(let i = 0; i < userResponse.length; i++){
        userEnquiryQuestions[userResponse[i]] = translatedUserText[i];
        aiEnquiryQuestions[aiResponse[i]] = translatedAiText[i];
      }

      // fetch doctors
      console.log(translatedUserText, userInfo.address)
      fetchDoctors(translatedUserText, userInfo.address, userInfo.email, userInfo.user_name, userEnquiryQuestions, aiEnquiryQuestions).then((response) => {
        console.log("response", response);
        let recommendedDoctors: any = response.doctors;
        // let uuid: string = response.uuid;
        console.log("recommendedDoctors", recommendedDoctors);


        // addUserEnquiry(userInfo, userEnquiryQuestions, aiEnquiryQuestions, recommendedDoctors, uuid);
      });
    }
  }, [translatedAiText]);
  

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

              <div className="flex flex-col items-center gap-4 mt-4">
                <button
                  onClick={recordAudio}
                  disabled={userResponse.length === 3}
                  className={`m-2 p-2 transition-all duration-300 text-white rounded ${
                    userResponse.length === 3
                      ? "bg-gray-500"
                      : isListening
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {isListening ? "Stop Recording" : "Start Recording"}
                </button>
              </div>

              <div className="flex flex-row gap-4">
                <div className="bg-white p-4 rounded-lg w-1/2">
                  <Typography variant="h5" align="center" gutterBottom>
                    User Response
                  </Typography>
                  <div className="flex flex-col gap-2">
                    {userResponse.map((text, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-2 bg-gray-100 p-4 rounded-lg"
                      >
                        <Typography
                          key={index}
                          variant="body1"
                          className="text-lg font-bold"
                        >
                          {text}
                        </Typography>
                        <Typography
                          variant="body1"
                          className="text-lg font-bold"
                        >
                          {translatedUserText[index]}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg w-1/2">
                  <Typography variant="h5" align="center" gutterBottom>
                    AI Helper
                  </Typography>
                  <div className="flex flex-col gap-2">
                    {aiResponse.map((text, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-2 bg-gray-100 p-4 rounded-lg"
                      >
                        {index === aiResponse.length - 1 && aiLoader ? (
                          <div className="flex justify-center items-center">
                            <RingLoader color="#000000" size={20} />
                          </div>
                        ) : (
                          <div>
                            <Typography variant="body1" className="text-lg">
                              {text}
                            </Typography>
                            <Typography variant="body1" className="text-lg">
                              {translatedAiText[index]}
                            </Typography>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </Container>
        </div>
      )}
    </Fade>
  );
};

export default Patient;
