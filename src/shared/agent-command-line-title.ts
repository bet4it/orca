import {
  recognizeAgentProcessFromCommandLine,
  type RecognizedAgentProcess
} from './agent-process-recognition'
import type { AgentType } from './agent-status-types'

export const AGENT_IDENTITY_ALIASES_LOWER: Readonly<Record<string, readonly string[]>> = {
  claude: ['claude code'],
  gemini: ['gemini cli'],
  antigravity: ['agy']
}

const ANTIGRAVITY_MODEL_TITLE_RE = /^(?:agy|antigravity)(?:\s*[·—:-]\s*|\s+)gemini\s+\d/i

export function recognizeAgentCommandLine(
  title: string | null | undefined,
  agentType?: AgentType | null | undefined
): RecognizedAgentProcess | null {
  if (!title) {
    return null
  }
  const trimmed = title.trim()
  if (!trimmed || ANTIGRAVITY_MODEL_TITLE_RE.test(trimmed)) {
    return null
  }
  const recognized = recognizeAgentProcessFromCommandLine(trimmed)
  if (!recognized) {
    return null
  }
  if (
    agentType &&
    recognized.agent !== agentType &&
    !AGENT_IDENTITY_ALIASES_LOWER[agentType]?.includes(recognized.processName.toLowerCase())
  ) {
    return null
  }

  // Definite command line markers: CLI flags, quotes, or file path separators.
  if (
    /(?:^|\s)(?:--[\w-]+|-[A-Za-z0-9]+)/.test(trimmed) ||
    trimmed.includes("'") ||
    trimmed.includes('"') ||
    /(?:^|\s)(?:~|[\\/]|[A-Za-z]:[\\/])/.test(trimmed)
  ) {
    return recognized
  }

  // Bare CLI executable / alias name (e.g. "agy", "agy.exe", "claude").
  const lower = trimmed.toLowerCase()
  const procLower = recognized.processName.toLowerCase()
  if (
    lower === procLower ||
    lower === `${procLower}.exe` ||
    lower === `${procLower}.cmd` ||
    lower === `${procLower}.bat`
  ) {
    return recognized
  }

  return null
}

export function isAgentCommandLineTitle(
  title: string | null | undefined,
  agentType?: AgentType | null | undefined
): boolean {
  return recognizeAgentCommandLine(title, agentType) !== null
}
