import type { Root, Text, Link } from 'mdast';
import { visit } from 'unist-util-visit';

const DEFAULT_WIDTH = 560;
const DEFAULT_HEIGHT = 315;
const URL_PATTERN = /^https:\/\/(?:youtu\.be\/|www\.youtube\.com\/watch\?v=)([0-9A-Za-z_-]+)$/;
const VK_URL_PATTERN = /^https:\/\/vk\.com\/video_ext\.php\?id=(\d+)(?:&hash=[0-9a-f]+)?$/;
// EXample of URL for vk "https://vk.com/video_ext.php?oid=-229290760&id=456239018&hd=2&hash=8a8f5bbbcfb49917&autoplay=1"
interface Options {
  width?: number;
  height?: number;
}

const remarkYoutubePlugin = (options?: Options) => (tree: Root) => {
  visit(tree, 'paragraph', (node) => {
    let videoId = '';
    let videoUrl = '';
    for (const child of node.children) {
      // parse type = 'link' for 'remark-gfm'
      if (child.type === 'text' || child.type === 'link') {
        const url = (child as Link)?.url ?? (child as Text)?.value;
        const match = url.match(URL_PATTERN);
        const vkMatch = url.match(VK_URL_PATTERN);
        if (match && match[1]) {
          videoId = match[1];
          videoUrl = url;
        } else if (vkMatch) {
          videoId = vkMatch[1];
          videoUrl = url;
        }
      }
    }

    if (videoId && videoUrl) {
      const text: Text = {
        type: 'text',
        value: videoUrl,
        data: {
          hName: 'iframe',
          hProperties: {
            width: options?.width ?? DEFAULT_WIDTH,
            height: options?.height ?? DEFAULT_HEIGHT,
            src: videoId.startsWith('https://vk.com') ? videoUrl : `https://www.youtube.com/embed/${videoId}`,
            frameborder: '0',
            allow:
              'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
            allowfullscreen: true,
          },
          hChildren: [],
        },
      };
      node.children = [text];
    }
  });
};

export default remarkYoutubePlugin;

