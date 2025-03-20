import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Profile = () => {
    const { id } = useParams(); // Get user ID from URL
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const loggedInUserId = localStorage.getItem("userId"); // Get logged-in user ID

    // ✅ Determine which ID to use: logged-in user or URL param
    const userId = id || loggedInUserId;

    useEffect(() => {
        if (!userId) {
            alert("User not logged in!");
            navigate("/login");
            return;
        }

        // Fetch user profile
        const fetchProfile = async () => {
            try {
              console.log("Fetching profile for userId:", userId); 
                const res = await axios.get(`http://localhost:5000/api/auth/profile/${userId}`);
                setUser(res.data);
            } catch (error) {
                alert(error.response?.data?.error || "Failed to load profile");
                navigate("/login");
                console.error(error
                );
            }
        };

        fetchProfile();
    }, [userId, navigate]);

    if (!user) {
        return <h2>Loading...</h2>;
    }

    return (
        <div className="profile-page">
            <h2 className="profile-title">Profile Page</h2>

            <img
                src={`http://localhost:5000/${user.profilePic}`} // Assuming profilePic is a path
                alt="Profile"
                className="profile-img"
            />

            <h3 className="profile-username">{user.username}</h3>
            <p className="profile-bio">{user.bio}</p>
        </div>
    );
};

export default Profile;
