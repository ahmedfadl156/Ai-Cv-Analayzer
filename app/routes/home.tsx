import type { Route } from "./+types/home";
import Navbar from "../components/Navbar";
import ResumeCard from "../components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useEffect, useState} from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "CV Analayzer" },
    { name: "description", content: "Smart CV Analayzer To Get Your Dream Job!" },
  ];
}

export default function Home() {
  const {auth , kv} = usePuterStore();
  const navigate = useNavigate();
  const [resumes , setResumes] = useState<Resume[]>([])
  const [loading , setLoading] = useState(false)
  useEffect(() => {
    if(!auth.isAuthenticated) {
      navigate('/auth?next=/');
    }
  }, [auth.isAuthenticated])

  useEffect(() => {
    async function loadResumes(){
      setLoading(true);
      const resumes = (await kv.list('resume:*' , true)) as KVItem[];
      const parsedResume = resumes?.map((resume) => JSON.parse(resume.value)) as Resume[]
      setResumes(parsedResume || []);
      setLoading(false);
    }
    loadResumes();
  },[])

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
        {!loading && resumes?.length === 0 ? <p className="text-neutral-200">No Resumes Found. Upload your resume to get started</p> :
        <p className="text-neutral-200">Review your submissions and check AI-powered feedback</p>}
      </div>
      {/* Resumes Cards Component */}
    {!loading && resumes.length > 0 && (
      <div className="resumes-section">
        {resumes.map((resume) => (
          <ResumeCard key={resume.id} resume={resume}/>
        ))}
      </div>
    )}

    {!loading && resumes?.length === 0 && (
      <div className="flex items-center justify-center py-16">
        <Link 
          to="/upload" 
          className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-3"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Upload Your First Resume
        </Link>
      </div>
    )}
    </section>
    </div>

  </main>
  )
}
