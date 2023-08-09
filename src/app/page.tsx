"use client";

import { agent } from "~/_lib/bsky";
import { useEffect, useState } from "react";
import { match, P } from "ts-pattern";
import { getSession } from "~/_lib/bsky";
import { useRouter } from "next/navigation";
import { AtpSessionData } from "@atproto/api";
import { Timeline } from "~/app/timeline";
import { Container, Flex } from "@radix-ui/themes";

export default function Home() {
  const [session, setSession] = useState<AtpSessionData | null | undefined>(
    undefined
  );
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const session = getSession();

      if (!session) {
        router.push("/login");
      } else {
        try {
          await agent.resumeSession({ ...session });
          setSession(session);
        } catch {
          router.push("/login");
        }
      }
    })();
  }, [router]);

  return (
    <Container size="1">
      {match(session)
        .with(P.not(P.nullish), (session) => (
          <Flex direction="column">
            <h3 className="text-xl font-mono">@{session.handle}</h3>
            <Timeline />
          </Flex>
        ))
        .with(null, () => (
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold">Not logged in</h1>
            <p className="text-xl">You are not logged in</p>
          </div>
        ))
        .with(undefined, () => (
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold">Loading...</h1>
            <p className="text-xl">Checking session...</p>
          </div>
        ))
        .exhaustive()}
    </Container>
  );
}
