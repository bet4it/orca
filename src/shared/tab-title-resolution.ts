import type { Tab } from './tab-types'
import type { TerminalTab } from './terminal-tab-types'
import { isMeaningfulOpenCodeTerminalTitle } from './opencode-terminal-title'
import { recognizeAgentCommandLine } from './agent-command-line-title'
import { formatAgentTypeLabel } from './agent-type-label'

export function resolveTerminalTabTitle(
  tab: Pick<
    TerminalTab,
    'customTitle' | 'quickCommandLabel' | 'aiVaultTitle' | 'generatedTitle' | 'title' | 'defaultTitle'
  >,
  generatedTitlesEnabled: boolean,
  fallback = ''
): string {
  const liveTitle = tab.title?.trim() ?? ''
  const recognizedCommandAgent = recognizeAgentCommandLine(liveTitle)
  const effectiveLiveTitle = recognizedCommandAgent ? '' : liveTitle
  const effectiveFallback =
    fallback && recognizeAgentCommandLine(fallback)
      ? (tab.defaultTitle?.trim() || '')
      : fallback

  return (
    tab.customTitle?.trim() ||
    tab.quickCommandLabel?.trim() ||
    (isMeaningfulOpenCodeTerminalTitle(effectiveLiveTitle) ? effectiveLiveTitle : '') ||
    tab.aiVaultTitle?.title.trim() ||
    (generatedTitlesEnabled ? tab.generatedTitle?.trim() : '') ||
    effectiveLiveTitle ||
    (recognizedCommandAgent ? formatAgentTypeLabel(recognizedCommandAgent.agent) : '') ||
    effectiveFallback ||
    tab.defaultTitle?.trim() ||
    fallback
  )
}

export function resolveUnifiedTabLabel(
  tab:
    | Pick<Tab, 'customLabel' | 'quickCommandLabel' | 'aiVaultTitle' | 'generatedLabel' | 'label'>
    | undefined,
  generatedTitlesEnabled: boolean,
  fallback = ''
): string {
  const liveLabel = tab?.label?.trim() ?? ''
  const recognizedCommandAgent = recognizeAgentCommandLine(liveLabel)
  const effectiveLiveLabel = recognizedCommandAgent ? '' : liveLabel
  const effectiveFallback =
    fallback && recognizeAgentCommandLine(fallback) ? '' : fallback

  return (
    tab?.customLabel?.trim() ||
    tab?.quickCommandLabel?.trim() ||
    (isMeaningfulOpenCodeTerminalTitle(effectiveLiveLabel) ? effectiveLiveLabel : '') ||
    tab?.aiVaultTitle?.title.trim() ||
    (generatedTitlesEnabled ? tab?.generatedLabel?.trim() : '') ||
    effectiveLiveLabel ||
    (recognizedCommandAgent ? formatAgentTypeLabel(recognizedCommandAgent.agent) : '') ||
    effectiveFallback ||
    fallback
  )
}
