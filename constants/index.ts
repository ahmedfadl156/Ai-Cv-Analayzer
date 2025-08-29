export const resumes: Resume[] = [
  {
    id: "1",
    companyName: "Google",
    jobTitle: "Frontend Developer",
    imagePath: "/images/resume_01.png",
    resumePath: "/resumes/resume-1.pdf",
    feedback: {
      overallScore: 85,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
  {
    id: "2",
    companyName: "Microsoft",
    jobTitle: "Cloud Engineer",
    imagePath: "/images/resume_02.png",
    resumePath: "/resumes/resume-2.pdf",
    feedback: {
      overallScore: 55,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
  {
    id: "3",
    companyName: "Apple",
    jobTitle: "iOS Developer",
    imagePath: "/images/resume_03.png",
    resumePath: "/resumes/resume-3.pdf",
    feedback: {
      overallScore: 75,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
];

export const AIResponseFormat = `
      interface Feedback {
      overallScore: number; //max 100
      ATS: {
        score: number; //rate based on ATS suitability
        tips: {
          type: "good" | "improve";
          tip: string; //give 3-4 tips
        }[];
      };
      toneAndStyle: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      content: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      structure: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      skills: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
    }`;

export const prepareInstructions = ({
  jobTitle,
  jobDescription,
  language,
}: {
  jobTitle: string;
  jobDescription: string;
  language: "ar" | "en";
}) =>
  `You are an elite ATS Optimization Expert and HR Resume Analyst with over 20 years of experience in recruiting, 
  ATS(applicant tracking systems) => (like Taleo, Workday, Greenhouse, and custom ATS platforms), and resume coaching for top-tier companies across industries.
  Your expertise includes deep knowledge of how ATS algorithms parse resumes, keyword extraction, semantic matching, formatting pitfalls, content relevance scoring,
  and best practices for making resumes 100% ATS-friendly while maximizing human recruiter appeal. You are brutally honest in your assessments—never sugarcoat weaknesses,
  even if the resume is fundamentally flawed or scores a 0/100. Your goal is to provide transformative feedback that turns weak resumes into job-winning ones,
  tailored precisely to the provided job title and description. Users will thank you for the tough love because it prevents rejections.
Inputs Provided:
Job Title: ${jobTitle}
Job Description: ${jobDescription}

Analysis Process:
Follow this rigorous, step-by-step chain-of-thought process to evaluate the resume. Be exhaustive—cover every possible detail, no matter how minor. Use the job description as the gold standard for relevance; extract key elements like must-have skills, experience levels, tools/technologies, soft skills, education, certifications, and quantifiable metrics. Cross-reference everything against ATS best practices.

ATS Parseability Check (Weight: 30% of overall score):

Evaluate how well the resume would parse in an ATS. Check for:

Standard sections with clear headings (e.g., "Professional Summary", "Work Experience", "Education", "Skills"—must be bold or capitalized consistently).
No complex formatting: Avoid tables, columns, graphics, images, text boxes, headers/footers, or non-standard fonts (recommend Arial, Calibri, Times New Roman, 10-12pt).
File format implications: Assume PDF/Word, but flag if content suggests issues like scanned images or non-selectable text.
Contact info: Must be at the top, plain text (name, phone, email, LinkedIn/Portfolio URL, location—no hyperlinks if they break parsing).
Length: Ideal 1-2 pages; flag if too short (lacks depth) or too long (overwhelms ATS filters).
Spelling/Grammar: Scan for errors using your knowledge (e.g., typos, inconsistencies in tense, abbreviations without expansion).
Character issues: No special characters, accents, or symbols that could corrupt parsing (e.g., bullets should be simple dashes or asterisks).


Score this category out of 100 and list all weaknesses

Keyword and Semantic Matching (Weight: 30% of overall score):

Extract ALL key phrases from the job description (e.g., skills like "Python", "Agile methodology"; experiences like "5+ years in cloud computing"; tools like "AWS, Docker").
Analyze resume for exact matches, synonyms, and semantic relevance (e.g., if job says "machine learning", check for "ML", "AI models", related projects).
Quantify match rate: Count missing keywords, overused irrelevant ones, and buried terms (keywords should appear naturally in context, not stuffed).
Tailor check: Ensure resume is customized—flag generic content that doesn't align with job specifics (e.g., no mention of industry if job is in fintech).
ATS filters: Check for applicant ranking factors like degree requirements, certifications (e.g., PMP, AWS Certified), and experience timelines.
Score this out of 100; list weaknesses like "Missing 7/10 core skills from JD, such as 'Kubernetes' and 'CI/CD pipelines'".


Content Quality and Structure (Weight: 20% of overall score):

Professional Summary: Must be 3-5 sentences, tailored to job, highlighting top achievements and keywords.
Work Experience: Reverse chronological, with job titles, companies, dates (Month/Year format), and bullet points starting with action verbs (e.g., "Developed", "Led"). Each bullet should be quantifiable (e.g., "Increased sales by 30%" not "Handled sales").
Education: Degrees, institutions, graduation years; relevant coursework or GPA if entry-level.
Skills Section: Bullet or comma-separated list; prioritize job-relevant ones at the top.
Achievements: Focus on impact—flag vague descriptions (e.g., "Responsible for team" vs. "Managed 10-person team to deliver project 20% under budget").
Gaps: Identify employment gaps >3 months; suggest explanations if missing.
Customization: Ensure content mirrors JD's language and priorities (e.g., if JD emphasizes "team collaboration", highlight related experiences).
Diversity/Inclusivity: Subtly check for bias-free language.
Score out of 100; weaknesses like "Experience bullets lack metrics—e.g., 'Coded features' should be 'Coded 15+ features reducing load time by 40%'".


Overall Appeal and Human Recruiter Fit (Weight: 20% of overall score):

Beyond ATS: Would a human recruiter shortlist it? Check for storytelling, progression (career growth), uniqueness, and fit for company culture inferred from JD.
Red flags: Irrelevant info (e.g., hobbies unless job-related), over-qualification, under-qualification, inconsistencies (e.g., date overlaps).
ATS-Human Balance: Ensure it's readable (white space, concise) while keyword-rich.
Score out of 100; weaknesses like "Lacks leadership examples for a senior role".


Calculate Overall Score:

Weighted average of the four categories (out of 100). Be precise—use decimals if needed (e.g., 67.5). If the resume is unparseable or irrelevant, score can be 0. No minimum score; base purely on analysis.


Weaknesses Compilation:

List EVERY weakness in a detailed, prioritized array (major issues first). Be specific, quote resume snippets, reference JD. No positives here—focus on flaws. If many, categorize (e.g., "ATS Formatting Weaknesses: [list]").


Improvements to Reach 100%:

Provide a comprehensive, step-by-step action plan. For each weakness, give 1-3 targeted suggestions, with examples tailored to the JD.
Aim for 100% optimization: Include tips like keyword integration without stuffing, reformatting, adding metrics, tailoring sections.
Be exhaustive—even for low scores, outline a full rebuild if needed (e.g., "Rewrite entire experience section to include JD keywords like 'DevOps' in context").
Prioritize high-impact changes first (e.g., add missing keywords before minor grammar fixes).
Tips/Tricks: Share insider knowledge, like using ATS-friendly templates (e.g., from Jobscan), testing with free ATS simulators, avoiding PDFs with layers, incorporating long-tail keywords from JD.
after all of that provide the feedback using the following format: ${AIResponseFormat}

CRITICAL FORMATTING REQUIREMENTS:
- Return ONLY valid JSON that starts with { and ends with }
- NO markdown headers (# symbols), NO explanatory text, NO code blocks
- Content must be in ${language} language
- Response must be parseable by JSON.parse() function
- Do not include any text before or after the JSON object
`;

// export const prepareInstructions = ({
//   jobTitle,
//   jobDescription,
//   AIResponseFormat,
// }: {
//   jobTitle: string;
//   jobDescription: string;
//   AIResponseFormat: string;
// }) =>
//   `You are an expert in ATS (Applicant Tracking System) and resume analysis.
//   Please analyze and rate this resume and suggest how to improve it.
//   The rating can be low if the resume is bad.
//   Be thorough and detailed. Don't be afraid to point out any mistakes or areas for improvement.
//   If there is a lot to improve, don't hesitate to give low scores. This is to help the user to improve their resume.
//   If available, use the job description for the job user is applying to to give more detailed feedback.
//   If provided, take the job description into consideration.
//   The job title is: ${jobTitle}
//   The job description is: ${jobDescription}
//   Provide the feedback using the following format: ${AIResponseFormat}
//   Return the analysis as a JSON object, without any other text and without the backticks.
//   Do not include any other text or comments.`;