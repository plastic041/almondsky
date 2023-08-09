"use client";

import useSWR from "swr";
import { agent } from "~/_lib/bsky";
import { match, P } from "ts-pattern";
import { Post } from "./post";
import { Flex } from "@radix-ui/themes";

export function Timeline() {
  const { data } = useSWR("getTimeline", () => {
    return agent.getTimeline();
  });

  return match(data)
    .with(P.nullish, () => <div>Loading...</div>)
    .with(P.any, ({ data: { feed } }) => {
      console.log();
      return (
        <Flex asChild direction="column" gap="2">
          <ul>
            {feed.map((item) => {
              return <Post item={item} />;
            })}
          </ul>
        </Flex>
      );
    })
    .exhaustive();
}
