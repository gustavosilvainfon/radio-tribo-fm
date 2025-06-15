import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import dbConnect from '@/lib/mongodb';
import { News } from '@/lib/models';

const parser = new Parser();

export async function GET() {
  try {
    await dbConnect();
    
    // Try to get cached news from database first
    const cachedNews = await News.find({})
      .sort({ pubDate: -1 })
      .limit(20)
      .lean();
    
    // Check if cached news is fresh (less than 1 hour old)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const hasRecentNews = cachedNews.some(news => 
      new Date(news.pubDate) > oneHourAgo
    );
    
    if (hasRecentNews && cachedNews.length > 0) {
      const formattedNews = cachedNews.map(item => ({
        id: item._id.toString(),
        title: item.title,
        link: item.link,
        description: item.description,
        pubDate: item.pubDate,
        category: item.category,
      }));
      return NextResponse.json(formattedNews);
    }
    
    // Fetch fresh news from RSS
    const rssUrl = process.env.RSS_FEED_URL || 'https://g1.globo.com/rss/g1/';
    
    try {
      const feed = await parser.parseURL(rssUrl);
      const newsItems = [];
      
      for (const item of feed.items.slice(0, 20)) {
        try {
          // Check if news already exists
          const existingNews = await News.findOne({ link: item.link });
          
          if (!existingNews) {
            const newsItem = new News({
              title: item.title || 'Sem título',
              link: item.link || '#',
              description: item.contentSnippet || item.content || '',
              pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
              category: item.categories && item.categories[0] ? item.categories[0] : 'Geral',
            });
            
            await newsItem.save();
            newsItems.push({
              id: newsItem._id.toString(),
              title: newsItem.title,
              link: newsItem.link,
              description: newsItem.description,
              pubDate: newsItem.pubDate,
              category: newsItem.category,
            });
          } else {
            newsItems.push({
              id: existingNews._id.toString(),
              title: existingNews.title,
              link: existingNews.link,
              description: existingNews.description,
              pubDate: existingNews.pubDate,
              category: existingNews.category,
            });
          }
        } catch (itemError) {
          console.error('Error processing news item:', itemError);
        }
      }
      
      return NextResponse.json(newsItems);
    } catch (rssError) {
      console.error('Error fetching RSS feed:', rssError);
      
      // Return mock news if RSS fails
      const mockNews = [
        {
          id: '1',
          title: 'Economia brasileira apresenta crescimento no último trimestre',
          link: '#',
          description: 'Dados divulgados hoje mostram recuperação em vários setores da economia nacional.',
          pubDate: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          category: 'Economia',
        },
        {
          id: '2',
          title: 'Nova tecnologia promete revolucionar o streaming de música',
          link: '#',
          description: 'Inovação permite qualidade de áudio superior com menor uso de dados.',
          pubDate: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
          category: 'Tecnologia',
        },
        {
          id: '3',
          title: 'Festival de música reúne milhares de pessoas na capital',
          link: '#',
          description: 'Evento conta com artistas nacionais e internacionais em três dias de shows.',
          pubDate: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
          category: 'Cultura',
        },
        {
          id: '4',
          title: 'Mercado fonográfico cresce com o streaming digital',
          link: '#',
          description: 'Plataformas digitais impulsionam vendas e descoberta de novos talentos.',
          pubDate: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
          category: 'Música',
        },
        {
          id: '5',
          title: 'Rádios online ganham espaço no consumo de mídia',
          link: '#',
          description: 'Audiência de emissoras digitais cresce exponencialmente no país.',
          pubDate: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
          category: 'Mídia',
        },
      ];
      
      return NextResponse.json(mockNews);
    }
  } catch (error) {
    console.error('Error in news API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}