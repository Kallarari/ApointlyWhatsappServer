import { WhatsAppMessage, WhatsAppSession } from '../types';

// Armazenamento local usando objetos
const messages = new Map<string, WhatsAppMessage>();
const sessions = new Map<string, WhatsAppSession>();
let messageCounter = 0;

// Controle de conversas já notificadas por sessão (para webhook de primeira mensagem)
const sessionIdToSeenChats = new Map<string, Set<string>>();

// Funções para mensagens
export async function saveMessage(message: Omit<WhatsAppMessage, 'id'>): Promise<WhatsAppMessage> {
  const id = (++messageCounter).toString();
  const newMessage: WhatsAppMessage = {
    ...message,
    id,
    timestamp: new Date()
  };
  
  messages.set(id, newMessage);
  return newMessage;
}

export async function getMessageById(id: string): Promise<WhatsAppMessage | null> {
  return messages.get(id) || null;
}

export async function getAllMessages(): Promise<WhatsAppMessage[]> {
  return Array.from(messages.values());
}

export async function updateMessageStatus(id: string, status: WhatsAppMessage['status']): Promise<boolean> {
  const message = messages.get(id);
  if (message) {
    message.status = status;
    return true;
  }
  return false;
}

export async function saveSession(session: Omit<WhatsAppSession, 'id'> & { id?: string }): Promise<WhatsAppSession> {
  const id = session.id ?? `session_${Date.now()}`;
  const newSession: WhatsAppSession = {
    ...session,
    id,
    lastActivity: new Date()
  };
  
  sessions.set(id, newSession);
  return newSession;
}

export async function getSessionById(id: string): Promise<WhatsAppSession | null> {
  return sessions.get(id) || null;
}

export async function updateSession(id: string, updates: Partial<WhatsAppSession>): Promise<boolean> {
  const session = sessions.get(id);
  if (session) {
    Object.assign(session, updates, { lastActivity: new Date() });
    return true;
  }
  return false;
}

export async function getActiveSession(): Promise<WhatsAppSession | null> {
  const sessionsList = Array.from(sessions.values());
  return sessionsList.find(session => session.isAuthenticated) || null;
}

export async function getSessionByIdOrCreate(sessionId: string, webhookUrl?: string): Promise<WhatsAppSession> {
  const existing = sessions.get(sessionId);
  if (existing) return existing;
  const created = await saveSession({ id: sessionId, isAuthenticated: false, webhookUrl, lastActivity: new Date() });
  return created;
}

export async function deleteSession(id: string): Promise<boolean> {
  sessionIdToSeenChats.delete(id);
  return sessions.delete(id);
}

export async function markConversationIfNew(sessionId: string, chatId: string): Promise<boolean> {
  let seen = sessionIdToSeenChats.get(sessionId);
  if (!seen) {
    seen = new Set<string>();
    sessionIdToSeenChats.set(sessionId, seen);
  }
  if (seen.has(chatId)) return false;
  seen.add(chatId);
  return true;
}
