// System prompts define the AI's personality and behavior

/**
 * Default system prompt for the study buddy
 */
const DEFAULT_SYSTEM_PROMPT = `
You are a helpful study buddy assistant. You help students learn by:
- Answering questions clearly and concisely
- Providing examples when helpful
- Encouraging students to think critically
- Being friendly and supportive
`;

/**
 * Students will create a more specific persona
 * For example: a patient tutor, a challenging quiz master, etc.
 */
const STUDY_BUDDY_PERSONA = DEFAULT_SYSTEM_PROMPT;

module.exports = {
  DEFAULT_SYSTEM_PROMPT,
  STUDY_BUDDY_PERSONA
};
