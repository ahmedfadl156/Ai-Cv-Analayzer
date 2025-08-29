import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";
import { usePuterStore } from "~/lib/puter";
import { useEffect, useState } from "react";

export default function ResumeCard({resume}: {resume: Resume}) {
  const {fs} = usePuterStore();
  const [resumeUrl , setResumeUrl] = useState("");
  useEffect(function(){
    async function loadResume() {
      const blob = await fs.read(resume.imagePath);
      if(!blob) return;
      let url = URL.createObjectURL(blob);
      setResumeUrl(url);
    }
    loadResume();
  },[resume.imagePath])
  return (
    <Link to={`/resume/${resume.id}`} className="resume-card animate-in fade-in hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="resume-card-header">
      <div className="flex flex-col gap-3">
        {resume.companyName && <h2 className="font-bold text-2xl !text-black break-words">{resume.companyName}</h2>}
        {resume.jobTitle && <p className="text-lg text-gray-500 break-words">{resume.jobTitle}</p>}
      </div>
      <div className="flex-shrink-0">
        <ScoreCircle score={resume.feedback?.overallScore || 0}/>
      </div>
      </div>

      {resumeUrl && <div className="gradient-border animate-in fade-in duration-1000">
        <div className="w-full h-full">
          <img src={resumeUrl} alt="resume" className="w-full h-[350px] max-w-sm:h-[250px] object-cover object-top"/>
        </div>
      </div>}
    </Link>
  )
}
