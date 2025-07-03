import React, { useState, useRef, useMemo, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Github, Linkedin, Globe, Play, Trash2, Home, User, X, CheckCircle, CircleDot, Sparkles, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

// --- TypeScript Interfaces ---
interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  duration: string;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  school: string;
  duration: string;
}

interface UserProfile {
  name: string;
  about: string;
  email: string;
  phone: string;
  location: string;
  skills: string[];
  experiences: Experience[];
  education: Education[];
  github: string;
  linkedin: string;
  website: string;
  status: "active" | "inactive";
}

// --- Default Data ---
let defaultProfile: UserProfile = {
  name: "Nandan Hyrele",
  about: "Aspiring software engineer passionate about building impactful products. Experienced in React, TypeScript, and Node.js. Always eager to learn and grow.",
  email: "nandan.hyrele@email.com",
  phone: "+1 234 567 8901",
  location: "Bangalore, India",
  skills: ["React", "TypeScript", "Node.js", "Tailwind CSS", "SQL"],
  experiences: [
    {
      id: "exp1",
      jobTitle: "Frontend Developer",
      company: "Tech Solutions",
      duration: "2022 - Present",
      description: "Developed and maintained web applications using React and TypeScript. Collaborated with designers and backend engineers to deliver seamless user experiences."
    },
    {
      id: "exp2",
      jobTitle: "Intern - Web Development",
      company: "Startup Hub",
      duration: "2021 - 2022",
      description: "Built responsive landing pages and dashboards. Improved website performance and accessibility."
    }
  ],
  education: [
    {
      id: "edu1",
      degree: "B.Tech Computer Science",
      school: "NIT Karnataka",
      duration: "2018 - 2022"
    }
  ],
  github: "https://github.com/nandan-hyrele",
  linkedin: "https://linkedin.com/in/nandan-hyrele",
  website: "https://nandan.dev",
  status: "active"
};

// --- Utility Functions ---
const generateId = () => Math.random().toString(36).substr(2, 9);

// Utility to get display name from email
function getNameFromEmail(email: string): string {
  const username = email.split('@')[0];
  return username
    .replace(/[._-]+/g, ' ')
    .split(' ')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

// --- Memoized Components ---

const ProfileAvatar = React.memo(function ProfileAvatar({
  profilePic,
  name,
  status,
  editMode,
  handleProfilePicChange,
}: {
  profilePic: string | null;
  name: string;
  status: "active" | "inactive";
  editMode: boolean;
  handleProfilePicChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="relative group">
      <span className="absolute -bottom-1 -right-1">
        {status === "active" && (
          <span className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse border-2 border-white"></span>
          </span>
        )}
      </span>
      {profilePic ? (
        <img
          src={profilePic}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border-2 border-blue-300 shadow"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-2xl border-2 border-blue-300">
          {name.charAt(0)}
        </div>
      )}
      {editMode && (
        <label className="absolute bottom-0 right-0 bg-white border border-blue-300 rounded-full p-1 cursor-pointer shadow hover:bg-blue-50 transition-opacity opacity-80 group-hover:opacity-100" title="Upload profile picture">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleProfilePicChange}
            aria-label="Upload Profile Picture"
          />
          <User className="w-4 h-4 text-blue-600" />
        </label>
      )}
    </div>
  );
});

const ProfileCompletenessBar = React.memo(function ProfileCompletenessBar({ completeness }: { completeness: number }) {
  return (
    <div className="w-full max-w-5xl mb-4 z-10">
      <div className="flex items-center gap-2 mb-1">
        <Progress value={completeness} className="h-4 bg-blue-100 border border-blue-200" />
        <span className="text-xs font-bold text-orange-500">{completeness}%</span>
      </div>
      <div className="text-right text-xs text-gray-500 mt-1">Profile completeness</div>
    </div>
  );
});

const AnalyticsSidebar = React.memo(function AnalyticsSidebar({ quizAnalytics }: { quizAnalytics: { taken: number; avg: number; last: number | null } }) {
  return (
    <Card className="p-6 shadow-lg rounded-2xl border border-orange-100 bg-white/90 transition-shadow hover:shadow-xl focus-within:shadow-xl z-10">
      <div className="font-semibold text-gray-800 mb-2">Practice Analytics</div>
      <div className="flex flex-col gap-1 text-sm text-gray-700">
        <div>Quizzes Taken: <span className="font-bold">{quizAnalytics.taken}</span></div>
        <div>Average Score: <span className="font-bold">{quizAnalytics.avg}</span></div>
        <div>Last Attempt: <span className="font-bold">{quizAnalytics.last !== null ? quizAnalytics.last : '-'}</span></div>
      </div>
    </Card>
  );
});

