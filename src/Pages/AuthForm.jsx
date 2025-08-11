import React, { useState } from "react";
import { useNavigate } from 'react-router';

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [registerWith, setRegisterWith] = useState("email");
    const [profileImage, setProfileImage] = useState(null);
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: "",
        shortBio: "",
        age: "",
        email: "",
        mobile: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isLogin) {
            
            alert(`Welcome, ${formData.name}!`);
            navigate('/Home');
        } else {
           
            alert(`Sign-Up successful! Bio: ${formData.shortBio}`);
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
                                    <label className="label font-semibold">Name</label>
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

                                <div className="md:col-span-2">
                                    <label className="label font-semibold">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="input input-bordered w-full"
                                        placeholder="Enter password"
                                        value={formData.password}
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
                                    <input
                                        type={registerWith === "email" ? "email" : "tel"}
                                        name={registerWith === "email" ? "email" : "mobile"}
                                        className="input input-bordered w-full"
                                        placeholder={
                                            registerWith === "email"
                                                ? "Enter your email"
                                                : "Enter your mobile number"
                                        }
                                        value={
                                            registerWith === "email"
                                                ? formData.email
                                                : formData.mobile
                                        }
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

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

                                <div>
                                    <label className="label font-semibold">Age</label>
                                    <input
                                        type="number"
                                        name="age"
                                        min="1"
                                        className="input input-bordered w-full"
                                        placeholder="Enter your age"
                                        value={formData.age}
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
                                onClick={() => setIsLogin(!isLogin)}
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
