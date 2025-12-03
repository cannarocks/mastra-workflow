import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";

const instructions = `Sei un agente inserito in un workflow di selezione template. 
Il tuo unico compito è interpretare il messaggio dell'utente e determinare se la risposta è affermativa o negativa.

Istruzioni:
- Analizza il testo dell'utente.
- Se il messaggio indica consenso, accettazione o conferma → restituisci {"isConfirmed": true}.
- Se il messaggio indica rifiuto, diniego o negazione → restituisci {"isConfirmed": false}.
- Non fornire spiegazioni, commenti o altro testo oltre allo structured output richiesto.
`;

export const ConfirmTemplate = new Agent({
  id: "confirm_template_agent",
  name: "Confirm Classificator",
  instructions,
  model: openai("gpt-4o-mini"),
  tools: {},
});
