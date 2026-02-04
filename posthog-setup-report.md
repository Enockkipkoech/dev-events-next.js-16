# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js 16 App Router project with PostHog analytics. The integration includes client-side event tracking with automatic exception capture, a reverse proxy configuration for reliable data collection, and custom event tracking for key user interactions across the site.

## Integration Summary

### Files Created
- `instrumentation-client.ts` - PostHog client initialization with exception capture and debug mode
- `.env` - Environment variables for PostHog API key and host

### Files Modified
- `next.config.ts` - Added rewrites for PostHog reverse proxy (bypasses ad blockers)
- `components/ExploreBtn.tsx` - Added explore button click tracking
- `components/EventCard.tsx` - Added event card click tracking with properties
- `components/Navbar.tsx` - Added navigation link click tracking

## Events Tracked

| Event Name | Description | File |
|------------|-------------|------|
| `explore_events_clicked` | User clicks the Explore Events button to navigate to the events section | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicks on an event card to view event details (includes event_title, event_slug, event_location, event_date properties) | `components/EventCard.tsx` |
| `nav_link_clicked` | User clicks a navigation link in the navbar (includes link_name property) | `components/Navbar.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

### Dashboard
- [Analytics basics](https://us.posthog.com/project/304867/dashboard/1200823) - Main analytics dashboard

### Insights
- [Event Card Clicks Over Time](https://us.posthog.com/project/304867/insights/6ifPEJd3) - Track how often users click on event cards
- [Navigation Link Clicks](https://us.posthog.com/project/304867/insights/t2lQSuG2) - Track navigation behavior broken down by link name
- [Explore Button Engagement](https://us.posthog.com/project/304867/insights/P0MPYdxG) - Track explore button clicks over time
- [Explore to Event Card Funnel](https://us.posthog.com/project/304867/insights/mVkQBgqe) - Conversion funnel from exploring to clicking events
- [Top Event Cards by Location](https://us.posthog.com/project/304867/insights/MgcIgjXM) - Event card clicks broken down by event location

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
