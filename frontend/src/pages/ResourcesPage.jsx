import { Link } from 'react-router-dom';
import { LinkIcon } from 'lucide-react';

const ResourcesPage = () => {
  const resourceCategories = [
    {
      level: 'N5',
      title: 'The First Step into Japanese Reading',
      resources: [
        {
          title: 'NHK News Web Easy',
          description: 'Classic resource with news articles in simple Japanese with full furigana and audio.',
          link: 'https://www3.nhk.or.jp/news/easy/',
        },
        {
          title: 'Matcha - Easy Japanese',
          description: 'Engaging articles on Japanese culture and travel written in simple language with furigana.',
          link: 'https://matcha-jp.com/easy',
        },
        {
          title: 'Traditional Japanese Stories',
          description: 'Simple, traditional folk tales with accompanying audio to learn vocabulary in a cultural context.',
          link: 'http://life.ou.edu/stories/',
        },
        {
          title: 'Fairy Tales by Wasabi',
          description: 'Famous fairy tales rewritten in very simple Japanese with slow/natural speed audio and full translations.',
          link: 'http://my.wasabi-jpn.com/magazine/japanese-lessons/fairy-tales-and-short-stories-with-easy-japanese/',
        },
      ],
    },
    {
      level: 'N4',
      title: 'Building a Foundation',
      resources: [
        {
          title: 'Watanoc - Graded Reading',
          description: 'A collection of short stories and articles graded by difficulty, with a large selection for the N4 level.',
          link: 'https://watanoc.com/',
        },
        {
          title: 'Hirogaru',
          description: 'A Japan Foundation site with articles and videos on culture, searchable by difficulty level.',
          link: 'https://hirogaru-nihongo.jp/',
        },
        {
          title: 'Tadoku - Free Graded Readers',
          description: 'A large library of free graded readers, with a focus on extensive reading to build fluency.',
          link: 'https://tadoku.org/japanese/en/free-books-en/',
        },
        {
          title: 'NHK for School',
          description: 'An educational portal with content for Japanese schoolchildren. Elementary level is great for N4.',
          link: 'https://www.nhk.or.jp/school/',
        },
      ],
    },
    {
      level: 'N3',
      title: 'Venturing into Intermediate Territory',
      resources: [
        {
          title: 'NHK News Web (Standard)',
          description: 'The standard version of NHK news. Challenging but manageable for N3 learners.',
          link: 'https://www3.nhk.or.jp/news/',
        },
        {
          title: 'Hukumusume - Folktales',
          description: 'A vast collection of Japanese folktales, many written at a level appropriate for N3 and above.',
          link: 'http://hukumusume.com/douwa/',
        },
        {
          title: 'Syosetu (小説家になろう)',
          description: 'A massive platform where users publish their own novels. A great source for finding fiction.',
          link: 'https://syosetu.com/',
        },
        {
          title: 'Syosetu (小説家になろう)',
          description: 'A massive platform where users publish their own novels. A great source for finding fiction.',
          link: 'https://syosetu.com/',
        },
      ],
    },
    {
      level: 'N2',
      title: 'Approaching Advanced Reading',
      resources: [
        {
          title: 'Asahi Shimbun Digital',
          description: 'A major Japanese newspaper, excellent for exposure to the formal language found on the N2 exam.',
          link: 'https://www.asahi.com/',
        },
        {
          title: 'Aozora Bunko (青空文庫)',
          description: 'A digital library of out-of-copyright Japanese literature, from novels to essays.',
          link: 'https://www.aozora.gr.jp/',
        },
        {
          title: 'ichi.moe',
          description: 'An invaluable text analysis tool. Paste any text to get definitions and grammar breakdowns.',
          link: 'https://ichi.moe/',
        },
        {
          title: 'Diamond Online',
          description: 'A prominent publication focusing on business and economics, with complex and specialized vocabulary.',
          link: 'https://diamond.jp/',
        },
      ],
    },
    {
      level: 'N1',
      title: 'Mastering Complex Japanese',
      resources: [
        {
          title: 'Nikkei Business Publications (日経BP)',
          description: 'Challenging articles on business, technology, and economics in professional, formal Japanese.',
          link: 'https://www.nikkeibp.co.jp/',
        },
        {
          title: 'CiNii Articles',
          description: 'A database of academic articles. Fantastic practice for the most difficult reading passages on the N1.',
          link: 'https://ci.nii.ac.jp/',
        },
      ],
    },
  ];

  return (
    <div>
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold">Reading Resources</h1>
        <p className="text-muted-foreground mt-2">This is a curated list of helpful websites and tools to aid your immersion journey. The key to improving your reading is consistency. Try to read a little bit every day, even if it's just one short article.</p>
        <p className="mt-4 bg-card border border-border p-4 rounded-lg text-muted-foreground max-w-3xl mx-auto">
          <strong>Pro Tip:</strong> If you find an article or a story that is difficult, don't give up! Copy the text and paste it into our{' '}
          <Link to="/analyzer" className="text-primary hover:underline font-semibold">
            Text Analyzer
          </Link>
          {' '}to get an interactive breakdown of the vocabulary and grammar.
        </p>
      </section>

      {/* This container will hold all of our category sections. */}
      <section className="space-y-12">
        {/* We map over the main categories first. */}
        {resourceCategories.map((category) => (
          <div key={category.level}>
            {/* The header for each JLPT level. */}
            <h2 className="text-3xl font-bold text-primary mb-2">{category.level}</h2>
            <p className="text-muted-foreground mb-6 border-b border-border pb-4">{category.title}</p>
            
            {/* The grid for the resources within this category. */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* We then map over the resources for the current category. */}
              {category.resources.map((resource) => (
                <a 
                  href={resource.link} 
                  key={resource.title}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-card p-6 rounded-lg border border-border shadow-sm hover:border-primary hover:shadow-lg transition-all flex items-start gap-4"
                >
                  <div className="bg-primary/10 p-3 rounded-lg mt-1">
                    <LinkIcon size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{resource.title}</h3>
                    <p className="text-muted-foreground text-sm">{resource.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default ResourcesPage;