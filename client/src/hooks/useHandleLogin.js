import toast from "react-hot-toast";
import getBaseURL from "../utils/config";
import { useNavigate } from "react-router-dom";

const useHandleLogin = ({setAuth, from}) => {
  const baseURL = getBaseURL();
  const navigate = useNavigate();
  
  const handleResponse = async (response, navigatePath) => {
    try {
      const parseRes = await response.json();

      if (response.ok && parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        setAuth(true);
        toast.success("Login successfully");
        navigate(navigatePath);
      } else {
        setAuth(false);
        toast.error(parseRes.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Error parsing response:", error.message);
      toast.error("An error occurred while processing the response.");
    }
  };

  const handleGoogleLogin = async (values) => {
    try {
      const { clientId, credential, select_by } = values;
      if (credential) {
        const response = await fetch(`${baseURL}/auth/login/google`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            googleCredential: credential,
          }),
        });
        await handleResponse(response, from);
      }
    } catch (error) {
      console.error(error.message);
      toast.error("An error has occured during Google Login.");
    }
  };

  return { handleResponse, handleGoogleLogin };
};

export default useHandleLogin;