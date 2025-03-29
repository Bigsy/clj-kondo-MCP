# clj-kondo MCP Server

A Model Context Protocol (MCP) server that provides clj-kondo linting capabilities for Clojure/ClojureScript/EDN files.

## Features

- Lint Clojure files via MCP tool calls
- Real-time linting feedback
- Supports all clj-kondo analysis capabilities
- Lightweight Node.js implementation

## Installation

1. Install dependencies:
```bash
npm install
```

2. Build the server:
```bash
npm run build
```

## Usage

### Running the Server
```bash
node build/index.js
```

### MCP Tool Calls
The server provides one tool:

**lint_clojure** - Lint a Clojure/ClojureScript/EDN file

Parameters:
```json
{
  "file": "path/to/file.clj"
}
```

Example response:
```
file.clj:2:14: warning: namespace clojure.string is required but never used
linting took 62ms, errors: 0, warnings: 1
```

## Configuration

Add to Cline's MCP settings:
```json
{
  "clj-kondo": {
    "command": "node",
    "args": ["build/index.js"],
    "disabled": false,
    "autoApprove": []
  }
}
```

## Development

- Written in TypeScript
- Uses @modelcontextprotocol/sdk
- Requires Node.js 16+

### Build
```bash
npm run build
```

### Watch Mode
```bash
npm run dev
```

## License

MIT
