# clj-kondo MCP Server

A Model Context Protocol (MCP) server that provides clj-kondo linting capabilities for Clojure/ClojureScript/EDN files. Handy for Claude code and desktop where there are no built in linting capabilities.

## Features

- Lint Clojure files via MCP tool calls
- Supports all clj-kondo analysis capabilities
- Optional explicit configuration directory support

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

**lint_clojure** - Lint Clojure/ClojureScript/EDN content

Parameters:
```json
{
  "file": "/absolute/path/to/file.clj", // Must be absolute path - can be a file, directory, or classpath
  "configDir": "/absolute/path/to/config/dir" // Optional, must be absolute path if provided
}
```

The `file` parameter accepts:
- A single file path (e.g. "/path/to/src/my_file.clj") 
- A directory path (e.g. "/path/to/src") - will lint all .clj, .cljs and .cljc files recursively
- A classpath string - will lint all Clojure files in the classpath
  - For Leiningen projects: Use output of `lein classpath`
  - For deps.edn projects: Use output of `clojure -Spath`

**Note**: Both file and configDir parameters must be absolute paths since the MCP server runs as a separate process. Relative paths will not work correctly.

By default, clj-kondo will automatically look for configuration in the `.clj-kondo` directory in the current and parent directories. You can override this by specifying the `configDir` parameter to point to a specific configuration directory.

For more information about clj-kondo configuration, see the [official documentation](https://github.com/clj-kondo/clj-kondo/blob/master/doc/config.md).


## Configuration

Add to MCP settings:
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

### Build
```bash
npm run build
```

### Watch Mode
```bash
npm run dev
```
