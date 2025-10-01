import type { ContentCategory, ContentItem } from '../types';

const videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
const trailerUrls = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
];

const assignTrailerUrl = (index: number) => trailerUrls[index % trailerUrls.length];

let contentCategories: ContentCategory[] = [
    {
      title: 'Most Popular',
      items: [
        {
          id: '1',
          title: 'Cybernetic Frontier',
          description: 'In a future ruled by AI, a lone hacker discovers a secret that could either liberate humanity or destroy it forever. A thrilling chase through neon-lit cityscapes ensues.',
          imageUrl: 'https://picsum.photos/id/10/400/600',
          backdropUrl: 'https://picsum.photos/id/10/1280/720',
          videoUrl,
          trailerUrl: assignTrailerUrl(0),
          type: 'Movie',
          genres: ['Sci-Fi', 'Action'],
          isPremium: true,
          tokenCost: 10,
        },
        {
          id: '2',
          title: 'The Last Kingdom',
          description: 'A historical drama about the Viking invasion of England and the birth of a nation. Follow Uhtred of Bebbanburg as he walks a tightrope between two worlds.',
          imageUrl: 'https://picsum.photos/id/1005/400/600',
          backdropUrl: 'https://picsum.photos/id/1005/1280/720',
          videoUrl: '',
          trailerUrl: assignTrailerUrl(1),
          type: 'Series',
          genres: ['Drama', 'History', 'Action'],
          isPremium: true,
          tokenCost: 25,
          seasons: [
            {
              id: 's1-2',
              seasonNumber: 1,
              episodes: [
                { id: 's1e1-2', episodeNumber: 1, title: 'Episode 1', description: 'After his father is killed, the young Saxon boy Uhtred is captured by the Danish warlord Earl Ragnar and raised as one of his own.', videoUrl, thumbnailUrl: 'https://picsum.photos/id/201/400/225' },
                { id: 's1e2-2', episodeNumber: 2, title: 'Episode 2', description: 'Uhtred is blamed for a massacre and must flee, seeking the help of the Saxon king of Wessex, Alfred.', videoUrl, thumbnailUrl: 'https://picsum.photos/id/202/400/225' },
                { id: 's1e3-2', episodeNumber: 3, title: 'Episode 3', description: 'To prove his loyalty to Alfred, Uhtred must train the Saxon army to fight the Danes in a new way.', videoUrl, thumbnailUrl: 'https://picsum.photos/id/203/400/225' },
              ]
            },
            {
              id: 's2-2',
              seasonNumber: 2,
              episodes: [
                { id: 's2e1-2', episodeNumber: 1, title: 'North to the Rescue', description: 'Uhtred heads north to rescue his sister and avenge Earl Ragnar, but his quest for revenge puts him at odds with Alfred.', videoUrl, thumbnailUrl: 'https://picsum.photos/id/204/400/225' },
              ]
            }
          ]
        },
        {
          id: '3',
          title: 'Ocean\'s Whisper',
          description: 'A marine biologist uncovers a mysterious signal from the deep ocean, leading to a discovery that challenges our understanding of life on Earth.',
          imageUrl: 'https://picsum.photos/id/101/400/600',
          backdropUrl: 'https://picsum.photos/id/101/1280/720',
          videoUrl,
          trailerUrl: assignTrailerUrl(2),
          type: 'Movie',
          genres: ['Mystery', 'Thriller'],
        },
        {
          id: '4',
          title: 'Mountain\'s Echo',
          description: 'Two estranged siblings must reunite to survive the harsh wilderness after their plane crashes in a remote mountain range. Their journey tests their bond and their will to live.',
          imageUrl: 'https://picsum.photos/id/1015/400/600',
          backdropUrl: 'https://picsum.photos/id/1015/1280/720',
          videoUrl,
          trailerUrl: assignTrailerUrl(3),
          type: 'Movie',
          genres: ['Adventure', 'Drama'],
        },
        {
          id: '5',
          title: 'City of Spies',
          description: 'A multi-season series following a group of international spies during the Cold War. Alliances are tested, and betrayals are common in this high-stakes game of espionage.',
          imageUrl: 'https://picsum.photos/id/1025/400/600',
          backdropUrl: 'https://picsum.photos/id/1025/1280/720',
          videoUrl: '',
          trailerUrl: assignTrailerUrl(4),
          type: 'Series',
          genres: ['Thriller', 'Drama'],
          seasons: [
            {
              id: 's1-5',
              seasonNumber: 1,
              episodes: [
                { id: 's1e1-5', episodeNumber: 1, title: 'The Berlin Exchange', description: 'A tense prisoner exchange at the Glienicke Bridge goes wrong, pulling agent Eva into a web of deceit.', videoUrl, thumbnailUrl: 'https://picsum.photos/id/301/400/225' },
                { id: 's1e2-5', episodeNumber: 2, title: 'The Vienna Gambit', description: 'Eva follows a lead to Vienna, where she must uncover a double agent before a critical asset is compromised.', videoUrl, thumbnailUrl: 'https://picsum.photos/id/302/400/225' },
              ]
            }
          ]
        },
        {
          id: '6',
          title: 'The Alchemist\'s Code',
          description: 'A historian teams up with a cryptographer to solve a centuries-old puzzle left by a famous alchemist, leading them on a globetrotting adventure.',
          imageUrl: 'https://picsum.photos/id/103/400/600',
          backdropUrl: 'https://picsum.photos/id/103/1280/720',
          videoUrl,
          trailerUrl: assignTrailerUrl(0),
          type: 'Movie',
          genres: ['Adventure', 'Mystery'],
        },
      ],
    },
    {
      title: 'Trending Now',
      items: [
        {
          id: '7',
          title: 'Zero Gravity',
          description: 'When their space station is critically damaged, two astronauts must work together to find a way back to Earth before their oxygen runs out.',
          imageUrl: 'https://picsum.photos/id/1043/400/600',
          backdropUrl: 'https://picsum.photos/id/1043/1280/720',
          videoUrl: 'https://www.youtube.com/watch?v=1roy4o4tqQM',
          trailerUrl: assignTrailerUrl(1),
          type: 'Movie',
          genres: ['Sci-Fi', 'Thriller'],
          isPremium: true,
          tokenCost: 5,
        },
        {
          id: '8',
          title: 'The Baker Street Files',
          description: 'A modern retelling of Sherlock Holmes, this series follows the brilliant detective and his partner Dr. Watson as they solve perplexing crimes in London.',
          imageUrl: 'https://picsum.photos/id/1062/400/600',
          backdropUrl: 'https://picsum.photos/id/1062/1280/720',
          videoUrl: '',
          trailerUrl: assignTrailerUrl(2),
          type: 'Series',
          genres: ['Crime', 'Drama', 'Mystery'],
          seasons: [
            {
              id: 's1-8',
              seasonNumber: 1,
              episodes: [
                { id: 's1e1-8', episodeNumber: 1, title: 'A Study in Pink', description: 'Dr. John Watson meets the eccentric Sherlock Holmes and is drawn into a case involving a series of baffling suicides.', videoUrl, thumbnailUrl: 'https://picsum.photos/id/401/400/225' },
              ]
            }
          ]
        },
        {
          id: '9',
          title: 'Culinary Kings',
          description: 'A lighthearted comedy series about two rival chefs who are forced to co-own a restaurant. Their conflicting styles lead to hilarious kitchen disasters and unexpected success.',
          imageUrl: 'https://picsum.photos/id/1080/400/600',
          backdropUrl: 'https://picsum.photos/id/1080/1280/720',
          videoUrl: '',
          trailerUrl: assignTrailerUrl(3),
          type: 'Series',
          genres: ['Comedy'],
        },
        {
          id: '10',
          title: 'Forgotten Relics',
          description: 'An archaeologist discovers a map that leads to a lost city, but a shadowy organization is also after the city\'s powerful secrets.',
          imageUrl: 'https://picsum.photos/id/119/400/600',
          backdropUrl: 'https://picsum.photos/id/119/1280/720',
          videoUrl,
          trailerUrl: assignTrailerUrl(4),
          type: 'Movie',
          genres: ['Action', 'Adventure'],
        },
        {
          id: '11',
          title: 'The Laugh Track',
          description: 'A struggling stand-up comedian finally gets her big break, but fame brings a new set of challenges to her personal and professional life.',
          imageUrl: 'https://picsum.photos/id/122/400/600',
          backdropUrl: 'https://picsum.photos/id/122/1280/720',
          videoUrl,
          trailerUrl: assignTrailerUrl(0),
          type: 'Movie',
          genres: ['Comedy', 'Drama'],
        },
        {
          id: '12',
          title: 'Canvas of Dreams',
          description: 'A young artist in 1920s Paris navigates the vibrant and competitive art scene, finding love and inspiration in the most unexpected places.',
          imageUrl: 'https://picsum.photos/id/145/400/600',
          backdropUrl: 'https://picsum.photos/id/145/1280/720',
          videoUrl: '',
          trailerUrl: assignTrailerUrl(1),
          type: 'Series',
          genres: ['Romance', 'Drama', 'History'],
        },
      ],
    },
    {
      title: 'Action Packed',
      items: [
        {
          id: '13',
          title: 'Rogue Agent',
          description: 'A disavowed spy must clear his name while on the run from the very agency he once served. A high-octane thriller with explosive action sequences.',
          imageUrl: 'https://picsum.photos/id/21/400/600',
          backdropUrl: 'https://picsum.photos/id/21/1280/720',
          videoUrl,
          trailerUrl: assignTrailerUrl(2),
          type: 'Movie',
          genres: ['Action', 'Thriller'],
        },
        {
          id: '14',
          title: 'Desert Fury',
          description: 'In a post-apocalyptic wasteland, a lone warrior battles marauders to protect a small community and their precious water source.',
          imageUrl: 'https://picsum.photos/id/211/400/600',
          backdropUrl: 'https://picsum.photos/id/211/1280/720',
          videoUrl,
          trailerUrl: assignTrailerUrl(3),
          type: 'Movie',
          genres: ['Action', 'Sci-Fi'],
        },
        {
          id: '15',
          title: 'Strike Force',
          description: 'An elite special forces team is sent on a series of dangerous missions around the globe to combat a rising terrorist threat.',
          imageUrl: 'https://picsum.photos/id/212/400/600',
          backdropUrl: 'https://picsum.photos/id/212/1280/720',
          videoUrl: '',
          trailerUrl: assignTrailerUrl(4),
          type: 'Series',
          genres: ['Action', 'War'],
        },
        {
          id: '16',
          title: 'Speed Demon',
          description: 'A getaway driver gets pulled into one last job, but when the heist goes wrong, he finds himself in a race against time to save his family.',
          imageUrl: 'https://picsum.photos/id/305/400/600',
          backdropUrl: 'https://picsum.photos/id/305/1280/720',
          videoUrl,
          trailerUrl: assignTrailerUrl(0),
          type: 'Movie',
          genres: ['Action', 'Crime'],
        },
        {
          id: '17',
          title: 'The Gauntlet',
          description: 'A wrongly convicted cop must fight his way through a prison riot to expose the corrupt officials who framed him.',
          imageUrl: 'https://picsum.photos/id/309/400/600',
          backdropUrl: 'https://picsum.photos/id/309/1280/720',
          videoUrl,
          trailerUrl: assignTrailerUrl(1),
          type: 'Movie',
          genres: ['Action', 'Thriller'],
        },
        {
          id: '18',
          title: 'Dragon\'s Claw',
          description: 'A martial arts master seeks revenge on the syndicate that murdered his teacher, leading to a series of epic, masterfully choreographed fight scenes.',
          imageUrl: 'https://picsum.photos/id/327/400/600',
          backdropUrl: 'https://picsum.photos/id/327/1280/720',
          videoUrl,
          trailerUrl: assignTrailerUrl(2),
          type: 'Movie',
          genres: ['Action', 'Martial Arts'],
          isPremium: true,
          tokenCost: 15,
        },
      ],
    },
];

