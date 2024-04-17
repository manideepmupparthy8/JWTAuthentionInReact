import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

export default function Login() {
  const { register, handleSubmit, formState: {errors,  isSubmitting } } = useForm();
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null)

  const onSubmit = async (formData) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login/", formData);
      console.log("Success!", response.data);
      setSuccessMessage("Login Successful!");
      localStorage.setItem("accessToken", response.data.tokens.access);
      localStorage.setItem("refreshToken", response.data.tokens.refresh);
    }  catch(error){
      console.log("Error during Login!", error.response?.data);
      if(error.response && error.response.data){
          Object.keys(error.response.data).forEach(field => {
              const errorMessages = error.response.data[field];
              if(errorMessages && errorMessages.length > 0){
                  setError(errorMessages[0]);
              }
          })
      }
  }
  };

  return (
    <div>
      {error && <p style={{color:"red"}}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      <h2>Login:</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Email:</label>
        <br />
        <input
          type="email"
          {...register("email", { required: "Email is required" })}
        />
        <br />
				{errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
				<br />
        <label>Password:</label>
        <br />
        <input
          type="password"
          {...register("password", { required: "Password is required" })}
        />
        <br />
        {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}
        <br />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
