import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaStar,
  FaCodeBranch,
  FaMapMarkerAlt,
  FaEnvelope,
  FaLink,
  FaTwitter,
  FaBuilding,
  FaFire,
  FaUsers,
  FaBook,
  FaPalette,
  FaArrowLeft,
  FaShare,
  FaMoon,
  FaSun,
  FaGripHorizontal,
  FaList,
  FaBriefcase,
  FaGraduationCap,
  FaTrophy,
  FaCertificate,
} from "react-icons/fa";
import { getPortfolioByUsername, saveCustomUrlMapping } from "../services/firestore";
import { LANGUAGE_COLORS } from "../services/github";
import Loader from "../components/common/Loader";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Input } from "../components/ui/input";

const PORTFOLIO_THEMES = [
  { name: "Default (Primary)", value: "default", hex: null },
  { name: "Rose", value: "rose", hex: "#f43f5e" },
  { name: "Emerald", value: "emerald", hex: "#10b981" },
  { name: "Amber", value: "amber", hex: "#f59e0b" },
  { name: "Violet", value: "violet", hex: "#8b5cf6" },
];

export default function Portfolio() {
  const { username } = useParams();
  const { user } = useAuth(); // for checking if they own the portfolio for "Share" creation
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTheme, setActiveTheme] = useState("default");
  
  // UI Controls
  const [layoutMode, setLayoutMode] = useState("classic"); // "tabs" or "classic"
  const [isDarkMode, setIsDarkMode] = useState(true); // Assuming dark by default
  
  // Share Modal
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [customPath, setCustomPath] = useState("");
  const [shareFeedback, setShareFeedback] = useState("");
  const [isSavingUrl, setIsSavingUrl] = useState(false);

  useEffect(() => {
    async function loadPortfolio() {
      try {
        setLoading(true);
        setError(false);
        const data = await getPortfolioByUsername(username);
        setPortfolio(data);
      } catch (err) {
        console.error("Error loading portfolio:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    if (username) loadPortfolio();
  }, [username]);

  // Toggle document root class for dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Handle Share / Custom URL
  async function handleCreateCustomUrl() {
    if (!customPath.trim()) return;
    if (!user || user.uid !== portfolio.userId) {
      setShareFeedback("Only the owner can create a custom URL.");
      return;
    }
    
    setIsSavingUrl(true);
    setShareFeedback("");
    try {
      await saveCustomUrlMapping(customPath, user.uid);
      setShareFeedback("Success! Custom URL claimed.");
      // Refresh local portfolio data mock
      setPortfolio(p => ({ ...p, customUrl: customPath.toLowerCase() }));
    } catch (err) {
      setShareFeedback(err.message || "Failed to claim URL.");
    } finally {
      setIsSavingUrl(false);
    }
  }

  function handleCopyShareLink() {
    const slug = portfolio.customUrl || portfolio.username || username;
    const url = `${window.location.origin}/p/${slug}`;
    navigator.clipboard.writeText(url);
    setShareFeedback("Link copied to clipboard!");
    setTimeout(() => setShareFeedback(""), 3000);
  }

  // Get the current theme's hex color (null = use CSS variable defaults)
  const themeColor = PORTFOLIO_THEMES.find(t => t.value === activeTheme)?.hex || null;

  // Helper: apply theme color to inline styles
  const themed = (property) => themeColor ? { [property]: themeColor } : {};
  const themedText = themeColor ? { color: themeColor } : {};
  const themedBg = themeColor ? { backgroundColor: themeColor } : {};
  const themedBorder = themeColor ? { borderColor: themeColor } : {};

  if (loading) {
    return <Loader />;
  }

  if (error || !portfolio) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 bg-background text-foreground">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-4xl">?</div>
          <h1 className="mb-2 text-2xl font-bold">Portfolio Not Found</h1>
          <p className="mb-6 text-muted-foreground">No portfolio has been generated for &quot;{username}&quot; yet.</p>
          <Link to="/dashboard">
            <Button>Generate Portfolio</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const {
    name,
    bio,
    avatarUrl,
    location,
    company,
    blog,
    email,
    twitterUsername,
    skills = [],
    projects = [],
    languages = [],
    contributions = {},
    stats = {},
    readmeSections = {},
  } = portfolio;

  // Mock a contribution heatmap grid
  const renderHeatmap = () => {
    // 52 weeks * 7 days Approx
    const cellCount = 364; 
    const baseHex = themeColor || "#6366f1"; // default to primary indigo
    const cells = Array.from({ length: cellCount }).map((_, i) => {
      // Create random mock density based on streak & contributions. Higher density towards end.
      const factor = i / cellCount; 
      const rand = Math.random() + (factor * 0.4); 
      let level = 0;
      if (rand > 1.2) level = 4;
      else if (rand > 0.9) level = 3;
      else if (rand > 0.6) level = 2;
      else if (rand > 0.3) level = 1;

      if (level === 0) {
        return <div key={i} className="w-3 h-3 rounded-[2px] bg-foreground/5" />;
      }
      return (
        <div 
          key={i} 
          className="w-3 h-3 rounded-[2px]" 
          style={{ backgroundColor: baseHex, opacity: level * 0.25 + 0.1 }}
          title={`${level} contributions`}
        />
      );
    });

    return (
      <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
        <div className="min-w-[750px]">
          <div className="flex text-xs text-muted-foreground mb-2 justify-between">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
          <div className="flex gap-1 flex-col h-[105px] flex-wrap content-start">
            {cells}
          </div>
          <div className="flex justify-between items-center text-xs text-muted-foreground mt-3">
            <span>{contributions.totalRecent || 0} contributions in the last year</span>
            <div className="flex items-center gap-1">
              Less 
              <div className="w-3 h-3 rounded-[2px] bg-foreground/5 ml-1" />
              <div className="w-3 h-3 rounded-[2px]" style={{ backgroundColor: baseHex, opacity: 0.35 }} />
              <div className="w-3 h-3 rounded-[2px]" style={{ backgroundColor: baseHex, opacity: 0.60 }} />
              <div className="w-3 h-3 rounded-[2px]" style={{ backgroundColor: baseHex, opacity: 0.85 }} />
              <div className="w-3 h-3 rounded-[2px]" style={{ backgroundColor: baseHex, opacity: 1 }} />
              More
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProjects = () => (
    <div className={`grid gap-6 ${layoutMode === 'classic' ? 'sm:grid-cols-2 md:grid-cols-2' : 'sm:grid-cols-2'}`}>
      {projects.map((project) => {
        const langColor = LANGUAGE_COLORS[project.language] || (themeColor || "#6366f1");
        return (
          <Card key={project.name} className="flex flex-col bg-card/60 hover:bg-card/90 transition-colors border-border shadow-md overflow-hidden relative group">
            {/* Top Color Line */}
            <div className="h-1.5 w-full absolute top-0 left-0" style={{ backgroundColor: langColor }} />
            
            <CardHeader className="p-5 pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="hover:underline flex flex-col gap-1 text-foreground">
                      <span className="text-sm font-normal text-muted-foreground">{portfolio.username || username}/</span>
                      <span className="font-bold" style={themedText}>{project.name}</span>
                    </a>
                  </CardTitle>
                </div>
                {/* Avatar matching Theo's style top right of project card */}
                <Avatar className="h-10 w-10 border border-border shadow-sm">
                  <AvatarImage src={avatarUrl} alt={name} />
                  <AvatarFallback>{name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-2 flex-1">
              <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{project.description || "A GitHub project."}</p>
              
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground mb-4">
                <span className="flex items-center gap-1"><FaStar className="text-yellow-500" /> {project.stars}</span>
                <span className="flex items-center gap-1"><FaCodeBranch /> {project.forks}</span>
              </div>

              {/* Technologies / Topics Pills */}
              <div className="flex flex-wrap gap-2">
                {project.language && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-accent text-foreground lowercase tracking-wider border border-border/50">
                    {project.language}
                  </span>
                )}
                {project.topics?.slice(0, 2).map((t) => (
                  <span key={t} className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-accent/50 text-muted-foreground lowercase tracking-wider">
                    {t}
                  </span>
                ))}
              </div>
            </CardContent>
            
            <CardFooter className="p-5 pt-0 flex items-center justify-between gap-3 border-t border-border/30 mt-4 pt-4">
               <a href={project.url} target="_blank" rel="noopener noreferrer" className="flex-1">
                 <Button variant="outline" className="w-full text-xs h-8 gap-2 bg-background hover:bg-accent rounded-full border-border">
                   <FaGithub /> Code
                 </Button>
               </a>
               {project.homepage && (
                 <a href={project.homepage} target="_blank" rel="noopener noreferrer" className="flex-1">
                   <Button className="w-full text-xs h-8 gap-2 rounded-full shadow-md" style={themedBg}>
                     <FaExternalLinkAlt /> Demo
                   </Button>
                 </a>
               )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );

  const renderSections = () => {
    return (
      <div className="space-y-16 mt-16">
        
        {/* Experience Section */}
        {readmeSections?.experience?.length > 0 && (
           <section>
             <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-2">
               <FaBriefcase className="text-xl" style={themedText} />
               <h2 className="text-2xl font-bold text-foreground tracking-tight">Work Experience</h2>
             </div>
             <div className="space-y-6">
                {readmeSections.experience.map((exp, i) => (
                  <div key={i} className="rounded-xl border border-border bg-card/30 p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                      <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                        {typeof exp === "string" ? exp : exp.title || exp.role}
                      </h3>
                      {exp.date && <span className="text-sm font-medium text-muted-foreground">{exp.date}</span>}
                    </div>
                    {exp.company && <p className="text-sm font-semibold text-primary mb-3" style={themedText}>{exp.company}</p>}
                    {exp.description && (
                      <ul className="text-sm text-foreground/80 space-y-1 ml-4 list-disc marker:text-muted">
                        {(Array.isArray(exp.description) ? exp.description : [exp.description]).map((d, j) => (
                          <li key={j}>{d}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
             </div>
           </section>
        )}

        {/* Education Section */}
        {readmeSections?.education?.length > 0 && (
           <section>
             <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-2">
               <FaGraduationCap className="text-xl" style={themedText} />
               <h2 className="text-2xl font-bold text-foreground tracking-tight">Education</h2>
             </div>
             <div className="space-y-4">
                {readmeSections.education.map((edu, i) => (
                  <div key={i} className="flex justify-between items-start border-l-2 pl-4 py-1 border-border">
                    <div>
                      <h3 className="font-bold text-foreground">{typeof edu === "string" ? edu : edu.institution || edu.school}</h3>
                      {edu.degree && <p className="text-sm text-muted-foreground">{edu.degree}</p>}
                      {edu.gpa && <p className="text-xs text-primary mt-1" style={themedText}>CGPA: {edu.gpa}</p>}
                    </div>
                    {edu.date && <span className="text-sm text-muted-foreground text-right">{edu.date}</span>}
                  </div>
                ))}
             </div>
           </section>
        )}

        {/* Achievements Section */}
        {readmeSections?.achievements?.length > 0 && (
           <section>
             <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-2">
               <FaTrophy className="text-xl" style={themedText} />
               <h2 className="text-2xl font-bold text-foreground tracking-tight">Achievements</h2>
             </div>
             <ul className="grid sm:grid-cols-2 gap-4">
                {readmeSections.achievements.map((ach, i) => (
                  <li key={i} className="flex items-start gap-2 bg-secondary/30 p-3 rounded-lg text-sm text-foreground">
                    <FaStar className="text-yellow-500 shrink-0 mt-0.5" />
                    <span>{typeof ach === "string" ? ach : ach.title || ach}</span>
                  </li>
                ))}
             </ul>
           </section>
        )}

        {/* Certifications Section */}
        {readmeSections?.certifications?.length > 0 && (
           <section>
             <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-2">
               <FaCertificate className="text-xl" style={themedText} />
               <h2 className="text-2xl font-bold text-foreground tracking-tight">Certifications</h2>
             </div>
             <div className="flex flex-wrap gap-3">
                {readmeSections.certifications.map((cert, i) => (
                  <span key={i} className="px-4 py-2 border border-border bg-card rounded-full text-sm font-medium hover:border-primary transition-colors cursor-default" style={themeColor ? { "--tw-border-opacity": 1, ...themedBg } : {}}>
                    {typeof cert === "string" ? cert : cert.name || cert.title}
                  </span>
                ))}
             </div>
           </section>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      
      {/* --- TOP CONTROL BAR --- */}
      <div className="fixed top-0 left-0 right-0 z-50 flex flex-wrap items-center justify-between px-6 py-3 bg-background/80 backdrop-blur-md border-b border-border/50">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-sm font-semibold text-foreground/70 hover:text-foreground transition-colors"
        >
          <FaArrowLeft /> Dashboard
        </Link>

        {/* Action Group: Log In (if guest), Layout, Theme, Share */}
        <div className="flex items-center gap-2 sm:gap-4">
          {!user && (
            <Link to="/login">
              <Button variant="ghost" className="h-9 px-3 gap-2 text-muted-foreground hover:text-foreground hidden sm:flex">
                <FaGithub /> Sign in with GitHub
              </Button>
            </Link>
          )}

          <div className="flex items-center bg-card border border-border rounded-lg p-0.5">
            <button 
              onClick={() => setLayoutMode("tabs")}
              className={`p-2 rounded-md transition-colors ${layoutMode === "tabs" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              title="Tabs Layout"
            >
              <FaGripHorizontal size={14} />
            </button>
            <button 
              onClick={() => setLayoutMode("classic")}
              className={`p-2 rounded-md transition-colors ${layoutMode === "classic" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              title="Classic Layout"
            >
              <FaList size={14} />
            </button>
          </div>

          <div className="w-px h-5 bg-border hidden sm:block" />

          {/* Theme Palette */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9 border-border bg-card hover:bg-accent rounded-full">
                <FaPalette style={themedText} className={themeColor ? "" : "text-primary"} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {PORTFOLIO_THEMES.map((theme) => (
                <DropdownMenuItem
                  key={theme.value}
                  onClick={() => setActiveTheme(theme.value)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <span
                    className={`h-4 w-4 rounded-full ${theme.hex ? "" : "bg-primary"}`}
                    style={theme.hex ? { backgroundColor: theme.hex } : {}}
                  />
                  {theme.name}
                  {activeTheme === theme.value && (
                    <span className="ml-auto text-xs font-bold text-primary">✓</span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dark Mode Toggle */}
          <Button 
            variant="outline" 
            size="icon" 
            className="h-9 w-9 border-border bg-card hover:bg-accent rounded-full"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? <FaMoon size={14} /> : <FaSun size={14} />}
          </Button>

          {/* Share Button */}
          <Button 
            className="h-9 px-4 gap-2 rounded-full font-semibold shadow-sm ml-1" 
            style={themedBg}
            onClick={() => setShareModalOpen(true)}
          >
            <FaShare size={12} /> Share
          </Button>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="mx-auto max-w-5xl px-6 py-12 pt-28 pb-32">
        
        {/* Universal Header - Rendered at top in Classic, or Left Sidebar in Tabs */}
        <div className={layoutMode === "tabs" ? "grid gap-8 md:grid-cols-12 md:gap-12" : "flex flex-col gap-10"}>
          
          <div className={layoutMode === "tabs" ? "md:col-span-4 md:sticky md:top-28 self-start space-y-6" : "w-full border-b border-border/50 pb-10"}>
            <motion.div 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }}
              className={layoutMode === "classic" ? "flex flex-col md:flex-row md:items-center justify-between gap-8" : ""}
            >
              <div className="order-2 md:order-1 flex-1">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-foreground" style={layoutMode === 'classic' ? themedText : {}}>
                  {name || username}
                </h1>
                <p className="text-muted-foreground flex items-center gap-2 mb-4 font-medium">
                  <FaGithub /> @{username}
                </p>
                
                <p className="text-foreground/90 leading-relaxed mb-6 max-w-xl text-lg">{bio}</p>
                
                <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground mb-6">
                  {location && <span className="flex items-center gap-2"><FaMapMarkerAlt /> {location}</span>}
                  {company && <span className="flex items-center gap-2"><FaBuilding /> {company}</span>}
                  <span className="flex items-center gap-2"><FaBook /> {stats.repos || 0} repos</span>
                  <span className="flex items-center gap-2"><FaUsers /> {stats.followers || 0} followers</span>
                  <span className="flex items-center gap-2">· {stats.following || 0} following</span>
                </div>
                
                <div className="flex flex-wrap gap-4 text-muted-foreground mt-2">
                  <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors p-2 bg-card rounded-full border border-border"><FaGithub size={18} /></a>
                  {twitterUsername && <a href={`https://twitter.com/${twitterUsername}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#1DA1F2] transition-colors p-2 bg-card rounded-full border border-border"><FaTwitter size={18} /></a>}
                  {blog && <a href={blog.startsWith("http") ? blog : `https://${blog}`} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors p-2 bg-card rounded-full border border-border"><FaExternalLinkAlt size={16} /></a>}
                </div>
              </div>

              <div className={`order-1 md:order-2 ${layoutMode === "classic" ? "flex-shrink-0" : ""}`}>
                <Avatar className={`border-4 border-background shadow-2xl ${layoutMode === "classic" ? "h-40 w-40 md:h-56 md:w-56" : "h-32 w-32 mb-4"}`}>
                  <AvatarImage src={avatarUrl} alt={name} />
                  <AvatarFallback className="text-4xl">{name?.charAt(0) || "?"}</AvatarFallback>
                </Avatar>
              </div>
            </motion.div>
          </div>

          {/* Body */}
          <div className={layoutMode === "tabs" ? "md:col-span-8" : "w-full"}>
            
            {/* --- CLASSIC LAYOUT BODY --- */}
            {layoutMode === "classic" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-16">
                
                {/* Heatmap Section */}
                <section>
                  <h2 className="text-2xl font-bold tracking-tight mb-1" style={themedText}>Contributions</h2>
                  <p className="text-sm text-muted-foreground mb-6">Activity over the past year</p>
                  <Card className="p-8 border border-border bg-card/30 shadow-sm overflow-hidden">
                    {renderHeatmap()}
                  </Card>
                </section>

                {/* Classic Projects Section */}
                <section>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold tracking-tight mb-1" style={themedText}>Featured Work</h2>
                    <p className="text-sm text-muted-foreground">{stats.stars || 0} stars across {stats.repos || 0} repositories</p>
                  </div>
                  {renderProjects()}
                </section>

                {/* Additional Sections (Experience, Education) */}
                {renderSections()}

              </motion.div>
            )}

            {/* --- TABS LAYOUT BODY --- */}
            {layoutMode === "tabs" && (
              <Tabs defaultValue="projects" className="w-full">
                <TabsList className="mb-8 w-full justify-start overflow-hidden bg-transparent border-b border-border rounded-none pb-0 h-auto flex flex-nowrap">
                  <TabsTrigger value="projects" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 rounded-none rounded-t-sm px-6 py-3 font-semibold" style={activeTheme !== "default" ? { "--tw-border-opacity": 1, borderColor: themeColor || "inherit" } : {}} >
                    Projects
                  </TabsTrigger>
                  <TabsTrigger value="skills" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 rounded-none rounded-t-sm px-6 py-3 font-semibold" style={activeTheme !== "default" ? { "--tw-border-opacity": 1, borderColor: themeColor || "inherit" } : {}}>
                    Skills & Data
                  </TabsTrigger>
                  <TabsTrigger value="contributions" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 rounded-none rounded-t-sm px-6 py-3 font-semibold" style={activeTheme !== "default" ? { "--tw-border-opacity": 1, borderColor: themeColor || "inherit" } : {}}>
                    Contributions
                  </TabsTrigger>
                  {(readmeSections?.experience?.length > 0 || readmeSections?.education?.length > 0) && (
                    <TabsTrigger value="resume" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 rounded-none rounded-t-sm px-6 py-3 font-semibold" style={activeTheme !== "default" ? { "--tw-border-opacity": 1, borderColor: themeColor || "inherit" } : {}}>
                      Resume Info
                    </TabsTrigger>
                  )}
                </TabsList>
                
                <TabsContent value="projects" className="mt-0 outline-none">
                  {renderProjects()}
                </TabsContent>

                <TabsContent value="skills" className="mt-0 outline-none space-y-8">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h3 className="text-lg font-semibold mb-4">Top Languages</h3>
                    <div className="mb-4 flex h-3 w-full overflow-hidden rounded-full bg-secondary">
                      {languages.slice(0, 8).map((lang) => (
                        <div
                          key={lang.language}
                          className="h-full hover:opacity-80 transition-opacity"
                          style={{ width: `${lang.percentage}%`, backgroundColor: LANGUAGE_COLORS[lang.language] || LANGUAGE_COLORS.default }}
                          title={`${lang.language}: ${lang.percentage}%`}
                        />
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      {languages.slice(0, 8).map((lang) => (
                        <div key={lang.language} className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: LANGUAGE_COLORS[lang.language] || LANGUAGE_COLORS.default }} />
                          <span className="font-medium text-foreground">{lang.language}</span>
                          <span className="text-muted-foreground">{lang.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <div className="pt-8 border-t border-border">
                    <h3 className="text-lg font-semibold mb-4">Skills Extracted by AI</h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className={`px-3 py-1 rounded-md text-sm ${themeColor ? "" : "bg-secondary text-secondary-foreground"}`}
                          style={themeColor ? { backgroundColor: themeColor + "22", color: themeColor, border: `1px solid ${themeColor}33` } : {}}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="contributions" className="mt-0 outline-none">
                   <div className="mb-6">
                     <div className="flex items-center gap-2 mb-2">
                        <FaFire className="text-xl" style={themeColor ? { color: themeColor } : { color: "#f97316" }} />
                        <h3 className="text-lg font-semibold tracking-tight">{contributions.totalRecent || 0} contributions</h3>
                     </div>
                     <p className="text-sm text-muted-foreground">Activity heatmap over the past calendar year.</p>
                   </div>
                   <Card className="p-6 md:p-8 border border-border bg-card/30 shadow-sm overflow-hidden mb-6">
                      {renderHeatmap()}
                   </Card>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {stats.currentStreak > 0 && (
                        <div className="p-4 rounded-lg border border-border bg-card/50 text-center flex flex-col justify-center">
                          <p className="text-2xl font-bold" style={themeColor ? { color: themeColor } : { color: "#f97316" }}>{stats.currentStreak}</p>
                          <p className="text-xs text-muted-foreground mt-1">Day Streak</p>
                        </div>
                      )}
                      <div className="p-4 rounded-lg border border-border bg-card/50 text-center flex flex-col justify-center">
                        <p className="text-2xl font-bold text-foreground">{stats.repos || 0}</p>
                        <p className="text-xs text-muted-foreground mt-1">Repositories</p>
                      </div>
                      <div className="p-4 rounded-lg border border-border bg-card/50 text-center flex flex-col justify-center">
                        <p className="text-2xl font-bold text-foreground">{stats.stars || 0}</p>
                        <p className="text-xs text-muted-foreground mt-1">Total Stars</p>
                      </div>
                      <div className="p-4 rounded-lg border border-border bg-card/50 text-center flex flex-col justify-center">
                        <p className="text-2xl font-bold text-foreground">{stats.followers || 0}</p>
                        <p className="text-xs text-muted-foreground mt-1">Followers</p>
                      </div>
                    </div>
                </TabsContent>

                <TabsContent value="resume" className="mt-0 outline-none">
                  {renderSections()}
                </TabsContent>
              </Tabs>
            )}

          </div>
        </div>
      </div>

      {/* --- SHARE MODAL --- */}
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-xl">Share Portfolio</DialogTitle>
            <p className="text-sm text-muted-foreground">Create a custom URL or share using the link below.</p>
          </DialogHeader>
          <div className="space-y-6 py-4">
            
            {/* Custom URL form - only for owner */}
            {user && user.uid === portfolio.userId && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Create Custom URL (Optional)</label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 flex items-center rounded-md border border-input bg-transparent px-3 py-1 shadow-sm transition-colors focus-within:border-primary">
                    <span className="text-muted-foreground text-sm border-r border-border pr-2 mr-2">
                      {window.location.host}/p/
                    </span>
                    <input
                      type="text"
                      className="flex-1 h-8 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                      placeholder="your-custom-url"
                      value={customPath}
                      onChange={(e) => setCustomPath(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    />
                  </div>
                  <Button 
                    onClick={handleCreateCustomUrl} 
                    disabled={isSavingUrl || !customPath.trim()}
                    style={themedBg}
                    className={themeColor ? "" : "bg-primary"}
                  >
                    Claim
                  </Button>
                </div>
              </div>
            )}

            {/* Readonly Link View */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Portfolio URL</label>
              <div className="flex items-center relative">
                <Input 
                  readOnly 
                  value={`${window.location.origin}/p/${portfolio.customUrl || portfolio.username || username}`} 
                  className="pr-12 bg-secondary/50 font-mono text-xs"
                />
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="absolute right-1 top-1 h-7 w-7 text-muted-foreground hover:text-foreground"
                  onClick={handleCopyShareLink}
                >
                  <FaLink size={12} />
                </Button>
              </div>
            </div>

            {/* Feedback Message */}
            {shareFeedback && (
              <p className={`text-sm font-medium ${shareFeedback.includes('Success') || shareFeedback.includes('copied') ? 'text-emerald-500' : 'text-red-500'}`}>
                {shareFeedback}
              </p>
            )}

          </div>
          <DialogFooter className="sm:justify-between w-full">
            <Button 
              className="w-full sm:w-auto flex-1 gap-2 rounded-full font-semibold"
              onClick={handleCopyShareLink}
              style={themedBg}
            >
              <FaShare size={14} /> Copy Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
