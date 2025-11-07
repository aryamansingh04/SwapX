import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login by default
    navigate("/auth/login");
  }, [navigate]);

  return null;
};

export default Auth;
