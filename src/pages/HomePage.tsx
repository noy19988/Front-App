import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styles/home.css";

function HomePage() {
  const [user, setUser] = useState<{ username: string; profileImage?: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <>
      <Navbar user={user} />
      <div className="home-container">
        <h1>Welcome to Home Page</h1>
      </div>
    </>
  );
}

export default HomePage;
