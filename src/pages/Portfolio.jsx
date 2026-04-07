import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
} from "react-icons/fa";
import { getPortfolioByUsername } from "../services/firestore";
import { LANGUAGE_COLORS } from "../services/github";
import Loader from "../components/common/Loader";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu";

const PORTFOLIO_THEMES = [
  { name: "Default (Primary)", value: "default", color: "bg-primary" },
  { name: "Rose", value: "rose", color: "bg-rose-500", primary: "#f43f5e" },
  { name: "Emerald", value: "emerald", color: "bg-emerald-500", primary: "#10b981" },
  { name: "Amber", value: "amber", color: "bg-amber-500", primary: "#f59e0b" },
  { name: "Violet", value: "violet", color: "bg-violet-500", primary: "#8b5cf6" },
];

export default function Portfolio() {
  const { username } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(PORTFOLIO_THEMES[0]);

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader />
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 bg-background text-foreground">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-4xl">?</div>
          <h1 className="mb-2 text-2xl font-bold">Portfolio Not Found</h1>
          <p className="mb-6 text-muted-foreground">No portfolio has been generated for "{username}" yet.</p>
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
  } = portfolio;

  // Render variables dynamically onto the container to override the theme if custom theme is selected
  const themeStyles = currentTheme.value !== "default" ? {
    "--primary": "0 0 0", // We could inject actual HSL/OKLCH, but for now we'll just style specific elements using inline logic or standard utility overrides
  } : {};

  return (
    <div 
      className={`min-h-screen bg-background text-foreground transition-colors duration-500`}
      style={themeStyles}
    >
      {/* Floating Theme Switcher */}
      <div className="fixed right-6 bottom-6 md:top-6 md:bottom-auto z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full shadow-lg border-border">
              <FaPalette className="text-primary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {PORTFOLIO_THEMES.map((theme) => (
              <DropdownMenuItem 
                key={theme.value} 
                onClick={() => setCurrentTheme(theme)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <span className={`h-4 w-4 rounded-full ${theme.color}`} style={theme.value !== 'default' ? {backgroundColor: theme.primary} : {}} />
                {theme.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 md:py-24">
        <div className="grid gap-8 md:grid-cols-12 md:gap-12">
          
          {/* Left Sidebar (Profile) */}
          <div className="md:col-span-4 md:sticky md:top-24 self-start space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Avatar className="h-32 w-32 border-4 border-background shadow-xl mb-4">
                <AvatarImage src={avatarUrl} alt={name} />
                <AvatarFallback>{name?.charAt(0) || "?"}</AvatarFallback>
              </Avatar>
              
              <h1 className="text-3xl font-bold tracking-tight mb-1">{name || username}</h1>
              <p className="text-muted-foreground flex items-center gap-2 mb-4">
                <FaGithub /> @{username}
              </p>
              
              <p className="text-foreground/90 leading-relaxed mb-6">{bio}</p>
              
              <div className="space-y-3 text-sm text-muted-foreground mb-6">
                {location && <p className="flex items-center gap-2"><FaMapMarkerAlt /> {location}</p>}
                {company && <p className="flex items-center gap-2"><FaBuilding /> {company}</p>}
                {email && <p className="flex items-center gap-2"><FaEnvelope /> <a href={`mailto:${email}`} className="hover:text-foreground">{email}</a></p>}
                {blog && <p className="flex items-center gap-2"><FaLink /> <a href={blog.startsWith("http") ? blog : `https://${blog}`} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">{blog}</a></p>}
                {twitterUsername && <p className="flex items-center gap-2"><FaTwitter /> <a href={`https://twitter.com/${twitterUsername}`} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">@{twitterUsername}</a></p>}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-foreground/80 pt-4 border-t border-border">
                <span className="flex items-center gap-1"><FaUsers /> <strong className="text-foreground">{stats.followers}</strong> followers</span>
                <span className="flex items-center gap-1">· <strong className="text-foreground">{stats.following}</strong> following</span>
              </div>
            </motion.div>
          </div>

          {/* Right Content Area */}
          <div className="md:col-span-8">
            <Tabs defaultValue="projects" className="w-full">
              <TabsList className="mb-6 w-full justify-start overflow-x-auto bg-transparent border-b border-border rounded-none pb-0 h-auto">
                <TabsTrigger value="projects" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none rounded-t-sm px-6 py-3">Projects</TabsTrigger>
                <TabsTrigger value="skills" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none rounded-t-sm px-6 py-3">Skills & Stats</TabsTrigger>
                <TabsTrigger value="contributions" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none rounded-t-sm px-6 py-3">Contributions</TabsTrigger>
              </TabsList>
              
              {/* Projects Tab */}
              <TabsContent value="projects" className="mt-0 outline-none">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-6 sm:grid-cols-2">
                  {projects.map((project, idx) => (
                    <Card key={project.name} className="flex flex-col bg-card/50 hover:bg-card/80 transition-colors border-border shadow-sm">
                      <CardHeader className="p-5 pb-3">
                        <CardTitle className="text-xl flex items-center justify-between">
                          <a href={project.url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-2">
                            <FaBook className="text-muted-foreground text-base" /> {project.name}
                          </a>
                          {project.homepage && (
                            <a href={project.homepage} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                              <FaExternalLinkAlt className="text-sm" />
                            </a>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-5 pt-0 flex-1">
                        <p className="text-muted-foreground text-sm line-clamp-3">{project.description}</p>
                      </CardContent>
                      <CardFooter className="p-5 pt-0 flex items-center gap-4 text-xs text-muted-foreground">
                        {project.language && (
                          <span className="flex items-center gap-1.5">
                            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: LANGUAGE_COLORS[project.language] || LANGUAGE_COLORS.default }} />
                            {project.language}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5 hover:text-foreground cursor-pointer"><FaStar /> {project.stars}</span>
                        <span className="flex items-center gap-1.5 hover:text-foreground cursor-pointer"><FaCodeBranch /> {project.forks}</span>
                      </CardFooter>
                    </Card>
                  ))}
                </motion.div>
                {projects.length === 0 && <p className="text-muted-foreground">No featured projects found.</p>}
              </TabsContent>

              {/* Skills & Stats Tab */}
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
                      <span key={skill} className="px-3 py-1 rounded-md bg-secondary text-secondary-foreground text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Contributions Tab */}
              <TabsContent value="contributions" className="mt-0 outline-none">
                <Card className="bg-card/50 border-border shadow-sm p-6">
                  <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-2">
                      <FaFire className="text-orange-500 text-xl" />
                      <h3 className="text-lg font-semibold">{contributions.totalRecent || 0} contributions in the last month</h3>
                    </div>
                    {stats.currentStreak > 0 && (
                      <div className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-sm font-medium">
                        {stats.currentStreak} day streak!
                      </div>
                    )}
                  </div>
                  {/* Simplified contribution representation or could use the old grid. For now, displaying it simply */}
                  <div className="p-4 rounded-lg border border-border bg-background flex flex-col items-center justify-center min-h-[160px] text-muted-foreground">
                    <p>Contribution graph data visualization goes here.</p>
                    <p className="text-sm mt-2">Active repos: {stats.repos}</p>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
