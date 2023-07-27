"use client";

import useSWR from "swr";
import { agent } from "~/_lib/bsky";
import { match, P } from "ts-pattern";
import { AppBskyFeedDefs, AppBskyFeedPost } from "@atproto/api";
import { Post } from "~/app/post";

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
            if (
              AppBskyFeedPost.isRecord(item.post.record) &&
              item.post.record.text
            ) {
              return <Post key={item.post.cid} {...item.post.record} />;
            }
          })}
        </ul>
      );
    })
    .exhaustive();
}
