# Framer MCP Setup Guide for Home Environment

If you are a new AI agent assisting with this project, follow these steps to re-establish the connection to the Framer design source of truth.

## 1. Prerequisites
- Ensure the file `framer_proxy.cjs` exists in the root directory.
- This project uses a custom bridge to bypass local network/SSE restrictions.

## 2. Start the Proxy
Run the following command in your terminal to start the MCP bridge:
```bash
node framer_proxy.cjs
```
The proxy will start on port `3001` and connect to the remote Framer MCP server.

## 3. Verify Connection
Once the proxy is running, use your Framer MCP tools (like `getProjectXml`) to confirm you can see the pages and styles.
- **Source Project ID**: `augiA20Il` (Editorial Portfolio)
- **Primary Page**: `/` (Home)

## 4. Key Reference Files
Refer to these files for the exact design specifications:
- `design-tokens.json`: Exact colors, spacing, and typography tokens.
- `component-spec.md`: Dimensional and functional specs for UI components.
- `page-structure.md`: The hierarchy and layout rules for the home page.

## 5. Development Environment
- Project URI: `c:\Users\Admin\Desktop\Du an web\Porfolio\radiant-growth-portfolio`
- Dev Server: `npm run dev` (usually port `8080`)
- **Strict Rule**: Port `8080` MUST be used for development.
