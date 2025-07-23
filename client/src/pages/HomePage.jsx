import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";
import Spline from "@splinetool/react-spline";
import { useAuth } from "../context/contextapi";
import {
  FaRobot,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import AboutSection from "./AboutSection";
import {
  MdQuiz,
  MdVideoLibrary,
  MdNoteAlt,
  MdGroup,
  MdNotificationsActive,
} from "react-icons/md";
import { GiSpy } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

import {
  Car,
  Bot,
  CalendarCheck2,
  Users,
  Upload,
  UserCircle,
  BellRing,
  HandMetal,
  ShieldAlert,
  Mail,
  Phone,
  MapPin,
  Heart,
  ExternalLink,
  Home
} from "lucide-react";

// Animation variants - optimized for better scroll performance
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// Directional animations for sections
const slideFromLeft = {
  hidden: { opacity: 0, x: -100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const slideFromRight = {
  hidden: { opacity: 0, x: 100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

// Animated section component - optimized for better scroll performance
const AnimatedSection = ({ children, className, id, direction = "up" }) => {
  const [ref, inView] = useInView({
    triggerOnce: false, // Allow re-triggering for directional animations
    threshold: 0.3,
    rootMargin: "-10px 0px",
  });

  // Choose animation variant based on direction
  const getAnimationVariant = () => {
    switch (direction) {
      case "left":
        return slideFromLeft;
      case "right":
        return slideFromRight;
      default:
        return fadeInUp;
    }
  };

  return (
    <motion.div
      ref={ref}
      id={id}
      className={className}
      variants={getAnimationVariant()}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
};

// Animated feature card component - optimized for better scroll performance
const AnimatedFeatureCard = ({ card, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
    rootMargin: "-10px 0px",
  });

  return (
    <motion.div
      ref={ref}
      className={`feature-card ${card.className} animated-card`}
      style={{ borderColor: card.borderColor }}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ delay: index * 0.05 }}
      whileHover={{
        scale: 1.02,
        boxShadow: `0 8px 25px rgba(0,0,0,0.15)`,
        transition: { duration: 0.2 },
      }}
    >
      <h3 style={{ color: card.borderColor }}>
        {card.icon}
        {card.title}
      </h3>
      <p>{card.description}</p>
      <div className="tech-stack"></div>
      <Link to={card.link} className="feature-button">
        {card.buttonText}
      </Link>
    </motion.div>
  );
};

const HomePage = () => {
  const { logout, localuser } = useAuth();
  const [phase, setPhase] = useState("spline");
  const [scrollDirection, setScrollDirection] = useState("down");
  const lastScrollY = useRef(0);

  useEffect(() => {
    // Optimized smooth scrolling
    document.documentElement.style.scrollBehavior = "smooth";
    document.body.style.scrollBehavior = "smooth";

    // Track scroll direction
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const hasSeenIntro = localStorage.getItem("hasSeenIntro");

    if (hasSeenIntro) {
      setPhase("home");
    } else {
      const splineTimer = setTimeout(() => setPhase("redirecting"), 4000);
      const redirectTimer = setTimeout(() => {
        setPhase("home");
        localStorage.setItem("hasSeenIntro", "true");
      }, 7000);

      return () => {
        clearTimeout(splineTimer);
        clearTimeout(redirectTimer);
      };
    }

    const handleUnload = () => {
      localStorage.removeItem("hasSeenIntro");
    };

    window.addEventListener("unload", handleUnload);
    return () => {
      window.removeEventListener("unload", handleUnload);
      window.removeEventListener("scroll", handleScroll);
      document.documentElement.style.scrollBehavior = "auto";
      document.body.style.scrollBehavior = "auto";
    };
  }, []);

  const Navbar = () => (
    <motion.nav
      className="navbar translucent"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="navbar-content">
        <motion.div
          className="navbar-title"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          SYNAPTO
        </motion.div>
        <motion.div
          className="navbar-links"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {localuser ? (
            <>
          
            <Link to="/dashboard" className="nav-link" >
                  <Home size={16} style={{ marginRight: "6px" }} />
                  Home
                </Link>
              {localuser?.isAdmin && (
                <Link to="/wtsp-alert" className="nav-link">
                  <BellRing size={16} style={{ marginRight: "6px" }} />
                  Alert Centre
                </Link>
              )}
              
              <Link to="/profile" className="nav-link">
                <UserCircle size={16} style={{ marginRight: "6px" }} />
                Profile
              </Link>
              <p className="nav-link" onClick={logout}>
                <HandMetal size={16} style={{ marginRight: "6px" }} />
                Logout
              </p>
            </>
          ) : (
            <Link to="/login" className="nav-link">
              <HandMetal size={16} style={{ marginRight: "6px" }} />
              Login
            </Link>
          )}
        </motion.div>
      </div>
    </motion.nav>
  );

  // Feature cards data
  const featureCards = [
    {
      title: "Chat Bot",
      icon: <FaRobot style={{ marginRight: "8px", color: "#ff4d4d" }} />,
      description:
        "Engage in smart AI conversations for instant support and ideas.",
      techStack: ["OpenAI", "React", "Node.js"],
      link: "/chatbot",
      buttonText: "Launch",
      borderColor: "#ff4d4d",
      className: "chatbot",
    },
    {
      title: "Summary & Quiz",
      icon: <MdQuiz style={{ marginRight: "8px", color: "#4dd0e1" }} />,
      description: "Upload files and get summaries with AI-generated quizzes.",

      link: "/subject-file-manager",
      buttonText: "View",
      borderColor: "#4dd0e1",
      className: "summary",
    },
    {
      title: "Video Transcripter",
      icon: <MdVideoLibrary style={{ marginRight: "8px", color: "#7e57c2" }} />,
      description:
        "Convert spoken content from videos into searchable transcripts.",

      link: "/transcriber",
      buttonText: "Start",
      borderColor: "#7e57c2",
      className: "transcripter",
    },
    {
      title: "Deadline Reminders",
      icon: (
        <MdNotificationsActive
          style={{ marginRight: "8px", color: "#fbc02d" }}
        />
      ),
      description: "Set deadlines and receive automated reminders.",

      link: "/deadline",
      buttonText: "Open",
      borderColor: "#fbc02d",
      className: "deadline",
    },
     {
      title: "Attendance-Tracker",
      icon: (
        <MdNotificationsActive
          style={{ marginRight: "8px", color: "#fbc02d" }}
        />
      ),
      description: "Have no fear of Short Attendance with our Attendance Tracker",

      link: "/attendance",
      buttonText: "Open",
      borderColor: "#fbc02d",
      className: "deadline",
    },
    {
      title: "Smart Notes",
      icon: <MdNoteAlt style={{ marginRight: "8px", color: "#00e676" }} />,
      description: "Take notes with deadlines and get reminded on time.",

      link: "/notes",
      buttonText: "Write",
      borderColor: "#00e676",
      className: "notes",
    },
    {
      title: "Mass Bunk Tracker",
      icon: <GiSpy style={{ marginRight: "8px", color: "#ff9100" }} />,
      description: "Create class bunk polls, view votes, and report imposters.",

      link: "/bunk",
      buttonText: "Track",
      borderColor: "#ff9100",
      className: "bunk",
    },
    {
      title: "Community Connect",
      icon: <MdGroup style={{ marginRight: "8px", color: "#00b0ff" }} />,
      description:
        "Join discussions, help peers, and stay connected with your batchmates.",

      link: "/chat",
      buttonText: "Join",
      borderColor: "#00b0ff",
      className: "community",
    },
  ];

  const resourceCards = [
    {
      title: "Professors",
      icon: <UserCircle style={{ marginRight: "8px", color: "#ffca28" }} />,
      description:
        "View profiles, office hours, and contact details of your professors.",

      link: "/professors",
      buttonText: "Explore",
      borderColor: "#ffca28",
      className: "",
    },
  ];

  return (
    <AnimatePresence mode="wait">
      {phase === "spline" && (
        <motion.div
          className="spline-container fullscreen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Spline scene="https://prod.spline.design/3WxrW7SgUd5J8a5o/scene.splinecode" />
        </motion.div>
      )}

      {phase === "redirecting" && (
        <motion.div
          className="intro-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="dots-loader">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <motion.h1
            className="launch-text"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Car
              size={24}
              style={{ marginBottom: "-4px", marginRight: "8px" }}
            />
            DRIVING TO HOME PAGE...
          </motion.h1>
        </motion.div>
      )}

      {phase === "home" && (
        <motion.div
          className="homepage-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Navbar />

          {/* Spline Section */}
          <motion.div
            className="simple-spline-section"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <Spline scene="https://prod.spline.design/yW1kHDXFLLzj5mAz/scene.splinecode" />
          </motion.div>

          {/* Features Section */}
          <AnimatedSection
            id="second-section"
            className="second-section"
            direction={scrollDirection === "up" ? "left" : "up"}
          >
            <motion.h2
              className="section-heading"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              Welcome to <span>Synapto 1.0</span>
            </motion.h2>
            <motion.p
              className="section-subtext"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              This is your AI-powered class companion. Scroll to explore
              features.
            </motion.p>

            <motion.div
              className="feature-cards"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {featureCards.map((card, index) => (
                <AnimatedFeatureCard key={index} card={card} index={index} />
              ))}
            </motion.div>
          </AnimatedSection>

          {/* Resource Hub Section */}
          <AnimatedSection
            id="third-section"
            className="second-section"
            direction={scrollDirection === "down" ? "right" : "up"}
          >
            <motion.h2
              className="section-heading"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              Resource Hub
            </motion.h2>
            <motion.p
              className="section-subtext"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              Access key academic details and faculty information here.
            </motion.p>

            <motion.div
              className="feature-cards"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {resourceCards.map((card, index) => (
                <AnimatedFeatureCard key={index} card={card} index={index} />
              ))}
            </motion.div>
          </AnimatedSection>

          <AboutSection />

          <AnimatedSection
            id="footer-section"
            className="footer"
            direction="up"
          >
            <div className="footer-content">
              <div className="footer-section">
                <h3>Synapto</h3>
                <p>
                  Your AI-powered class companion designed to enhance your
                  academic experience with smart features and seamless
                  integration.
                </p>
                <div className="social-links">
                  <a
                    href="https://github.com/anushkagupta-06/Synapto"
                    className="social-link"
                    aria-label="GitHub"
                  >
                    <FaGithub size={20} />
                  </a>
                  <a href="#" className="social-link" aria-label="LinkedIn">
                    <FaLinkedin size={20} />
                  </a>
                  <a href="#" className="social-link" aria-label="Twitter">
                    <FaTwitter size={20} />
                  </a>
                </div>
              </div>

              <div className="footer-section">
                <h3>Quick Links</h3>
                <ul className="footer-links">
                  <li>
                    <a href="/AIZonePage">
                      <Bot size={16} />
                      AI Zone
                    </a>
                  </li>
                  <li>
                    <a href="/chat">
                      <Users size={16} />
                      Community
                    </a>
                  </li>
                  <li>
                    <a href="/attendance">
                      <CalendarCheck2 size={16} />
                      Attendance
                    </a>
                  </li>
                  <li>
                    <a href="/deadline">
                      <BellRing size={16} />
                      Deadlines
                    </a>
                  </li>
                  <li>
                    <a href="/notes">
                      <MdNoteAlt size={16} />
                      Notes
                    </a>
                  </li>
                  <li>
                    <a href="/bunk">
                      <ShieldAlert size={16} />
                      Bunk Tracker
                    </a>
                  </li>
                </ul>
              </div>

              <div className="footer-section">
                <h3>Resources</h3>
                <ul className="footer-links">
                  <li>
                    <a href="/subject-file-manager">
                      <Upload size={16} />
                      File Manager
                    </a>
                  </li>
                  <li>
                    <a href="/transcriber">
                      <MdVideoLibrary size={16} />
                      Transcriber
                    </a>
                  </li>
                  <li>
                    <a href="/professors">
                      <UserCircle size={16} />
                      Professors
                    </a>
                  </li>
                  <li>
                    <a href="/profile">
                      <UserCircle size={16} />
                      Profile
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <ExternalLink size={16} />
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <ExternalLink size={16} />
                      Support
                    </a>
                  </li>
                </ul>
              </div>

              <div className="footer-section">
                <h3>Contact</h3>
                <div className="contact-info">
                  <div className="contact-item">
                    <Mail size={16} />
                    <span>Teamsynapto@gmail.com</span>
                  </div>
                  <div className="contact-item">
                    <Phone size={16} />
                    <span>9120991471 , 8005366053</span>
                  </div>
                  <div className="contact-item">
                    <MapPin size={16} />
                    <span>MNNIT Allahabad</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="footer-bottom">
              <div className="footer-bottom-content">
                <div className="copyright">
                  <span>© 2025 SYNAPTO. Made with</span>
                  <Heart size={16} fill="currentColor" />
                  <span>for students</span>
                </div>
                <a href="#" className="brand-footer">
                  SYNAPTO
                </a>
                <nav className="footer-nav">
                  <a href="#">Privacy Policy</a>
                  <a href="#">Terms of Service</a>
                  <a href="#">Help Center</a>
                  <a href="#">About</a>
                </nav>
              </div>
            </div>
          </AnimatedSection>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HomePage;
