"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useUser, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PlusCircle,
  Trash2,
  Github,
  Linkedin,
  Globe,
  FileText,
  Save,
  User,
  Code,
  Briefcase,
  GraduationCap,
  Award,
  FolderGit2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from "uuid";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ProfilePage() {
  // State declarations
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [userId, setUserId] = useState(null);
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  });
  const [socialLinks, setSocialLinks] = useState({
    github: "",
    linkedin: "",
    portfolio: "",
    twitter: "",
  });
  const [resume, setResume] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([{ id: uuidv4(), title: "", description: "", technologies: "", link: "", github: "" }]);
  const [experiences, setExperiences] = useState([{ id: uuidv4(), company: "", position: "", duration: "", description: "" }]);
  const [certifications, setCertifications] = useState([{ id: uuidv4(), name: "", issuer: "", date: "", link: "" }]);
  const [education, setEducation] = useState([{ id: uuidv4(), institution: "", degree: "", field: "", duration: "" }]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch user data and set Supabase auth token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      if (!isLoaded) return;

      if (isSignedIn && user) {
        setUserId(user.id);
        setIsAuthenticated(true);
        try {
          const token = await getToken({ template: "supabase" });
          if (token) {
            await supabase.auth.setSession({ access_token: token });
          } else {
            console.error("Failed to retrieve JWT token");
            setIsAuthenticated(false);
            setLoading(false);
            return;
          }
          await fetchProfileData(user.id);
        } catch (error) {
          console.error("Error initializing auth:", error.message);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };
    initializeAuth();
  }, [isLoaded, isSignedIn, user, getToken]);

  // Fetch profile data from Supabase
  const fetchProfileData = async (userId) => {
    try {
      // Personal Info
      const { data: personalData, error: personalError } = await supabase
        .from("personal_info")
        .select("*")
        .eq("user_id", userId)
        .single();
      if (personalError && personalError.code !== "PGRST116") throw personalError;
      if (personalData) setPersonalInfo(personalData);

      // Social Links
      const { data: socialData, error: socialError } = await supabase
        .from("social_links")
        .select("*")
        .eq("user_id", userId)
        .single();
      if (socialError && socialError.code !== "PGRST116") throw socialError;
      if (socialData) setSocialLinks(socialData);

      // Skills
      const { data: skillsData, error: skillsError } = await supabase
        .from("skills")
        .select("id, skill")
        .eq("user_id", userId);
      if (skillsError) throw skillsError;
      if (skillsData) setSkills(skillsData.map((s) => ({ id: s.id, skill: s.skill })));

      // Projects
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", userId);
      if (projectsError) throw projectsError;
      if (projectsData) {
        setProjects(
          projectsData.length > 0
            ? projectsData.map((p) => ({ ...p, id: p.id }))
            : [{ id: uuidv4(), title: "", description: "", technologies: "", link: "", github: "" }]
        );
      }

      // Experiences
      const { data: experiencesData, error: experiencesError } = await supabase
        .from("experiences")
        .select("*")
        .eq("user_id", userId);
      if (experiencesError) throw experiencesError;
      if (experiencesData) {
        setExperiences(
          experiencesData.length > 0
            ? experiencesData.map((e) => ({ ...e, id: e.id }))
            : [{ id: uuidv4(), company: "", position: "", duration: "", description: "" }]
        );
      }

      // Certifications
      const { data: certificationsData, error: certificationsError } = await supabase
        .from("certifications")
        .select("*")
        .eq("user_id", userId);
      if (certificationsError) throw certificationsError;
      if (certificationsData) {
        setCertifications(
          certificationsData.length > 0
            ? certificationsData.map((c) => ({ ...c, id: c.id }))
            : [{ id: uuidv4(), name: "", issuer: "", date: "", link: "" }]
        );
      }

      // Education
      const { data: educationData, error: educationError } = await supabase
        .from("education")
        .select("*")
        .eq("user_id", userId);
      if (educationError) throw educationError;
      if (educationData) {
        setEducation(
          educationData.length > 0
            ? educationData.map((e) => ({ ...e, id: e.id }))
            : [{ id: uuidv4(), institution: "", degree: "", field: "", duration: "" }]
        );
      }

      // Resume
      const { data: resumeData, error: resumeError } = await supabase
        .from("resumes")
        .select("file_url")
        .eq("user_id", userId)
        .single();
      if (resumeError && resumeError.code !== "PGRST116") throw resumeError;
      if (resumeData) setResumeUrl(resumeData.file_url);
    } catch (error) {
      console.error("Error fetching profile data:", error.message);
    }
  };

  // Handle personal info changes
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Handle social links changes
  const handleSocialLinksChange = (e) => {
    const { name, value } = e.target;
    setSocialLinks((prev) => ({ ...prev, [name]: value }));
  };

  // Handle resume upload
  const handleResumeUpload = async (e) => {
    if (!userId) {
      console.error("Cannot upload resume: User not authenticated");
      return;
    }
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResume(file);
      try {
        const token = await getToken({ template: "supabase" });
        if (!token) throw new Error("Failed to retrieve JWT token");
        await supabase.auth.setSession({ access_token: token });

        const fileExt = file.name.split(".").pop();
        const fileName = `${userId}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from("resumes").upload(fileName, file);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from("resumes").getPublicUrl(fileName);
        setResumeUrl(urlData.publicUrl);

        const { error: upsertError } = await supabase
          .from("resumes")
          .upsert({ user_id: userId, file_url: urlData.publicUrl });
        if (upsertError) throw upsertError;
      } catch (error) {
        console.error("Error uploading resume:", error.message);
      }
    }
  };

  // Add skill
  const addSkill = async (e) => {
    e.preventDefault();
    if (!userId) {
      console.error("Cannot add skill: User not authenticated");
      return;
    }
    if (skillInput.trim() && !skills.some((s) => s.skill === skillInput.trim())) {
      const newSkill = { id: uuidv4(), skill: skillInput.trim() };
      setSkills((prev) => [...prev, newSkill]);
      setSkillInput("");
      try {
        const token = await getToken({ template: "supabase" });
        if (!token) throw new Error("Failed to retrieve JWT token");
        await supabase.auth.setSession({ access_token: token });

        const { error } = await supabase.from("skills").insert({ user_id: userId, skill: newSkill.skill });
        if (error) throw error;
      } catch (error) {
        console.error("Error adding skill:", error.message);
      }
    }
  };

  // Remove skill
  const removeSkill = async (id) => {
    if (!userId) {
      console.error("Cannot remove skill: User not authenticated");
      return;
    }
    const skillToRemove = skills.find((s) => s.id === id);
    setSkills(skills.filter((s) => s.id !== id));
    try {
      const token = await getToken({ template: "supabase" });
      if (!token) throw new Error("Failed to retrieve JWT token");
      await supabase.auth.setSession({ access_token: token });

      const { error } = await supabase
        .from("skills")
        .delete()
        .eq("user_id", userId)
        .eq("skill", skillToRemove.skill);
      if (error) throw error;
    } catch (error) {
      console.error("Error removing skill:", error.message);
    }
  };

  // Add project
  const addProject = () => {
    setProjects([...projects, { id: uuidv4(), title: "", description: "", technologies: "", link: "", github: "" }]);
  };

  // Update project
  const updateProject = (id, field, value) => {
    const updatedProjects = projects.map((p) => (p.id === id ? { ...p, [field]: value } : p));
    setProjects(updatedProjects);
  };

  // Remove project
  const removeProject = async (id) => {
    if (!userId) {
      console.error("Cannot remove project: User not authenticated");
      return;
    }
    const project = projects.find((p) => p.id === id);
    const updatedProjects = projects.filter((p) => p.id !== id);
    setProjects(
      updatedProjects.length > 0
        ? updatedProjects
        : [{ id: uuidv4(), title: "", description: "", technologies: "", link: "", github: "" }]
    );
    if (project && project.id && project.title) {
      try {
        const token = await getToken({ template: "supabase" });
        if (!token) throw new Error("Failed to retrieve JWT token");
        await supabase.auth.setSession({ access_token: token });

        const { error } = await supabase.from("projects").delete().eq("id", project.id);
        if (error) throw error;
      } catch (error) {
        console.error("Error removing project:", error.message);
      }
    }
  };

  // Add experience
  const addExperience = () => {
    setExperiences([...experiences, { id: uuidv4(), company: "", position: "", duration: "", description: "" }]);
  };

  // Update experience
  const updateExperience = (id, field, value) => {
    const updatedExperiences = experiences.map((e) => (e.id === id ? { ...e, [field]: value } : e));
    setExperiences(updatedExperiences);
  };

  // Remove experience
  const removeExperience = async (id) => {
    if (!userId) {
      console.error("Cannot remove experience: User not authenticated");
      return;
    }
    const experience = experiences.find((e) => e.id === id);
    const updatedExperiences = experiences.filter((e) => e.id !== id);
    setExperiences(
      updatedExperiences.length > 0
        ? updatedExperiences
        : [{ id: uuidv4(), company: "", position: "", duration: "", description: "" }]
    );
    if (experience && experience.id && experience.company) {
      try {
        const token = await getToken({ template: "supabase" });
        if (!token) throw new Error("Failed to retrieve JWT token");
        await supabase.auth.setSession({ access_token: token });

        const { error } = await supabase.from("experiences").delete().eq("id", experience.id);
        if (error) throw error;
      } catch (error) {
        console.error("Error removing experience:", error.message);
      }
    }
  };

  // Add certification
  const addCertification = () => {
    setCertifications([...certifications, { id: uuidv4(), name: "", issuer: "", date: "", link: "" }]);
  };

  // Update certification
  const updateCertification = (id, field, value) => {
    const updatedCertifications = certifications.map((c) => (c.id === id ? { ...c, [field]: value } : c));
    setCertifications(updatedCertifications);
  };

  // Remove certification
  const removeCertification = async (id) => {
    if (!userId) {
      console.error("Cannot remove certification: User not authenticated");
      return;
    }
    const certification = certifications.find((c) => c.id === id);
    const updatedCertifications = certifications.filter((c) => c.id !== id);
    setCertifications(
      updatedCertifications.length > 0
        ? updatedCertifications
        : [{ id: uuidv4(), name: "", issuer: "", date: "", link: "" }]
    );
    if (certification && certification.id && certification.name) {
      try {
        const token = await getToken({ template: "supabase" });
        if (!token) throw new Error("Failed to retrieve JWT token");
        await supabase.auth.setSession({ access_token: token });

        const { error } = await supabase.from("certifications").delete().eq("id", certification.id);
        if (error) throw error;
      } catch (error) {
        console.error("Error removing certification:", error.message);
      }
    }
  };

  // Add education
  const addEducation = () => {
    setEducation([...education, { id: uuidv4(), institution: "", degree: "", field: "", duration: "" }]);
  };

  // Update education
  const updateEducation = (id, field, value) => {
    const updatedEducation = education.map((e) => (e.id === id ? { ...e, [field]: value } : e));
    setEducation(updatedEducation);
  };

  // Remove education
  const removeEducation = async (id) => {
    if (!userId) {
      console.error("Cannot remove education: User not authenticated");
      return;
    }
    const edu = education.find((e) => e.id === id);
    const updatedEducation = education.filter((e) => e.id !== id);
    setEducation(
      updatedEducation.length > 0
        ? updatedEducation
        : [{ id: uuidv4(), institution: "", degree: "", field: "", duration: "" }]
    );
    if (edu && edu.id && edu.institution) {
      try {
        const token = await getToken({ template: "supabase" });
        if (!token) throw new Error("Failed to retrieve JWT token");
        await supabase.auth.setSession({ access_token: token });

        const { error } = await supabase.from("education").delete().eq("id", edu.id);
        if (error) throw error;
      } catch (error) {
        console.error("Error removing education:", error.message);
      }
    }
  };

  // Handle form submission
// Handle form submission
// Handle form submission
// Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!isAuthenticated || !userId) {
    console.error("Cannot save profile: User not authenticated");
    alert("Please log in to save your profile.");
    return;
  }
  setLoading(true);
  try {
    const token = await getToken({ template: "supabase" });
    if (!token) throw new Error("Failed to retrieve JWT token");
    await supabase.auth.setSession({ access_token: token });

    // Personal Info - Ensure all fields are optional with null fallback
    const personalData = {
      user_id: userId,
      fullName: personalInfo.fullName || null,
      title: personalInfo.title || null,
      email: personalInfo.email || null,
      phone: personalInfo.phone || null,
      location: personalInfo.location || null,
      bio: personalInfo.bio || null,
    };
    const { error: personalError, data: personalResponse } = await supabase
      .from("personal_info")
      .upsert(personalData, { onConflict: "user_id" })
      .select();
    if (personalError) {
      console.error("Personal Info Upsert Error:", personalError.message, personalError.details);
      throw personalError;
    }
    console.log("Personal Info Saved:", personalResponse);

    // Social Links
    const { error: socialError, data: socialResponse } = await supabase
      .from("social_links")
      .upsert({ user_id: userId, ...socialLinks }, { onConflict: "user_id" })
      .select();
    if (socialError) {
      console.error("Social Links Upsert Error:", socialError.message, socialError.details);
      throw socialError;
    }
    console.log("Social Links Saved:", socialResponse);

    // Skills: Delete existing and insert new
    const { error: skillsDeleteError } = await supabase.from("skills").delete().eq("user_id", userId);
    if (skillsDeleteError) throw skillsDeleteError;
    if (skills.length > 0) {
      const { error: skillsInsertError, data: skillsResponse } = await supabase
        .from("skills")
        .insert(skills.filter((s) => s.skill).map((s) => ({ user_id: userId, skill: s.skill })))
        .select();
      if (skillsInsertError) {
        console.error("Skills Insert Error:", skillsInsertError.message, skillsInsertError.details);
        throw skillsInsertError;
      }
      console.log("Skills Saved:", skillsResponse);
    }

    // Projects: Delete existing and insert new
    const { error: projectsDeleteError } = await supabase.from("projects").delete().eq("user_id", userId);
    if (projectsDeleteError) throw projectsDeleteError;
    if (projects.some((p) => p.title)) {
      const { error: projectsInsertError, data: projectsResponse } = await supabase
        .from("projects")
        .insert(
          projects
            .filter((p) => p.title)
            .map((p) => ({
              user_id: userId,
              title: p.title,
              description: p.description,
              technologies: p.technologies,
              link: p.link,
              github: p.github,
            }))
        )
        .select();
      if (projectsInsertError) {
        console.error("Projects Insert Error:", projectsInsertError.message, projectsInsertError.details);
        throw projectsInsertError;
      }
      console.log("Projects Saved:", projectsResponse);
    }

    // Add similar blocks for experiences, certifications, education, and resumes...

    console.log("Profile saved successfully!");
    alert("Profile saved successfully!");
  } catch (error) {
    console.error("Error saving profile:", error.message, error.details);
    alert(`Failed to save profile. Please try again. Error: ${error.message}`);
  } finally {
    setLoading(false);
  }
};

  if (!isLoaded || loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isSignedIn) {
    return <div className="flex justify-center items-center h-screen">Please log in to view and edit your profile.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto py-12 px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-1/4">
            <Card className="sticky top-12">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.imageUrl || "https://via.placeholder.com/150"} alt="Profile" />
                    <AvatarFallback>{personalInfo.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{personalInfo.fullName || user.fullName || "Your Name"}</CardTitle>
                    <CardDescription>{personalInfo.title || "Professional Title"}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  {[
                    { value: "personal", label: "Personal Info", icon: User },
                    { value: "social", label: "Social Links", icon: Globe },
                    { value: "skills", label: "Skills", icon: Code },
                    { value: "projects", label: "Projects", icon: FolderGit2 },
                    { value: "experience", label: "Experience", icon: Briefcase },
                    { value: "education", label: "Education", icon: GraduationCap },
                    { value: "certifications", label: "Certifications", icon: Award },
                    { value: "resume", label: "Resume", icon: FileText },
                  ].map((item) => (
                    <Button
                      key={item.value}
                      variant="ghost"
                      className="w-full justify-start gap-2"
                      onClick={() => document.getElementById(item.value)?.scrollIntoView({ behavior: "smooth" })}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="lg:w-3/4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold mb-4">Build Your Developer Profile</h1>
              <p className="text-muted-foreground mb-8">
                Create a comprehensive profile to showcase your skills, projects, and experience to potential employers and
                collaborators.
              </p>

              <form onSubmit={handleSubmit}>
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="hidden">
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="social">Social</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                    <TabsTrigger value="education">Education</TabsTrigger>
                    <TabsTrigger value="certifications">Certifications</TabsTrigger>
                    <TabsTrigger value="resume">Resume</TabsTrigger>
                  </TabsList>

                  {/* Personal Information */}
                  <TabsContent value="personal">
                    <AnimatePresence>
                      <motion.div
                        id="personal"
                        key="personal-tab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card>
                          <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Provide your contact details and a professional bio.</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                  id="fullName"
                                  name="fullName"
                                  placeholder="John Doe"
                                  value={personalInfo.fullName}
                                  onChange={handlePersonalInfoChange}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="title">Professional Title</Label>
                                <Input
                                  id="title"
                                  name="title"
                                  placeholder="Senior Frontend Developer"
                                  value={personalInfo.title}
                                  onChange={handlePersonalInfoChange}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                  id="email"
                                  name="email"
                                  type="email"
                                  placeholder="john.doe@example.com"
                                  value={personalInfo.email}
                                  onChange={handlePersonalInfoChange}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                  id="phone"
                                  name="phone"
                                  placeholder="+1 (555) 123-4567"
                                  value={personalInfo.phone}
                                  onChange={handlePersonalInfoChange}
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="location">Location</Label>
                              <Input
                                id="location"
                                name="location"
                                placeholder="San Francisco, CA"
                                value={personalInfo.location}
                                onChange={handlePersonalInfoChange}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="bio">Professional Bio</Label>
                              <Textarea
                                id="bio"
                                name="bio"
                                placeholder="Write a short professional bio..."
                                className="min-h-[150px]"
                                value={personalInfo.bio}
                                onChange={handlePersonalInfoChange}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </AnimatePresence>
                  </TabsContent>

                  {/* Social Links */}
                  <TabsContent value="social">
                    <AnimatePresence>
                      <motion.div
                        id="social"
                        key="social-tab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card>
                          <CardHeader>
                            <CardTitle>Social Links</CardTitle>
                            <CardDescription>Connect your professional profiles.</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            {[
                              { id: "github", label: "GitHub", icon: Github, placeholder: "https://github.com/username" },
                              { id: "linkedin", label: "LinkedIn", icon: Linkedin, placeholder: "https://linkedin.com/in/username" },
                              { id: "portfolio", label: "Portfolio", icon: Globe, placeholder: "https://yourportfolio.com" },
                              { id: "twitter", label: "Twitter/X", icon: Globe, placeholder: "https://x.com/username" },
                            ].map((social) => (
                              <div key={social.id} className="space-y-2">
                                <Label htmlFor={social.id} className="flex items-center gap-2">
                                  <social.icon className="h-4 w-4" /> {social.label}
                                </Label>
                                <Input
                                  id={social.id}
                                  name={social.id}
                                  placeholder={social.placeholder}
                                  value={socialLinks[social.id]}
                                  onChange={handleSocialLinksChange}
                                />
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      </motion.div>
                    </AnimatePresence>
                  </TabsContent>

                  {/* Skills */}
                  <TabsContent value="skills">
                    <AnimatePresence>
                      <motion.div
                        id="skills"
                        key="skills-tab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card>
                          <CardHeader>
                            <CardTitle>Skills</CardTitle>
                            <CardDescription>List your technical and soft skills.</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div className="flex gap-4">
                              <Input
                                placeholder="Add a skill (e.g., React, Node.js)"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && addSkill(e)}
                              />
                              <Button onClick={addSkill} type="button" disabled={!skillInput.trim()}>
                                Add
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {skills.map((skillObj) => (
                                <Badge
                                  key={skillObj.id}
                                  variant="secondary"
                                  className="px-3 py-1 text-sm flex items-center gap-2"
                                >
                                  {skillObj.skill}
                                  <button
                                    type="button"
                                    onClick={() => removeSkill(skillObj.id)}
                                    className="text-muted-foreground hover:text-foreground"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                              {skills.length === 0 && <p className="text-muted-foreground text-sm">No skills added yet.</p>}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </AnimatePresence>
                  </TabsContent>

                  {/* Projects */}
                  <TabsContent value="projects">
                    <AnimatePresence>
                      <motion.div
                        id="projects"
                        key="projects-tab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card>
                          <CardHeader>
                            <CardTitle>Projects</CardTitle>
                            <CardDescription>Highlight your key projects.</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-8">
                            {projects.map((project, index) => (
                              <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="border rounded-lg p-6 space-y-6 bg-white shadow-sm"
                              >
                                <div className="flex justify-between items-center">
                                  <h3 className="text-lg font-semibold">Project {index + 1}</h3>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeProject(project.id)}
                                    disabled={projects.length === 1}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                <Separator />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <Label htmlFor={`project-title-${project.id}`}>Project Title</Label>
                                    <Input
                                      id={`project-title-${project.id}`}
                                      value={project.title}
                                      onChange={(e) => updateProject(project.id, "title", e.target.value)}
                                      placeholder="E-commerce Platform"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`project-technologies-${project.id}`}>Technologies</Label>
                                    <Input
                                      id={`project-technologies-${project.id}`}
                                      value={project.technologies}
                                      onChange={(e) => updateProject(project.id, "technologies", e.target.value)}
                                      placeholder="React, Node.js, MongoDB"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`project-description-${project.id}`}>Description</Label>
                                  <Textarea
                                    id={`project-description-${project.id}`}
                                    value={project.description}
                                    onChange={(e) => updateProject(project.id, "description", e.target.value)}
                                    placeholder="Describe your project..."
                                    className="min-h-[120px]"
                                  />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <Label htmlFor={`project-link-${project.id}`}>Live URL</Label>
                                    <Input
                                      id={`project-link-${project.id}`}
                                      value={project.link}
                                      onChange={(e) => updateProject(project.id, "link", e.target.value)}
                                      placeholder="https://project.com"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`project-github-${project.id}`}>GitHub</Label>
                                    <Input
                                      id={`project-github-${project.id}`}
                                      value={project.github}
                                      onChange={(e) => updateProject(project.id, "github", e.target.value)}
                                      placeholder="https://github.com/username/repo"
                                    />
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                            <Button type="button" variant="outline" className="w-full" onClick={addProject}>
                              <PlusCircle className="mr-2 h-4 w-4" /> Add Project
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </AnimatePresence>
                  </TabsContent>

                  {/* Experience */}
                  <TabsContent value="experience">
                    <AnimatePresence>
                      <motion.div
                        id="experience"
                        key="experience-tab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card>
                          <CardHeader>
                            <CardTitle>Work Experience</CardTitle>
                            <CardDescription>Detail your professional journey.</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-8">
                            {experiences.map((experience, index) => (
                              <motion.div
                                key={experience.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="border rounded-lg p-6 space-y-6 bg-white shadow-sm"
                              >
                                <div className="flex justify-between items-center">
                                  <h3 className="text-lg font-semibold">Experience {index + 1}</h3>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeExperience(experience.id)}
                                    disabled={experiences.length === 1}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                <Separator />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <Label htmlFor={`company-${experience.id}`}>Company</Label>
                                    <Input
                                      id={`company-${experience.id}`}
                                      value={experience.company}
                                      onChange={(e) => updateExperience(experience.id, "company", e.target.value)}
                                      placeholder="Google"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`position-${experience.id}`}>Position</Label>
                                    <Input
                                      id={`position-${experience.id}`}
                                      value={experience.position}
                                      onChange={(e) => updateExperience(experience.id, "position", e.target.value)}
                                      placeholder="Senior Developer"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`duration-${experience.id}`}>Duration</Label>
                                  <Input
                                    id={`duration-${experience.id}`}
                                    value={experience.duration}
                                    onChange={(e) => updateExperience(experience.id, "duration", e.target.value)}
                                    placeholder="Jan 2020 - Present"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`exp-description-${experience.id}`}>Description</Label>
                                  <Textarea
                                    id={`exp-description-${experience.id}`}
                                    value={experience.description}
                                    onChange={(e) => updateExperience(experience.id, "description", e.target.value)}
                                    placeholder="Describe your responsibilities..."
                                    className="min-h-[120px]"
                                  />
                                </div>
                              </motion.div>
                            ))}
                            <Button type="button" variant="outline" className="w-full" onClick={addExperience}>
                              <PlusCircle className="mr-2 h-4 w-4" /> Add Experience
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </AnimatePresence>
                  </TabsContent>

                  {/* Education */}
                  <TabsContent value="education">
                    <AnimatePresence>
                      <motion.div
                        id="education"
                        key="education-tab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card>
                          <CardHeader>
                            <CardTitle>Education</CardTitle>
                            <CardDescription>Add your academic qualifications.</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-8">
                            {education.map((edu, index) => (
                              <motion.div
                                key={edu.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="border rounded-lg p-6 space-y-6 bg-white shadow-sm"
                              >
                                <div className="flex justify-between items-center">
                                  <h3 className="text-lg font-semibold">Education {index + 1}</h3>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeEducation(edu.id)}
                                    disabled={education.length === 1}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                <Separator />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <Label htmlFor={`institution-${edu.id}`}>Institution</Label>
                                    <Input
                                      id={`institution-${edu.id}`}
                                      value={edu.institution}
                                      onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                                      placeholder="Stanford University"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`degree-${edu.id}`}>Degree</Label>
                                    <Input
                                      id={`degree-${edu.id}`}
                                      value={edu.degree}
                                      onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                                      placeholder="Bachelor of Science"
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <Label htmlFor={`field-${edu.id}`}>Field of Study</Label>
                                    <Input
                                      id={`field-${edu.id}`}
                                      value={edu.field}
                                      onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                                      placeholder="Computer Science"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`edu-duration-${edu.id}`}>Duration</Label>
                                    <Input
                                      id={`edu-duration-${edu.id}`}
                                      value={edu.duration}
                                      onChange={(e) => updateEducation(edu.id, "duration", e.target.value)}
                                      placeholder="2016 - 2020"
                                    />
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                            <Button type="button" variant="outline" className="w-full" onClick={addEducation}>
                              <PlusCircle className="mr-2 h-4 w-4" /> Add Education
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </AnimatePresence>
                  </TabsContent>

                  {/* Certifications */}
                  <TabsContent value="certifications">
                    <AnimatePresence>
                      <motion.div
                        id="certifications"
                        key="certifications-tab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card>
                          <CardHeader>
                            <CardTitle>Certifications</CardTitle>
                            <CardDescription>Showcase your professional certifications.</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-8">
                            {certifications.map((cert, index) => (
                              <motion.div
                                key={cert.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="border rounded-lg p-6 space-y-6 bg-white shadow-sm"
                              >
                                <div className="flex justify-between items-center">
                                  <h3 className="text-lg font-semibold">Certification {index + 1}</h3>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeCertification(cert.id)}
                                    disabled={certifications.length === 1}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                <Separator />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <Label htmlFor={`cert-name-${cert.id}`}>Certification Name</Label>
                                    <Input
                                      id={`cert-name-${cert.id}`}
                                      value={cert.name}
                                      onChange={(e) => updateCertification(cert.id, "name", e.target.value)}
                                      placeholder="AWS Certified Developer"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`issuer-${cert.id}`}>Issuer</Label>
                                    <Input
                                      id={`issuer-${cert.id}`}
                                      value={cert.issuer}
                                      onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)}
                                      placeholder="Amazon Web Services"
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <Label htmlFor={`cert-date-${cert.id}`}>Date Issued</Label>
                                    <Input
                                      id={`cert-date-${cert.id}`}
                                      value={cert.date}
                                      onChange={(e) => updateCertification(cert.id, "date", e.target.value)}
                                      placeholder="June 2022"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`cert-link-${cert.id}`}>Credential URL</Label>
                                    <Input
                                      id={`cert-link-${cert.id}`}
                                      value={cert.link}
                                      onChange={(e) => updateCertification(cert.id, "link", e.target.value)}
                                      placeholder="https://credential.net/..."
                                    />
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                            <Button type="button" variant="outline" className="w-full" onClick={addCertification}>
                              <PlusCircle className="mr-2 h-4 w-4" /> Add Certification
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </AnimatePresence>
                  </TabsContent>

                  {/* Resume */}
                  <TabsContent value="resume">
                    <AnimatePresence>
                      <motion.div
                        id="resume"
                        key="resume-tab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card>
                          <CardHeader>
                            <CardTitle>Resume</CardTitle>
                            <CardDescription>Upload your latest resume or CV.</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div className="grid w-full items-center gap-1.5">
                              <Label htmlFor="resume">Upload Resume (PDF, DOC, DOCX)</Label>
                              <Input
                                id="resume"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleResumeUpload}
                              />
                              {resumeUrl && (
                                <a
                                  href={resumeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:underline flex items-center gap-2 mt-2"
                                >
                                  <FileText className="h-4 w-4" />
                                  View Uploaded Resume
                                </a>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </AnimatePresence>
                  </TabsContent>
                </Tabs>

                <div className="mt-12 flex justify-end">
                  <Button type="submit" size="lg" className="gap-2" disabled={loading}>
                    <Save className="h-4 w-4" />
                    {loading ? "Saving..." : "Save Profile"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </main>
        </div>

        {/* Profile Preview */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Profile Preview</CardTitle>
              <CardDescription>See how your profile will appear to others.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold">{personalInfo.fullName || user.fullName}</h2>
                  <p className="text-lg text-muted-foreground">{personalInfo.title}</p>
                  <p className="text-sm">{personalInfo.location}</p>
                  <p className="mt-2">{personalInfo.bio}</p>
                </div>
                {(socialLinks.github || socialLinks.linkedin || socialLinks.portfolio || socialLinks.twitter) && (
                  <div className="flex gap-4">
                    {socialLinks.github && <a href={socialLinks.github} className="text-blue-600 hover:underline"><Github className="h-5 w-5" /></a>}
                    {socialLinks.linkedin && <a href={socialLinks.linkedin} className="text-blue-600 hover:underline"><Linkedin className="h-5 w-5" /></a>}
                    {socialLinks.portfolio && <a href={socialLinks.portfolio} className="text-blue-600 hover:underline"><Globe className="h-5 w-5" /></a>}
                    {socialLinks.twitter && <a href={socialLinks.twitter} className="text-blue-600 hover:underline"><Globe className="h-5 w-5" /></a>}
                  </div>
                )}
                {skills.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold">Skills</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {skills.map((skillObj) => (
                        <Badge key={skillObj.id} variant="secondary">{skillObj.skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {projects.some((p) => p.title) && (
                  <div>
                    <h3 className="text-lg font-semibold">Projects</h3>
                    <div className="space-y-4 mt-2">
                      {projects.filter((p) => p.title).map((project) => (
                        <div key={project.id} className="border-l-4 border-blue-500 pl-4">
                          <h4 className="font-medium">{project.title}</h4>
                          <p className="text-sm text-muted-foreground">{project.technologies}</p>
                          <p>{project.description}</p>
                          <div className="flex gap-2 mt-1">
                            {project.link && <a href={project.link} className="text-blue-600 hover:underline text-sm">Live Demo</a>}
                            {project.github && <a href={project.github} className="text-blue-historic hover:underline text-sm">GitHub</a>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}