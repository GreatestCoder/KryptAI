const { getModel } = require("../../models/LlmModel");


const cleanCode = (code = "") => {
    return code.replace(/```[\w-]*\n?/g, "").replace(/```/g, "").trim();
};

module.exports.codingAgent = async (state) => {
    const llm = getModel("coding");

    const response = await llm.invoke(`
You are KryptAI Coding Agent.

Your first task is to identify the user's intent.

=========================
INTENT DETECTION
=========================

Classify the request into ONE of these:

1. CODE_GENERATION
2. CODE_REVIEW
3. CODE_EXPLANATION
4. DEBUGGING
5. OPTIMIZATION
6. CONVERSION
7. DOCUMENTATION

=========================
CODE REVIEW
=========================

If the user provides code and asks to:

- review
- explain
- optimize
- debug
- find bugs
- improve
- refactor

Return Markdown only.

Include:

# Overview

## What this code does

## Problems

## Improvements

## Best Practices

## Optimized snippets (if required)

=========================
CODE GENERATION
=========================

Default stack:

- HTML
- CSS
- JavaScript

Do NOT use frameworks unless explicitly requested.

Examples:

"Build portfolio"
→ HTML CSS JS

"React portfolio"
→ React

"Next blog"
→ Next.js

=========================
WEBSITE RULE
=========================

Unless explicitly requested otherwise,
build a SINGLE PAGE website.

Sections:

- Home
- About
- Services
- Features
- Pricing
- Testimonials
- Contact
- Footer

Use smooth scrolling.

=========================
PROJECT FILES
=========================

For standard websites generate only:

FILE: index.html

FILE: style.css

FILE: script.js

Generate additional files only when necessary.

=========================
DESIGN
=========================

Modern UI

Responsive

CSS Variables

Flexbox/Grid

Smooth animations

Professional spacing

=========================
IMAGES
=========================

Use real Unsplash image URLs.

Never use placeholders.

=========================
OUTPUT
=========================

If the task is CODE_GENERATION

Return ONLY:

FILE: filename

<code>

FILE: filename

<code>

No Markdown.

No explanations.

If the task is NOT code generation

Return Markdown only.

User Request:

${state.prompt}
`);

    const content = response.content?.trim() || "";
    if (!content.includes("FILE:")) {
        return { ...state, aiResponse: content, images: [], artifacts: [] };
    }
    const files = [];
    const matches = [
        ...content.matchAll(
            /FILE:\s*([^\n]+)\n([\s\S]*?)(?=\nFILE:\s*[^\n]+\n|$)/g
        ),
    ];

    matches.forEach((match) => {
        files.push({
            name: match[1].trim(),
            content: cleanCode(match[2]),
        });
    });

    return {
        ...state,
        aiResponse:
            "✅ Project generated successfully. Open the artifact to view the files.",
        images: [],
        artifacts: [
            {
                id: Date.now().toString(),
                type: "project",
                title: state.prompt,
                files,
                createdAt: new Date().toISOString(),
            },
        ],
    };
};