export const getMockContent = (): ContentCategory[] => {
  return JSON.parse(JSON.stringify(contentCategories));
};

export const addContentCategory = (title: string) => {
    if (contentCategories.some(c => c.title === title)) {
        console.warn(`Category with title "${title}" already exists.`);
        return;
    }
    contentCategories.push({
        title,
        items: []
    });
};

export const updateContentCategoryTitle = (oldTitle: string, newTitle: string) => {
    const category = contentCategories.find(c => c.title === oldTitle);
    if (category) {
        category.title = newTitle;
    }
};

export const deleteContentCategory = (title: string) => {
    contentCategories = contentCategories.filter(c => c.title !== title);
};

export const reorderContentCategories = (startIndex: number, endIndex: number) => {
    if (startIndex < 0 || startIndex >= contentCategories.length || endIndex < 0 || endIndex >= contentCategories.length) {
        return;
    }
    const result = Array.from(contentCategories);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    contentCategories = result;
};

// --- Global Content Item CRUD ---

export const addContentItemToCategories = (itemData: Omit<ContentItem, 'id'>, categoryTitles: string[]) => {
    const newItem: ContentItem = {
        ...itemData,
        id: `content-${Date.now()}`
    };
    categoryTitles.forEach(title => {
        const category = contentCategories.find(c => c.title === title);
        if (category) {
            category.items.unshift(newItem); // Add to beginning
        }
    });
};

