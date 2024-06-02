import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setCurrentUser, User } from "../data/repository";
import { useToast } from "@chakra-ui/react";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [fields, setFields] = useState({ email: "", password: "" });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const toast = useToast();
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
                setFields({ ...fields, password: "" });
                setErrorMessage("Email and/or password invalid, please try again.");
                return;
            }

            setCurrentUser(user);
            navigate("/");
            toast({
                title: "Login successful, welcome back!",
                status: "success",
                duration: 2500,
                isClosable: true,
            })
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                setErrorMessage("You have been blocked by the admin.");
            } else {
                setErrorMessage("An error occurred. Please try again.");
            }
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
                        {errorMessage !== null && (
                            <div className="form-group">
                                <span className="text-danger">{errorMessage}</span>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
