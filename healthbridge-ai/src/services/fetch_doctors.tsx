import axios from "axios";

const fetchDoctors = async (paitent_issue: string[], user_location: string, email: string, name: string, userEnquiryQuestions: any, aiEnquiryQuestions: any) => {
    const paitent_issue_string = paitent_issue.join(" ");
    const response = await axios.post("http://localhost:8000/getDoctors", {
        paitent_issue: paitent_issue_string,
        user_location: user_location,
        email: email,
        name: name,
        userEnquiryQuestions: userEnquiryQuestions,
        aiEnquiryQuestions: aiEnquiryQuestions
    });
    return response.data;
}   

export default fetchDoctors;    