import { AppBskyEmbedImages } from "@atproto/api";
import { AspectRatio, Flex } from "@radix-ui/themes";
import NextImage from "next/image";
import { match, P } from "ts-pattern";

type ImageProps = {
  viewImage: AppBskyEmbedImages.ViewImage;
};

function SingleImage({ viewImage }: ImageProps) {
  return (
    <AspectRatio ratio={16 / 9}>
      <NextImage
        src={viewImage.fullsize}
        alt={viewImage.alt}
        layout="fill"
        objectFit="cover"
        className="rounded-lg"
      />
    </AspectRatio>
  );
}

type PostEmbedImageProps = {
  view: AppBskyEmbedImages.View;
};

export function PostEmbedImage({ view }: PostEmbedImageProps) {
  return match(view.images.length)
    .with(1, () => <SingleImage viewImage={view.images[0]} />)
    .with(2, () => (
      <Flex gap="1">
        <SingleImage viewImage={view.images[0]} />
        <SingleImage viewImage={view.images[1]} />
      </Flex>
    ))
    .with(3, () => (
      <Flex gap="1">
        <SingleImage viewImage={view.images[0]} />
        <Flex direction="column" gap="1">
          <SingleImage viewImage={view.images[1]} />
          <SingleImage viewImage={view.images[2]} />
        </Flex>
      </Flex>
    ))
    .with(4, () => (
      <Flex gap="1">
        <Flex direction="column" gap="1">
          <SingleImage viewImage={view.images[0]} />
          <SingleImage viewImage={view.images[1]} />
        </Flex>
        <Flex direction="column" gap="1">
          <SingleImage viewImage={view.images[2]} />
          <SingleImage viewImage={view.images[3]} />
        </Flex>
      </Flex>
    ))
    .otherwise(() => null);

  // return <SingleImage src={view.images[0].fullsize} alt={view.images[0].alt} />;
}
