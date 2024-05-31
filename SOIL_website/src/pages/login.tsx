import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface LoginProps {
    loginUser: (user: User) => void;
}

interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
}

export default function Login(props: LoginProps) {
    const navigate = useNavigate();
    const [fields, setFields] = useState({ email: "", password: "" });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Generic change handler.
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFields({ ...fields, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        try {
            const response = await axios.post<User | null>('http://localhost:4000/api/users/login', {
                email: fields.email,
                password: fields.password
            });

            const user = response.data;

            if (user === null) {
                // Login failed, reset password field to blank and set error message.
                setFields({ ...fields, password: "" });
                setErrorMessage("Email and/or password invalid, please try again.");
                return;
            }

            // Set user state.
            props.loginUser(user);

            // Navigate to the home page.
            navigate("/");
        } catch (error) {
            // Handle error.
            setErrorMessage("An error occurred. Please try again.");
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h1 className="text-center">Login</h1>
                    <hr />
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email" className="control-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="form-control"
                                value={fields.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" className="control-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                className="form-control"
                                value={fields.password}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group text-center">
                            <input type="submit" className="btn btn-primary" value="Login" />
                        </div>
                        {errorMessage !== null &&
                            <div className="form-group">
                                <span className="text-danger">{errorMessage}</span>
                            </div>
                        }
                    </form>
                </div>
            </div>
        </div>
    );
}
