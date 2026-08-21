#!/usr/bin/env node

/**
 * AI Review Layer for RTK Query Course
 *
 * Uses Groq API (GPT-OSS 20B) to provide qualitative code review.
 *
 * IMPORTANT:
 * This review only runs if functional tests pass.
 *
 * It receives:
 * - Challenge instructions and requirements (README.md)
 * - All user-created code files
 *
 * Provides sophisticated feedback based on actual implementation vs requirements.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

// Load .env from repo root if it exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = join(__dirname, '..', '..', '..');
const envPath = join(repoRoot, '.env');

if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');

  for (const line of envContent.split(/\r?\n/)) {
    const match = line.match(/^\s*GROQ_API_KEY\s*=\s*(.+?)\s*$/);

    if (match) {
      process.env.GROQ_API_KEY = match[1]
        .trim()
        .replace(/^["']|["']$/g, '');
      break;
    }
  }
}

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

const GROQ_API_URL =
  'https://api.groq.com/openai/v1/chat/completions';

const MODEL = 'openai/gpt-oss-20b';

// File extensions to include in code review
const CODE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

/**
 * Clamp a score between 0 and 100.
 */
function clampScore(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(number)));
}

/**
 * Reviews code using AI for qualitative feedback.
 *
 * @param {string} challengeId
 * @param {object} challengeMetadata
 * @param {string} projectDir
 */
export async function reviewCodeWithAI(
  challengeId,
  challengeMetadata,
  projectDir
) {
  const results = {
    challengeId,
    timestamp: new Date().toISOString(),
    score: 0,
    feedback: [],
    strengths: [],
    improvements: [],
    readability: 0,
    maintainability: 0,
    requirementCompliance: 0,
    overall: ''
  };

  try {
    // ------------------------------------------------------------
    // 1. Load challenge instructions and requirements
    // ------------------------------------------------------------

    const challengeDir = join(
      projectDir,
      'challenges',
      challengeId
    );

    const readmePath = join(challengeDir, 'README.md');

    let challengeInstructions = '';
    let challengeRequirements = '';

    if (existsSync(readmePath)) {
      const readmeContent = readFileSync(
        readmePath,
        'utf-8'
      );

      // Split README into instructions and technical requirements
      const requirementsMatch = readmeContent.match(
        /## Technical Requirements(?:\s*\(What Will Be Reviewed\))?/i
      );

      if (requirementsMatch && requirementsMatch.index !== undefined) {
        const splitIndex = requirementsMatch.index;

        challengeInstructions =
          readmeContent.substring(0, splitIndex);

        challengeRequirements =
          readmeContent.substring(splitIndex);
      } else {
        challengeInstructions = readmeContent;
      }
    }

    // ------------------------------------------------------------
    // 2. Read all user-created code files
    // ------------------------------------------------------------

    const codeFiles = [];
    const missingFiles = [];

    for (const filePath of challengeMetadata.filesToCheck || []) {
      const fullPath = join(projectDir, filePath);

      if (existsSync(fullPath)) {
        try {
          const content = readFileSync(fullPath, 'utf-8');

          if (
            CODE_EXTENSIONS.includes(extname(fullPath)) &&
            content.trim().length > 0
          ) {
            codeFiles.push({
              file: filePath,
              content: content.substring(0, 8000)
            });
          }
        } catch {
          // Ignore files that cannot be read
        }
      } else {
        missingFiles.push(filePath);
      }
    }

    // ------------------------------------------------------------
    // 3. Discover additional code files
    // ------------------------------------------------------------

    const additionalFiles = discoverAdditionalFiles(
      challengeMetadata,
      projectDir
    );

    for (const file of additionalFiles) {
      if (!codeFiles.some((f) => f.file === file.file)) {
        codeFiles.push(file);
      }
    }

    if (codeFiles.length === 0) {
      return {
        ...results,
        error:
          'No code files found to review. User must create the required files first.',
        score: 0
      };
    }

    // ------------------------------------------------------------
    // 4. Check API key
    // ------------------------------------------------------------

    if (!GROQ_API_KEY) {
      return {
        ...results,
        error:
          'GROQ_API_KEY environment variable not set. AI review skipped.',
        score: 0
      };
    }

    // ------------------------------------------------------------
    // 5. Build review prompt
    // ------------------------------------------------------------

    const prompt = buildReviewPrompt(
      challengeId,
      challengeMetadata,
      challengeInstructions,
      challengeRequirements,
      codeFiles,
      missingFiles
    );

    // ------------------------------------------------------------
    // 6. Call Groq API
    // ------------------------------------------------------------

    const aiResponse = await callGroqAPI(prompt);

    // ------------------------------------------------------------
    // 7. Parse response
    // ------------------------------------------------------------

    const parsedResponse = parseAIResponse(aiResponse);

    return {
      ...results,
      ...parsedResponse,
      score: calculateAIScore(parsedResponse)
    };
  } catch (error) {
    return {
      ...results,
      error:
        error instanceof Error
          ? error.message
          : String(error),
      score: 0
    };
  }
}

