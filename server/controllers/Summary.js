import dotenv from "dotenv";
import { CohereClientV2 } from "cohere-ai";
import File from "../models/File.js";
dotenv.config();

// Initialize Cohere client
const cohere = new CohereClientV2({
  token: process.env.COHERE_API_KEY,
});

export const Summary = async (req, res) => {
  try {
    const { fileId } = req.body;

    const user = await File.findById(fileId);
    if (!user) {
      return res.status(404).json({ success: false, message: "File not found" });
    }
    const text = user.textContent;
    console.log("Extracted text length:", text.length);

    // Smart chunking function that respects context and maintains optimal sizes
    const smartChunking = (text, maxChunkSize = 2000, minChunkSize = 500) => {
      const cleanText = text
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/•/g, '\n• ')
        .replace(/\./g, '. ')
        .replace(/,/g, ', ')
        .replace(/:/g, ': ')
        .replace(/\s+/g, ' ')
        .trim();

      const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 10);

      const chunks = [];
      let currentChunk = '';

      for (let sentence of sentences) {
        sentence = sentence.trim();

        if (currentChunk.length + sentence.length > maxChunkSize) {
          if (currentChunk.length >= minChunkSize) {
            chunks.push(currentChunk.trim());
            currentChunk = sentence;
          } else {
            currentChunk += ' ' + sentence;
          }
        } else {
          currentChunk += (currentChunk ? ' ' : '') + sentence;
        }
      }

      if (currentChunk.trim().length >= minChunkSize) {
        chunks.push(currentChunk.trim());
      }

      return chunks;
    };

    // Topic-based chunking (more advanced)
    const topicBasedChunking = (text, maxChunkSize = 2000) => {
      const topicIndicators = [
        /\n\d+\./g,
        /\n[A-Z][^.]*:/g,
        /\n[A-Z\s]{3,}\n/g,
        /\n\s*[-•]\s*/g,
        /\n\s*\*\s*/g,
      ];

      let chunks = [text];

      for (let indicator of topicIndicators) {
        const newChunks = [];
        for (let chunk of chunks) {
          const splits = chunk.split(indicator);
          newChunks.push(...splits.filter(s => s.trim().length > 100));
        }
        chunks = newChunks;
      }

      const finalChunks = [];
      let currentChunk = '';

      for (let chunk of chunks) {
        if (currentChunk.length + chunk.length <= maxChunkSize) {
          currentChunk += (currentChunk ? '\n' : '') + chunk;
        } else {
          if (currentChunk) {
            finalChunks.push(currentChunk.trim());
          }

          if (chunk.length > maxChunkSize) {
            const subChunks = smartChunking(chunk, maxChunkSize);
            finalChunks.push(...subChunks);
            currentChunk = '';
          } else {
            currentChunk = chunk;
          }
        }
      }

      if (currentChunk.trim()) {
        finalChunks.push(currentChunk.trim());
      }

      return finalChunks.filter(chunk => chunk.length > 200);
    };

    // Sliding window chunking (maintains context overlap)
    const slidingWindowChunking = (text, chunkSize = 2000, overlap = 400) => {
      const words = text.split(/\s+/);
      const chunks = [];

      for (let i = 0; i < words.length; i += chunkSize - overlap) {
        const chunk = words.slice(i, i + chunkSize).join(' ');
        if (chunk.trim().length > 200) {
          chunks.push(chunk.trim());
        }
      }

      return chunks;
    };

    // Updated generateDetailedSummary with Cohere API
    const generateDetailedSummary = async (text) => {
      try {
        console.log("Original text length:", text.length);

        // Use smart chunking with larger chunks for Cohere
        const chunks = smartChunking(text, 2000, 500);
        console.log(`Created ${chunks.length} chunks`);

        chunks.forEach((chunk, i) => {
          console.log(`Chunk ${i + 1} size: ${chunk.length} characters`);
        });

        const detailedSummaries = [];

        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i];

          try {
            // Create a detailed prompt for Cohere
            const prompt = `Please provide a comprehensive and detailed summary of the following text. Focus on:
- Main concepts and key points
- Important details and explanations
- Logical flow and structure
- Technical terms and their meanings (if any)
- Any conclusions or outcomes mentioned

Text to summarize:
${chunk}

Please provide a well-structured summary that captures all important information while being clear and organized.`;

            const response = await cohere.chat({
              model: 'command-r-plus-08-2024',
              messages: [
                { role: 'user', content: prompt },
              ],
              temperature: 0.3,
              max_tokens: 800,
            });

            const summary = response.message?.content?.[0]?.text || '';

            if (summary && summary.trim().length > 50) {
              detailedSummaries.push({
                section: i + 1,
                originalLength: chunk.length,
                summary: summary.trim(),
                preview: chunk.substring(0, 150) + "..."
              });
              
              console.log(`Successfully generated summary for chunk ${i + 1}`);
            } else {
              console.warn(`No valid summary generated for chunk ${i + 1}`);
            }

            // Add delay to respect rate limits
            await new Promise(resolve => setTimeout(resolve, 1000));

          } catch (chunkError) {
            console.error(`Error processing chunk ${i + 1}:`, chunkError);
            
            // If it's a rate limit error, wait longer and retry once
            if (chunkError.message?.includes('rate') || chunkError.message?.includes('429')) {
              console.log(`Rate limit hit, waiting 5 seconds before retry...`);
              await new Promise(resolve => setTimeout(resolve, 5000));
              
              try {
                const prompt = `Summarize this text concisely but comprehensively:\n\n${chunk}`;
                const retryResponse = await cohere.chat({
                  model: 'command-r-plus-08-2024',
                  messages: [
                    { role: 'user', content: prompt },
                  ],
                  temperature: 0.3,
                  max_tokens: 600,
                });

                const retrySummary = retryResponse.message?.content?.[0]?.text || '';
                if (retrySummary && retrySummary.trim().length > 50) {
                  detailedSummaries.push({
                    section: i + 1,
                    originalLength: chunk.length,
                    summary: retrySummary.trim(),
                    preview: chunk.substring(0, 150) + "..."
                  });
                }
              } catch (retryError) {
                console.error(`Retry failed for chunk ${i + 1}:`, retryError);
              }
            }
            continue;
          }
        }

        if (detailedSummaries.length === 0) {
          return "No summaries could be generated from the provided text.";
        }

        const formatText = (text) => {
          return text
            .replace(/\*\*(.*?)\*\*/g, '**$1**') // Preserve bold formatting
            .replace(/•/g, '\n• ')
            .replace(/\n\s*\n/g, '\n\n') // Clean up multiple newlines
            .replace(/\s+/g, ' ')
            .trim();
        };

        // Generate an overall summary if we have multiple sections
        let overallSummary = '';
        if (detailedSummaries.length > 1) {
          try {
            const allSummaries = detailedSummaries.map(item => item.summary).join('\n\n');
            const overallPrompt = `Based on these section summaries, provide a comprehensive overall summary that ties together all the main points and themes:

${allSummaries}

Please create a cohesive summary that captures the main ideas and flow of the entire document.`;

            const overallResponse = await cohere.chat({
              model: 'command-r-plus-08-2024',
              messages: [
                { role: 'user', content: overallPrompt },
              ],
              temperature: 0.3,
              max_tokens: 600,
            });

            overallSummary = overallResponse.message?.content?.[0]?.text || '';
          } catch (overallError) {
            console.error("Error generating overall summary:", overallError);
          }
        }

        const formattedSummary = detailedSummaries
          .map(item => {
            const cleanSummary = formatText(item.summary);
            return `**Section ${item.section}** (${item.originalLength} characters):\n\n${cleanSummary}\n`;
          })
          .join('\n' + '─'.repeat(50) + '\n\n');

        const finalResult = overallSummary ? 
          `**📋 OVERALL SUMMARY**\n\n${formatText(overallSummary)}\n\n${'═'.repeat(60)}\n\n**📚 DETAILED SECTION SUMMARIES**\n\n${formattedSummary}` :
          formattedSummary;

        return {
          summary: finalResult,
          totalSections: detailedSummaries.length,
          hasOverallSummary: !!overallSummary,
          processingStats: {
            originalLength: text.length,
            chunksProcessed: chunks.length,
            successfulSummaries: detailedSummaries.length
          }
        };

      } catch (error) {
        console.error("Detailed summary error:", error);
        throw error;
      }
    };

    // Generate the detailed summary
    const result = await generateDetailedSummary(text);

    // Return the result
    return res.status(200).json({
      success: true,
      summary: result.summary,
      totalSections: result.totalSections,
      hasOverallSummary: result.hasOverallSummary,
      processingStats: result.processingStats
    });
  } catch (error) {
    console.error("Summary controller error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while generating the summary.",
      error: error.message
    });
  }
};

// Alternative function for quick summaries (single API call)
export const QuickSummary = async (req, res) => {
  try {
    const { fileId } = req.body;

    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    const text = file.textContent;
    
    // For quick summary, we'll use a single API call with truncated text if needed
    const maxLength = 8000; // Cohere's context limit consideration
    const truncatedText = text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

    const prompt = `Please provide a comprehensive summary of the following document. Include:
- Main topics and key concepts
- Important details and findings
- Conclusions or outcomes
- Any technical terms and their explanations

Document content:
${truncatedText}

Provide a well-structured and detailed summary.`;

    const response = await cohere.chat({
      model: 'command-r-plus-08-2024',
      messages: [
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const summary = response.message?.content?.[0]?.text || '';

    if (!summary) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate summary"
      });
    }

    return res.status(200).json({
      success: true,
      summary: summary.trim(),
      type: 'quick_summary',
      originalLength: text.length,
      processedLength: truncatedText.length
    });

  } catch (error) {
    console.error("Quick summary error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while generating the quick summary.",
      error: error.message
    });
  }
};