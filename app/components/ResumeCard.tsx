import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

interface Resume {
  id: string;
  companyName?: string;
  jobTitle?: string;
  imagePath: string;
  resumePath: string;
  feedback: {
    overallScore: number;
    ATS: any;
    toneAndStyle: any;
    content: any;
    structure: any;
    skills: any;
  };
}

const ResumeCard = ({ resume }: { resume: Resume }) => {
  const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState('');

  useEffect(() => {
    const loadResume = async () => {
      try {
        const blob = await fs.read(resume.imagePath);
        if (blob) {
          setResumeUrl(URL.createObjectURL(blob));
          return;
        }
      } catch (err) {
        // fail silently
      }
      // fallback to public image path
      setResumeUrl(resume.imagePath);
    };
    loadResume();
  }, [resume.imagePath, fs]);

  return (
    <Link to={`/resume/${resume.id}`} className="resume-card animate-in fade-in duration-1000">
      <div className="resume-card-header flex justify-between items-center">
        <div className="flex flex-col gap-2">
          {resume.companyName ? (
            <h2 className="text-black font-bold wrap-break-word-words">{resume.companyName}</h2>
          ) : (
            <h2 className="text-black font-bold">Resume</h2>
          )}
          {resume.jobTitle && (
            <h3 className="text-lg wrap-break-word-words text-gray-500">{resume.jobTitle}</h3>
          )}
        </div>
        <div className="shrink-0">
          <ScoreCircle score={resume.feedback.overallScore} />
        </div>
      </div>
      {resumeUrl && (
        <div className="gradient-border animate-in fade-in duration-1000 mt-2">
          <div className="w-full h-full">
            <img
              src={resumeUrl}
              alt="resume"
              className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
            />
          </div>
        </div>
      )}
    </Link>
  );
};

export default ResumeCard;
