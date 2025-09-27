const shareUrl = 'https://turbotags.app/';
const shareTitle = 'TurboTags - #1 FREE AI Tag & Hashtag Generator';
const shareText = 'Check out TurboTags! A free AI-powered tag and hashtag generator for creators. #TurboTags #AI #ContentCreator';
const shareMedia = 'https://turbotags.app/og-image.jpg'; // A default image for services like Pinterest

const urlReplacer = (template, data) => {
  return template
    .replace('{url}', encodeURIComponent(data.url))
    .replace('{title}', encodeURIComponent(data.title))
    .replace('{text}', encodeURIComponent(data.text))
    .replace('{media}', encodeURIComponent(data.media));
};

export const getShareUrls = () => ({
  twitter: urlReplacer('https://twitter.com/intent/tweet?url={url}&text={text}', { url: shareUrl, text: shareText }),
  facebook: urlReplacer('https://www.facebook.com/sharer/sharer.php?u={url}', { url: shareUrl }),
  linkedin: urlReplacer('https://www.linkedin.com/shareArticle?mini=true&url={url}&title={title}&summary={text}', { url: shareUrl, title: shareTitle, text: shareText }),
  whatsapp: urlReplacer('https://api.whatsapp.com/send?text={text}%20{url}', { url: shareUrl, text: shareText }),
  telegram: urlReplacer('https://t.me/share/url?url={url}&text={text}', { url: shareUrl, text: shareText }),
  reddit: urlReplacer('https://www.reddit.com/submit?url={url}&title={title}', { url: shareUrl, title: shareTitle }),
  email: urlReplacer('mailto:?subject={title}&body={text}%20{url}', { url: shareUrl, title: shareTitle, text: shareText }),
  pinterest: urlReplacer('https://pinterest.com/pin/create/button/?url={url}&media={media}&description={text}', { url: shareUrl, media: shareMedia, text: shareText }),
  tumblr: urlReplacer('https://www.tumblr.com/widgets/share/tool?posttype=link&title={title}&caption={text}&content={url}&canonicalUrl={url}', { url: shareUrl, title: shareTitle, text: shareText }),
  pocket: urlReplacer('https://getpocket.com/save?url={url}&title={title}', { url: shareUrl, title: shareTitle }),
  messenger: urlReplacer('fb-messenger://share?link={url}', { url: shareUrl }),
  skype: urlReplacer('https://web.skype.com/share?url={url}&text={text}', { url: shareUrl, text: shareText }),
  vk: urlReplacer('https://vk.com/share.php?url={url}&title={title}', { url: shareUrl, title: shareTitle }),
  blogger: urlReplacer('https://www.blogger.com/blog-this.g?u={url}&n={title}&t={text}', { url: shareUrl, title: shareTitle, text: shareText }),
  evernote: urlReplacer('https://www.evernote.com/clip.action?url={url}&title={title}', { url: shareUrl, title: shareTitle }),
  hackernews: urlReplacer('https://news.ycombinator.com/submitlink?u={url}&t={title}', { url: shareUrl, title: shareTitle }),
  line: urlReplacer('https://social-plugins.line.me/lineit/share?url={url}', { url: shareUrl }),
  xing: urlReplacer('https://www.xing.com/spi/shares/new?url={url}', { url: shareUrl }),
  viber: urlReplacer('viber://forward?text={text}%20{url}', { url: shareUrl, text: shareText }),
  weibo: urlReplacer('http://service.weibo.com/share/share.php?url={url}&title={title}', { url: shareUrl, title: shareTitle }),
  wordpress: urlReplacer('https://wordpress.com/press-this.php?u={url}&t={title}&s={text}', { url: shareUrl, title: shareTitle, text: shareText }),
  sms: urlReplacer('sms:?body={text}%20{url}', { url: shareUrl, text: shareText }),
});

export const primaryServices = ['twitter', 'facebook', 'linkedin', 'whatsapp', 'reddit', 'telegram'];

// The 'icon' property is now a string identifier. The component that renders
// this data will map the string to the actual icon component.
export const allServices = [
  { name: 'Twitter', icon: 'Twitter', color: '#1DA1F2', keywords: ['twitter', 'x'], id: 'twitter' },
  { name: 'Facebook', icon: 'Facebook', color: '#1877F2', keywords: ['facebook', 'meta'], id: 'facebook' },
  { name: 'LinkedIn', icon: 'Linkedin', color: '#0A66C2', keywords: ['linkedin'], id: 'linkedin' },
  { name: 'WhatsApp', icon: 'Share2', color: '#25D366', keywords: ['whatsapp', 'message'], id: 'whatsapp' },
  { name: 'Reddit', icon: 'Share2', color: '#FF4500', keywords: ['reddit'], id: 'reddit' },
  { name: 'Telegram', icon: 'Send', color: '#2AABEE', keywords: ['telegram', 'message', 'send'], id: 'telegram' },
  { name: 'Email', icon: 'Mail', color: '#7f7f7f', keywords: ['email', 'mail', 'gmail', 'outlook'], id: 'email' },
  { name: 'Pinterest', icon: 'Share2', color: '#E60023', keywords: ['pinterest', 'pin'], id: 'pinterest' },
  { name: 'Tumblr', icon: 'Share2', color: '#36465D', keywords: ['tumblr'], id: 'tumblr' },
  { name: 'Pocket', icon: 'Pocket', color: '#EF3F56', keywords: ['pocket', 'save'], id: 'pocket' },
  { name: 'Messenger', icon: 'MessageSquare', color: '#00B2FF', keywords: ['messenger', 'facebook'], id: 'messenger' },
  { name: 'Skype', icon: 'Share2', color: '#00AFF0', keywords: ['skype'], id: 'skype' },
  { name: 'VKontakte', icon: 'Share2', color: '#4680C2', keywords: ['vk', 'vkontakte', 'russian'], id: 'vk' },
  { name: 'Blogger', icon: 'Share2', color: '#FF6600', keywords: ['blogger', 'blog'], id: 'blogger' },
  { name: 'Evernote', icon: 'Share2', color: '#00A82D', keywords: ['evernote', 'note'], id: 'evernote' },
  { name: 'Hacker News', icon: 'Share2', color: '#FF6600', keywords: ['hacker', 'news', 'yc'], id: 'hackernews' },
  { name: 'Line', icon: 'Share2', color: '#00B900', keywords: ['line', 'message'], id: 'line' },
  { name: 'Xing', icon: 'Share2', color: '#026466', keywords: ['xing'], id: 'xing' },
  { name: 'Viber', icon: 'Share2', color: '#7360F2', keywords: ['viber', 'message'], id: 'viber' },
  { name: 'Weibo', icon: 'Share2', color: '#E6162D', keywords: ['weibo', 'china'], id: 'weibo' },
  { name: 'WordPress', icon: 'Share2', color: '#21759B', keywords: ['wordpress', 'blog'], id: 'wordpress' },
  { name: 'SMS', icon: 'MessageSquare', color: '#55c57a', keywords: ['sms', 'text', 'message'], id: 'sms' },
  { name: 'Print', icon: 'Printer', color: '#555', keywords: ['print'], id: 'print' },
  { name: 'Copy Link', icon: 'Link', color: '#6b7280', keywords: ['copy', 'link'], id: 'copy' },
];
