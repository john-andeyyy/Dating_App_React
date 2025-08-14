import React, { useState } from "react";
import { Navigate, useNavigate } from 'react-router';
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const Baseurl = import.meta.env.VITE_BASEURL;
    const { user } = useAuth();

    if (user) {
        return <Navigate to="/Home" replace />;
    }

    const [isLogin, setIsLogin] = useState(true);
    const [registerWith, setRegisterWith] = useState("email");
    const [errorMsg, seterrorMsg] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: "johnx3216@gmail.com",
        shortBio: "",
        Birthday: "",
        email: "johnx3216@gmail.com",
        Password: "johnx3216@gmail.com",
        Phonenumber: "",
    });

    const cleanform = () => {
        setFormData({
            name: "",
            shortBio: "",
            Birthday: "",
            email: "",
            mobile: "",
            Password: "",
            Phonenumber: "",
        });
        seterrorMsg('')
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const [profileImageFile, setProfileImageFile] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(URL.createObjectURL(file));
            setProfileImageFile(file);
        }
    };


    const { login } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLogin) {
            try {
                const res = await axios.post(`${Baseurl}/user/auth/login`, {
                    Username: formData.name,
                    Password: formData.Password
                });


                if (res.status === 200) {
                    // alert(res.data.message || "Login successful");
                    localStorage.setItem("userId", res.data.Data._id);
                    localStorage.setItem("username", res.data.Data.Username);;
                    navigate('/Home');
                    await login();
                }
                navigate("/Home");
            } catch (err) {
                if (err.response) {
                    seterrorMsg(err.response.data.message || "Sign-Up failed");
                } else {
                    alert("Network error. Please try again.");
                }
                console.error("Login error:", err);
            }
        }
        else {
            try {
                const formDataToSend = new FormData();
                formDataToSend.append("Username", formData.email);
                formDataToSend.append("Name", formData.name);
                formDataToSend.append("Password", formData.Password);
                formDataToSend.append("Phonenumber", formData.Phonenumber);
                formDataToSend.append("Birthday", formData.Birthday);
                formDataToSend.append("bio", formData.shortBio);


                if (profileImageFile) {
                    formDataToSend.append("Image", profileImageFile);
                }

                const res = await axios.post(`${Baseurl}/user/auth/signup`, formDataToSend, {
                    headers: { "Content-Type": "multipart/form-data" }
                });

                alert(res.data.message);
                setIsLogin(true);
                cleanform()
            } catch (err) {
                if (err.response) {
                    seterrorMsg(err.response.data.message);
                } else {
                    alert("Network error. Please try again.");
                }
                console.error("Sign-Up error:", err);
            }
        }


    };


    return (
        <div className="hero min-h-screen">
            <div className="hero-content flex-col">
                <div className="card w-full max-w-2xl shadow-2xl rounded-2xl p-8">
                    <h1 className="text-3xl font-bold text-center mb-2">
                        {isLogin ? "Login" : "New User Sign-Up"}
                    </h1>
                    <p className="text-center text-gray-500 mb-6">
                        {isLogin
                            ? "Access your account"
                            : `Register using your ${registerWith}`}
                    </p>
                    <p className={`text-red-600 text-center transition-opacity duration-300 ${errorMsg ? 'opacity-100' : 'opacity-0'}`}>
                        {errorMsg}
                    </p>


                    {!isLogin && (
                        <div className="flex justify-center gap-4 mb-4">
                            <button
                                type="button"
                                className={`btn btn-sm ${registerWith === "email" ? "btn-neutral" : "btn-outline"
                                    }`}
                                onClick={() => setRegisterWith("email")}
                            >
                                Email
                            </button>
                            <button
                                type="button"
                                className={`btn btn-sm ${registerWith === "mobile" ? "btn-neutral" : "btn-outline"
                                    }`}
                                onClick={() => setRegisterWith("mobile")}
                            >
                                Mobile
                            </button>
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        {isLogin ? (
                            <>
                                <div className="md:col-span-2">
                                    <label className="label font-semibold">Email/Phone Number</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="input input-bordered w-full"
                                        placeholder="Enter Email/Phone Number"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="label font-semibold">Password</label>
                                    <input
                                        type="password"
                                        name="Password"
                                        className="input input-bordered w-full"
                                        placeholder="Enter Password"
                                        value={formData.Password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="md:col-span-2">
                                    <label className="label font-semibold">
                                        {registerWith === "email" ? "Email" : "Mobile Number"}
                                    </label>
                                    <label className="label font-semibold">
                                        {registerWith === "email" ? "Email" : "Mobile Number"}
                                    </label>
                                    <input
                                        type={registerWith === "email" ? "email" : "tel"}
                                        name={registerWith === "email" ? "email" : "mobile"}
                                        className="input input-bordered w-full"
                                        placeholder={`Enter your ${registerWith === "email" ? "email" : "mobile number"}`}
                                        value={registerWith === "email" ? formData.email : formData.mobile}
                                        onChange={(e) => {
                                            if (registerWith === "email") {
                                                setFormData({ ...formData, email: e.target.value });
                                            } else {
                                                setFormData({
                                                    ...formData,
                                                    mobile: e.target.value.replace(/\D/g, "") // only numbers
                                                });
                                            }
                                        }}
                                        {...(registerWith !== "email" && {
                                            pattern: "[0-9]{11}",
                                            maxLength: 11,
                                            inputMode: "numeric"
                                        })}
                                        required
                                    />


                                    <div>
                                        <label className="label font-semibold">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="input input-bordered w-full"
                                            placeholder="Enter your name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="label font-semibold">Password</label>
                                    <input
                                        type="password"
                                        name="Password"
                                        className="input input-bordered w-full"
                                        placeholder="Enter password"
                                        value={formData.Password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label font-semibold">Birthday</label>
                                    <input
                                        type="date"
                                        name="Birthday"
                                        className="input input-bordered w-full"
                                        value={formData.Birthday}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="label font-semibold">Short Bio</label>
                                    <textarea
                                        name="shortBio"
                                        className="textarea textarea-bordered w-full"
                                        placeholder="Tell us about yourself..."
                                        rows="3"
                                        value={formData.shortBio}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="label font-semibold">Profile Picture</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="file-input file-input-bordered w-full"
                                        onChange={handleImageChange}
                                    />
                                    {profileImage && (
                                        <div className="mt-3 flex justify-center">
                                            <img
                                                src={profileImage}
                                                alt="Profile Preview"
                                                className="w-24 h-24 object-cover rounded-full shadow-md"
                                            />
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        <div className="md:col-span-2 mt-4">
                            <button className="btn btn-neutral w-full">
                                {isLogin ? "Login" : "Sign Up"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            {isLogin
                                ? "Don't have an account?"
                                : "Already have an account?"}{" "}
                            <button
                                onClick={() => {
                                    cleanform();
                                    setIsLogin(!isLogin);
                                    
                                }}
                                className="link link-primary font-semibold"
                            >
                                {isLogin ? "Sign Up" : "Login"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
