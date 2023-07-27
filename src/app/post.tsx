import type { RichTextProps, RichTextSegment } from "@atproto/api";
import { RichText } from "@atproto/api";
import Link from "next/link";
import { useMemo } from "react";

type PostProps = RichTextProps;

export function Post({ text, facets }: PostProps) {
  const content = useMemo(() => {
    const rt = new RichText({ text, facets });

    return rt;
  }, [text, facets]);

  return (
    <p className="">
      {Array.from(content.segments()).map((segment) => (
        <Segment key={segment.text} segment={segment} />
      ))}
    </p>
  );
}

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
  } else if (segment.isLink() && segment.link) {
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
