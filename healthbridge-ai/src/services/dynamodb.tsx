import axios from "axios"

const getInfo = async (email: string) => {
    const response = await axios.get(`http://localhost:8000/getInfo/${email}`)
    return response.data
}

const addUserEnquiry = async (userInfo: any, userEnquiryQuestions: any, aiEnquiryQuestions: any, recommendedDoctors: any, uuid: string) => {
    console.log(userInfo, userEnquiryQuestions, aiEnquiryQuestions, recommendedDoctors, uuid, 'called')
    const response = await axios.post("http://localhost:8000/addUserEnquiry", {userInfo, userEnquiryQuestions, aiEnquiryQuestions, recommendedDoctors, uuid})
    return response.data
}

export {getInfo, addUserEnquiry}
