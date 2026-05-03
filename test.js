const Anthropic = require('@anthropic-ai/sdk');

async function test() {
  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-latest',
      max_tokens: 10,
      messages: [{ role: 'user', content: 'Test' }]
    });
    console.log('SUCCESS:', message.content[0].text);
  } catch (err) {
    console.error('ERROR_NAME:', err.name);
    console.error('ERROR_STATUS:', err.status);
    console.error('ERROR_MESSAGE:', err.message);
  }
}
test();
