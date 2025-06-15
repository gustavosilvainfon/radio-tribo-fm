import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { TeamMember } from '@/lib/models';
import { getAuthUser, requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    const team = await TeamMember.find({ isActive: true }).sort({ order: 1 });
    
    // If no team members in database, return default data
    if (team.length === 0) {
      const defaultTeam = [
        {
          id: '1',
          name: 'Santos Águia',
          role: 'Locutor 100% Sertanejo',
          description: 'Especialista em música sertaneja, Santos traz o melhor do country e sertanejo universitário para você.',
          imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&face=center',
          schedule: 'Segunda a Sexta - 14h às 18h',
          specialty: 'Sertanejo & Country',
          icon: '🤠',
          order: 1,
          isActive: true,
        },
        {
          id: '2',
          name: 'João Lopes',
          role: 'Locutor Tribo News e Bom dia Tribo',
          description: 'Jornalista experiente, João mantém você informado com as principais notícias e um bom dia especial.',
          imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&face=center',
          schedule: 'Segunda a Sexta - 6h às 10h',
          specialty: 'Jornalismo & Informação',
          icon: '📰',
          order: 2,
          isActive: true,
        },
        {
          id: '3',
          name: 'Daiane Santos',
          role: 'Locutora Tribo Mania',
          description: 'Com energia contagiante, Daiane anima suas tardes com os maiores sucessos e muita descontração.',
          imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=300&h=300&fit=crop&face=center',
          schedule: 'Segunda a Sexta - 18h às 22h',
          specialty: 'Pop & Hits',
          icon: '🎵',
          order: 3,
          isActive: true,
        },
      ];
      return NextResponse.json(defaultTeam);
    }

    const formattedTeam = team.map(member => ({
      id: member._id.toString(),
      name: member.name,
      role: member.role,
      description: member.description,
      imageUrl: member.imageUrl,
      schedule: member.schedule,
      specialty: member.specialty,
      icon: member.icon,
      order: member.order,
      isActive: member.isActive,
    }));

    return NextResponse.json(formattedTeam);
  } catch (error) {
    console.error('Error fetching team:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team' },
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
    
    const teamMember = new TeamMember(body);
    await teamMember.save();
    
    return NextResponse.json({
      id: teamMember._id.toString(),
      ...body,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json(
      { error: 'Failed to create team member' },
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
    
    const teamMember = await TeamMember.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!teamMember) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      id: teamMember._id.toString(),
      name: teamMember.name,
      role: teamMember.role,
      description: teamMember.description,
      imageUrl: teamMember.imageUrl,
      schedule: teamMember.schedule,
      specialty: teamMember.specialty,
      icon: teamMember.icon,
      order: teamMember.order,
      isActive: teamMember.isActive,
    });
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json(
      { error: 'Failed to update team member' },
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
        { error: 'Team member ID is required' },
        { status: 400 }
      );
    }
    
    const teamMember = await TeamMember.findByIdAndUpdate(
      id, 
      { isActive: false }, 
      { new: true }
    );
    
    if (!teamMember) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Team member deactivated successfully' });
  } catch (error) {
    console.error('Error deactivating team member:', error);
    return NextResponse.json(
      { error: 'Failed to deactivate team member' },
      { status: 500 }
    );
  }
}