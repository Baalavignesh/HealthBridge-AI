import { Typography } from "@mui/material";

const UserInfoCard = ({ userInfo }: { userInfo: any }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
        <Typography
          variant="h4"
          className="text-3xl font-bold text-center text-gray-800 mb-6"
        >
          {userInfo.type} - {userInfo.user_name}
        </Typography>
        <Typography
          variant="h5"
          className="text-xl font-semibold text-center text-gray-700 mb-8"
        >
          Patient Information
        </Typography>
        <div className="space-y-4">
          {
            userInfo.type === "Doctor" && (
              <div className="flex items-center border-b border-gray-200 pb-3">
                <span className="text-gray-600 font-medium pr-4">Specialization:</span>
                <span className="text-gray-800">{userInfo.specialization}</span>
              </div>  
            )
          }
          {
            userInfo.type === "Patient" && (
              <div className="flex items-center border-b border-gray-200 pb-3">
            <span className="text-gray-600 font-medium w-24">Age:</span>
            <span className="text-gray-800">{userInfo.age}</span>
          </div>  
            )
          }
          
          {
            userInfo.type === "Doctor" && (
              <div className="flex items-center border-b border-gray-200 pb-3">
                <span className="text-gray-600 font-medium pr-4">Hospital:</span>
                <span className="text-gray-800">{userInfo.hospital}</span>
              </div>
            )
          }
          {
            userInfo.type === "Doctor" && (
              <div className="flex items-center border-b border-gray-200 pb-3">
                <span className="text-gray-600 font-medium pr-4">Hospital Location:</span>
                <span className="text-gray-800">{userInfo.hospitalLocation}</span>
              </div>
            ) 
          }
          {
            userInfo.type === "Patient" && (
              <div className="flex items-center border-b border-gray-200 pb-3">
            <span className="text-gray-600 font-medium w-24">Gender:</span>
            <span className="text-gray-800">{userInfo.gender}</span>
          </div>
            )
          }
          <div className="flex items-center border-b border-gray-200 pb-3">
            <span className="text-gray-600 font-medium w-24">Phone:</span>
            <span className="text-gray-800">{userInfo.mobile}</span>
          </div>
          <div className="flex items-center border-b border-gray-200 pb-3">
            <span className="text-gray-600 font-medium w-24">Email:</span>
            <span className="text-gray-800">{userInfo.email}</span>
          </div>
          {
            userInfo.type === "Patient" && (
              <div className="flex items-center">
                <span className="text-gray-600 font-medium w-24">Address:</span>
                <span className="text-gray-800">{userInfo.address}</span>
              </div>
            ) 
          }
        </div>
      </div>
    )
}
export default UserInfoCard;    