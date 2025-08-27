import express from 'express';
import cors from 'cors';
import { createWhatsAppRoutes } from './routes/WhatsAppRoutes';

// Função para inicializar middlewares
function initializeMiddlewares(app: express.Application): void {
  // Middleware para CORS
  const allowedOrigins = [
    'http://localhost:7000',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1',
    'https://emotioncare-server-781420692552.southamerica-east1.run.app',
    'https://www.apointly.com.br/'
  ];
/*   app.use(cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.some(o => origin.startsWith(o))) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
   */

  app.use(cors());
  app.use(express.json());
  
  app.use(express.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Função para inicializar rotas
function initializeRoutes(app: express.Application): void {
  // Aplicar rotas do WhatsApp
  app.use('/api/whatsapp', createWhatsAppRoutes());

  // Rota raiz
  app.get('/', (req, res) => {
    res.json({
      message: 'Apointly WhatsApp Service',
      version: '1.0.0',
      endpoints: {
        health: '/api/whatsapp/health',
        auth: {
          init: 'POST /api/whatsapp/auth/init',
          status: 'GET /api/whatsapp/auth/status',
          disconnect: 'POST /api/whatsapp/auth/disconnect'
        },
        messages: {
          send: 'POST /api/whatsapp/message/send',
          list: 'GET /api/whatsapp/messages'
        }
      }
    });
  });

  // Middleware de tratamento de erros
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Erro não tratado:', err);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno'
    });
  });

  // Middleware para rotas não encontradas
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: 'Rota não encontrada'
    });
  });
}

// Função para iniciar a aplicação
function startApp(): void {
  const app = express();
  const port = parseInt(process.env.PORT || '7000');

  // Inicializar middlewares e rotas
  initializeMiddlewares(app);
  initializeRoutes(app);

  // Iniciar servidor
  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${port}`);
    console.log(`📱 Apointly WhatsApp Service iniciado`);
    console.log(`🔗 Acesse: http://localhost:${port}`);
    console.log(`📋 Documentação: http://localhost:${port}/api/whatsapp/health`);
  });
}

// Iniciar aplicação
startApp();
