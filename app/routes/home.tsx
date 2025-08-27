import type { Route } from "./+types/home";
import Navbar from "../components/Navbar";
import { resumes } from "../../constants";
import ResumeCard from "../components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "CV Analayzer" },
    { name: "description", content: "Smart CV Analayzer To Get Your Dream Job!" },
  ];
}

export default function Home() {
  const {auth} = usePuterStore();
  const navigate = useNavigate();

  useEffect(() => {
    if(!auth.isAuthenticated) {
      navigate('/auth?next=/');
    }
  }, [auth.isAuthenticated])

  return(
    // The Main And The Gradient Background
  <main className="bg-gradient-to-br from-primary-900 via-primary-700 to-accent-600 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 pointer-events-none"></div>
    <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-[length:40px_40px] pointer-events-none"></div>
    
    <div className="relative z-10">
      {/* The Navbar Component */}
      <Navbar />
    <section className="main-section">
      {/* Header Of The Section */}
      <div className="page-heading py-16">
        <h1>Trak Your Applications & Resume Ratings</h1>
        <p className="text-neutral-200">Review your submissions and check AI-powered feedback</p>
      </div>
      {/* Resumes Cards Component */}
    {resumes.length > 0 && (
      <div className="resumes-section">
        {resumes.map((resume) => (
          <ResumeCard key={resume.id} resume={resume}/>
        ))}
      </div>
    )}
    </section>
    </div>

  </main>
  )
}
