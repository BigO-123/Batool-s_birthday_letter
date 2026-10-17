// Server-side gate for the birthday letter.
// The letter text lives ONLY here, so it is never sent to a browser before the date.

// When the letter unlocks. Istanbul time (UTC+3). Change here if needed.
const OPEN_AT = Date.parse("2026-10-29T00:00:00+03:00");

const LETTER = {
  greeting: "To the Lady Batool, upon the day of her birth,",
  intro: [
    "Hear ye, hear ye! Let it be known across the realm, from the highest tower to the humblest tavern, that on this very day the world was graced with one Batool. A scribe was summoned, a candle was lit, and this letter was sealed in wax, that no rascal might read it before the appointed hour.",
    "And now, good lady, the seal is broken. I shall set down my quill and speak to thee plainly."
  ],
  body: [
    "Happy birthday, Batool!",
    "I wanted to give you something more real than a quick message you'd scroll past, so I made you this little letter. I hope it made you smile when you opened it.",
    "Thank you for being the kind of friend who makes ordinary days better, whether it's a coffee that turns into hours of talking, a silly photo, or just being there when it matters. I'm lucky to have you around.",
    "I hope this new year brings you everything you've been working toward, a lot of laughter, and plenty of days that feel as light as today. You deserve good things, and I'll be cheering for you the whole way.",
    "Now go celebrate properly. Eat the cake, take the photos, and don't let anyone give you chores today."
  ],
  closing: "With love, and one very dramatic wax seal,",
  from: "Omar"
};

module.exports = (req, res) => {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("X-Robots-Tag", "noindex");

  const q = req.query || {};
  const now = Date.now();
  // Optional private test key (set as PREVIEW_KEY in Vercel). Not stored in the code.
  const bypass = !!process.env.PREVIEW_KEY && q.key === process.env.PREVIEW_KEY;
  const open = bypass || now >= OPEN_AT;

  // Plain status check: never contains the letter.
  if (!q.open) return res.status(200).json({ open, openAt: OPEN_AT, now });

  // Letter request: only answered once the date has really passed (server clock).
  if (!open) return res.status(403).json({ open: false, openAt: OPEN_AT, now });
  return res.status(200).json({ open: true, letter: LETTER });
};
