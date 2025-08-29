import Accordion from "./Accordin";

function CategoryScore({ score }: { score: number }) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-accent-500 text-white";
    if (score >= 60) return "bg-amber-500 text-white";
    return "bg-red-500 text-white";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Work";
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`px-4 py-2 rounded-full font-bold text-sm shadow-sm ${getScoreColor(score)}`}>
        {score}/100
      </div>
      <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${
        score >= 80 ? "bg-accent-50 text-accent-700 border-accent-200" :
        score >= 60 ? "bg-amber-50 text-amber-700 border-amber-200" :
        "bg-red-50 text-red-700 border-red-200"
      }`}>
        {getScoreLabel(score)}
      </div>
    </div>
  );
}

function TipsList({ tips }: { tips: { type: "good" | "improve"; tip: string; explanation: string; }[] }) {
  return (
    <div className="space-y-3">
      {tips.map((tipItem, index) => (
        <div key={index} className={`flex items-start gap-3 p-4 rounded-lg border-l-4 ${
          tipItem.type === "good" 
            ? "bg-white shadow border-accent-500" 
            : "bg-amber-50 border-amber-500"
        }`}>
          <div className={`p-1 rounded-full flex-shrink-0 mt-1 ${
            tipItem.type === "good" 
              ? "bg-accent-100" 
              : "bg-amber-100"
          }`}>
            {tipItem.type === "good" ? (
              <svg className="w-3 h-3 text-accent-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-3 h-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-neutral-800 font-medium leading-relaxed">{tipItem.tip}</p>
            {tipItem.explanation && (
              <p className="text-neutral-600 text-sm leading-relaxed">{tipItem.explanation}</p>
            )}
          </div>
        </div>
      ))}
      
      {tips.length === 0 && (
        <div className="text-center py-8 text-neutral-500">
          <div className="p-3 bg-accent-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
            <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="font-medium">Excellent work!</p>
          <p className="text-sm">This section looks great - no improvements needed.</p>
        </div>
      )}
    </div>
  );
}

export default function Details({feedback}: {feedback: Feedback}) {
  const accordionItems = [
    {
      id: "tone-style",
      title: "Tone & Style",
      score: `${feedback.toneAndStyle.score}/100`,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-5 bg-white rounded-xl border border-neutral-200 shadow-sm">
            <div>
              <h4 className="font-bold text-primary-900 mb-2 text-lg">Professional Tone Assessment</h4>
              <p className="text-neutral-600">How well your resume communicates professionalism and industry standards</p>
            </div>
            <CategoryScore score={feedback.toneAndStyle.score} />
          </div>
          <div className="max-h-80 overflow-y-auto pr-2">
            <TipsList tips={feedback.toneAndStyle.tips} />
          </div>
        </div>
      )
    },
    {
      id: "content",
      title: "Content Quality",
      score: `${feedback.content.score}/100`,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-5 bg-white rounded-xl border border-neutral-200 shadow-sm">
            <div>
              <h4 className="font-bold text-primary-900 mb-2 text-lg">Content Relevance & Impact</h4>
              <p className="text-neutral-600">Quality and relevance of your experience and achievements</p>
            </div>
            <CategoryScore score={feedback.content.score} />
          </div>
          <div className="max-h-80 overflow-y-auto pr-2">
            <TipsList tips={feedback.content.tips} />
          </div>
        </div>
      )
    },
    {
      id: "structure",
      title: "Document Structure",
      score: `${feedback.structure.score}/100`,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-5 bg-white rounded-xl border border-neutral-200 shadow-sm">
            <div>
              <h4 className="font-bold text-primary-900 mb-2 text-lg">Layout & Organization</h4>
              <p className="text-neutral-600">How well your resume is structured and formatted for readability</p>
            </div>
            <CategoryScore score={feedback.structure.score} />
          </div>
          <div className="max-h-80 overflow-y-auto pr-2">
            <TipsList tips={feedback.structure.tips} />
          </div>
        </div>
      )
    },
    {
      id: "skills",
      title: "Skills & Keywords",
      score: `${feedback.skills.score}/100`,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-5 bg-white rounded-xl border border-neutral-200 shadow-sm">
            <div>
              <h4 className="font-bold text-primary-900 mb-2 text-lg">Technical & Soft Skills</h4>
              <p className="text-neutral-600">Relevance and presentation of your skill set for the target role</p>
            </div>
            <CategoryScore score={feedback.skills.score} />
          </div>
          <div className="max-h-80 overflow-y-auto pr-2">
            <TipsList tips={feedback.skills.tips} />
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-primary-900 mb-3">Detailed Analysis</h2>
        <p className="text-neutral-600 text-lg">Expand each section to see specific recommendations for improvement</p>
      </div>
      
      <Accordion 
        items={accordionItems}
        allowMultiple={true}
        defaultOpen={[]}
      />
    </div>
  );
}
