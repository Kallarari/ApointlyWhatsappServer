import { Request, Response } from 'express';
import { 
  initializeConnection, 
  sendMessage, 
  getConnectionStatus, 
  getAllMessages, 
  disconnect 
} from '../services/WhatsAppService';
import { SendMessageRequest } from '../types';

// Função para inicializar conexão
export async function handleInitializeConnection(req: Request, res: Response): Promise<void> {
  try {
    const { sessionId, webhookUrl } = req.body || {};
    if (!sessionId || typeof sessionId !== 'string') {
      res.status(400).json({ success: false, message: 'sessionId é obrigatório' });
      return;
    }
    const result = await initializeConnection({ sessionId, webhookUrl });
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Conexão inicializada com sucesso',
        data: result
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro ao inicializar conexão',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Erro no controller:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: 'Erro inesperado'
    });
  }
}

// Função para enviar mensagem
export async function handleSendMessage(req: Request, res: Response): Promise<void> {
  try {
    const { number, message, sessionId }: SendMessageRequest & { sessionId: string } = req.body;

    // Validação básica
    if (!number || !message) {
      res.status(400).json({
        success: false,
        message: 'Número e mensagem são obrigatórios'
      });
      return;
    }

    if (typeof number !== 'string' || typeof message !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Número e mensagem devem ser strings'
      });
      return;
    }

    if (!sessionId || typeof sessionId !== 'string') {
      res.status(400).json({ success: false, message: 'sessionId é obrigatório' });
      return;
    }
    const result = await sendMessage({ number, message, sessionId });
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Mensagem enviada com sucesso',
        data: {
          messageId: result.messageId
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Erro ao enviar mensagem',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Erro no controller:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: 'Erro inesperado'
    });
  }
}

// Função para obter status da conexão
export async function handleGetConnectionStatus(req: Request, res: Response): Promise<void> {
  try {
    const sessionId = (req.query.sessionId as string) || (req.body?.sessionId as string);
    if (!sessionId) {
      res.status(400).json({ success: false, message: 'sessionId é obrigatório' });
      return;
    }
    const result = await getConnectionStatus(sessionId);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Status da conexão obtido com sucesso',
        data: result
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Nenhuma sessão encontrada',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Erro no controller:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: 'Erro inesperado'
    });
  }
}

// Função para obter todas as mensagens
export async function handleGetAllMessages(req: Request, res: Response): Promise<void> {
  try {
    const messages = await getAllMessages();
    
    res.status(200).json({
      success: true,
      message: 'Mensagens obtidas com sucesso',
      data: {
        messages,
        total: messages.length
      }
    });
  } catch (error) {
    console.error('Erro no controller:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: 'Erro inesperado'
    });
  }
}

// Função para desconectar
export async function handleDisconnect(req: Request, res: Response): Promise<void> {
  try {
    const { sessionId } = req.body || {};
    if (!sessionId || typeof sessionId !== 'string') {
      res.status(400).json({ success: false, message: 'sessionId é obrigatório' });
      return;
    }
    await disconnect(sessionId);
    
    res.status(200).json({
      success: true,
      message: 'Desconectado com sucesso'
    });
  } catch (error) {
    console.error('Erro no controller:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: 'Erro inesperado'
    });
  }
}
