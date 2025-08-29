import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { usePuterStore } from "~/lib/puter";
import Loader from "~/components/Loader";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
export const meta = () => [
  { title: "ResumeForg | Resume Review" },
  { name: "description", content: "Detailed Overview Of Your Resume" },
];
export default function resume() {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const [resumeUrl, setResumeUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoadingResume, setIsLoadingResume] = useState(true);
  const navigate = useNavigate();

  useEffect(
    function () {
      async function loadResume() {
        try {
          setIsLoadingResume(true);
          const resume = await kv.get(`resume:${id}`);
          if (!resume) {
            setIsLoadingResume(false);
            return;
          }
          
          const data = JSON.parse(resume);
          
          const resumeBlob = await fs.read(data.resumePath);
          
          if (!resumeBlob) {
            setIsLoadingResume(false);
            return;
          }
          
          const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
          const resumeUrl = URL.createObjectURL(pdfBlob);
          setResumeUrl(resumeUrl);
          
          const imageBlob = await fs.read(data.imagePath);
          
          if (!imageBlob) {
            setIsLoadingResume(false);
            return;
          }
          
          const imageUrl = URL.createObjectURL(imageBlob);
          setImageUrl(imageUrl);
          setFeedback(data.feedback);
          setIsLoadingResume(false);
        } catch (error) {
          console.error("Error loading resume:", error);
          setIsLoadingResume(false);
        }
      }
      
      if (kv && fs && id && auth) {
        loadResume();
      } else {
        if (!auth) {
          console.log("User not authenticated - redirecting to auth");
          navigate("/auth");
        }
      }
    },
    [id, kv, fs, auth, navigate]
  );
  return (
    <main className="!pt-0">
      <nav className="resume-nav">
        <Link to={"/"} className="back-button">
          <img src="/icons/back.svg" alt="back" className="w-4 h-4" />
          <span className="text-gray-800 font-semibold">Back To Homepage</span>
        </Link>
      </nav>
      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        <section className="w-1/2 max-lg:w-full bg-gradient-to-br from-primary-900 via-primary-700 to-accent-600 h-[100vh] sticky top-0 flex items-center justify-center">
          {isLoadingResume ? (
            <Loader message="Loading your resume..." />
          ) : imageUrl && resumeUrl ? (
            <div className="animate-in fade-in duration-1000 gradient-border max-w-md w-full h-fit">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <img src={imageUrl} alt="resume" className="w-full h-full object-contain" />
              </a>
            </div>
          ) : (
            <div className="text-center text-white">
              <p className="text-lg">Resume not found</p>
              <p className="text-sm opacity-75">Please check the URL or try uploading again</p>
            </div>
          )}
        </section>
        <section className="feedback-section">
          <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
          {isLoadingResume ? (
            <div className="mt-8">
              <Loader message="Analyzing feedback..." />
            </div>
          ) : feedback ? (
            <div className="flex flex-col gap-8 animate-in fade-in duration-1000 mt-8">
            <Summary feedback={feedback}/>
            <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []}/>
            <Details feedback={feedback}/>
            </div>
          ) : (
            <div className="mt-8 text-neutral-500">
              <p>No feedback available for this resume</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
