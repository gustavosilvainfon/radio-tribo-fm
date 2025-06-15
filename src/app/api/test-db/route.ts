import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Admin } from '@/lib/models';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // Teste 1: Conectar ao MongoDB
    console.log('Tentando conectar ao MongoDB...');
    await dbConnect();
    console.log('✅ MongoDB conectado com sucesso');

    // Teste 2: Verificar se usuário admin existe
    console.log('Verificando usuário admin...');
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    
    if (!existingAdmin) {
      console.log('❌ Usuário admin não existe. Criando...');
      
      // Criar usuário admin
      const defaultPassword = process.env.ADMIN_PASSWORD || 'AdminTribo2024!';
      const hashedPassword = await bcrypt.hash(defaultPassword, 12);
      
      const newAdmin = await Admin.create({
        username: 'admin',
        passwordHash: hashedPassword,
        isAdmin: true,
      });
      
      console.log('✅ Usuário admin criado:', newAdmin.username);
      
      return NextResponse.json({
        status: 'success',
        message: 'Banco conectado e usuário admin criado',
        admin: {
          username: newAdmin.username,
          created: true,
          id: newAdmin._id.toString()
        },
        timestamp: new Date().toISOString(),
      });
    } else {
      console.log('✅ Usuário admin já existe');
      
      return NextResponse.json({
        status: 'success',
        message: 'Banco conectado e usuário admin existe',
        admin: {
          username: existingAdmin.username,
          created: false,
          id: existingAdmin._id.toString()
        },
        timestamp: new Date().toISOString(),
      });
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Falha na conexão ou operação',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}