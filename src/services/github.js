// Calculate contribution activity from events or GraphQL payload.
export function calculateContributionActivity(events) {
  if (events && events._graphQL && events.data) {
    const calendar = events.data;
    const contributionsByDate = {};

    calendar.weeks.forEach(week => {
      week.contributionDays.forEach(day => {
        if (day.contributionCount > 0) {
          contributionsByDate[day.date] = day.contributionCount;
        }
      });
    });

    const sortedDates = Object.keys(contributionsByDate).sort().reverse();
    let streakDays = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedDates.length; i++) {
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);
      const expectedDateStr = expectedDate.toISOString().split("T")[0];

      if (contributionsByDate[expectedDateStr]) {
        streakDays++;
      } else if (i > 0) {
        break;
      }
    }

    return {
      contributionsByDate,
      totalRecent: calendar.totalContributions,
      streakDays,
    };
  }

  const contributionsByDate = {};
  const eventTypes = ["PushEvent", "PullRequestEvent", "IssuesEvent", "IssueCommentEvent", "CreateEvent", "ReleaseEvent"];

  if (Array.isArray(events)) {
    events.forEach((event) => {
      if (eventTypes.includes(event.type)) {
        const date = event.created_at?.split("T")[0];
        if (date) contributionsByDate[date] = (contributionsByDate[date] || 0) + 1;
      }
    });
  }

  const totalRecent = Object.values(contributionsByDate).reduce((sum, count) => sum + count, 0);
  const sortedDates = Object.keys(contributionsByDate).sort().reverse();
  let streakDays = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sortedDates.length; i++) {
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);
    const expectedDateStr = expectedDate.toISOString().split("T")[0];

    if (contributionsByDate[expectedDateStr]) {
      streakDays++;
    } else if (i > 0) {
      break;
    }
  }

  return { contributionsByDate, totalRecent, streakDays };
}

// Language colors for visualization
export const LANGUAGE_COLORS = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5", Java: "#b07219",
  "C++": "#f34b7d", C: "#555555", "C#": "#239120", Go: "#00ADD8", Rust: "#dea584",
  Ruby: "#701516", PHP: "#4F5D95", Swift: "#F05138", Kotlin: "#A97BFF", Dart: "#00B4AB",
  Scala: "#c22d40", HTML: "#e34c26", CSS: "#563d7c", SCSS: "#c6538c", Shell: "#89e051",
  Vue: "#41b883", Svelte: "#ff3e00", React: "#61dafb", default: "#8b949e",
};
