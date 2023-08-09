import {
  RichTextProps,
  RichTextSegment,
  AppBskyFeedDefs,
  AppBskyEmbedExternal,
  AppBskyEmbedImages,
} from "@atproto/api";
import { AppBskyFeedPost, RichText } from "@atproto/api";
import Link from "next/link";
import { useMemo } from "react";
import {
  RepeatIcon,
  HeartIcon,
  MessageSquareIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import {
  DropdownMenu,
  Avatar,
  Button,
  Card,
  Flex,
  Text,
  AspectRatio,
  Link as OutLink,
} from "@radix-ui/themes";
import Image from "next/image";
import { PostEmbedImage } from "~/app/embed";

type SegmentProps = {
  segment: RichTextSegment;
};

function Segment({ segment }: SegmentProps) {
  if (segment.isMention()) {
    return (
      <Link
        href={`/profile/${segment.mention?.id}`}
        className="text-blue-500 cursor-pointer"
      >
        {segment.text}
      </Link>
    );
  }

  if (segment.isLink() && segment.link) {
    return (
      // <Text color="blue" asChild>
      <OutLink
        href={segment.link.uri}
        className="break-all"
        target="_blank"
        rel="noreferrer noopener"
        onClick={(e) => e.stopPropagation()}
      >
        {segment.text.length > 30
          ? segment.text.slice(0, 30) + "..."
          : segment.text}
      </OutLink>
      // </Text>
    );
  }

  return segment.text;
}

type ContentProps = RichTextProps;

export function Content({ text, facets }: ContentProps) {
  const content = useMemo(() => {
    const rt = new RichText({ text, facets });

    return rt;
  }, [text, facets]);

  return (
    <Text as="p" className="whitespace-pre-wrap">
      {Array.from(content.segments()).map((segment) => (
        <Segment segment={segment} />
      ))}
    </Text>
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

  return (
    <Flex direction="column">
      <Flex direction="row" align="start" gap="2">
        <Flex direction="column">
          <Flex gap="1">
            <Text
              color="gray"
              weight="bold"
              className="text-[var(--accent-12)]"
            >
              {name}
            </Text>
            <Text color="gray" className="text-[var(--accent-11)]">
              @{handle}
            </Text>
          </Flex>
          <Text color="gray" size="2" className="text-[var(--accent-11)]">
            {post.indexedAt.toLocaleString()}
          </Text>
        </Flex>
      </Flex>
    </Flex>
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
    <Text color="gray" asChild>
      <Flex justify="between" align="center">
        <Button variant="ghost" className="mx-0">
          <MessageSquareIcon size={16} />
          <Text>{replyCount}</Text>
        </Button>
        <Button variant="ghost" className="mx-0">
          <RepeatIcon size={16} />
          <Text>{repostCount}</Text>
        </Button>
        <Button variant="ghost" className="mx-0">
          <HeartIcon size={16} />
          <Text>{likeCount}</Text>
        </Button>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button variant="ghost" className="mx-0">
              <MoreHorizontalIcon size={16} />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item color="red">Report</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
        <div aria-hidden className="w-1 h-1" />
      </Flex>
    </Text>
  );
}

type PostProps = {
  item: AppBskyFeedDefs.FeedViewPost;
};

export function Post({ item }: PostProps) {
  const post = item.post;
  const author = post.author;
  const handle = author.handle;
  const avatar = author.avatar ?? "/avatar.png";

  return (
    <Card variant="classic">
      <Flex direction="column" gap="2">
        <Flex direction="column" gap="1">
          {AppBskyFeedDefs.isReasonRepost(item.reason) && item.reason && (
            <Flex direction="row" ml="8" align="center" gap="1">
              <Text size="2" className="text-[var(--accent-11)]">
                @{item.reason.by.displayName}
              </Text>
              <Text size="2" color="gray" className="text-[var(--accent-11)]">
                Reposted
              </Text>
              <Text size="2" color="gray" className="text-[var(--accent-11)]">
                <RepeatIcon size={12} />
              </Text>
            </Flex>
          )}
          {item.reply && AppBskyFeedDefs.isPostView(item.reply.parent) && (
            <Flex direction="row" ml="8" align="center" gap="1">
              <Text size="2" color="gray" className="text-[var(--accent-11)]">
                Replied to
              </Text>
              <Text size="2" className="text-[var(--accent-11)]">
                @{item.reply?.parent.author.displayName}
              </Text>
              <Text size="2" color="gray" className="text-[var(--accent-11)]">
                <MessageSquareIcon size={12} />
              </Text>
            </Flex>
          )}
        </Flex>
        <Flex gap="2">
          <Avatar
            fallback={handle.slice(0, 1)}
            size="3"
            radius="full"
            src={avatar}
          />
          <Flex direction="column" gap="2" grow="1">
            <PostHeader item={item} />
            {AppBskyFeedPost.isRecord(item.post.record) &&
              item.post.record.text && <Content {...item.post.record} />}
            {item.post.embed && AppBskyEmbedImages.isView(item.post.embed) && (
              <PostEmbedImage view={item.post.embed} />
            )}
          </Flex>
        </Flex>
        <PostFooter item={item} />
      </Flex>
    </Card>
  );
}
