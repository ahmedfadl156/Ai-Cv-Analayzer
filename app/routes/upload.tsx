import { useState } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { usePuterStore } from "~/lib/puter";
import { convertPdfToImage } from "~/lib/pdfToImg";
import { prepareInstructions } from "constants";

export default function upload() {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  function generateUUID() {
    return crypto.randomUUID();
  }

  function handleFileSelect(file: File | null) {
    setFile(file);
  }

  async function handleAnalyze({
    companyName,
    jobTitle,
    jobDescription,
    language,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    language: "ar" | "en";
    file: File;
  }) {
    setIsProcessing(true);
    setStatusText("Uploading The File....");
    const uploadedFile = await fs.upload([file]);
    if (!uploadedFile) {
      setIsProcessing(false);
      return setStatusText("Error: File Upload Failed");
    }
    setStatusText("Converting The File To Image....");
    const imageFile = await convertPdfToImage(file);
    if (!imageFile.file) {
      console.error('PDF conversion failed:', imageFile.error);
      setIsProcessing(false);
      return setStatusText(`Error: Failed Upload Image - ${imageFile.error || 'Unknown error'}`);
    }
    setStatusText("Uploading The Image....");
    const uploadedImage = await fs.upload([imageFile.file]);
    if (!uploadedImage) {
      setIsProcessing(false);
      return setStatusText("Error: Image Upload Failed");
    }
    setStatusText("Preparing You Data....");
    const uuid = generateUUID();
    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName,
      jobTitle,
      jobDescription,
      feedback: null as any,
    };
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
      const feedback = await ai.feedback(
        uploadedFile.path,
        prepareInstructions({jobTitle , jobDescription , language})
      );
      if(!feedback) {
        setIsProcessing(false);
        return setStatusText('Error: Failed to analyze resume');
      }
      const feedbackText = typeof feedback.message.content === 'string' ? feedback.message.content : feedback.message.content[0].text;
      
      try {
        // Remove any markdown formatting that might be present
        let cleanedText = feedbackText.trim();
        
        // Remove markdown headers and any text before the JSON
        if (cleanedText.includes('{')) {
          cleanedText = cleanedText.substring(cleanedText.indexOf('{'));
        }
        
        // Remove any text after the last closing brace
        if (cleanedText.includes('}')) {
          cleanedText = cleanedText.substring(0, cleanedText.lastIndexOf('}') + 1);
        }
        
        data.feedback = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Raw AI Response:', feedbackText);
        setIsProcessing(false);
        return setStatusText('Error: AI returned invalid format. Please try again.');
      }
      await kv.set(`resume:${uuid}`, JSON.stringify(data));
      setStatusText('Analysis complete, redirecting...');
      console.log(data);
      setIsProcessing(false);
      navigate(`/resume/${uuid}`);
  }


  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const companyName = formData.get("companyName") as string;
    const jobTitle = formData.get("jobTitle") as string;
    const jobDescription = formData.get("jobDescription") as string;
    const language = formData.get("language") as "ar" | "en";
    const resume = file;
    if (!file) return;
    handleAnalyze({ companyName, jobTitle, jobDescription, language, file });
    console.log({ companyName, jobDescription, jobTitle, language, resume });
  }
  return (
    <main className="bg-gradient-to-br from-primary-900 via-primary-700 to-accent-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 pointer-events-none"></div>
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-[length:40px_40px] pointer-events-none"></div>
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1 className="max-w-xl text-center">
            Smart feedback for your dream job
          </h1>
          {isProcessing ? (
            <div className="processing-container max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full mb-4 shadow-lg">
                    <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">{statusText}</h2>
                  <p className="text-white/70">Our AI is analyzing your resume with precision</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className={`flex items-center p-4 rounded-xl transition-all duration-500 ${
                    statusText.includes("Uploading The File") ? "bg-accent-500/20 border border-accent-400/30" : 
                    statusText.includes("Converting") || statusText.includes("Uploading The Image") || statusText.includes("Preparing") ? "bg-primary-500/20 border border-primary-400/30" : "bg-white/5 border border-white/10"
                  }`}>
                    <div className={`w-3 h-3 rounded-full mr-4 transition-all duration-300 ${
                      statusText.includes("Uploading The File") ? "bg-accent-400 animate-pulse" : 
                      statusText.includes("Converting") || statusText.includes("Uploading The Image") || statusText.includes("Preparing") ? "bg-primary-400" : "bg-white/30"
                    }`}></div>
                    <span className="text-white/90 font-medium">File Upload & Processing</span>
                    {statusText.includes("Uploading The File") && <div className="ml-auto w-5 h-5 border-2 border-accent-400/30 border-t-accent-400 rounded-full animate-spin"></div>}
                  </div>

                  <div className={`flex items-center p-4 rounded-xl transition-all duration-500 ${
                    statusText.includes("Converting") ? "bg-accent-500/20 border border-accent-400/30" : 
                    statusText.includes("Uploading The Image") || statusText.includes("Preparing") ? "bg-primary-500/20 border border-primary-400/30" : "bg-white/5 border border-white/10"
                  }`}>
                    <div className={`w-3 h-3 rounded-full mr-4 transition-all duration-300 ${
                      statusText.includes("Converting") ? "bg-accent-400 animate-pulse" : 
                      statusText.includes("Uploading The Image") || statusText.includes("Preparing") ? "bg-primary-400" : "bg-white/30"
                    }`}></div>
                    <span className="text-white/90 font-medium">Document Conversion</span>
                    {statusText.includes("Converting") && <div className="ml-auto w-5 h-5 border-2 border-accent-400/30 border-t-accent-400 rounded-full animate-spin"></div>}
                  </div>

                  <div className={`flex items-center p-4 rounded-xl transition-all duration-500 ${
                    statusText.includes("Uploading The Image") ? "bg-accent-500/20 border border-accent-400/30" : 
                    statusText.includes("Preparing") ? "bg-primary-500/20 border border-primary-400/30" : "bg-white/5 border border-white/10"
                  }`}>
                    <div className={`w-3 h-3 rounded-full mr-4 transition-all duration-300 ${
                      statusText.includes("Uploading The Image") ? "bg-accent-400 animate-pulse" : 
                      statusText.includes("Preparing") ? "bg-primary-400" : "bg-white/30"
                    }`}></div>
                    <span className="text-white/90 font-medium">AI Analysis Preparation</span>
                    {statusText.includes("Uploading The Image") && <div className="ml-auto w-5 h-5 border-2 border-accent-400/30 border-t-accent-400 rounded-full animate-spin"></div>}
                  </div>

                  <div className={`flex items-center p-4 rounded-xl transition-all duration-500 ${
                    statusText.includes("Preparing") ? "bg-accent-500/20 border border-accent-400/30" : "bg-white/5 border border-white/10"
                  }`}>
                    <div className={`w-3 h-3 rounded-full mr-4 transition-all duration-300 ${
                      statusText.includes("Preparing") ? "bg-accent-400 animate-pulse" : "bg-white/30"
                    }`}></div>
                    <span className="text-white/90 font-medium">Generating Insights</span>
                    {statusText.includes("Preparing") && <div className="ml-auto w-5 h-5 border-2 border-accent-400/30 border-t-accent-400 rounded-full animate-spin"></div>}
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600/20 to-accent-600/20 p-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
                  <div className="relative flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-accent-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-accent-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-accent-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                  <p className="text-center text-white/70 mt-4 text-sm">
                    Analyzing resume structure, keywords, and ATS compatibility...
                  </p>
                </div>
              </div>

              <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent-400/20 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary-400/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
          ) : (
            <h2 className="!text-2xl ">
              Drop your resume for an ATS score and improvement tips
            </h2>
          )}
          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 mt-8"
            >
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input
                  type="text"
                  id="company-name"
                  name="companyName"
                  placeholder="Company Name"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input
                  type="text"
                  id="job-title"
                  name="jobTitle"
                  placeholder="Job Title"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>
                <textarea
                  id="job-description"
                  name="jobDescription"
                  placeholder="Job Description"
                />
              </div>
              <div className="form-div">
                <label htmlFor="language">Language (Instructions Will Appear In This Language)</label>
                <select
                  id="language"
                  name="language"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl bg-white text-neutral-900"
                  defaultValue="en"
                >
                  <option value="en">English</option>
                  <option value="ar">Arabic</option>
                </select>
              </div>
              <div className="form-div">
                <label htmlFor="resume">Upload Resume</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>
              <button className="primary-button" type="submit">
                Save & Analyze Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
