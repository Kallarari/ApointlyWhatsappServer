import { 
  makeWASocket, 
  DisconnectReason, 
  useMultiFileAuthState,
  WASocket
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import {
  saveMessage as repoSaveMessage,
  updateMessageStatus as repoUpdateMessageStatus,
  getAllMessages as repoGetAllMessages,
  getActiveSession as repoGetActiveSession,
  saveSession as repoSaveSession,
  updateSession as repoUpdateSession,
  getSessionByIdOrCreate
} from '../repository/WhatsAppRepository';
import { InitAuthRequest } from '../types';
import { WhatsAppSession, WhatsAppMessage, SendMessageResponse, AuthResponse } from '../types';
import * as fs from 'fs';
import QRCode from 'qrcode';

// Suporte multi-sessão: mapa de sessionId -> socket e sessão
const sessionIdToSocket = new Map<string, WASocket>();
const sessionIdToSession = new Map<string, WhatsAppSession>();
const authFolder = './auth_info_baileys';

// Função para garantir que a pasta de autenticação existe
function ensureAuthFolder(): void {
  if (!fs.existsSync(authFolder)) {
    fs.mkdirSync(authFolder, { recursive: true });
  }
}

// Função para inicializar a conexão com WhatsApp
export async function initializeConnection(payload: InitAuthRequest): Promise<AuthResponse> {
  try {
    const { sessionId, webhookUrl } = payload;
    ensureAuthFolder();
    const { state, saveCreds } = await useMultiFileAuthState(`${authFolder}/${sessionId}`);
    
    const sock = makeWASocket({
      auth: state,
      browser: ['Apointly WhatsApp Bot', 'Chrome', '1.0.0']
    });
    sessionIdToSocket.set(sessionId, sock);

    sock.ev.on('connection.update', async (update: any) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        // Gerar Data URL do QR e salvar na sessão para o front renderizar
        const qrDataUrl = await QRCode.toDataURL(qr);
        const sess = sessionIdToSession.get(sessionId);
        if (sess) await repoUpdateSession(sess.id, { qrCode: qrDataUrl });
      }

      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
        
        if (shouldReconnect) {
          console.log('Reconectando...');
          setTimeout(() => initializeConnection({ sessionId, webhookUrl }), 3000);
        } else {
          console.log('Conexão fechada permanentemente');
          const sess = sessionIdToSession.get(sessionId);
          if (sess) await repoUpdateSession(sess.id, { isAuthenticated: false });
        }
      }

      if (connection === 'open') {
        console.log('WhatsApp conectado!');
        const sess = sessionIdToSession.get(sessionId);
        if (sess) {
          await repoUpdateSession(sess.id, { 
            isAuthenticated: true,
            qrCode: undefined 
          });
        }
      }
    });

    sock.ev.on('creds.update', saveCreds);

    // Criar ou recuperar sessão
    const session = await getSessionByIdOrCreate(sessionId, webhookUrl);
    sessionIdToSession.set(sessionId, session);

    return {
      success: true,
      isAuthenticated: session.isAuthenticated,
      qrCode: session.qrCode
    };

  } catch (error) {
    console.error('Erro ao inicializar conexão:', error);
    return {
      success: false,
      isAuthenticated: false,
      error: 'Erro ao inicializar conexão com WhatsApp'
    };
  }
}

// Função para enviar mensagem
export async function sendMessage(request: { sessionId: string; number: string; message: string }): Promise<SendMessageResponse> {
  try {
    const { sessionId } = request;
    const sock = sessionIdToSocket.get(sessionId);
    const sess = sessionIdToSession.get(sessionId);
    if (!sock || !sess?.isAuthenticated) {
      return {
        success: false,
        error: 'WhatsApp não está conectado ou autenticado'
      };
    }

    const { number, message } = request;
    const formattedNumber = formatPhoneNumber(number);

    // Salvar mensagem no repositório
    const savedMessage = await repoSaveMessage({
      number: formattedNumber,
      message,
      status: 'pending',
      timestamp: new Date()
    });

    // Enviar mensagem via WhatsApp
    const result = await sock.sendMessage(`${formattedNumber}@s.whatsapp.net`, {
      text: message
    });

    if (result) {
      await repoUpdateMessageStatus(savedMessage.id, 'sent');
      return {
        success: true,
        messageId: savedMessage.id
      };
    } else {
      await repoUpdateMessageStatus(savedMessage.id, 'failed');
      return {
        success: false,
        error: 'Falha ao enviar mensagem'
      };
    }

  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    return {
      success: false,
      error: 'Erro interno ao enviar mensagem'
    };
  }
}

// Função para formatar número de telefone
function formatPhoneNumber(number: string): string {
  // Remove caracteres não numéricos e adiciona código do país se necessário
  let cleaned = number.replace(/\D/g, '');
  
  // Se não começar com 55 (Brasil), adiciona
  if (!cleaned.startsWith('55')) {
    cleaned = '55' + cleaned;
  }
  
  return cleaned;
}

// Função para obter status da conexão
export async function getConnectionStatus(sessionId: string): Promise<AuthResponse> {
  const sess = sessionIdToSession.get(sessionId);
  if (!sess) {
    return {
      success: false,
      isAuthenticated: false,
      error: 'Nenhuma sessão encontrada'
    };
  }

  return {
    success: true,
    isAuthenticated: sess.isAuthenticated,
    qrCode: sess.qrCode
  };
}

// Função para desconectar
export async function disconnect(sessionId: string): Promise<void> {
  const sock = sessionIdToSocket.get(sessionId);
  if (sock) sock.end(undefined);
  sessionIdToSocket.delete(sessionId);
  const sess = sessionIdToSession.get(sessionId);
  if (sess) await repoUpdateSession(sess.id, { isAuthenticated: false });
}

// Função para obter todas as mensagens
export async function getAllMessages(): Promise<WhatsAppMessage[]> {
  return repoGetAllMessages();
}

// Listener de mensagens recebidas: dispara webhook somente na primeira mensagem de um chat
// Necessário para cada socket criado
// Para simplificar, adicionamos aqui um helper para registrar este listener quando o socket abre
// (opcional: poderia ser extraído para função dedicada)
