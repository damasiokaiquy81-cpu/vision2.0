# 🚀 Como Conectar ao Banco de Dados - Guia Simples

## ⚠️ IMPORTANTE: Você precisa de 2 coisas rodando:
1. **Frontend** (já está rodando)
2. **Backend** (precisa criar e rodar)

---

## 📝 PASSO 1: Corrigir as informações do banco

Você disse que passou o database errado. Vamos corrigir:

1. **Abra o arquivo `.env`** na pasta do projeto
2. **Substitua as informações** pelas corretas do seu banco:

```env
# SUBSTITUA ESTAS INFORMAÇÕES PELAS CORRETAS:
DB_HOST=seu_host_aqui
DB_PORT=5432
DB_NAME=seu_database_aqui
DB_USER=seu_usuario_aqui
DB_PASSWORD=sua_senha_aqui
DB_SSL=false
VITE_API_URL=http://localhost:3001
```

**Exemplo com suas informações corretas:**
```env
DB_HOST=pgbouncer-geral
DB_PORT=5432
DB_NAME=directus_jana
DB_USER=postgres
DB_PASSWORD=SUA_SENHA_REAL_AQUI
DB_SSL=false
VITE_API_URL=http://localhost:3001
```

---

## 🔧 PASSO 2: Configurar o Backend

### 2.1 Abrir um novo terminal
- No VS Code: `Ctrl + Shift + '` (ou Terminal > New Terminal)
- **IMPORTANTE**: Deixe o frontend rodando no terminal atual!

### 2.2 Navegar para a pasta do backend
```bash
cd backend-example
```

### 2.3 Instalar dependências
```bash
npm install
```

### 2.4 Criar arquivo .env no backend
Crie um arquivo `.env` dentro da pasta `backend-example` com:

```env
DB_HOST=seu_host_aqui
DB_PORT=5432
DB_NAME=seu_database_aqui
DB_USER=seu_usuario_aqui
DB_PASSWORD=sua_senha_aqui
DB_SSL=false
PORT=3001
```

### 2.5 Rodar o backend
```bash
npm run dev
```

---

## ✅ PASSO 3: Testar se funcionou

### 3.1 Teste rápido no navegador
Abra: http://localhost:3001/api/health

**Se funcionou:** Vai mostrar uma mensagem de sucesso
**Se não funcionou:** Vai mostrar erro de conexão

### 3.2 Teste no CRM
1. Abra seu projeto: http://localhost:5173
2. Vá na seção "CRM Vision"
3. Clique nos botões (Individual, Semanal, etc.)
4. Se conectou: dados reais aparecerão
5. Se não conectou: dados de exemplo + mensagem de erro

---

## 🆘 Se der erro:

### Erro de conexão com banco:
1. **Verifique se o banco está rodando**
2. **Confirme host, porta, usuário e senha**
3. **Teste no pgAdmin primeiro**

### Erro "tabela não existe":
1. **Confirme o nome da tabela** (deve ser `data_analysis`)
2. **Verifique se está no database correto**

### Backend não inicia:
1. **Certifique-se que está na pasta `backend-example`**
2. **Rode `npm install` novamente**
3. **Verifique se a porta 3001 está livre**

---

## 📋 Resumo do que você precisa fazer:

1. ✏️ **Corrigir** informações do banco no arquivo `.env`
2. 📁 **Entrar** na pasta `backend-example`
3. 📦 **Instalar** dependências: `npm install`
4. 🔧 **Criar** arquivo `.env` no backend
5. ▶️ **Rodar** o backend: `npm run dev`
6. 🧪 **Testar** se funcionou

**Resultado:** Seu CRM vai mostrar dados reais do banco PostgreSQL!

---

## 💡 Dica:
Se ainda não funcionar, me mande:
1. As informações corretas do seu banco
2. O erro que aparece no terminal
3. Se a tabela `data_analysis` realmente existe

Aí eu te ajudo a resolver!