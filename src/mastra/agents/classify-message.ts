import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import {
  createAnswerRelevancyScorer,
  createToxicityScorer,
} from "@mastra/evals/scorers/llm";
import { LibSQLVector } from "@mastra/libsql";
import { Memory } from "@mastra/memory";

const instructions = `
Ruolo: Sei il Classifier Agent del workflow UNGUESS. Il tuo unico compito è analizzare la richiesta dell’utente e restituire un output strutturato per gli agenti successivi. Non devi mai rispondere all’utente.

1. Cosa devi determinare

Analizza il messaggio dell'utente e stabilisci:

A) Pertinenza
La richiesta è PERTINENTE se riguarda:
- Quality Assurance e testing (funzionale, regressione, exploratory)
- User Experience / usabilità
- Security testing / vulnerabilità
- Accessibility (WCAG)
- Compatibilità devie/browser
- Performance testing
- Servizi, piattaforma o attività UNGUESS
(→ crowdtesting, tryber, workspace, attività di test)

La richiesta è NON PERTINENTE se riguarda:

- Sviluppo software / scrittura codice
- Questioni amministrative/fatturazione
- HR, sales, marketing
- Argomenti estranei al testing digitale

B) Intent
Classifica l'intent:
- "create_test_plan" → l'utente vuole avviare un test, un plan o migliorare un prodotto digitale tramite QA/UX/Security.
- "support_request" → l'utente chiede teoriche informazioni su QA/UX/security, su un'attività passata svolta o sulla piattaforma UNGUESS.
- "out_of_scope" → richiesta non pertinente.

C) Topic
Individua il tema principale (es. "functional testing", "usability", "security", "performance", "tryber platform", "billing", "software development", ecc.)

D) Summary
Produci un breve riassunto oggettivo della richiesta (1–2 frasi).

2. Output
Restituisci solo questo JSON:
{
  "intent": "create_test_plan | support_request | out_of_scope",
  "topic": "string",
  "summary": "string"
}

3. Vincoli
❌ Non rispondere mai all'utente
❌ Non proporre soluzioni o servizi
❌ Non fare domande
✔️ Analisi pura → classificazione + sintesi
✔️ Breve, oggettivo, consistente
`;

export const ClassifyMessage = new Agent({
  id: "classify_message_agent",
  name: "Message Classificator",
  instructions: async ({ runtimeContext }) => {
    const workspacename = runtimeContext.get("workspaceName");
    const userName = runtimeContext.get("userName");
    console.debug("🚀 ~ requestContext:", runtimeContext);
    console.debug("🚀 ~ workspacename:", workspacename);
    console.debug("🚀 ~ userName:", userName);

    return `${instructions} \n\n you know that you are talking with ${userName} from the workspace ${workspacename} and today is ${Date.now().toLocaleString()}. Use this information to better contextualize your answers.`;
  },
  model: openai("gpt-4.1"),
  tools: {},
  memory: new Memory({
    vector: new LibSQLVector({
      connectionUrl: "file:../../.storage/storage_workflow.db",
    }),
    embedder: openai.embedding("text-embedding-3-small"),
    options: {
      lastMessages: 15,
      semanticRecall: {
        topK: 10,
        messageRange: 5,
      },
    },
  }),
  scorers: {
    relevancy: {
      scorer: createAnswerRelevancyScorer({ model: openai("gpt-4o-mini") }),
      sampling: { type: "ratio", rate: 0.5 },
    },
    safety: {
      scorer: createToxicityScorer({ model: openai("gpt-4o-mini") }),
      sampling: { type: "ratio", rate: 1 },
    },
  },
});
