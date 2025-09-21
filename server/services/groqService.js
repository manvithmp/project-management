const Groq = require('groq-sdk');

class GroqService {
  constructor() {
    this.client = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
  }

  async generateUserStories(projectDescription) {
    try {
      const prompt = `
        Generate user stories for the following project description: "${projectDescription}"
        
        Return ONLY a JSON array of user stories in this exact format:
        [
          "As a [role], I want to [action], so that [benefit].",
          "As a [role], I want to [action], so that [benefit]."
        ]
        
        Generate 5-8 user stories. Make sure each story follows the exact format and is relevant to the project.
      `;

      const chatCompletion = await this.client.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a senior product manager expert at writing user stories. Generate clear, concise user stories that follow agile best practices."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 1000
      });

      const response = chatCompletion.choices[0].message.content.trim();
      
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const userStories = JSON.parse(jsonMatch[0]);
        return userStories.filter(story => 
          story.includes('As a') && 
          story.includes('I want to') && 
          story.includes('so that')
        );
      }
      
      throw new Error('Failed to parse user stories from AI response');
    } catch (error) {
      console.error('GROQ API Error:', error);
      throw new Error('Failed to generate user stories');
    }
  }
}

module.exports = new GroqService();
