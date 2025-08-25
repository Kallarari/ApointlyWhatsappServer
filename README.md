# Apointly WhatsApp Service

Um serviço back-end para automação de WhatsApp usando Express, TypeScript e Baileys.

## 🚀 Funcionalidades

- **Autenticação WhatsApp**: Inicialização de conexão e gerenciamento de sessões
- **Envio de Mensagens**: Envio de mensagens para números específicos
- **Histórico de Mensagens**: Armazenamento local de todas as mensagens enviadas
- **Status de Conexão**: Verificação do status atual da conexão
- **Arquitetura Limpa**: Separação clara entre Repository, Service, Controller e Routes

## 🛠️ Tecnologias

- **Node.js** com **TypeScript**
- **Express.js** para o servidor web
- **Baileys** para integração com WhatsApp
- **CORS** habilitado para desenvolvimento
- **Armazenamento Local** usando objetos em memória

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- WhatsApp Web funcionando no dispositivo

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd apointly-whatsapp-service
```

2. Instale as dependências:
```bash
npm install
```

3. Compile o projeto:
```bash
npm run build
```

## 🚀 Execução

### Modo Desenvolvimento
```bash
npm run dev
```

### Modo Produção
```bash
npm run build
npm start
```

O servidor estará rodando em `http://localhost:7000`

## 📱 Endpoints da API

### Autenticação

#### `POST /api/whatsapp/auth/init`
Inicializa a conexão com WhatsApp e gera QR Code para autenticação.

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Conexão inicializada com sucesso",
  "data": {
    "success": true,
    "isAuthenticated": false,
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  }
}
```

#### `GET /api/whatsapp/auth/status`
Verifica o status atual da conexão.

**Resposta:**
```json
{
  "success": true,
  "message": "Status da conexão obtido com sucesso",
  "data": {
    "success": true,
    "isAuthenticated": true,
    "qrCode": null
  }
}
```

#### `POST /api/whatsapp/auth/disconnect`
Desconecta a sessão atual do WhatsApp.

### Mensagens

#### `POST /api/whatsapp/message/send`
Envia uma mensagem para um número específico.

**Body da Requisição:**
```json
{
  "number": "5511999999999",
  "message": "Olá! Esta é uma mensagem de teste."
}
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Mensagem enviada com sucesso",
  "data": {
    "messageId": "1"
  }
}
```

#### `GET /api/whatsapp/messages`
Lista todas as mensagens enviadas.

**Resposta:**
```json
{
  "success": true,
  "message": "Mensagens obtidas com sucesso",
  "data": {
    "messages": [
      {
        "id": "1",
        "number": "5511999999999",
        "message": "Olá! Esta é uma mensagem de teste.",
        "timestamp": "2024-01-01T10:00:00.000Z",
        "status": "sent"
      }
    ],
    "total": 1
  }
}
```

### Utilitários

#### `GET /api/whatsapp/health`
Verifica se o serviço está funcionando.

#### `GET /`
Documentação da API com todos os endpoints disponíveis.

## 🔐 Autenticação WhatsApp

1. **Inicializar Conexão**: Faça uma requisição POST para `/api/whatsapp/auth/init`
2. **Escaneie o QR Code**: Use o WhatsApp do seu dispositivo para escanear o QR Code retornado
3. **Verificar Status**: Use `GET /api/whatsapp/auth/status` para verificar se está autenticado
4. **Enviar Mensagens**: Após autenticado, você pode enviar mensagens usando `/api/whatsapp/message/send`

## 📁 Estrutura do Projeto

```
src/
├── types/           # Interfaces TypeScript
├── repository/      # Camada de acesso a dados
├── services/        # Lógica de negócio
├── controllers/     # Controle de requisições HTTP
├── routes/          # Definição de rotas
└── index.ts         # Arquivo principal da aplicação
```

## 🧪 Testando a API

### Usando cURL

1. **Inicializar Conexão:**
```bash
curl -X POST http://localhost:3000/api/whatsapp/auth/init
```

2. **Verificar Status:**
```bash
curl http://localhost:3000/api/whatsapp/auth/status
```

3. **Enviar Mensagem:**
```bash
curl -X POST http://localhost:3000/api/whatsapp/message/send \
  -H "Content-Type: application/json" \
  -d '{"number": "5511999999999", "message": "Teste"}'
```

4. **Listar Mensagens:**
```bash
curl http://localhost:3000/api/whatsapp/messages
```

### Usando Postman ou Insomnia

Importe as seguintes requisições:

- **POST** `http://localhost:3000/api/whatsapp/auth/init`
- **GET** `http://localhost:3000/api/whatsapp/auth/status`
- **POST** `http://localhost:3000/api/whatsapp/message/send`
- **GET** `http://localhost:3000/api/whatsapp/messages`

## ⚠️ Observações Importantes

- **Números de Telefone**: Use o formato internacional (ex: 5511999999999 para Brasil)
- **Autenticação**: O QR Code deve ser escaneado dentro de alguns minutos após ser gerado
- **Armazenamento**: Os dados são armazenados em memória e serão perdidos ao reiniciar o servidor
- **Conexão**: Mantenha o dispositivo conectado à internet para manter a sessão ativa

## 🚧 Desenvolvimento

### Scripts Disponíveis

- `npm run dev`: Executa em modo desenvolvimento com hot-reload
- `npm run build`: Compila o projeto TypeScript
- `npm start`: Executa o projeto compilado
- `npm test`: Executa os testes (quando implementados)

### Adicionando Novas Funcionalidades

1. Defina os tipos em `src/types/index.ts`
2. Implemente a lógica no repositório
3. Adicione métodos no serviço
4. Crie endpoints no controller
5. Configure as rotas

## 📄 Licença

Este projeto está sob a licença MIT.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, abra uma issue ou pull request.

---

**Desenvolvido com ❤️ para Apointly**
