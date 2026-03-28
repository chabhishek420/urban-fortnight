/**
 * Curl Action
 * 
 * Fetches content from a URL using HTTP request and returns it.
 * 
 * @see keitaro_source/application/Traffic/Actions/Predefined/Curl.php
 */

import { AbstractAction, ActionType, ActionField } from './abstract-action';

export class CurlAction extends AbstractAction {
  protected _weight = 3;

  constructor() {
    super('curl');
  }

  getType(): ActionType {
    return ActionType.REDIRECT;
  }

  getField(): ActionField {
    return ActionField.URL;
  }

  async execute(): Promise<void> {
    const url = this.getActionPayload().trim();
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': this.getRawClick().getUserAgent() || 'Mozilla/5.0',
        },
        redirect: 'follow',
      });

      const contentType = response.headers.get('content-type') || 'text/html';
      this.setContentType(contentType);

      if (!response.ok) {
        this.setContent('Oops! Something went wrong on the requesting page');
        return;
      }

      const buffer = await response.arrayBuffer();
      
      // Handle binary content (images, PDFs)
      if (contentType.includes('image') || contentType.includes('application/pdf')) {
        const base64 = Buffer.from(buffer).toString('base64');
        this.setContent(base64);
      } else {
        // Text content - process macros
        const text = new TextDecoder().decode(buffer);
        const processed = this.processMacros(text);
        this.setContent(this.utf8ize(processed));
      }

      this.setDestinationInfo(`CURL: ${url}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.setContent(`Oops! Something went wrong: ${errorMessage}`);
    }
  }

  /**
   * Ensure UTF-8 encoding
   */
  private utf8ize(content: string): string {
    try {
      // Try to normalize to UTF-8
      return Buffer.from(content, 'utf8').toString('utf8');
    } catch {
      return content;
    }
  }
}
