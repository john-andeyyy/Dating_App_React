import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { showToast } from "../components/ToastNotif";

const Baseurl = import.meta.env.VITE_BASEURL;

export default function Profile() {
    const { user } = useAuth();

    const [Userdata, setUser] = useState({
        id: user?._id || "",
        email: user?.Email || "",
        phonenumber: user?.Phonenumber || "",
        name: user?.Name || "",
        birthday: user?.Birthday || "",
        bio: user?.bio || "",
        image: user?.Image || null,
        photo: null,
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPass, setIsChangingPass] = useState(false);

    const [passwordData, setPasswordData] = useState({
        Password: "",
        NewPass: "",
    });

    const [previewPhoto, setPreviewPhoto] = useState(null);

    const inputClass =
        "w-full border border-gray-500 bg-transparent rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400";

    const buttonBase =
        "px-4 py-2 rounded-lg transition-all duration-200 text-white";

    useEffect(() => {
        if (user) {
            setUser({
                id: user._id || "",
                email: user.Email || "",
                phonenumber: user.Phonenumber || "",
                name: user.Name || "",
                birthday: user.Birthday || "",
                bio: user.bio || "",
                image: user.Image || null,
                photo: null,
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUser((prev) => ({ ...prev, photo: file }));
            setPreviewPhoto(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        try {
            const formData = new FormData();
            formData.append("Id", Userdata.id);
            formData.append("Email", Userdata.email);
            formData.append("Name", Userdata.name);
            formData.append("Phonenumber", Userdata.phonenumber || "");
            formData.append("Birthday", Userdata.birthday || "");
            formData.append("bio", Userdata.bio || "");
            if (Userdata.photo) formData.append("Image", Userdata.photo);

            await axios.put(`${Baseurl}/user/auth/update`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            showToast("Profile updated successfully!");

            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile");
            showToast(error.response.data.message, 'error')

        }
    };

    const handleChangePassword = async () => {
        if (!passwordData.Password || !passwordData.NewPass) {
            alert("Please fill in both fields.");
            return;
        }
        try {
            await axios.put(`${Baseurl}/user/auth/ChangePass`, {
                Id: Userdata.id,
                Password: passwordData.Password,
                NewPass: passwordData.NewPass,
            });
            // alert("Password changed successfully!");
            showToast('Password changed successfully!')

            setIsChangingPass(false);
            setPasswordData({ Password: "", NewPass: "" });
        } catch (error) {
            console.error("Error changing password:", error);
            // alert(error.response.data.message);
            showToast(error.response.data.message, 'error')

        }
    };

    const getImageSrc = (imageBuffer) => {
        if (!imageBuffer || !imageBuffer.data) return null;
        const byteArray = new Uint8Array(imageBuffer.data);
        const blob = new Blob([byteArray], { type: "image/png" });
        return URL.createObjectURL(blob);
    };

    const calculateAge = (birthday) => {
        if (!birthday) return "Not set";
        const today = new Date();
        const birthDate = new Date(birthday);
        let age = today.getFullYear() - birthDate.getFullYear();

        const hasBirthdayPassed =
            today.getMonth() > birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

        if (!hasBirthdayPassed) age--;

        return age;
    };
    return (
        <div className="p-4 flex justify-center items-center min-h-screen bg-darker">
            <div className="bg-dark shadow-xl rounded-2xl p-6 max-w-4xl w-full">
                <h1 className="text-2xl font-bold text-center mb-6">User Profile</h1>

                {/* Profile Image */}
                <div className="flex flex-col items-center gap-4 mb-6">
                    <img
                        src={
                            previewPhoto ||
                            getImageSrc(Userdata.image) || "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg"                        }
                        alt="Profile"
                        className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full object-cover"
                    />

                    {isEditing && (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="text-sm text-gray-300"
                        />
                    )}
                </div>

                {/* Change Password Mode */}
                {isChangingPass ? (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleChangePassword();
                        }}
                        className="space-y-4"
                    >
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Current Password</label>
                            <input
                                type="password"
                                name="Password"
                                required
                                value={passwordData.Password}
                                onChange={(e) =>
                                    setPasswordData({ ...passwordData, Password: e.target.value })
                                }
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 text-sm mb-1">New Password</label>
                            <input
                                type="password"
                                name="NewPass"
                                required
                                value={passwordData.NewPass}
                                onChange={(e) =>
                                    setPasswordData({ ...passwordData, NewPass: e.target.value })
                                }
                                className={inputClass}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6">
                            <button
                                type="submit"
                                className={`${buttonBase} bg-green-500 hover:bg-green-600 w-full sm:w-auto`}
                            >
                                Save Password
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsChangingPass(false)}
                                className={`${buttonBase} bg-gray-500 hover:bg-gray-600 w-full sm:w-auto`}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>

                ) : isEditing ? (
                    <>
                        {/* Edit Mode */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={Userdata.name}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>
                            {/* <div>
                                <label className="block text-gray-400 text-sm mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    name="phonenumber"
                                    value={Userdata.phonenumber}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div> */}
                            {/* <div>
                                <label className="block text-gray-400 text-sm mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={Userdata.email}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div> */}
                            {/* <div>
                                <label className="block text-gray-400 text-sm mb-1">Birthday</label>
                                <input
                                    type="date"
                                    name="birthday"
                                    value={Userdata.birthday}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div> */}
                            <div className="md:col-span-2">
                                <label className="block text-gray-400 text-sm mb-1">Bio</label>
                                <textarea
                                    name="bio"
                                    value={Userdata.bio}
                                    onChange={handleChange}
                                    className={`${inputClass} resize-none`}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6">
                            <button
                                onClick={handleSave}
                                className={`${buttonBase} bg-green-500 hover:bg-green-600 w-full sm:w-auto`}
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className={`${buttonBase} bg-gray-500 hover:bg-gray-600 w-full sm:w-auto`}
                            >
                                Cancel
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* View Mode */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                            {[
                                { label: "Full Name", value: Userdata.name || "Not set" },
                                { label: "Phone Number", value: Userdata.phonenumber || "No phone" },
                                { label: "Email", value: Userdata.email || "Not set" },
                                { label: "Birthday", value: Userdata.birthday || "Not set" },
                                { label: "Age", value: calculateAge(Userdata.birthday) },
                                { label: "Bio", value: Userdata.bio || "No bio", fullWidth: true },
                            ].map((item, idx) => (
                                <div key={idx} className={item.fullWidth ? "md:col-span-2" : ""}>
                                    <p className="text-sm text-gray-400">{item.label}</p>
                                    <p className="font-semibold break-words">{item.value}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-5 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white w-full sm:w-auto transition-all duration-200"
                            >
                                Edit Profile
                            </button>
                            <button
                                onClick={() => setIsChangingPass(true)}
                                className="px-5 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white w-full sm:w-auto transition-all duration-200"
                            >
                                Change Password
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
