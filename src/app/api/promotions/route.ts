import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Promotion } from '@/lib/models';
import { getAuthUser, requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    const promotions = await Promotion.find({}).sort({ order: 1 });
    
    // If no promotions in database, return default data
    if (promotions.length === 0) {
      const defaultPromotions = [
        {
          id: '1',
          title: 'Tribo Premium - Ganhe Ingressos',
          description: 'Participe e concorra a ingressos para os melhores shows da cidade!',
          prize: '2 Ingressos VIP',
          endDate: new Date('2024-12-31'),
          howToParticipate: 'Ligue durante o programa e responda a pergunta musical',
          phone: '(11) 9999-9999',
          status: 'active',
          color: 'from-purple-600 to-pink-600',
          icon: '🎫',
          order: 1,
        },
        {
          id: '2',
          title: 'Sertanejo na Veia',
          description: 'Todo sábado às 20h - Acerte a música sertaneja e ganhe prêmios!',
          prize: 'Camiseta + CD Autografado',
          endDate: new Date('2024-12-25'),
          howToParticipate: 'Participe pelo WhatsApp ou Instagram',
          phone: '(11) 8888-8888',
          status: 'active',
          color: 'from-yellow-600 to-orange-600',
          icon: '🤠',
          order: 2,
        },
        {
          id: '3',
          title: 'Tribo Mania - Hora do Rush',
          description: 'De segunda a sexta, às 18h - Quiz musical com prêmios diários!',
          prize: 'Vale-compras R$ 200',
          endDate: new Date('2024-12-20'),
          howToParticipate: 'Seja o primeiro a ligar e responder corretamente',
          phone: '(11) 7777-7777',
          status: 'active',
          color: 'from-blue-600 to-cyan-600',
          icon: '🎵',
          order: 3,
        },
      ];
      return NextResponse.json(defaultPromotions);
    }

    const formattedPromotions = promotions.map(promotion => ({
      id: promotion._id.toString(),
      title: promotion.title,
      description: promotion.description,
      prize: promotion.prize,
      endDate: promotion.endDate,
      howToParticipate: promotion.howToParticipate,
      phone: promotion.phone,
      status: promotion.status,
      color: promotion.color,
      icon: promotion.icon,
      order: promotion.order,
    }));

    return NextResponse.json(formattedPromotions);
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch promotions' },
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
    
    const promotion = new Promotion(body);
    await promotion.save();
    
    return NextResponse.json({
      id: promotion._id.toString(),
      ...body,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating promotion:', error);
    return NextResponse.json(
      { error: 'Failed to create promotion' },
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
    
    const promotion = await Promotion.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!promotion) {
      return NextResponse.json(
        { error: 'Promotion not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      id: promotion._id.toString(),
      title: promotion.title,
      description: promotion.description,
      prize: promotion.prize,
      endDate: promotion.endDate,
      howToParticipate: promotion.howToParticipate,
      phone: promotion.phone,
      status: promotion.status,
      color: promotion.color,
      icon: promotion.icon,
      order: promotion.order,
    });
  } catch (error) {
    console.error('Error updating promotion:', error);
    return NextResponse.json(
      { error: 'Failed to update promotion' },
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
        { error: 'Promotion ID is required' },
        { status: 400 }
      );
    }
    
    const promotion = await Promotion.findByIdAndUpdate(
      id, 
      { status: 'inactive' }, 
      { new: true }
    );
    
    if (!promotion) {
      return NextResponse.json(
        { error: 'Promotion not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Promotion deactivated successfully' });
  } catch (error) {
    console.error('Error deactivating promotion:', error);
    return NextResponse.json(
      { error: 'Failed to deactivate promotion' },
      { status: 500 }
    );
  }
}