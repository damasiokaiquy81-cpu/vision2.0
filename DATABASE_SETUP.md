# Configuração do Banco de Dados PostgreSQL

Este guia explica como conectar o CRM Vision à sua tabela `data_analysis` no banco PostgreSQL do Directus.

## 📋 Pré-requisitos

- Acesso ao banco PostgreSQL do Directus
- Node.js instalado para o backend
- Credenciais de conexão configuradas

## 🔧 Configuração

### 1. Variáveis de Ambiente

O arquivo `.env` já foi criado com as configurações básicas. **IMPORTANTE**: Substitua `your_password_here` pela senha real:

```env
DB_HOST=pgbouncer-geral
DB_PORT=5432
DB_NAME=directus_jana
DB_USER=postgres
DB_PASSWORD=SUA_SENHA_AQUI
DB_MAX_CONNECTIONS=100
DB_SSL=false
VITE_API_URL=http://localhost:3001
```

### 2. Backend API (Necessário)

O frontend React não pode conectar diretamente ao PostgreSQL por questões de segurança. Você precisa configurar um backend:

#### Opção A: Usar o exemplo fornecido

1. Navegue para a pasta `backend-example/`
2. Instale as dependências:
   ```bash
   cd backend-example
   npm install
   ```
3. Configure o arquivo `.env` na pasta backend-example
4. Execute o servidor:
   ```bash
   npm run dev
   ```

#### Opção B: Integrar com seu backend existente

Se você já tem um backend, adicione os endpoints do arquivo `server.js` ao seu projeto existente.

### 3. Estrutura da Tabela

O sistema espera que sua tabela `data_analysis` tenha pelo menos estas colunas:

```sql
CREATE TABLE data_analysis (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Como Funciona

### Frontend (React)

1. **Serviço de Banco**: `src/services/database.ts`
   - Faz requisições HTTP para o backend
   - Implementa fallback para dados mock em caso de erro
   - Gerencia diferentes períodos de visualização

2. **Componente CRM**: `src/components/Dashboard/CRMSection.tsx`
   - Carrega dados automaticamente ao trocar de período
   - Mostra indicadores de loading e erro
   - Fallback automático para dados de exemplo

### Backend (Node.js + Express)

1. **Endpoints disponíveis**:
   - `GET /api/health` - Testa conexão com banco
   - `GET /api/data-analysis?period=individual|weekly|monthly|yearly` - Busca dados por período
   - `GET /api/data-analysis/aggregated?period=weekly|monthly|yearly` - Dados agregados

2. **Filtros por período**:
   - **Individual**: Últimos 50 registros
   - **Semanal**: Últimas 4 semanas
   - **Mensal**: Últimos 12 meses
   - **Anual**: Últimos 3 anos

## 🔍 Testando a Conexão

### 1. Teste direto no PostgreSQL

```sql
-- Conecte-se ao banco e teste:
SELECT COUNT(*) FROM data_analysis;
SELECT * FROM data_analysis LIMIT 5;
```

### 2. Teste do backend

```bash
# Teste de saúde
curl http://localhost:3001/api/health

# Teste de dados
curl "http://localhost:3001/api/data-analysis?period=individual"
```

### 3. Teste no frontend

1. Abra o CRM Vision
2. Vá para a seção "CRM Vision"
3. Troque entre os períodos (Individual, Semanal, Mensal, Anual)
4. Verifique se os dados carregam ou se aparece mensagem de erro

## 🛠️ Troubleshooting

### Problema: "Erro ao carregar dados"

1. **Verifique se o backend está rodando**:
   ```bash
   curl http://localhost:3001/api/health
   ```

2. **Verifique as credenciais do banco**:
   - Confirme host, porta, usuário e senha
   - Teste conexão direta com pgAdmin

3. **Verifique os logs do backend**:
   - Erros de conexão aparecerão no console do servidor

### Problema: "Dados não aparecem"

1. **Verifique se a tabela existe**:
   ```sql
   \dt data_analysis
   ```

2. **Verifique se há dados na tabela**:
   ```sql
   SELECT COUNT(*) FROM data_analysis;
   ```

3. **Verifique a estrutura da tabela**:
   ```sql
   \d data_analysis
   ```

## 📊 Personalização

### Modificar campos exibidos

Edite `src/services/database.ts` e `src/components/Dashboard/CRMSection.tsx` para mapear campos adicionais da sua tabela.

### Adicionar novos períodos

1. Adicione o novo tipo em `ViewType`
2. Implemente a lógica no backend (`server.js`)
3. Adicione o botão no frontend (`CRMSection.tsx`)

### Customizar queries

Modifique as queries SQL no arquivo `backend-example/server.js` conforme suas necessidades.

## 🔐 Segurança

- **Nunca** exponha credenciais do banco no frontend
- Use variáveis de ambiente para configurações sensíveis
- Implemente autenticação no backend se necessário
- Configure CORS adequadamente para produção

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs do backend
2. Teste a conexão direta com o banco
3. Confirme se a estrutura da tabela está correta
4. Verifique se as credenciais estão corretas

O sistema foi projetado para funcionar com dados mock como fallback, então sempre mostrará algum conteúdo mesmo se a conexão falhar.