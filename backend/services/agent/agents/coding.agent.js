import { getModels } from "../config/llmModels.js";


export const codingAgent = async (state) => {
    const intentLlm = await getModels("coding");
    const intentRes = await intentLlm.invoke(`
You are an intent classifier.

Return ONLY one of these values.

CODE_GENERATION
CODE_REVIEW
CODE_EXPLANATION
DEBUGGING
OPTIMIZATION
CONVERSION
DOCUMENTATION

User Request:
${state.prompt}
    `);

    const intent = String(intentRes.content).trim();
    const llm = intent === "CODE_GENERATION"
        ? await getModels("deepseek")
        : await getModels("coding");

    if (intent === "CODE_GENERATION") {
        const prompt = `
You are CortexAI Coding Agent.

Generate the requested project.

Default stack:
- HTML
- CSS
- JavaScript

Use React / Next.js / Vue ONLY if explicitly requested.

Rules:

- Build a polished, premium, production-quality interface.
- Use a clear visual hierarchy with a strong headline, concise supporting copy, and one primary call to action.
- Use a cohesive color system, generous spacing, restrained borders, subtle gradients, soft shadows, and consistent border radii.
- Use CSS Variables for the design system and clamp() for fluid typography.
- Use Flexbox/Grid, modern CSS, smooth scrolling, and polished hover/focus/active states.
- Include tasteful entrance animations, staggered reveals, hover lift effects, shimmer/loading states, or scroll interactions.
- Add micro-interactions: animated icons, button press feedback, image zoom, card depth, and subtle navigation transitions.
- Respect prefers-reduced-motion and use semantic, keyboard-accessible HTML.
- Make every section responsive across mobile, tablet, and desktop.
- Use a fixed or sticky header only when it improves the experience.
- Avoid generic dashboards and avoid repetitive card grids unless the request requires them.
- Design for the complete page: header, hero, relevant content sections, social proof, CTA, and footer where appropriate.
- Use professional, relevant remote images when the project needs visuals.
- Prefer stable Unsplash URLs with explicit width and quality parameters, for example:
  https://images.unsplash.com/photo-ID?auto=format&fit=crop&w=1600&q=85
- Use working Unsplash photo URLs or another verified public CDN; never use broken, placeholder, or fake image URLs.
- Use descriptive alt text and add loading="eager" for the main hero image and loading="lazy" for below-the-fold images.
- Add onerror fallbacks to hide broken image icons or replace failed images with a styled gradient background.

Return ONLY valid JSON.

Schema:
{
  "files": [
    {
      "name": "index.html",
      "content": "..."
    },
    {
      "name": "style.css",
      "content": "..."
    },
    {
      "name": "script.js",
      "content": "..."
    }
  ]
}

Rules:

- Output must start with {
- Output must end with }
- No markdown
- No explanation
- No extra text
- No \`\`\`
- Never mention intent

User Request:
${state.prompt}
        `;

        const res = await llm.invoke(prompt);
        const data = JSON.parse(res.content);

        return {
            ...state,
            aiResponse: "Code Generated Successfully.",
            artifacts: [
                {
                    id: Date.now(),
                    type: "Project",
                    files: data.files || [],
                    title: state.prompt || "Generated Project"
                },
            ],
        };
    }

    const res = await llm.invoke(`
The user's request is:
${intent}

Return Markdown only.

Never generate project files.

Use headings like:

# Overview

## Explanation

## Problems

## Improvements

## Best Practices

## Optimized Code (if needed)

User Request:
${state.prompt}
    `);

    const data = res.content;
    return {
        ...state,
        aiResponse: data,
        artifacts: [],
    };
};
