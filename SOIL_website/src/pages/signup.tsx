import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@chakra-ui/react"; 

interface SignupProps {
    loginUser: (user: User) => void;
}

interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
}

const Signup: React.FC<SignupProps> = ({ loginUser }) => {
    const navigate = useNavigate();
    const toast = useToast();
    const [fields, setFields] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFields({ ...fields, [event.target.name]: event.target.value });
    };

    const validateEmail = (email: string): boolean => {
        var emailRegex = /^\S+@\S+\.\S+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string): boolean => {
        var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const { firstName, lastName, email, password, confirmPassword } = fields;

        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            setErrorMessage("All fields are required.");
            return;
        }

        if (!validateEmail(email)) {
            setErrorMessage("Invalid email address.");
            return;
        }

        if (!validatePassword(password)) {
            setErrorMessage("Password must contain at least one lowercase letter, one uppercase letter, one number, one special character, and at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.post<User>('http://localhost:4000/api/users/signup', {
                first_name: firstName,
                last_name: lastName,
                email,
                password
            });

            const user = response.data;
            loginUser(user);

            toast({
                title: 'Sign up successful!',
                status: 'success',
                duration: 2500,
            });

            navigate("/");
        } catch (error) {
            setErrorMessage("An error occurred. Please try again.");
        }
    };

    const handleCancel = () => {
        navigate("/");
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h1 className="text-center">Sign Up</h1>
                    <hr />
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="firstName" className="control-label">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                id="firstName"
                                className="form-control"
                                value={fields.firstName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName" className="control-label">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                id="lastName"
                                className="form-control"
                                value={fields.lastName}
                                onChange={handleInputChange}
                            />
                        </div>
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
                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="control-label">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                className="form-control"
                                value={fields.confirmPassword}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group text-center">
                            <input type="submit" className="btn btn-primary" value="Sign Up"/>
                            <button type="button" className="btn btn-secondary ml-12" onClick={handleCancel}>Cancel
                            </button>
                        </div>
                        {errorMessage && (
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

export default Signup;
