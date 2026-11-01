# PartyPilot — 3-Minute Demo Walkthrough

> **Purpose:** A step-by-step click path for recording a 3-minute demo video.

---

## Prerequisites

- App running at `http://localhost:5173` (or live Vercel URL)
- Gemini API key configured (for AI section); remove it to demo fallback mode
- Use a clean browser window (or incognito)

---

## Click Path

### 0:00 — App Load (15 seconds)

1. Open the app URL in an **incognito window**
2. Point out:
   - The dark glassmorphism UI
   - No login prompt, no API key prompt
   - The skip-to-content link (tab once to reveal it)
3. Scroll briefly to show the single-screen layout

---

### 0:15 — Event Setup Form (45 seconds)

4. Click **Event Type** → Select **"Wedding"**
5. Click **Total Budget** → Type `1500000` (₹15 lakhs)
6. Click **Guest Count** → Type `200`
7. Click **Event Date** → Pick a date **6 months from today**
8. Click **City** → Type `Jaipur`
9. Click **Theme or Vibe** → Type `Royal Rajasthani with marigolds and fairy lights`
10. Click **"✨ Generate My Plan"**

> **Show:** All sections appear instantly — budget cards, timeline, checklist.

---

### 1:00 — Budget Breakdown (30 seconds)

11. Scroll to the **Budget Breakdown** section
12. Point out:
    - 7 category cards (Venue, Catering, Décor, etc.)
    - Each card shows: total amount, percentage bar, and **per-guest cost**
    - Catering is the largest allocation (~30%)
13. Hover over a card to show the lift animation

---

### 1:30 — Planning Timeline (30 seconds)

14. Scroll to the **Planning Timeline** section
15. Point out:
    - Tasks are sorted chronologically from oldest to newest
    - Each task shows: weeks-before label, calendar date, and task description
    - No overdue items (event is 6 months away)
16. *(Optional)* Set date to **next week** on the form and regenerate — show overdue badges and the short-notice banner

---

### 2:00 — Vendor Checklist (30 seconds)

17. Scroll to the **Vendor Checklist** section
18. Click 3–4 checkboxes (e.g. "Book ceremony venue", "Book caterer")
19. Watch the **progress bar** update in real time
20. Type a custom item in the "Add custom item" field → `Book mehndi artist` → Click **"+ Add"**
21. Check the new custom item
22. Refresh the page → Show that checked state persisted (localStorage)

---

### 2:30 — AI Ideas Panel (20 seconds)

23. Scroll to the **Personalised Ideas** section
24. Click **"✨ Get Personalised Ideas"**
25. Show the **loading spinner** briefly
26. When ideas appear, read out one idea from each of the 5 categories:
    - Decor, Food & Drinks, Activities, Budget-Saving Tips, Local Experience
27. *(Fallback demo)* If AI key is not set: show "Offline ideas mode" banner + curated ideas load automatically — no broken screen

---

### 2:50 — Copy Plan (10 seconds)

28. Scroll back to the top of the plan (below the form)
29. Click **"📋 Copy Plan"**
30. Show the button text change to **"✅ Copied!"**
31. Paste in a text editor to show the formatted plan output

---

## End of Demo

> **Total time: ~3 minutes**

Key talking points to mention:
- Zero setup for any visitor — works in incognito with no API key
- Gemini API key lives **only on the server** — never in client code
- Falls back gracefully to curated ideas if AI is unavailable
- All plan data persists across refresh (localStorage)
- Full keyboard navigation works — Tab through every control
