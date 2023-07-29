import { RichTextProps, RichTextSegment, AppBskyFeedDefs } from "@atproto/api";
import { AppBskyFeedPost, RichText } from "@atproto/api";
import Link from "next/link";
import { useMemo } from "react";
import {
  RepeatIcon,
  HeartIcon,
  MessageSquareIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import Image from "next/image";

type SegmentProps = {
  segment: RichTextSegment;
};

function Segment({ segment }: SegmentProps) {
  if (segment.isMention()) {
    return (
      <Link
        key={segment.mention?.did}
        href={`/profile/${segment.mention?.id}`}
        className="text-blue-500 cursor-pointer"
      >
        {segment.text}
      </Link>
    );
  }

  if (segment.isLink() && segment.link) {
    return (
      <a
        key={segment.text}
        href={segment.link.uri}
        className="text-blue-500 cursor-pointer"
        target="_blank"
        rel="noreferrer noopener"
        onClick={(e) => e.stopPropagation()}
      >
        {segment.text}
      </a>
    );
  }

  return <span key={segment.text}>{segment.text}</span>;
}

type ContentProps = RichTextProps;

export function Content({ text, facets }: ContentProps) {
  const content = useMemo(() => {
    const rt = new RichText({ text, facets });

    return rt;
  }, [text, facets]);

  return (
    <div className="ml-14">
      {Array.from(content.segments()).map((segment) => (
        <Segment key={segment.text} segment={segment} />
      ))}
    </div>
  );
}

type PostHeaderProps = {
  item: AppBskyFeedDefs.FeedViewPost;
};

function PostHeader({ item }: PostHeaderProps) {
  const post = item.post;
  const author = post.author;
  const name = author.displayName;
  const handle = author.handle;
  const avatar = author.avatar ?? "/avatar.png";

  return (
    <div className="flex flex-col">
      {AppBskyFeedDefs.isReasonRepost(item.reason) && item.reason && (
        <div className="flex ml-14 text-sm items-center mb-2">
          <span className="text-slate-500">@{item.reason.by.displayName}</span>
          <span className="text-slate-700 ml-1">Reposted</span>
          <RepeatIcon className="text-slate-700 inline-block ml-1" size={12} />
        </div>
      )}
      <div className="flex flex-row items-start">
        <div className="w-12 h-12 relative">
          <Image
            fill
            src={avatar}
            alt={handle}
            className="rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col ml-2">
          <div className="flex">
            <span className="font-bold text-slate-900">{name}</span>
            <span className="text-gray-500 ml-1">@{handle}</span>
          </div>
          <div className="text-gray-500 text-sm">
            {post.indexedAt.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}

type PostFooterProps = {
  item: AppBskyFeedDefs.FeedViewPost;
};

function PostFooter({ item }: PostFooterProps) {
  const post = item.post;
  const likeCount = post.likeCount ?? 0;
  const replyCount = post.replyCount ?? 0;
  const repostCount = post.repostCount ?? 0;

  return (
    <div className="flex flex-row justify-between">
      <div className="text-gray-500 flex items-center">
        <MessageSquareIcon className="inline-block mr-1" size={16} />
        {replyCount}
      </div>
      <div className="text-gray-500 flex items-center">
        <RepeatIcon className="inline-block mr-1" size={16} />
        {repostCount}
      </div>
      <div className="text-gray-500 flex items-center">
        <HeartIcon className="inline-block mr-1" size={16} />
        {likeCount}
      </div>
      <div className="text-gray-500 flex items-center">
        <MoreHorizontalIcon className="inline-block mr-1" size={16} />
      </div>
      <div aria-hidden className="w-1 h-1" />
    </div>
  );
}

type PostProps = {
  item: AppBskyFeedDefs.FeedViewPost;
};

export function Post({ item }: PostProps) {
  return (
    <article className="flex flex-col p-4 space-y-2">
      <PostHeader item={item} />
      {AppBskyFeedPost.isRecord(item.post.record) && item.post.record.text && (
        <Content {...item.post.record} />
      )}
      <PostFooter item={item} />
    </article>
  );
}
