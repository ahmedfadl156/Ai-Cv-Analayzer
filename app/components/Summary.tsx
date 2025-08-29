import OverallScore from "./overallScore"

function Category({title , score} : {title:string , score:number}) {
  return (
    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
      <div className="title flex items-center gap-3">
      <p className="text-lg">{title}</p>
      <span className={`text-[10px] text-white font-bold px-2 py-0.5 rounded-lg ${score >= 75 ? 'bg-accent-600' : score >= 50 ? 'bg-yellow-400' : 'bg-red-500'}`}>
        {score >= 75 ? "Strong" : score >= 50 ? "Good Start" : "Needs Work"}
      </span>
      </div>
      <span className={`text-sm font-bold ${score >= 75 ? 'text-accent-600' : score >= 50 ? 'text-yellow-400' : 'text-red-500'}`}>{score} / 100</span>
    </div>
  )
}

export default function Summary({feedback}: {feedback: Feedback}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg w-full border border-neutral-200">
      <div className="flex flex-col-reverse lg:flex-row items-center gap-8 p-6">
        <OverallScore score={feedback.overallScore}/>
        <div className="flex flex-col gap-2 text-center lg:text-left">
          <h2 className="font-bold text-2xl">Overall Score</h2>
          <p className="text-sm text-neutral-500">This score is calculated based on the variables listed below</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 p-6">
        <Category title="Tone & Style" score={feedback.toneAndStyle.score}/>
        <Category title="Content" score={feedback.content.score}/>
        <Category title="Structure" score={feedback.structure.score}/>
        <Category title="Skills" score={feedback.skills.score}/>
      </div>
    </div>
  )
}
