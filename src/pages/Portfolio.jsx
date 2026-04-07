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
} from "react-icons/fa";
import { getPortfolioByUsername } from "../services/firestore";
import { LANGUAGE_COLORS } from "../services/github";
import Loader from "../components/common/Loader";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu";

const PORTFOLIO_THEMES = [
  { name: "Default (Primary)", value: "default", hex: null },
  { name: "Rose", value: "rose", hex: "#f43f5e" },
  { name: "Emerald", value: "emerald", hex: "#10b981" },
  { name: "Amber", value: "amber", hex: "#f59e0b" },
  { name: "Violet", value: "violet", hex: "#8b5cf6" },
];

export default function Portfolio() {
  const { username } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTheme, setActiveTheme] = useState("default");

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
  } = portfolio;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      {/* Top bar with back button */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-background/80 backdrop-blur-md border-b border-border">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <FaArrowLeft /> Back to Dashboard
        </Link>

        {/* Theme Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full border-border">
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
                  <span className="ml-auto text-xs">✓</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 pt-20 md:py-24 md:pt-24">
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
                <TabsTrigger value="projects" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 rounded-none rounded-t-sm px-6 py-3" style={activeTheme !== "default" ? { "--tw-border-opacity": 1 } : {}} >
                  <span style={activeTheme !== "default" ? {} : {}}>Projects</span>
                </TabsTrigger>
                <TabsTrigger value="skills" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 rounded-none rounded-t-sm px-6 py-3">Skills & Stats</TabsTrigger>
                <TabsTrigger value="contributions" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 rounded-none rounded-t-sm px-6 py-3">Contributions</TabsTrigger>
              </TabsList>

              {/* Projects Tab */}
              <TabsContent value="projects" className="mt-0 outline-none">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-6 sm:grid-cols-2">
                  {projects.map((project) => (
                    <Card key={project.name} className="flex flex-col bg-card/50 hover:bg-card/80 transition-colors border-border shadow-sm">
                      <CardHeader className="p-5 pb-3">
                        <CardTitle className="text-xl flex items-center justify-between">
                          <a href={project.url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-2" style={themedText}>
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
                        <span className="flex items-center gap-1.5"><FaStar /> {project.stars}</span>
                        <span className="flex items-center gap-1.5"><FaCodeBranch /> {project.forks}</span>
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
                      <span
                        key={skill}
                        className={`px-3 py-1 rounded-md text-sm ${themeColor ? "text-white" : "bg-secondary text-secondary-foreground"}`}
                        style={themeColor ? { backgroundColor: themeColor + "22", color: themeColor, border: `1px solid ${themeColor}33` } : {}}
                      >
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
                      <FaFire className="text-xl" style={themeColor ? { color: themeColor } : { color: "#f97316" }} />
                      <h3 className="text-lg font-semibold">{contributions.totalRecent || 0} contributions in the last month</h3>
                    </div>
                    {stats.currentStreak > 0 && (
                      <div
                        className="px-3 py-1 rounded-full text-sm font-medium"
                        style={themeColor
                          ? { backgroundColor: themeColor + "1a", color: themeColor }
                          : { backgroundColor: "rgba(249,115,22,0.1)", color: "#f97316" }
                        }
                      >
                        {stats.currentStreak} day streak!
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg border border-border bg-background text-center">
                      <p className="text-2xl font-bold" style={themedText || {}}>{stats.repos || 0}</p>
                      <p className="text-xs text-muted-foreground mt-1">Repositories</p>
                    </div>
                    <div className="p-4 rounded-lg border border-border bg-background text-center">
                      <p className="text-2xl font-bold" style={themedText || {}}>{stats.stars || 0}</p>
                      <p className="text-xs text-muted-foreground mt-1">Total Stars</p>
                    </div>
                    <div className="p-4 rounded-lg border border-border bg-background text-center">
                      <p className="text-2xl font-bold" style={themedText || {}}>{stats.followers || 0}</p>
                      <p className="text-xs text-muted-foreground mt-1">Followers</p>
                    </div>
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
