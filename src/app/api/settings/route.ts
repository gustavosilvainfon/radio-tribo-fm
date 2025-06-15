import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Settings } from '@/lib/models';
import { getAuthUser, requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    let query = {};
    if (category) {
      query = { category };
    }
    
    const settings = await Settings.find(query);
    
    // If no settings, return defaults
    if (settings.length === 0) {
      const defaultSettings = [
        // Streaming
        { key: 'radio_stream_url', value: 'https://stm21.srvstm.com:6874/stream', category: 'streaming', description: 'URL do stream da rádio' },
        { key: 'radio_name', value: 'Rádio Tribo FM', category: 'general', description: 'Nome da rádio' },
        { key: 'radio_slogan', value: 'A Sua Música, A Sua Tribo', category: 'general', description: 'Slogan da rádio' },
        
        // Social Media
        { key: 'facebook_url', value: 'https://facebook.com/radiotribofm', category: 'social', description: 'URL do Facebook' },
        { key: 'instagram_url', value: 'https://instagram.com/radiotribofm', category: 'social', description: 'URL do Instagram' },
        { key: 'youtube_url', value: 'https://youtube.com/radiotribofm', category: 'social', description: 'URL do YouTube' },
        { key: 'whatsapp_number', value: '5511999999999', category: 'social', description: 'Número do WhatsApp' },
        
        // Programming
        { key: 'morning_show', value: 'Bom dia Tribo - 6h às 10h', category: 'programming', description: 'Programa matinal' },
        { key: 'afternoon_show', value: '100% Sertanejo - 14h às 18h', category: 'programming', description: 'Programa vespertino' },
        { key: 'evening_show', value: 'Tribo Mania - 18h às 22h', category: 'programming', description: 'Programa noturno' },
        { key: 'news_show', value: 'Tribo News - Toda hora', category: 'programming', description: 'Programa de notícias' },
        
        // Custom Code
        { key: 'custom_header', value: '', category: 'custom_code', description: 'Código personalizado para o header' },
        { key: 'custom_footer', value: '', category: 'custom_code', description: 'Código personalizado para o footer' },
        { key: 'custom_css', value: '', category: 'custom_code', description: 'CSS personalizado' },
        { key: 'google_analytics', value: '', category: 'custom_code', description: 'Código do Google Analytics' },
      ];
      
      return NextResponse.json(defaultSettings);
    }

    const formattedSettings = settings.map(setting => ({
      key: setting.key,
      value: setting.value,
      category: setting.category,
      description: setting.description,
    }));

    return NextResponse.json(formattedSettings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
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
    const { key, value, category, description } = body;
    
    // Update or create setting
    const setting = await Settings.findOneAndUpdate(
      { key },
      { value, category, description },
      { upsert: true, new: true }
    );
    
    return NextResponse.json({
      key: setting.key,
      value: setting.value,
      category: setting.category,
      description: setting.description,
    }, { status: 201 });
  } catch (error) {
    console.error('Error saving setting:', error);
    return NextResponse.json(
      { error: 'Failed to save setting' },
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
    const { settings } = body; // Array of settings to update
    
    const results = [];
    
    for (const { key, value, category, description } of settings) {
      const setting = await Settings.findOneAndUpdate(
        { key },
        { value, category, description },
        { upsert: true, new: true }
      );
      
      results.push({
        key: setting.key,
        value: setting.value,
        category: setting.category,
        description: setting.description,
      });
    }
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}