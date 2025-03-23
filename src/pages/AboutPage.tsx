import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import "../styles/about.css";
import { useNavigate } from 'react-router-dom';
import { getUserDetails } from "../services/api-client";

const AboutPage: React.FC = () => {
    const [user, setUser] = useState<{ username: string; imgUrl?: string } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                navigate("/login");
                return;
            }

            try {
                const userData = await getUserDetails(userId);
                setUser(userData);
            } catch {
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                navigate("/login");
            }
        };

        fetchUser();
    }, [navigate]);

    return (
        <div className="home-container">
            <Navbar user={user} onSearch={() => {}} />
            <div className="content">
                <Sidebar />
                <div className="about-page">
                    <div className="about-container">
                        <h1 className="glass-text">Welcome to FoodConnect</h1>
                        <p className="about-description">
                            At <strong>FoodConnect</strong>, we believe food brings people together. Whether you're a home cook, a food enthusiast, or a professional chef,
                            our platform is designed to help you <strong>share, discover, and connect</strong> through amazing recipes.
                        </p>

                        <div className="section">
                            <h2 className="section-title-about">👨‍🍳 Why Join Us?</h2>
                            <ul>
                                <li><strong>Explore Thousands of Recipes:</strong> Find the best recipes from around the world, all shared by our vibrant community.</li>
                                <li><strong>Share Your Creations:</strong> Upload your own recipes with images, step-by-step instructions, and nutrition details.</li>
                                <li><strong>Engage with Others:</strong> Like, comment, and save your favorite recipes for later.</li>
                                <li><strong>AI-Powered Features:</strong> Get instant nutrition analysis for any recipe using our smart AI system.</li>
                            </ul>
                        </div>

                        <div className="section">
                            <h2 className="section-title-about">Our Mission</h2>
                            <p>To create a welcoming space where food lovers from all around the world can connect, share, and grow through the love of cooking.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
