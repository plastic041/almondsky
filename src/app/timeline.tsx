"use client";

import useSWR from "swr";
import { agent } from "~/_lib/bsky";
import { match, P } from "ts-pattern";
import { Post } from "./post";

export function Timeline() {
  const { data } = useSWR("getTimeline", () => {
    return agent.getTimeline();
  });

  return match(data)
    .with(P.nullish, () => <div>Loading...</div>)
    .with(P.any, ({ data: { feed } }) => {
      return (
        <ul className="flex flex-col divide-y">
          {feed.map((item) => {
            return <Post key={item.post.cid} item={item} />;
          })}
        </ul>
      );
    })
    .exhaustive();
}