/**
 * Discover additional files user might have created.
 */
function discoverAdditionalFiles(
  challengeMetadata,
  projectDir
) {
  const additionalFiles = [];
  const checkedDirs = new Set();

  for (const filePath of challengeMetadata.filesToCheck || []) {
    const dir = dirname(filePath);

    if (checkedDirs.has(dir)) {
      continue;
    }

    checkedDirs.add(dir);

    const fullDir = join(projectDir, dir);

    if (!existsSync(fullDir)) {
      continue;
    }

    try {
      const files = readdirSync(fullDir);

      for (const file of files) {
        const fullPath = join(fullDir, file);

        try {
          if (
            statSync(fullPath).isFile() &&
            CODE_EXTENSIONS.includes(extname(file))
          ) {
            const relativePath = join(dir, file).replace(
              /\\/g,
              '/'
            );

            if (
              !(challengeMetadata.filesToCheck || []).includes(
                relativePath
              )
            ) {
              try {
                const content = readFileSync(
                  fullPath,
                  'utf-8'
                );

                if (content.trim().length > 0) {
                  additionalFiles.push({
                    file: relativePath,
                    content: content.substring(0, 8000)
                  });
                }
              } catch {
                // Skip unreadable files
              }
            }
          }
        } catch {
          // Skip files that cannot be inspected
        }
      }
    } catch {
      // Skip directories that cannot be read
    }
  }

  return additionalFiles;
}

/**
 * Build sophisticated review prompt with all context.
 */
