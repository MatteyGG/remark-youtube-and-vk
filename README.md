# Based on [remark-youtube](https://github.com/remarkjs/remark-youtube)

## remark-youtube-and-vk ![](https://github.com/MatteyGG/remark-youtube-and-vk/workflows/main/badge.svg)

Embed Vk and YouTube player in your Markdown.

👍 This package is ESM only!

❌ CommonJS modules not supported!

Для использования в редакторе просто вставь ссылку на видео.
Паттерны ссылок: 
YT /^https:\/\/(?:youtu\.be\/|www\.youtube\.com\/watch\?v=)([0-9A-Za-z_-]+)$/;
VK /^https:\/\/(?:vk\.com|vkvideo\.ru)\/video_ext\.php\?.*oid=.*&id=.*&hash=.*/;

## Install

1. Install plugin to your site:

```bash
npm i remark-youtube
```

2. Setup plugin:

```typescript
import { unified } from 'unified'
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkYoutube from 'remark-youtube';

const input = 'your markdown content';

unified()
    .use(remarkParse)
    .use(remarkYoutube)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(input)
    .then((file) => {
        console.log(String(file))
    });
```

## Usage

```markdown
## Watch this video

https://youtu.be/enTFE2c68FQ

https://www.youtube.com/watch?v=enTFE2c68FQ
```

## Usage with react-markdown

```tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkYoutube from 'remark-youtube';

interface PageProps {
    markdownContent?: string
}

export const Page: React.FC<PageProps> = ({ markdownContent = '' }) => {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm, remarkYoutube]}>
        {markdownContent}
    </ReactMarkdown>
  );
};
```

## License

  [MIT](LICENSE.md)

