import { Router } from 'express';
import { 
  handleInitializeConnection,
  handleSendMessage,
  handleGetConnectionStatus,
  handleGetAllMessages,
  handleDisconnect
} from '../controllers/WhatsAppController';

// Função para criar e configurar as rotas
export function createWhatsAppRoutes(): Router {
  const router = Router();

  // 1) Inicializa autenticação (gera QR) — requer body: { sessionId, webhookUrl? }
  router.post('/auth/init', handleInitializeConnection);

  // 2) Status da conexão — aceita query/body: sessionId
  router.get('/auth/status', handleGetConnectionStatus);

  // 3) Logout — requer body: { sessionId }
  router.post('/auth/logout', handleDisconnect);

  // 4) Enviar mensagem — requer body: { sessionId, number, message }
  router.post('/message/send', handleSendMessage);

  // 5) (Opcional admin) Listar mensagens (mantido para debug)
  router.get('/messages', handleGetAllMessages);

  // Rota de health check
  router.get('/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Serviço funcionando normalmente',
      timestamp: new Date().toISOString()
    });
  });

  return router;
}
