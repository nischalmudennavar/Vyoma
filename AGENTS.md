<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

Strict Token Adherence:** All styling must strictly utilize the design tokens and utility classes defined in `src/app/globals.css` or provided by Shadcn UI.
- **Prohibition of Arbitrary Values:** Never use hardcoded or "just-in-time" values (e.g., `text-[12px]`, `bg-[#f0f0f0]`, `p-[17px]`). All properties must map to the established theme scale.
- **Theme Scalability:** To ensure the system remains fully adaptable to theme, color, and font changes, use only semantic variables (e.g., `text-foreground`, `bg-background`, `font-mono`). Hardcoded values are strictly forbidden as they compromise architectural maintainability and theme-switching.

BELOW is non-negotiable:
Write clean, maintainable, and scalable components with documentation, jsdocs and clear typescript types for props