function buildReviewPrompt(
  challengeId,
  challengeMetadata,
  instructions,
  requirements,
  codeFiles,
  missingFiles
) {
  const challengeName =
    challengeMetadata.challengeName || challengeId;

  const skills = challengeMetadata.skills || [];

  const patternsRequired =
    challengeMetadata.patternsRequired || [];

  const codeContext = codeFiles
    .map(
      (f) =>
        `File: ${f.file}\n\`\`\`typescript\n${f.content}\n\`\`\``
    )
    .join('\n\n---\n\n');

  const missingFilesNote =
    missingFiles.length > 0
      ? `\n\nNOTE: The following expected files are missing: ${missingFiles.join(
          ', '
        )}. This may indicate incomplete implementation.`
      : '';

  const requirementsSummary = requirements
    ? `\n\n## Technical Requirements:\n${requirements.substring(
        0,
        2000
      )}`
    : '';

  const instructionsSummary = instructions
    ? `\n\n## Challenge Instructions:\n${instructions.substring(
        0,
        3000
      )}`
    : '';

  return `You are an expert RTK Query, Redux Toolkit, and TypeScript code reviewer.

Review the following implementation for challenge "${challengeName}" (${challengeId}).

## Challenge Context:

- Challenge ID: ${challengeId}
- Skills Focus: ${skills.join(', ') || 'Not specified'}
- Required Patterns: ${
    patternsRequired.join(', ') || 'Not specified'
  }

${instructionsSummary}
${requirementsSummary}

## User's Implementation:

The following code files were created/modified by the user:

${codeContext}

${missingFilesNote}

## Review Task:

Provide a comprehensive code review focusing on:

1. Requirement Compliance (30%):
   - Does the code meet all functional requirements?
   - Are all required patterns implemented correctly?
   - Are missing files a concern?

2. Code Quality (25%):
   - Readability
   - TypeScript usage
   - Code organization
   - Separation of concerns

3. RTK Query Best Practices (25%):
   - Correct use of createApi
   - Correct use of fetchBaseQuery or appropriate base query
   - Correct endpoint definitions
   - Proper hook usage
   - Store integration
   - Reducer and middleware configuration
   - Error and loading state handling

4. Maintainability (20%):
   - Maintainability
   - Extensibility
   - Code smells
   - Anti-patterns
   - Future changes

IMPORTANT OUTPUT RULES:

- Return ONLY one valid JSON object.
- Do not use Markdown code fences.
- Do not write any explanation before or after the JSON.
- All JSON strings must use valid JSON escaping.
- Do not include trailing commas.
- requirementCompliance MUST be a number from 0 to 100.
- readability MUST be a number from 0 to 100.
- maintainability MUST be a number from 0 to 100.
- strengths MUST be an array of strings.
- improvements MUST be an array of strings.
- overall MUST be a string containing 2-3 sentences.

Return exactly this structure:

{
  "readability": 0,
  "maintainability": 0,
  "strengths": [
    "specific strength 1",
    "specific strength 2",
    "specific strength 3"
  ],
  "improvements": [
    "specific improvement 1 with file reference",
    "specific improvement 2 with file reference",
    "specific improvement 3 with file reference"
  ],
  "overall": "2-3 sentence assessment focusing on requirement compliance and RTK Query best practices.",
  "requirementCompliance": 0
}

Be specific in your feedback. Reference specific files and code patterns. Focus on actionable improvements.`;
}

/**
 * Call Groq API.
 */
async function callGroqAPI(prompt) {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,

      messages: [
        {
          role: 'user',
          content: `Return ONLY valid JSON.

Required JSON format:
{
  "readability": 80,
  "maintainability": 80,
  "strengths": ["strength"],
  "improvements": ["improvement"],
  "overall": "assessment",
  "requirementCompliance": 80
}

All scores must be integers from 0 to 100.
Do not use Markdown.
Do not use code fences.
Do not include any text outside the JSON object.

Review this implementation:

${prompt}`,
        },
      ],

      temperature: 0.2,

      max_tokens: 1500,

      response_format: {
        type: 'json_object',
      },

      reasoning_format: 'hidden',
    }),
  })

  const rawResponse = await response.text()

  if (!response.ok) {
    throw new Error(
      `Groq API error (${response.status}): ${rawResponse}`
    )
  }

  let data

  try {
    data = JSON.parse(rawResponse)
  } catch {
    throw new Error('Groq returned an invalid API response.')
  }

  const content = data?.choices?.[0]?.message?.content

  if (typeof content !== 'string') {
    throw new Error('Groq API returned no review content.')
  }

  return content
}
/**
 * Parse AI response.
 */
