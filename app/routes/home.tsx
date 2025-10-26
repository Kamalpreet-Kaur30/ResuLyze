import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { resumes as sampleResumes } from "../../constants";

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

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResuLyze" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const kvResumes = (await kv.list('resume:*', true)) as { key: string; value: string }[];
      const parsedResumes = kvResumes?.map((r) => JSON.parse(r.value) as Resume);

      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    };

    loadResumes();
  }, [kv]);

  const displayResumes = resumes.length > 0 ? resumes : sampleResumes;

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16 text-center">
          <h1>Track Your Applications & Resume Ratings</h1>
          {!loadingResumes && resumes.length === 0 ? (
            <h2>Explore sample resumes before uploading your own.</h2>
          ) : (
            <h2>Review your submissions and check AI-powered feedback.</h2>
          )}
        </div>

        {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" alt="loading" />
          </div>
        )}

        {!loadingResumes && (
          <div className="resumes-section flex flex-wrap justify-center gap-4 mt-10">
            {displayResumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {!loadingResumes && resumes.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
              Upload Resume
            </Link>
          </div>
        )}
        <footer className="text-dark-300 text-center py-4 mt-10">
        <p className="text-m">
          © 2025 ResuLyze. All rights reserved.
        </p>
        <p className="text-m">Made By Kamalpreet Kaur.</p>
      </footer>
      </section>
    </main>
  );
}
