import { BskyAgent } from "@atproto/api";
import type { AtpSessionData } from "@atproto/api";

export const agent = new BskyAgent({
  service: "https://bsky.social/",
  persistSession: (evt, session) => {
    console.log("persistSession", evt, session);
    if (session) {
      sessionStorage.setItem("bsky-session", JSON.stringify(session));
    }
  },
});

export function getSession() {
  const session = sessionStorage.getItem("bsky-session");
  if (!session) {
    return null;
  }
  return JSON.parse(session) as AtpSessionData;
}
