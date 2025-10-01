import type { InfoPageContent } from '../types';

const pageData: Record<string, InfoPageContent> = {
  'About Us': {
    title: 'About Streamflix',
    imageUrl: 'https://picsum.photos/id/1040/1200/400',
    content: [
      'Welcome to Streamflix, your destination for free, ad-supported streaming of movies and TV shows. We believe that everyone should have access to great entertainment without the barrier of a subscription fee. Our vast library is constantly growing, featuring everything from blockbuster hits and timeless classics to indie gems and binge-worthy series.',
      'Our mission is to provide a seamless and high-quality viewing experience, supported by a state-of-the-art streaming platform. By partnering with top content creators and advertisers, we are able to bring thousands of titles to your screen, on any device, completely free of charge. Thank you for being a part of the Streamflix community.'
    ]
  },
  'Careers': {
    title: 'Join Our Team',
    imageUrl: 'https://picsum.photos/id/1076/1200/400',
    content: [
      'At Streamflix, we are passionate about revolutionizing the way people watch television. We are a diverse and innovative team of engineers, designers, content specialists, and marketers dedicated to building the future of streaming. Our culture is collaborative, fast-paced, and focused on making a real impact.',
      'We are always looking for talented individuals to join us on our mission. If you are a problem-solver who is excited about technology and entertainment, we would love to hear from you. Explore our open positions below.',
      'Open Positions (Demo):\n- Senior Frontend Engineer\n- Backend Services Developer\n- Product Manager, Content Discovery\n- Digital Marketing Specialist'
    ]
  },
  'Press': {
    title: 'Streamflix in the News',
    imageUrl: 'https://picsum.photos/id/120/1200/400',
    content: [
      'For all media inquiries, please contact our public relations team at press@streamflix-demo.com. We are happy to provide information, arrange interviews, and supply press materials.',
      'Recent Press Release - Oct 2023: Streamflix announces a landmark content deal with Major Studio, adding over 500 new titles to its free streaming library. This expansion solidifies Streamflix\'s position as a leading ad-supported video-on-demand (AVOD) service.',
      'In The News: TechCrunch writes, "Streamflix is rapidly becoming a major player in the streaming wars by offering a compelling, cost-free alternative to subscription giants."'
    ]
  },
  'Contact Us': {
    title: 'Get in Touch',
    imageUrl: 'https://picsum.photos/id/1015/1200/400',
    content: [
        'We love hearing from our users! Whether you have a question, feedback, or a partnership inquiry, our team is here to help. Please reach out to us through the appropriate channel below.',
        'For general support and questions about our service, please visit our Help Center or check the FAQ page. For technical issues, you can email our support team at support@streamflix-demo.com.',
        'For business or press inquiries, please contact us at business@streamflix-demo.com. We look forward to connecting with you!'
    ]
  },
  'Help Center': {
    title: 'Streamflix Help Center',
    imageUrl: 'https://picsum.photos/id/1025/1200/400',
    content: [
        'Welcome to the Streamflix Help Center. Here you can find answers to common questions and solutions to technical problems. Use the search bar above (not implemented in demo) to find what you are looking for.',
        'Popular Topics:\n- How to reset your password\n- Supported devices and platforms\n- Managing your "My List"\n- How tokens and premium content work',
        'If you can\'t find the answer you are looking for, please don\'t hesitate to contact our support team directly through our Contact Us page.'
    ]
  },
  'FAQ': {
    title: 'Frequently Asked Questions',
    imageUrl: 'https://picsum.photos/id/237/1200/400',
    content: [
        'Q: Is Streamflix really free?\nA: Yes! Streamflix is an ad-supported streaming service. You can watch thousands of movies and TV shows for free. We also offer premium content that can be unlocked with tokens, which can be earned or purchased.',
        'Q: What devices can I watch Streamflix on?\nA: You can watch Streamflix on most internet-connected devices, including smart TVs, streaming media players, computers, and mobile phones through your web browser.',
        'Q: How often is new content added?\nA: We add new content every week! Our library is constantly expanding with new movies and series from our content partners.'
    ]
  },
  'Terms of Use': {
    title: 'Terms of Use',
    imageUrl: 'https://picsum.photos/id/512/1200/400',
    content: [
        'This is a demonstration website. The following terms are placeholders and not legally binding. Welcome to Streamflix. By accessing or using our service, you agree to be bound by these terms of use. Please read them carefully.',
        'You agree not to archive, reproduce, distribute, modify, display, perform, publish, license, create derivative works from, offer for sale, or use content and information contained on or obtained from or through the Service. You also agree not to: circumvent, remove, alter, deactivate, degrade or thwart any of the content protections in the Service.',
        'We may terminate or restrict your use of our service if you violate these Terms of Use or are engaged in illegal or fraudulent use of the service. We reserve the right to modify these terms at any time.'
    ]
  },
  'Privacy Policy': {
    title: 'Privacy Policy',
    imageUrl: 'https://picsum.photos/id/1011/1200/400',
    content: [
        'This is a demonstration website. The following privacy policy is a placeholder. Your privacy is important to us. This Privacy Policy explains how we collect, use, and share information about you when you use our services.',
        'Information We Collect: We may collect information you provide directly to us, such as when you create an account. We may also collect information automatically as you navigate the site, such as your viewing history and device information. This data is used solely for the purpose of improving the demo experience.',
        'We do not sell your personal information to third parties. All data collected in this demo (e.g., via localStorage) is stored only on your local device and is not transmitted to any server.'
    ]
  },
  'Cookie Policy': {
    title: 'Cookie Policy',
    imageUrl: 'https://picsum.photos/id/292/1200/400',
    content: [
        'This is a demonstration website and does not use tracking cookies. The following policy is a placeholder. What are cookies? Cookies are small text files stored on your device that help websites remember information about your visit.',
        'How We Use Cookies: In a real application, we would use cookies to remember your preferences, keep you signed in, and understand how you use our service to personalize your experience. This demo application uses browser `localStorage` and `sessionStorage` for basic functionality like remembering your "My List" and login status, which operate similarly to cookies but are not sent to a server.',
        'Your Choices: You can usually set your browser to remove or reject browser cookies. Please note that if you choose to remove or reject cookies, this could affect the availability and functionality of our services.'
    ]
  }
};

export const getInfoPageContent = (page: string): InfoPageContent | null => {
  return pageData[page] || null;
};
