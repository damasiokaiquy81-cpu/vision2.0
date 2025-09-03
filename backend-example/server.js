// Example Node.js backend server for PostgreSQL connection
// This is a reference implementation - you'll need to set up a separate backend project

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

app.use(express.json());

// Directus API configuration
const directusConfig = {
  apiUrl: process.env.DIRECTUS_API_URL,
  token: process.env.DIRECTUS_TOKEN
};

// Axios instance for Directus API
const directusApi = axios.create({
  baseURL: directusConfig.apiUrl,
  headers: {
    'Authorization': `Bearer ${directusConfig.token}`,
    'Content-Type': 'application/json'
  }
});

// Health check endpoint for Directus API
app.get('/api/directus/health', async (req, res) => {
  try {
    // Test Directus API connection
    const response = await directusApi.get('/server/info');
    
    res.json({ 
      success: true, 
      message: 'Directus API connected successfully',
      timestamp: new Date().toISOString(),
      directus_info: response.data
    });
  } catch (error) {
    console.error('Directus API connection failed:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Directus API connection failed',
      details: error.message
    });
  }
});

// Parse all_analyzes JSON and extract data_analysis fields
function processDirectusRecord(record) {
  try {
    // Use user_id as the main ID
    const mainId = record.user_id || record.id;
    
    let analysisData = {};
    
    // Parse all_analyzes JSON field only
    if (record.all_analyzes) {
      try {
        // Check if it's already an object
        if (typeof record.all_analyzes === 'object') {
          analysisData = record.all_analyzes;
        } else {
          analysisData = JSON.parse(record.all_analyzes);
        }
      } catch (parseError) {
        console.warn('Skipping record with invalid JSON:', record.id, parseError.message);
        // Return null to filter out this record
        return null;
      }
    }
    
    // Check if filtro contains the special message
    const hasFilterMessage = record.filtro && record.filtro.includes('Os dados da semana se mantiveram os mesmos do atendimento realizado em');
    
    // Create fixed columns structure - always return these columns even if empty
    return {
      id: mainId,
      name: analysisData['Name'] || '',
      phone: analysisData['Phone'] || '',
      dtAnalysis: record.date_of_analysis || '',
      resumo: analysisData['Resumo'] || '',
      satisfacao: analysisData['Satisfacao'] || '',
      reclamacao: analysisData['Reclamacao'] || '',
      duracao: analysisData['Duracao'] || '',
      tema: analysisData['Tema'] || '',
      busca: analysisData['Busca'] || '',
      keywords: analysisData['Keywords'] || '',
      filtro: record.filtro || '',
      isViewReference: hasFilterMessage,
      // New apontamentos fields
      apontamentos: {
        clientesInsatisfeitos: analysisData['Nome dos clientes insatisfeitos'] || '',
        clientesSatisfeitos: analysisData['Nome dos clientes satisfeitos'] || '',
        motivosReclamacoes: analysisData['Todos os motivos de Reclamações'] || ''
      },
      // Keep original fields
      user_id: record.user_id,
      session_id: record.session_id,
      date_of_analysis: record.date_of_analysis,
      time_type: record.time_type,
      all_analyzes: record.all_analyzes,
      created_at: record.date_of_analysis,
      updated_at: record.date_of_analysis
    };
  } catch (error) {
    console.error('Error processing Directus record:', error);
    return {
      id: record.user_id || record.id,
      name: '',
      phone: '',
      dtAnalysis: '',
      resumo: '',
      satisfacao: '',
      reclamacao: '',
      duracao: '',
      tema: '',
      busca: '',
      keywords: '',
      filtro: '',
      isViewReference: false,
      apontamentos: {
        clientesInsatisfeitos: '',
        clientesSatisfeitos: '',
        motivosReclamacoes: ''
      },
      user_id: record.user_id,
      session_id: record.session_id,
      date_of_analysis: record.date_of_analysis,
      time_type: record.time_type,
      all_analyzes: record.all_analyzes,
      created_at: record.date_of_analysis,
      updated_at: record.date_of_analysis
    };
  }
}

// Debug endpoint to see available fields
app.get('/api/directus/debug', async (req, res) => {
  try {
    const response = await directusApi.get('/items/data_analysis', {
      params: {
        limit: 1
      }
    });
    
    res.json({
      success: true,
      raw_data: response.data,
      first_record: response.data.data[0] || null
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({
      success: false,
      error: 'Debug failed',
      details: error.response?.data || error.message
    });
  }
});

// Get data analysis records from Directus
app.get('/api/directus/data-analysis', async (req, res) => {
  try {
    const { period } = req.query;
    
    // Map period to time_type
    const timeTypeMapping = {
      'individual': 'daily',
      'weekly': 'weekly',
      'monthly': 'month',
      'yearly': 'year'
    };
    
    const timeType = timeTypeMapping[period];
    
    // Build query parameters
       let queryParams = {
         limit: 100,
         sort: '-id',
         fields: 'id,user_id,session_id,date_of_analysis,time_type,all_analyzes,text_embedding,filtro'
       };
    
    // Add filter if specific period is requested
    if (timeType) {
      queryParams.filter = {
        time_type: {
          _contains: timeType
        }
      };
    }
    
    // Fetch data from Directus
    const response = await directusApi.get('/items/data_analysis', {
      params: queryParams
    });
    
    // Process the records and filter out null values (invalid JSON records)
    const processedData = response.data.data
      .map(processDirectusRecord)
      .filter(record => record !== null);
    
    res.json({
      success: true,
      data: processedData,
      count: processedData.length,
      period: period,
      time_type: timeType
    });
  } catch (error) {
    console.error('Error fetching data analysis from Directus:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch data analysis from Directus',
      details: error.response?.data || error.message
    });
  }
});

// Get aggregated data by period
app.get('/api/data-analysis/aggregated', async (req, res) => {
  try {
    const { period } = req.query;
    let query;
    
    switch (period) {
      case 'weekly':
        query = `
          SELECT 
            DATE_TRUNC('week', created_at) as period,
            COUNT(*) as count,
            'Semana ' || EXTRACT(week FROM created_at) as name
          FROM data_analysis 
          WHERE created_at >= NOW() - INTERVAL '4 weeks'
          GROUP BY DATE_TRUNC('week', created_at), EXTRACT(week FROM created_at)
          ORDER BY period DESC
        `;
        break;
      case 'monthly':
        query = `
          SELECT 
            DATE_TRUNC('month', created_at) as period,
            COUNT(*) as count,
            TO_CHAR(created_at, 'Month') as name
          FROM data_analysis 
          WHERE created_at >= NOW() - INTERVAL '12 months'
          GROUP BY DATE_TRUNC('month', created_at), TO_CHAR(created_at, 'Month')
          ORDER BY period DESC
        `;
        break;
      case 'yearly':
        query = `
          SELECT 
            DATE_TRUNC('year', created_at) as period,
            COUNT(*) as count,
            EXTRACT(year FROM created_at)::text as name
          FROM data_analysis 
          WHERE created_at >= NOW() - INTERVAL '3 years'
          GROUP BY DATE_TRUNC('year', created_at), EXTRACT(year FROM created_at)
          ORDER BY period DESC
        `;
        break;
      default:
        query = `
          SELECT 
            id,
            name,
            data,
            created_at
          FROM data_analysis 
          ORDER BY created_at DESC 
          LIMIT 50
        `;
    }

    const client = await pool.connect();
    const result = await client.query(query);
    client.release();

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching aggregated data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch aggregated data'
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Database: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await pool.end();
  process.exit(0);
});