# AI Agent Attribution Instructions

We welcome contributions that were written or assisted by AI coding agents. However, any commit that involved AI assistance must say so clearly.

Attribution is important when using agents for coding. Commits should be authored by the human contributor and co‑signed by the AI agent(s). Always use a 'Co-Authored-By' trailer in commit messages.

The format generally is: "Co-Authored-By: <agent-name> (<version>) <email>". Substitute the actual names and versions at runtime.

For GitHub to link these to the correct accounts, these specific email addresses should be used by these common models:

- ChatGPT (including Codex and other integrations):
  `Co-authored-by: ChatGPT <chatgpt-codex-connector[bot]@users.noreply.github.com>`

- Codex (OpenAI Codex CLI 等 Codex 系列编码 Agent):
  `Co-authored-by: Codex <codex@openai.com>`

- Claude (including Claude Code and other integrations of Claude):
  `Co-authored-by: Claude <noreply@anthropic.com>`

- Gemini (including gemini-cli and other Gemini models and agent integrations):
  `Co-authored-by: Gemini <gemini-cli@users.noreply.github.com>`

- Copilot (including Microsoft Copilot, GitHub Copilot, or other variations):
  `Co-authored-by: Copilot <copilot-connector[bot]@users.noreply.github.com>`

- Cursor:
  `Co-authored-by: Cursor <cursoragent@cursor.com>`

- Warp:
  `Co-authored-by: Warp <agent@warp.dev>`

## Example

```
Commit message subject

Commit message body.

Co-authored-by: Codex <codex@openai.com>
```
