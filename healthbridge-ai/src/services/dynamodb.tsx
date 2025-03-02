import axios from "axios"

const getInfo = async (email: string) => {
    const response = await axios.get(`http://localhost:8000/getInfo/${email}`)
    return response.data
}

export default getInfo
