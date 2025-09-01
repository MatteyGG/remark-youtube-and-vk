import type { Root, Text, Link } from 'mdast';
import { visit } from 'unist-util-visit';

const DEFAULT_WIDTH = 560;
const DEFAULT_HEIGHT = 315;
const YOUTUBE_URL_PATTERN = /^https:\/\/(?:youtu\.be\/|www\.youtube\.com\/watch\?v=)([0-9A-Za-z_-]+)$/;
const VK_URL_PATTERN = /^https:\/\/(?:vk\.com|vkvideo\.ru)\/video_ext\.php\?.*oid=.*&id=.*&hash=.*/;

interface Options {
  width?: number;
  height?: number;
}

const remarkVideoPlugin = (options?: Options) => (tree: Root) => {
  visit(tree, 'paragraph', (node) => {
    let videoUrl = '';
    let iframeSrc = '';

    for (const child of node.children) {
      if (child.type === 'text' || child.type === 'link') {
        const url = (child as Link)?.url ?? (child as Text)?.value;
        const youtubeMatch = url.match(YOUTUBE_URL_PATTERN);
        if (youtubeMatch && youtubeMatch[1]) {
          iframeSrc = `https://www.youtube.com/embed/${youtubeMatch[1]}`;
          videoUrl = url;
          break;
        }

        const vkMatch = url.match(VK_URL_PATTERN);
        if (vkMatch) {
          iframeSrc = url;
          videoUrl = url;
          break;
        }
      }
    }

    if (iframeSrc && videoUrl) {
      const iframeNode: Text = {
        type: 'text',
        value: videoUrl,
        data: {
          hName: 'iframe',
          hProperties: {
            width: options?.width ?? DEFAULT_WIDTH,
            height: options?.height ?? DEFAULT_HEIGHT,
            src: iframeSrc,
            frameborder: '0',
            allow:
              'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
            allowfullscreen: true,
          },
          hChildren: [],
        },
      };
      node.children = [iframeNode];
    }
  });
};

export default remarkVideoPlugin;