// --- Main Component ---
const CandidatePortal: React.FC = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [editField, setEditField] = useState<string | null>(null);
  const [tempProfile, setTempProfile] = useState<UserProfile>(profile);
  const [playing, setPlaying] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const skillInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ type: 'exp' | 'edu'; id: string } | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(() => localStorage.getItem('profilePic') || null);
  // Placeholder: is there a test invitation from company?
  const hasActiveInterview = true; // set to true to show the placeholder
  // --- Aptitude Quiz State ---
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string>("");
  const [quizAnalytics, setQuizAnalytics] = useState(() => {
    const data = localStorage.getItem('quizAnalytics');
    return data ? JSON.parse(data) : { taken: 0, avg: 0, last: null };
  });
  const quizQuestions = [
    {
      q: "What is the next number in the sequence: 2, 4, 8, 16, ?",
      options: [18, 24, 32, 20],
      answer: 2,
    },
    {
      q: "If a train travels 60 km in 1.5 hours, what is its average speed?",
      options: [30, 40, 45, 60],
      answer: 1,
    },
    {
      q: "Which word does NOT belong: Apple, Banana, Carrot, Mango?",
      options: ["Apple", "Banana", "Carrot", "Mango"],
      answer: 2,
    },
  ];

  // --- Profile Completeness ---
  const completeness = (() => {
    let filled = 0, total = 7;
    if (profile.name) filled++;
    if (profile.about) filled++;
    if (profile.email) filled++;
    if (profile.phone) filled++;
    if (profile.location) filled++;
    if (profile.skills.length) filled++;
    if (profile.experiences.length) filled++;
    return Math.round((filled / total) * 100);
  })();

  // --- Profile Picture Upload ---
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        setProfilePic(dataUrl);
        localStorage.setItem('profilePic', dataUrl);
        toast({ title: 'Profile Picture Updated', description: 'Your profile picture has been updated.' });
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Handlers ---
  const handleAddExperience = () => {
    const newId = generateId();
    setTempProfile({
      ...tempProfile,
      experiences: [
        ...tempProfile.experiences,
        { id: newId, jobTitle: '', company: '', duration: '', description: '' }
      ]
    });
    setEditField(`exp-${newId}`);
  };
  const handleRemoveExperience = (id: string) => {
    setDeleteDialog({ type: 'exp', id });
  };
  const confirmRemoveExperience = (id: string) => {
    setTempProfile({
      ...tempProfile,
      experiences: tempProfile.experiences.filter((exp) => exp.id !== id)
    });
    setDeleteDialog(null);
    toast({ title: "Experience Deleted", description: "The experience entry was removed." });
  };
  const handleAddEducation = () => {
    const newId = generateId();
    setTempProfile({
      ...tempProfile,
      education: [
        ...tempProfile.education,
        { id: newId, degree: '', school: '', duration: '' }
      ]
    });
    setEditField(`edu-${newId}`);
  };
  const handleRemoveEducation = (id: string) => {
    setDeleteDialog({ type: 'edu', id });
  };
  const confirmRemoveEducation = (id: string) => {
    setTempProfile({
      ...tempProfile,
      education: tempProfile.education.filter((edu) => edu.id !== id)
    });
    setDeleteDialog(null);
    toast({ title: "Education Deleted", description: "The education entry was removed." });
  };
  const handleSkillInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkillInput(e.target.value);
  };
  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim()) {
      const skill = skillInput.trim();
      if (!tempProfile.skills.includes(skill)) {
        setTempProfile({ ...tempProfile, skills: [...tempProfile.skills, skill] });
        toast({ title: "Skill Added", description: `Added skill: ${skill}` });
      }
      setSkillInput("");
    }
  };
  const handleRemoveSkill = (skill: string) => {
    setTempProfile({ ...tempProfile, skills: tempProfile.skills.filter((s) => s !== skill) });
    toast({ title: "Skill Removed", description: `Removed skill: ${skill}` });
  };
  const handlePlayVideo = () => {
    setPlaying(true);
    setTimeout(() => setPlaying(false), 3000);
  };
  const startQuiz = () => {
    setQuizStep(0);
    setQuizAnswers([]);
    setQuizScore(null);
    setQuizFeedback("");
    setQuizOpen(true);
  };
  const submitQuiz = () => {
    const score = quizAnswers.filter((a, i) => a === quizQuestions[i].answer).length;
    setQuizScore(score);
    let feedback = "";
    if (score === quizQuestions.length) feedback = "Excellent! Perfect score.";
    else if (score >= 2) feedback = "Good job! Review the missed questions.";
    else feedback = "Keep practicing! Try again for a better score.";
    setQuizFeedback(feedback);
    // Update analytics
    const prev = quizAnalytics;
    const taken = prev.taken + 1;
    const avg = Math.round(((prev.avg * prev.taken + score) / taken) * 100) / 100;
    const last = score;
    const analytics = { taken, avg, last };
    setQuizAnalytics(analytics);
    localStorage.setItem('quizAnalytics', JSON.stringify(analytics));
  };

  // --- Accessibility: ARIA labels, semantic HTML, etc. ---

  // --- Layout ---
  return (
    <section className="relative min-h-screen bg-white overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-animated-slow opacity-5"></div>
      {/* Floating Particles */}
      <div className="absolute inset-0 particles"></div>
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      {/* Glowing Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl animate-pulse-slow float-delay-1"></div>
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl animate-pulse-slow float-delay-2"></div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-20 lg:py-32 animate-on-scroll">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm font-semibold text-gray-700 border border-orange-500/30 animate-slide-in-left mb-6">
          <div className="premium-icon">
            <Sparkles className="w-4 h-4 text-orange-500" />
          </div>
          <span>AI-Powered Interview Platform</span>
        </div>
        {/* Active Interview Placeholder */}
        {hasActiveInterview && (
          <Card className="mb-8 p-6 rounded-2xl shadow-lg border border-blue-200 bg-blue-50/80 flex items-center gap-4 animate-fade-in">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-200/60">
              <CircleDot className="w-7 h-7 text-blue-700 animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-lg text-blue-900">Active Interview in Progress</div>
              <div className="text-blue-700 text-sm">A company has opened an interview for you. Please join the session when ready.</div>
            </div>
            <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-2 text-base transition-all duration-300">Join Interview</Button>
          </Card>
        )}
        {/* Profile Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Profile Picture & Status */}
          <Card className="p-6 flex flex-col items-center gap-3 border border-orange-100 bg-white/90 shadow-md">
            <ProfileAvatar profilePic={profilePic} name={profile.name} status={profile.status} editMode={editField === 'profilePic'} handleProfilePicChange={handleProfilePicChange} />
            <ProfileCompletenessBar completeness={completeness} />
            <div className="text-xs text-gray-500">{profile.status === 'active' ? 'Active' : 'Inactive'}</div>
            <Button size="sm" variant="outline" onClick={() => setEditField('profilePic')}>Change Picture</Button>
          </Card>
          {/* Welcome & About */}
          <Card className="p-6 flex flex-col gap-3 border border-orange-100 bg-white/90 shadow-md">
            <div className="text-xl font-bold text-gray-900">
              Hi {profile.name ? profile.name : getNameFromEmail(profile.email)}, thrilled you've joined us!
            </div>
            <div className="font-semibold text-gray-700 flex items-center gap-2">About
              <Button size="icon" variant="ghost" onClick={() => setEditField('about')}><User className="w-4 h-4" /></Button>
            </div>
            {editField === 'about' ? (
              <div className="flex gap-2 items-center">
                <Textarea
                  value={tempProfile.about}
                  onChange={e => setTempProfile({ ...tempProfile, about: e.currentTarget.value })}
                  className="mt-1"
                  aria-label="Edit About"
                />
                <Button size="sm" onClick={() => { setProfile({ ...profile, about: tempProfile.about }); setEditField(null); toast({ title: 'About Updated' }); }}>Save</Button>
                <Button size="sm" variant="outline" onClick={() => { setTempProfile(profile); setEditField(null); }}>Cancel</Button>
              </div>
            ) : (
              <div className="text-gray-600 mt-1">{profile.about || <span className="italic text-gray-400">Add something about yourself...</span>}</div>
            )}
          </Card>
        </div>
        {/* Experience, Education, Skills */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Experience */}
          <Card className="p-6 border border-orange-100 bg-white/90 shadow-md">
            <div className="font-semibold text-gray-700 flex items-center justify-between mb-2">Experience
              <Button size="sm" variant="outline" onClick={handleAddExperience}>Add</Button>
            </div>
            {tempProfile.experiences.length === 0 ? null : (
              <ul className="space-y-2">
                {tempProfile.experiences.map((exp) => (
                  <li key={exp.id} className="bg-orange-50/60 rounded-lg p-3 flex flex-col gap-1 relative">
                    <div className="font-bold text-gray-800">{exp.jobTitle}</div>
                    <div className="text-gray-600">{exp.company} <span className="text-xs text-gray-400">({exp.duration})</span></div>
                    <div className="text-gray-500 text-sm">{exp.description}</div>
                    <Button size="icon" variant="ghost" className="absolute top-2 right-2" onClick={() => setEditField(`exp-${exp.id}`)}><User className="w-4 h-4" /></Button>
                    {editField === `exp-${exp.id}` && (
                      <div className="mt-2 flex flex-col gap-1">
                        <Input value={tempProfile.experiences.find(e => e.id === exp.id)?.jobTitle || ''} onChange={e => setTempProfile({ ...tempProfile, experiences: tempProfile.experiences.map(e2 => e2.id === exp.id ? { ...e2, jobTitle: e.currentTarget.value } : e2) })} placeholder="Job Title" />
                        <Input value={tempProfile.experiences.find(e => e.id === exp.id)?.company || ''} onChange={e => setTempProfile({ ...tempProfile, experiences: tempProfile.experiences.map(e2 => e2.id === exp.id ? { ...e2, company: e.currentTarget.value } : e2) })} placeholder="Company" />
                        <Input value={tempProfile.experiences.find(e => e.id === exp.id)?.duration || ''} onChange={e => setTempProfile({ ...tempProfile, experiences: tempProfile.experiences.map(e2 => e2.id === exp.id ? { ...e2, duration: e.currentTarget.value } : e2) })} placeholder="Duration" />
                        <Textarea value={tempProfile.experiences.find(e => e.id === exp.id)?.description || ''} onChange={e => setTempProfile({ ...tempProfile, experiences: tempProfile.experiences.map(e2 => e2.id === exp.id ? { ...e2, description: e.currentTarget.value } : e2) })} placeholder="Description" />
                        <div className="flex gap-2 mt-1">
                          <Button size="sm" onClick={() => { setProfile({ ...profile, experiences: tempProfile.experiences }); setEditField(null); toast({ title: 'Experience Updated' }); }}>Save</Button>
                          <Button size="sm" variant="outline" onClick={() => { setTempProfile(profile); setEditField(null); }}>Cancel</Button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Card>
          {/* Education */}
          <Card className="p-6 border border-orange-100 bg-white/90 shadow-md">
            <div className="font-semibold text-gray-700 flex items-center justify-between mb-2">Education
              <Button size="sm" variant="outline" onClick={handleAddEducation}>Add</Button>
            </div>
            {tempProfile.education.length === 0 ? null : (
              <ul className="space-y-2">
                {tempProfile.education.map((edu) => (
                  <li key={edu.id} className="bg-orange-50/60 rounded-lg p-3 flex flex-col gap-1 relative">
                    <div className="font-bold text-gray-800">{edu.degree}</div>
                    <div className="text-gray-600">{edu.school} <span className="text-xs text-gray-400">({edu.duration})</span></div>
                    <Button size="icon" variant="ghost" className="absolute top-2 right-2" onClick={() => setEditField(`edu-${edu.id}`)}><User className="w-4 h-4" /></Button>
                    {editField === `edu-${edu.id}` && (
                      <div className="mt-2 flex flex-col gap-1">
                        <Input value={tempProfile.education.find(e => e.id === edu.id)?.degree || ''} onChange={e => setTempProfile({ ...tempProfile, education: tempProfile.education.map(e2 => e2.id === edu.id ? { ...e2, degree: e.currentTarget.value } : e2) })} placeholder="Degree" />
                        <Input value={tempProfile.education.find(e => e.id === edu.id)?.school || ''} onChange={e => setTempProfile({ ...tempProfile, education: tempProfile.education.map(e2 => e2.id === edu.id ? { ...e2, school: e.currentTarget.value } : e2) })} placeholder="School" />
                        <Input value={tempProfile.education.find(e => e.id === edu.id)?.duration || ''} onChange={e => setTempProfile({ ...tempProfile, education: tempProfile.education.map(e2 => e2.id === edu.id ? { ...e2, duration: e.currentTarget.value } : e2) })} placeholder="Duration" />
                        <div className="flex gap-2 mt-1">
                          <Button size="sm" onClick={() => { setProfile({ ...profile, education: tempProfile.education }); setEditField(null); toast({ title: 'Education Updated' }); }}>Save</Button>
                          <Button size="sm" variant="outline" onClick={() => { setTempProfile(profile); setEditField(null); }}>Cancel</Button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Card>
          {/* Skills */}
          <Card className="p-6 border border-orange-100 bg-white/90 shadow-md">
            <div className="font-semibold text-gray-700 flex items-center justify-between mb-2">Skills
              <Button size="sm" variant="outline" onClick={() => setEditField('skills')}>Edit</Button>
            </div>
            {tempProfile.skills.length === 0 ? null : (
              <div className="flex flex-wrap gap-2 mt-2">
                {tempProfile.skills.map((skill) => (
                  <span key={skill} className="inline-flex items-center bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            )}
            {editField === 'skills' && (
              <div className="mt-2 flex flex-col gap-2">
                <div className="flex gap-2">
                  <Input
                    ref={skillInputRef}
                    value={skillInput}
                    onChange={e => setSkillInput(e.currentTarget.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && skillInput.trim()) {
                        const skill = skillInput.trim();
                        if (!tempProfile.skills.includes(skill)) {
                          setTempProfile({ ...tempProfile, skills: [...tempProfile.skills, skill] });
                          setSkillInput('');
                        }
                      }
                    }}
                    placeholder="Add skill"
                    className="w-32"
                    aria-label="Add Skill"
                  />
                  <Button size="sm" onClick={() => { setProfile({ ...profile, skills: tempProfile.skills }); setEditField(null); toast({ title: 'Skills Updated' }); }}>Save</Button>
                  <Button size="sm" variant="outline" onClick={() => { setTempProfile(profile); setEditField(null); }}>Cancel</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tempProfile.skills.map((skill) => (
                    <span key={skill} className="inline-flex items-center bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                      {skill}
                      <button className="ml-2 text-orange-500 hover:text-orange-700" onClick={() => setTempProfile({ ...tempProfile, skills: tempProfile.skills.filter(s => s !== skill) })} aria-label={`Remove skill ${skill}`}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
        {/* Contact & Social */}
        <Card className="mb-10 p-6 border border-orange-100 bg-white/90 shadow-md flex flex-wrap gap-4 items-center text-gray-600">
          {/* Email */}
          <span className="flex items-center gap-1">
            <Mail className="w-4 h-4" />
            {editField === 'email' ? (
              <>
                <Input
                  value={tempProfile.email}
                  onChange={e => setTempProfile({ ...tempProfile, email: e.currentTarget.value })}
                  className="w-48"
                />
                <Button size="sm" onClick={() => {
                  const oldEmailName = getNameFromEmail(profile.email);
                  const newEmailName = getNameFromEmail(tempProfile.email);
                  setProfile({
                    ...profile,
                    email: tempProfile.email,
                    name: profile.name === oldEmailName ? newEmailName : profile.name,
                  });
                  setEditField(null);
                  toast({ title: 'Email Updated' });
                }}>Save</Button>
                <Button size="sm" variant="outline" onClick={() => { setTempProfile(profile); setEditField(null); }}>Cancel</Button>
              </>
            ) : (
              <>
                {profile.email}
                <Button size="icon" variant="ghost" onClick={() => setEditField('email')}><User className="w-4 h-4" /></Button>
              </>
            )}
          </span>
          {/* Phone */}
          <span className="flex items-center gap-1">
            <Phone className="w-4 h-4" />
            {editField === 'phone' ? (
              <>
                <Input
                  value={tempProfile.phone}
                  onChange={e => setTempProfile({ ...tempProfile, phone: e.currentTarget.value })}
                  className="w-40"
                />
                <Button size="sm" onClick={() => { setProfile({ ...profile, phone: tempProfile.phone }); setEditField(null); toast({ title: 'Phone Updated' }); }}>Save</Button>
                <Button size="sm" variant="outline" onClick={() => { setTempProfile(profile); setEditField(null); }}>Cancel</Button>
              </>
            ) : (
              <>
                {profile.phone}
                <Button size="icon" variant="ghost" onClick={() => setEditField('phone')}><User className="w-4 h-4" /></Button>
              </>
            )}
          </span>
          {/* Location */}
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {editField === 'location' ? (
              <>
                <Input
                  value={tempProfile.location}
                  onChange={e => setTempProfile({ ...tempProfile, location: e.currentTarget.value })}
                  className="w-40"
                />
                <Button size="sm" onClick={() => { setProfile({ ...profile, location: tempProfile.location }); setEditField(null); toast({ title: 'Location Updated' }); }}>Save</Button>
                <Button size="sm" variant="outline" onClick={() => { setTempProfile(profile); setEditField(null); }}>Cancel</Button>
              </>
            ) : (
              <>
                {profile.location}
                <Button size="icon" variant="ghost" onClick={() => setEditField('location')}><User className="w-4 h-4" /></Button>
              </>
            )}
          </span>
          {/* GitHub */}
          <span className="flex items-center gap-1">
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-700">
              <Github className="w-4 h-4" />
              {editField === 'github' ? (
                <>
                  <Input
                    value={tempProfile.github}
                    onChange={e => setTempProfile({ ...tempProfile, github: e.currentTarget.value })}
                    className="w-48"
                  />
                  <Button size="sm" onClick={() => { setProfile({ ...profile, github: tempProfile.github }); setEditField(null); toast({ title: 'GitHub Updated' }); }}>Save</Button>
                  <Button size="sm" variant="outline" onClick={() => { setTempProfile(profile); setEditField(null); }}>Cancel</Button>
                </>
              ) : (
                <>
                  GitHub
                  <Button size="icon" variant="ghost" onClick={e => { e.preventDefault(); setEditField('github'); }}><User className="w-4 h-4" /></Button>
                </>
              )}
            </a>
          </span>
          {/* LinkedIn */}
          <span className="flex items-center gap-1">
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-700">
              <Linkedin className="w-4 h-4" />
              {editField === 'linkedin' ? (
                <>
                  <Input
                    value={tempProfile.linkedin}
                    onChange={e => setTempProfile({ ...tempProfile, linkedin: e.currentTarget.value })}
                    className="w-48"
                  />
                  <Button size="sm" onClick={() => { setProfile({ ...profile, linkedin: tempProfile.linkedin }); setEditField(null); toast({ title: 'LinkedIn Updated' }); }}>Save</Button>
                  <Button size="sm" variant="outline" onClick={() => { setTempProfile(profile); setEditField(null); }}>Cancel</Button>
                </>
              ) : (
                <>
                  LinkedIn
                  <Button size="icon" variant="ghost" onClick={e => { e.preventDefault(); setEditField('linkedin'); }}><User className="w-4 h-4" /></Button>
                </>
              )}
            </a>
          </span>
          {/* Website */}
          <span className="flex items-center gap-1">
            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-700">
              <Globe className="w-4 h-4" />
              {editField === 'website' ? (
                <>
                  <Input
                    value={tempProfile.website}
                    onChange={e => setTempProfile({ ...tempProfile, website: e.currentTarget.value })}
                    className="w-48"
                  />
                  <Button size="sm" onClick={() => { setProfile({ ...profile, website: tempProfile.website }); setEditField(null); toast({ title: 'Website Updated' }); }}>Save</Button>
                  <Button size="sm" variant="outline" onClick={() => { setTempProfile(profile); setEditField(null); }}>Cancel</Button>
                </>
              ) : (
                <>
                  Website
                  <Button size="icon" variant="ghost" onClick={e => { e.preventDefault(); setEditField('website'); }}><User className="w-4 h-4" /></Button>
                </>
              )}
            </a>
          </span>
        </Card>
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {/* Aptitude Round Card */}
          <div className="bg-white/90 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center space-y-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mb-2"><Zap className="w-7 h-7 text-orange-500" /></div>
            <h2 className="text-xl font-bold text-gray-900">Aptitude Round</h2>
            <p className="text-gray-600">Test your problem-solving and reasoning skills before the interview. This round helps you prepare for common aptitude questions.</p>
            <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-8 py-3 text-lg transition-all duration-300" onClick={startQuiz}>Start Aptitude Round</Button>
          </div>
          {/* Group Discussion Card */}
          <div className="bg-white/90 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center space-y-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mb-2"><Play className="w-7 h-7 text-orange-500" /></div>
            <h2 className="text-xl font-bold text-gray-900">Group Discussion</h2>
            <p className="text-gray-600">Join a group discussion to practice communication and teamwork skills. Collaborate and share your thoughts on trending topics.</p>
            <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-8 py-3 text-lg transition-all duration-300" onClick={() => toast({ title: 'Group Discussion', description: 'Group Discussion will be available soon!' })}>Join Group Discussion</Button>
          </div>
          {/* Test Interview Card */}
          <div className="bg-white/90 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center space-y-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mb-2"><Play className="w-7 h-7 text-orange-500" /></div>
            <h2 className="text-xl font-bold text-gray-900">Test Interview</h2>
            <p className="text-gray-600">Simulate a real interview environment. Practice answering questions and get instant feedback to improve your performance.</p>
            <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-8 py-3 text-lg transition-all duration-300" onClick={() => toast({ title: 'Test Interview', description: 'Test Interview will start soon!' })}>Start Test Interview</Button>
          </div>
          {/* Analytics/Profile Card */}
          <div className="bg-white/90 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center space-y-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mb-2"><Sparkles className="w-7 h-7 text-orange-500" /></div>
            <h2 className="text-xl font-bold text-gray-900">Your Progress</h2>
            <p className="text-gray-600">Quizzes Taken: <span className="font-bold">{quizAnalytics.taken}</span><br/>Average Score: <span className="font-bold">{quizAnalytics.avg}</span></p>
          </div>
        </div>
        {/* Aptitude Quiz Modal */}
        <Dialog open={quizOpen} onOpenChange={setQuizOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Aptitude Quiz</DialogTitle>
            </DialogHeader>
            {quizScore === null ? (
              <div>
                <div className="mb-4 font-medium text-gray-700">Question {quizStep + 1} of {quizQuestions.length}</div>
                <div className="mb-4 text-lg">{quizQuestions[quizStep].q}</div>
                <div className="flex flex-col gap-2 mb-6">
                  {quizQuestions[quizStep].options.map((opt, idx) => (
                    <Button
                      key={idx}
                      variant={quizAnswers[quizStep] === idx ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => {
                        const next = [...quizAnswers];
                        next[quizStep] = idx;
                        setQuizAnswers(next);
                      }}
                      aria-label={`Select option ${opt}`}
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
                <DialogFooter>
                  {quizStep > 0 && (
                    <Button variant="outline" onClick={() => setQuizStep(quizStep - 1)}>Previous</Button>
                  )}
                  {quizStep < quizQuestions.length - 1 ? (
                    <Button
                      onClick={() => setQuizStep(quizStep + 1)}
                      disabled={quizAnswers[quizStep] === undefined}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      onClick={submitQuiz}
                      disabled={quizAnswers.length !== quizQuestions.length}
                    >
                      Submit
                    </Button>
                  )}
                </DialogFooter>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="text-2xl font-bold text-blue-700">Score: {quizScore} / {quizQuestions.length}</div>
                <div className="text-lg text-gray-700">{quizFeedback}</div>
                <Button onClick={() => setQuizOpen(false)}>Close</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
        {/* Delete Dialog */}
        <AlertDialog open={!!deleteDialog} onOpenChange={open => !open && setDeleteDialog(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The entry will be permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteDialog(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                if (deleteDialog?.type === 'exp') confirmRemoveExperience(deleteDialog.id);
                if (deleteDialog?.type === 'edu') confirmRemoveEducation(deleteDialog.id);
              }}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </section>
  );
};

export default CandidatePortal; 