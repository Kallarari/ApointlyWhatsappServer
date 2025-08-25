# 🚀 Instruções Rápidas - Apointly WhatsApp Service

## 📋 Pré-requisitos
- Node.js instalado (versão 16+)
- WhatsApp funcionando no seu dispositivo

## ⚡ Inicialização Rápida

### Opção 1: Script Automático (Windows)
```bash
start.bat
```

### Opção 2: Comandos Manuais
```bash
# 1. Instalar dependências (apenas na primeira vez)
npm install

# 2. Compilar o projeto
npm run build

# 3. Iniciar o servidor
npm start
```

## 🔐 Primeiro Uso

1. **Inicie o servidor** usando um dos métodos acima
2. **Abra o navegador** e acesse: `http://localhost:7000`
3. **Inicialize a conexão** com WhatsApp:
   - POST: `http://localhost:7000/api/whatsapp/auth/init`
4. **Escaneie o QR Code** com seu WhatsApp
5. **Verifique o status**: `http://localhost:7000/api/whatsapp/auth/status`
6. **Envie uma mensagem**:
   - POST: `http://localhost:7000/api/whatsapp/message/send`
   - Body: `{"number": "5511999999999", "message": "Teste"}`

## 📱 Endpoints Principais

- **Health Check**: `GET /api/whatsapp/health`
- **Inicializar**: `POST /api/whatsapp/auth/init`
- **Status**: `GET /api/whatsapp/auth/status`
- **Enviar**: `POST /api/whatsapp/message/send`
- **Mensagens**: `GET /api/whatsapp/messages`
- **Desconectar**: `POST /api/whatsapp/auth/disconnect`

## 🧪 Testando

### Opção 1: Interface Web (Recomendado)
Abra o arquivo `examples/qr-code-example.html` no seu navegador para uma interface completa e amigável.

### Opção 2: Arquivo HTTP
Use o arquivo `examples/test-api.http` com extensões como REST Client (VS Code) ou Insomnia.

### Opção 3: Navegador Direto
Teste diretamente no navegador:
- `http://localhost:7000` - Documentação da API
- `http://localhost:7000/api/whatsapp/health` - Status do serviço

## ⚠️ Importante

- Mantenha o dispositivo conectado à internet
- O QR Code expira em alguns minutos
- Os dados são armazenados em memória (perdidos ao reiniciar)

## 🆘 Problemas Comuns

- **Porta 7000 ocupada**: Mude a porta no arquivo `src/index.ts`
- **Erro de compilação**: Execute `npm run build` primeiro
- **Dependências**: Execute `npm install` se necessário

---

**🎯 Sucesso!** Seu bot de WhatsApp está rodando em `http://localhost:7000`