export const updateContentItemAndCategories = (updatedItem: ContentItem, newCategoryTitles: string[]) => {
    // 1. Find all current categories for the item
    const currentCategories = new Set<string>();
    contentCategories.forEach(cat => {
        if (cat.items.some(item => !('isAd' in item) && (item as ContentItem).id === updatedItem.id)) {
            currentCategories.add(cat.title);
        }
    });

    // 2. Update item data everywhere it exists
    contentCategories.forEach(cat => {
        const itemIndex = cat.items.findIndex(item => !('isAd' in item) && (item as ContentItem).id === updatedItem.id);
        if (itemIndex > -1) {
            cat.items[itemIndex] = updatedItem;
        }
    });

    // 3. Categories to remove from
    const toRemove = [...currentCategories].filter(catTitle => !newCategoryTitles.includes(catTitle));
    toRemove.forEach(catTitle => {
        const category = contentCategories.find(c => c.title === catTitle);
        if (category) {
            category.items = category.items.filter(item => {
                if ('isAd' in item) return true;
                return (item as ContentItem).id !== updatedItem.id;
            });
        }
    });

    // 4. Categories to add to
    const toAdd = newCategoryTitles.filter(catTitle => !currentCategories.has(catTitle));
    toAdd.forEach(catTitle => {
        const category = contentCategories.find(c => c.title === catTitle);
        // Ensure the item with the updated data is added
        const itemToAdd = contentCategories
            .flatMap(c => c.items)
            .find(i => !('isAd' in i) && (i as ContentItem).id === updatedItem.id) as ContentItem | undefined;

        if (category && itemToAdd) {
            // Check if it already exists to be safe
            if (!category.items.some(item => !('isAd' in item) && (item as ContentItem).id === updatedItem.id)) {
                category.items.unshift(itemToAdd);
            }
        }
    });
};


export const deleteContentItemGlobally = (itemId: string) => {
    contentCategories.forEach(category => {
        category.items = category.items.filter(item => {
            if ('isAd' in item) return true; // Keep ads
            return (item as ContentItem).id !== itemId;
        });
    });
};