import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import "../styles/about.css";
import { useNavigate } from 'react-router-dom';
import { getUserDetails } from "../services/api-client";

// טיפוס עבור משתמש
interface User {
    username: string;
    imgUrl?: string;
}

const AboutPage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();
    const welcomeSectionRef = useRef<HTMLDivElement>(null);
    const bubbles = useRef<HTMLDivElement[]>([]);
    const bgShapesRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        // יצירת אפקט שינוי זווית בהתאם למיקום העכבר
        const welcomeSection = welcomeSectionRef.current;
        if (!welcomeSection) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = welcomeSection.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            // חישוב זווית הסיבוב בהתאם למיקום העכבר
            const rotateX = (y - 0.5) * 5; // -2.5 עד 2.5 מעלות
            const rotateY = (0.5 - x) * 5; // -2.5 עד 2.5 מעלות
            
            welcomeSection.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        };
        
        const handleMouseLeave = () => {
            welcomeSection.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        };

        welcomeSection.addEventListener('mousemove', handleMouseMove);
        welcomeSection.addEventListener('mouseleave', handleMouseLeave);

        // יצירת בועות אנימציה
        createBubbles();
        
        // יצירת צורות רקע אקראיות
        createBackgroundShapes();

        return () => {
            welcomeSection.removeEventListener('mousemove', handleMouseMove);
            welcomeSection.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    // פונקציה ליצירת בועות אנימציה
    const createBubbles = () => {
        const welcomeSection = welcomeSectionRef.current;
        if (!welcomeSection) return;
        
        // יצירת מספר בועות אקראיות
        for (let i = 0; i < 15; i++) {
            const bubble = document.createElement('div');
            bubble.classList.add('bubble');
            
            // גודל אקראי בין 10 ל-60 פיקסלים
            const size = Math.random() * 50 + 10;
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            
            // מיקום אקראי
            bubble.style.left = `${Math.random() * 100}%`;
            bubble.style.top = `${Math.random() * 100}%`;
            
            // משך ועיכוב אנימציה אקראיים
            const duration = Math.random() * 10 + 10;
            const delay = Math.random() * 5;
            bubble.style.animation = `float ${duration}s ${delay}s infinite ease-in-out`;
            
            welcomeSection.appendChild(bubble);
            bubbles.current.push(bubble);
        }
    };

  // פונקציה ליצירת צורות רקע
    const createBackgroundShapes = () => {
        const bgShapes = bgShapesRef.current;
        if (!bgShapes) return;

        // יצירת עיגולים גדולים ברקע עם אפקט בלור
        for (let i = 0; i < 3; i++) {
            const circle = document.createElement('div');
            circle.classList.add('bg-circle');
            
            const size = Math.random() * 300 + 200;
            circle.style.width = `${size}px`;
            circle.style.height = `${size}px`;
            
            circle.style.left = `${Math.random() * 100}%`;
            circle.style.top = `${Math.random() * 100}%`;
            
            // אנימציית פעימה איטית
            const duration = Math.random() * 10 + 15;
            circle.style.animation = `pulse ${duration}s infinite alternate ease-in-out`;
            
            bgShapes.appendChild(circle);
        }
    };

    // פונקציה לעטיפת מילים מודגשות
    const wrapHighlightedWords = (text: string) => {
        // מחליף <strong> תגים עם ה-highlight-word קלאס
        return text.replace(/<strong>(.*?)<\/strong>/g, '<span class="highlight-word">$1</span>');
    };

    const aboutDescription = `
        At <strong>FoodConnect</strong>, we believe food brings people together. Whether you're a home cook, a food enthusiast, or a professional chef,
        our platform is designed to help you <strong>share, discover, and connect</strong> through amazing recipes.
    `;

    return (
        <div className="home-container">
            <Navbar user={user} onSearch={() => {}} />
            <div className="content">
                <Sidebar />
                <div className="about-page">
                    {/* אלמנטים דקורטיביים ברקע */}
                    <div className="bg-shapes" ref={bgShapesRef}></div>
                    
                    <div className="about-container">
                        <div className="welcome-section" ref={welcomeSectionRef}>
                            {/* צורות נוזליות מאחורי התוכן */}
                            <div className="liquid-shape"></div>
                            <div className="liquid-shape"></div>
                            
                            <h1 className="glass-text" data-text="Welcome to FoodConnect">
                                Welcome to FoodConnect
                            </h1>
                            <p 
                                className="about-description"
                                dangerouslySetInnerHTML={{ __html: wrapHighlightedWords(aboutDescription) }}
                            />
                        </div>

                        <div className="section">
                            <h2 className="section-title-about">‍ Why Join Us?</h2>
                            <ul>
                                <li>
                                    <strong>Explore Thousands of Recipes</strong>
                                    Find the best recipes from around the world.
                                </li>
                                <li>
                                    <strong>Share Your Creations</strong>
                                    Upload your own recipes with images and instructions.
                                </li>
                                <li>
                                    <strong>Engage with Others</strong>
                                    Like, comment, and save your favorite recipes.
                                </li>
                                <li>
                                    <strong>AI-Powered Features</strong>
                                    Get instant nutrition analysis for any recipe.
                                </li>
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