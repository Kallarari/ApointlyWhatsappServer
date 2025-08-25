export interface WhatsAppMessage {
  id: string;
  number: string;
  message: string;
  timestamp: Date;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
}

export interface WhatsAppSession {
  id: string;
  isAuthenticated: boolean;
  qrCode?: string;
  phoneNumber?: string;
  webhookUrl?: string;
  lastActivity: Date;
}

export interface SendMessageRequest {
  number: string;
  message: string;
}

export interface SendMessageResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface AuthResponse {
  success: boolean;
  qrCode?: string;
  isAuthenticated: boolean;
  error?: string;
}

export interface InitAuthRequest {
  sessionId: string;
  webhookUrl?: string;
}

export interface ConnectionStatusRequest {
  sessionId: string;
}

export interface LogoutRequest {
  sessionId: string;
}
