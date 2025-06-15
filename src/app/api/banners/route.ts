import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { AdBanner } from '@/lib/models';
import { getAuthUser, requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    const banners = await AdBanner.find({ isActive: true }).sort({ position: 1, order: 1 });
    
    // If no banners in database, return default data
    if (banners.length === 0) {
      const defaultBanners = [
        {
          id: '1',
          title: 'Loja do Som - Instrumentos Musicais',
          description: 'Os melhores instrumentos com até 50% de desconto!',
          imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop',
          link: 'https://exemplo.com/loja-do-som',
          sponsor: 'Loja do Som',
          category: 'Música',
          position: 'top',
          isActive: true,
          order: 1,
          clickCount: 0,
        },
        {
          id: '2',
          title: 'Café Tribo - O Melhor Café da Cidade',
          description: 'Venha saborear nosso café especial com música ao vivo!',
          imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=200&fit=crop',
          link: 'https://exemplo.com/cafe-tribo',
          sponsor: 'Café Tribo',
          category: 'Alimentação',
          position: 'side',
          isActive: true,
          order: 1,
          clickCount: 0,
        },
        {
          id: '3',
          title: 'Auto Escola Direção Certa',
          description: 'Aprenda a dirigir com segurança e qualidade!',
          imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=200&fit=crop',
          link: 'https://exemplo.com/auto-escola',
          sponsor: 'Auto Escola Direção Certa',
          category: 'Educação',
          position: 'inline',
          isActive: true,
          order: 1,
          clickCount: 0,
        },
        {
          id: '4',
          title: 'Pizzaria Sabor & Cia',
          description: 'As melhores pizzas da cidade com entrega grátis!',
          imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=200&fit=crop',
          link: 'https://exemplo.com/pizzaria',
          sponsor: 'Pizzaria Sabor & Cia',
          category: 'Alimentação',
          position: 'side',
          isActive: true,
          order: 2,
          clickCount: 0,
        },
      ];
      return NextResponse.json(defaultBanners);
    }

    const formattedBanners = banners.map(banner => ({
      id: banner._id.toString(),
      title: banner.title,
      description: banner.description,
      imageUrl: banner.imageUrl,
      link: banner.link,
      sponsor: banner.sponsor,
      category: banner.category,
      position: banner.position,
      isActive: banner.isActive,
      order: banner.order,
      clickCount: banner.clickCount,
    }));

    return NextResponse.json(formattedBanners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { error: 'Failed to fetch banners' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!requireAdmin(user)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const body = await request.json();
    
    const banner = new AdBanner(body);
    await banner.save();
    
    return NextResponse.json({
      id: banner._id.toString(),
      ...body,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json(
      { error: 'Failed to create banner' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!requireAdmin(user)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const body = await request.json();
    const { id, ...updateData } = body;
    
    const banner = await AdBanner.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!banner) {
      return NextResponse.json(
        { error: 'Banner not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      id: banner._id.toString(),
      title: banner.title,
      description: banner.description,
      imageUrl: banner.imageUrl,
      link: banner.link,
      sponsor: banner.sponsor,
      category: banner.category,
      position: banner.position,
      isActive: banner.isActive,
      order: banner.order,
      clickCount: banner.clickCount,
    });
  } catch (error) {
    console.error('Error updating banner:', error);
    return NextResponse.json(
      { error: 'Failed to update banner' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!requireAdmin(user)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Banner ID is required' },
        { status: 400 }
      );
    }
    
    const banner = await AdBanner.findByIdAndUpdate(
      id, 
      { isActive: false }, 
      { new: true }
    );
    
    if (!banner) {
      return NextResponse.json(
        { error: 'Banner not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Banner deactivated successfully' });
  } catch (error) {
    console.error('Error deactivating banner:', error);
    return NextResponse.json(
      { error: 'Failed to deactivate banner' },
      { status: 500 }
    );
  }
}