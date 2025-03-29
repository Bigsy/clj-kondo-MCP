#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
  type Request
} from '@modelcontextprotocol/sdk/types.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const isValidLintArgs = (
  args: any
): args is { file: string } =>
  typeof args === 'object' &&
  args !== null &&
  typeof args.file === 'string';

class ClojureLintServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'clj-kondo-mcp',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    this.server.onerror = (error: Error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'lint_clojure',
          description: 'Lint a Clojure/ClojureScript/EDN file using clj-kondo',
          inputSchema: {
            type: 'object',
            properties: {
              file: {
                type: 'string',
                description: 'Path to the file to lint',
              },
            },
            required: ['file'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request: Request) => {
      if (!request.params || request.params.name !== 'lint_clojure') {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${request.params?.name || 'undefined'}`
        );
      }

      if (!request.params.arguments || !isValidLintArgs(request.params.arguments)) {
        throw new McpError(
          ErrorCode.InvalidParams,
          'Invalid lint arguments'
        );
      }

      try {
        const { stdout, stderr } = await execAsync(
          `clj-kondo --lint "${request.params.arguments.file}"`
        );

        return {
          content: [
            {
              type: 'text',
              text: stdout || stderr,
            },
          ],
        };
      } catch (error: any) {
        // clj-kondo returns non-zero exit code when it finds linting issues
        if (error.stdout || error.stderr) {
          return {
            content: [
              {
                type: 'text',
                text: error.stdout || error.stderr,
              },
            ],
          };
        }
        throw error;
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Clj-kondo MCP server running on stdio');
  }
}

const server = new ClojureLintServer();
server.run().catch(console.error);
