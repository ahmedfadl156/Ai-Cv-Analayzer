export default function ATS({
  score,
  suggestions,
}: {
  score: number;
  suggestions: { type: "good" | "improve"; tip: string }[];
}) {
  const getScoreStatus = (score: number) => {
    if (score >= 80) return { 
      status: "Excellent", 
      color: "text-accent-600", 
      bgColor: "bg-accent-100",
      borderColor: "border-accent-500",
      icon: "/icons/ats-good.svg"
    };
    if (score >= 60) return { 
      status: "Good", 
      color: "text-primary-600", 
      bgColor: "bg-primary-50",
      borderColor: "border-primary-500",
      icon: "/icons/ats-warning.svg"
    };
    return { 
      status: "Needs Improvement", 
      color: "text-primary-800", 
      bgColor: "bg-neutral-50",
      borderColor: "border-red-500",
      icon: "/icons/ats-bad.svg"
    };
  };

  const scoreStatus = getScoreStatus(score);

  return (
    <div className={`rounded-2xl shadow-lg w-full bg-white border ${scoreStatus.borderColor} p-6`}>
      <div className="flex items-center gap-4 mb-6">
        <div className={`p-3 rounded-xl ${scoreStatus.bgColor}`}>
          <img
            src={scoreStatus.icon}
            alt="ATS Score"
            className="w-6 h-6"
          />
        </div>
        <div>
          <h3 className="text-xl font-bold text-primary-900">
            ATS Compatibility
          </h3>
          <div className="flex items-center gap-2">
            <span className={`text-lg font-semibold ${scoreStatus.color}`}>
              {score}/100
            </span>
            <span className={`text-sm px-2 py-1 rounded-full ${scoreStatus.bgColor} ${scoreStatus.color} font-medium`}>
              {scoreStatus.status}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <h4 className="font-semibold text-primary-900 mb-2">
          How well does your resume pass through Applicant Tracking Systems?
        </h4>
        <p className="text-neutral-600">
          Your resume was scanned like an employer would. Here's how it performed:
        </p>
      </div>

      {/* Suggestions */}
      <div className="space-y-3 mb-4">
        {suggestions.map((suggestion, index) => (
          <div 
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg bg-neutral-50"
          >
            <div className={`p-1 rounded-full ${suggestion.type === "good" ? "bg-accent-100" : "bg-amber-100"} flex-shrink-0 mt-0.5`}>
              <img
                src={suggestion.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                alt={suggestion.type}
                className="w-3 h-3"
              />
            </div>
            <p className="text-neutral-700 text-sm leading-relaxed">
              {suggestion.tip}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-neutral-100">
        <p className="text-sm text-neutral-500">
          💡 Want a better score? Apply the suggestions above to improve your ATS compatibility.
        </p>
      </div>
    </div>
  );
}

