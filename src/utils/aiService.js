// AI Service for generating weather alerts and recommendations
// Supports OpenAI, Anthropic, and Google Gemini

/**
 * Generate weather alerts using AI
 * @param {Object} weatherData - Current weather data object
 * @param {string} apiKey - User's AI API key
 * @param {string} provider - AI provider ('openai', 'anthropic', 'google')
 * @returns {Promise<Array>} Array of alert objects with type, icon, title, message
 */
export async function generateWeatherAlerts(weatherData, apiKey, provider = 'openai') {
  if (!weatherData || !weatherData.current || !apiKey) {
    throw new Error('Missing required parameters');
  }

  const { temperature, feelsLike, uvIndex, chanceOfRain, windSpeed, humidity, description, visibility } = weatherData.current;
  const location = weatherData.location?.village || weatherData.location?.town || 'your location';

  const prompt = `You are a weather safety expert. Analyze the following weather conditions and provide critical alerts ONLY for dangerous or concerning conditions. Return alerts in JSON format as an array of objects with: type ("danger" or "warning"), icon (emoji), title (string), message (string).

Weather conditions:
- Location: ${location}
- Temperature: ${temperature}°C (feels like ${feelsLike}°C)
- UV Index: ${uvIndex}
- Chance of Rain: ${chanceOfRain}%
- Wind Speed: ${windSpeed} m/s
- Humidity: ${humidity}%
- Conditions: ${description}
- Visibility: ${visibility ? (visibility / 1000).toFixed(1) + ' km' : 'N/A'}

Only return alerts for:
- Extreme temperatures (below -10°C or above 40°C)
- Very high UV (above 8)
- Severe weather (thunderstorms, heavy rain >80%)
- Strong winds (above 15 m/s)
- Dangerous visibility conditions

Return ONLY valid JSON array, no markdown, no code blocks. Example format:
[{"type":"danger","icon":"🌡️","title":"Extreme Heat Warning","message":"Temperature is 42°C. Avoid outdoor activities."}]`;

  try {
    const response = await callAIProvider(prompt, apiKey, provider);
    const alerts = parseAIResponse(response);
    
    // Validate and format alerts
    if (Array.isArray(alerts)) {
      return alerts.filter(alert => 
        alert && 
        typeof alert === 'object' && 
        (alert.type === 'danger' || alert.type === 'warning') &&
        alert.title && 
        alert.message
      );
    }
    return [];
  } catch (error) {
    console.error('AI Alert Generation Error:', error);
    throw error;
  }
}

/**
 * Generate weather recommendations using AI
 * @param {Object} weatherData - Current weather data object
 * @param {string} apiKey - User's AI API key
 * @param {string} provider - AI provider ('openai', 'anthropic', 'google')
 * @returns {Promise<Object>} Recommendations object with clothing, accessories, activities, tips arrays
 */
export async function generateWeatherRecommendations(weatherData, apiKey, provider = 'openai') {
  if (!weatherData || !weatherData.current || !apiKey) {
    throw new Error('Missing required parameters');
  }

  const { temperature, feelsLike, uvIndex, chanceOfRain, windSpeed, humidity, description } = weatherData.current;
  const location = weatherData.location?.village || weatherData.location?.town || 'your location';

  const prompt = `You are a weather advisor. Analyze the following weather conditions and provide personalized recommendations. Return a JSON object with: clothing (array of strings), accessories (array of strings), activities (array of strings), tips (array of strings).

Weather conditions:
- Location: ${location}
- Temperature: ${temperature}°C (feels like ${feelsLike}°C)
- UV Index: ${uvIndex}
- Chance of Rain: ${chanceOfRain}%
- Wind Speed: ${windSpeed} m/s
- Humidity: ${humidity}%
- Conditions: ${description}

Provide practical, specific recommendations. Return ONLY valid JSON object, no markdown, no code blocks. Example format:
{"clothing":["Light jacket","Long pants"],"accessories":["Umbrella","Sunglasses"],"activities":["Outdoor walk","Park visit"],"tips":["Bring a light layer","Stay hydrated"]}`;

  try {
    const response = await callAIProvider(prompt, apiKey, provider);
    const recommendations = parseAIResponse(response);
    
    // Validate and format recommendations
    if (recommendations && typeof recommendations === 'object') {
      return {
        clothing: Array.isArray(recommendations.clothing) ? recommendations.clothing : [],
        accessories: Array.isArray(recommendations.accessories) ? recommendations.accessories : [],
        activities: Array.isArray(recommendations.activities) ? recommendations.activities : [],
        tips: Array.isArray(recommendations.tips) ? recommendations.tips : []
      };
    }
    return { clothing: [], accessories: [], activities: [], tips: [] };
  } catch (error) {
    console.error('AI Recommendation Generation Error:', error);
    throw error;
  }
}

/**
 * Call the appropriate AI provider API
 * @param {string} prompt - The prompt to send
 * @param {string} apiKey - API key for the provider
 * @param {string} provider - Provider name
 * @returns {Promise<string>} AI response text
 */
async function callAIProvider(prompt, apiKey, provider) {
  switch (provider.toLowerCase()) {
    case 'openai':
      return await callOpenAI(prompt, apiKey);
    case 'anthropic':
      return await callAnthropic(prompt, apiKey);
    case 'google':
    case 'gemini':
      return await callGoogleGemini(prompt, apiKey);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

/**
 * Call OpenAI API
 */
async function callOpenAI(prompt, apiKey) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful weather assistant. Always respond with valid JSON only, no markdown formatting, no code blocks.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'API request failed' } }));
    throw new Error(error.error?.message || `OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

/**
 * Call Anthropic Claude API
 */
async function callAnthropic(prompt, apiKey) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `You are a helpful weather assistant. Always respond with valid JSON only, no markdown formatting, no code blocks.\n\n${prompt}`
        }
      ]
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'API request failed' } }));
    throw new Error(error.error?.message || `Anthropic API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0]?.text || '';
}

/**
 * Call Google Gemini API
 */
async function callGoogleGemini(prompt, apiKey) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `You are a helpful weather assistant. Always respond with valid JSON only, no markdown formatting, no code blocks.\n\n${prompt}`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500
      }
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'API request failed' } }));
    throw new Error(error.error?.message || `Google Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates[0]?.content?.parts[0]?.text || '';
}

/**
 * Parse AI response and extract JSON
 * @param {string} response - Raw AI response
 * @returns {Object|Array} Parsed JSON object or array
 */
function parseAIResponse(response) {
  if (!response) {
    throw new Error('Empty response from AI');
  }

  // Try to extract JSON from markdown code blocks if present
  const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || 
                    response.match(/\{[\s\S]*\}/) || 
                    response.match(/\[[\s\S]*\]/);
  
  const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : response.trim();
  
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    // If parsing fails, try to clean the response
    const cleaned = jsonString
      .replace(/^[^{[]*/, '') // Remove leading non-JSON text
      .replace(/[^}\]]*$/, ''); // Remove trailing non-JSON text
    
    try {
      return JSON.parse(cleaned);
    } catch (e) {
      console.error('Failed to parse AI response:', response);
      throw new Error('Invalid JSON response from AI');
    }
  }
}

