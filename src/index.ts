import { visit } from 'unist-util-visit';
const DEFAULT_WIDTH = 560;
const DEFAULT_HEIGHT = 315;
const URL_PATTERN = /^https:\/\/(?:youtu\.be\/|www\.youtube\.com\/watch\?v=)([0-9A-Za-z_-]+)$/;
const VK_URL_PATTERN = /^https:\/\/vk\.com\/video_ext\.php\?.*oid=.*&id=.*&hash=.*/;

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
          videoUrl = url;
        }
      }
    }

    if (videoId || videoUrl) {
      const text: Text = {
        type: 'text',
        value: videoUrl,
        data: {
          hName: 'iframe',
          hProperties: {
            width: options?.width ?? DEFAULT_WIDTH,
            height: options?.height ?? DEFAULT_HEIGHT,
            src: videoId ? `https://www.youtube.com/embed/${videoId}` : videoUrl,
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

const remarkVkPlugin = (options?: Options) => (tree: Root) => {
  visit(tree, 'paragraph', (node) => {
    let videoUrl = '';
    for (const child of node.children) {
      if (child.type === 'link') {
        const url = child.url;
        const vkMatch = url.match(VK_URL_PATTERN);
        if (vkMatch) {
          videoUrl = url;
        }
      }
    }
    if (videoUrl) {
      const iframeNode = {
        type: 'text',
        value: videoUrl,
        data: {
          hName: 'iframe',
          hProperties: {
            width: options?.width ?? DEFAULT_WIDTH,
            height: options?.height ?? DEFAULT_HEIGHT,
            src: videoUrl,
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

export { remarkYoutubePlugin, remarkVkPlugin };

