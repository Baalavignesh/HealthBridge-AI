import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loading from "../shared/loading";

const withAuth = (WrappedComponent: React.ComponentType<any>) => {
  return (props: any) => {

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    useEffect(() => {
      const localUser = localStorage.getItem("userinfo");
      if (!localUser) {
        navigate("/");
      }
      setLoading(false);
    }, []);


    if (loading) {
      return (
        <div className="h-screen flex justify-center items-center bg-custom-black">
          <Loading />
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
