import {useState} from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
	const { register, handleSubmit, formState: { errors, isSubmitting }, getValues } = useForm();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState(null)

	const onSubmit = async (data) => {
		if(isLoading){
            return
        }

        setIsLoading(true);
		try {
			const response = await axios.post("http://127.0.0.1:8000/api/register/", data);
			console.log("Success!", response.data);
			setSuccessMessage("Registration Successful!")
			setTimeout(() => {
				navigate('/login')
			}, 3000);
			} catch(error){
            console.log("Error during registration!", error.response?.data);
            if(error.response && error.response.data){
                Object.keys(error.response.data).forEach(field => {
                    const errorMessages = error.response.data[field];
                    if(errorMessages && errorMessages.length > 0){
                        setError(errorMessages[0]);
                    }
                })
            }
        }
		finally{
            setIsLoading(false)
        }
	};

	return (
		<div>
			<h2>Register:</h2>
			{error && <p style={{color:"red"}}>{error}</p>}
            { successMessage && <p style={{color:"green"}}>{successMessage}</p>}
			<form onSubmit={handleSubmit(onSubmit)}>
				<label>username:</label>
				<br />
				<input
					type="text"
					name="username"
					{...register("username", { required: "Username is required" })}
				></input>{" "}
				<br />
				{errors.username && <p style={{ color: "red" }}>{errors.username.message}</p>}
				<br />
				<label>email:</label>
				<br />
				<input
					type="email"
					name="email"
					{...register("email", { required: "Email is required" })}
				></input>{" "}
				<br />
				{errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
				<br />
				<label>password:</label>
				<br />
				<input
					type="password"
					name="password1"
					{...register("password1", { required: "Password is required" })}
				></input>{" "}
				<br />
				{errors.password1 && <p style={{ color: "red" }}>{errors.password1.message}</p>}
				<br />
				<label>confirm password:</label>
				<br />
				<input
					type="password"
					name="password2"
					{...register("password2", {
						required: "Please confirm your password",
						validate: (value) =>
							value === getValues("password1") || "The passwords do not match",
					})}
				></input>{" "}
				<br />
				{errors.password2 && <p style={{ color: "red" }}>{errors.password2.message}</p>}
				<br />
				<button type="submit" disabled={isSubmitting}>
					Register
				</button>
			</form>
		</div>
	);
}