function parseAIResponse(response) {
  if (!response || typeof response !== 'string') {
    return createEmptyAIResponse();
  }

  // ------------------------------------------------------------
  // 1. Try direct JSON parsing
  // ------------------------------------------------------------

  try {
    const parsed = JSON.parse(response);

    return normalizeAIResponse(parsed);
  } catch {
    // Continue to extraction
  }

  // ------------------------------------------------------------
  // 2. Remove Markdown code fences and try again
  // ------------------------------------------------------------

  try {
    const cleaned = response
      .trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const parsed = JSON.parse(cleaned);

    return normalizeAIResponse(parsed);
  } catch {
    // Continue to extraction
  }

  // ------------------------------------------------------------
  // 3. Extract JSON object
  // ------------------------------------------------------------

  try {
    const start = response.indexOf('{');
    const end = response.lastIndexOf('}');

    if (start !== -1 && end > start) {
      const jsonText = response.substring(
        start,
        end + 1
      );

      const parsed = JSON.parse(jsonText);

      return normalizeAIResponse(parsed);
    }
  } catch {
    // Continue to fallback parsing
  }

  // ------------------------------------------------------------
  // 4. Manual fallback
  // ------------------------------------------------------------

  const readabilityMatch = response.match(
    /["']?readability["']?\s*[:=]\s*(\d+)/i
  );

  const maintainabilityMatch = response.match(
    /["']?maintainability["']?\s*[:=]\s*(\d+)/i
  );

  const complianceMatch = response.match(
    /["']?requirementCompliance["']?\s*[:=]\s*(\d+)/i
  );

  return {
    readability: readabilityMatch
      ? clampScore(readabilityMatch[1])
      : 0,

    maintainability: maintainabilityMatch
      ? clampScore(maintainabilityMatch[1])
      : 0,

    requirementCompliance: complianceMatch
      ? clampScore(complianceMatch[1])
      : 0,

    strengths: extractList(
      response,
      /strengths?/i
    ),

    improvements: extractList(
      response,
      /improvements?/i
    ),

    overall: response
      .substring(0, 500)
      .trim()
  };
}

/**
 * Normalize AI response and ensure valid values.
 */
function normalizeAIResponse(parsed) {
  if (!parsed || typeof parsed !== 'object') {
    return createEmptyAIResponse();
  }

  return {
    readability: clampScore(parsed.readability),

    maintainability: clampScore(
      parsed.maintainability
    ),

    requirementCompliance: clampScore(
      parsed.requirementCompliance
    ),

    strengths: Array.isArray(parsed.strengths)
      ? parsed.strengths
          .filter(
            (item) => typeof item === 'string'
          )
          .slice(0, 5)
      : [],

    improvements: Array.isArray(
      parsed.improvements
    )
      ? parsed.improvements
          .filter(
            (item) => typeof item === 'string'
          )
          .slice(0, 5)
      : [],

    overall:
      typeof parsed.overall === 'string'
        ? parsed.overall
        : ''
  };
}

/**
 * Empty AI response fallback.
 */
function createEmptyAIResponse() {
  return {
    readability: 0,
    maintainability: 0,
    requirementCompliance: 0,
    strengths: [],
    improvements: [],
    overall: ''
  };
}

/**
 * Extract list items from text.
 */
function extractList(text, keyword) {
  const lines = text.split('\n');
  const list = [];
  let inList = false;

  const matchesKeyword = (line) =>
    typeof keyword === 'string'
      ? line
          .toLowerCase()
          .includes(keyword.toLowerCase())
      : keyword.test(line);

  for (const line of lines) {
    if (matchesKeyword(line)) {
      inList = true;
      continue;
    }

    if (
      inList &&
      (
        line.trim().startsWith('-') ||
        /^\d+\./.test(line.trim()) ||
        line.trim().startsWith('"')
      )
    ) {
      const item = line
        .trim()
        .replace(/^[-•\d."]+\s*/, '')
        .replace(/^["']|["']$/g, '')
        .trim();

      if (item) {
        list.push(item);

        if (list.length >= 5) {
          break;
        }
      }
    }

    if (
      inList &&
      line.trim() === '' &&
      list.length > 0
    ) {
      break;
    }
  }

  return list;
}

/**
 * Calculate AI score based on multiple factors.
 *
 * Requirement compliance is weighted most heavily.
 */
function calculateAIScore(parsedResponse) {
  const readability = clampScore(
    parsedResponse.readability
  );

  const maintainability = clampScore(
    parsedResponse.maintainability
  );

  const requirementCompliance = clampScore(
    parsedResponse.requirementCompliance
  );

  const score = Math.round(
    requirementCompliance * 0.4 +
      readability * 0.3 +
      maintainability * 0.3
  );

  return Math.max(0, Math.min(100, score));
}