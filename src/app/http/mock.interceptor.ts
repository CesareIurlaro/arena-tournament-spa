import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CustomHttpRequestBuilderService} from './custom-http-request-builder.service';

@Injectable()
export class MockInterceptor implements HttpInterceptor {

  constructor(private urlBuilderService: CustomHttpRequestBuilderService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log(request);
    const cose = this.urlBuilderService.buildUrl(
      `/mock/${this.handleMockResponse(request)}.json`,
      (_) => {
      },
      (headers) => {
        headers.append('Content-Type', 'application/json');
      }
    );
    return next.handle(request.clone({
      headers: cose.headers,
      url: cose.path,
      params: cose.params
    }));
  }


  handleMockResponse(request: HttpRequest<unknown>): string {
    const words = request.url.split('/').slice(3);
    console.log(`Split words: ${JSON.stringify(words)}`);
    switch (request.url) {
      case '/isAccountVerified':
        return 'verification_status_response.json';
      case '/isAccountSubscribed':
        return 'subscription_status_response.json';
      default:
        return singleOrMultipleResponse();
    }

    function singleOrMultipleResponse() {
      switch (words.length) {
        case 1:
          return lengthOneCase();
        case 2:
          return `${words[0]}_response`;
        default:
          return DefaultCase();
      }

      function lengthOneCase(): string {
        if (request.method === 'GET') {
          return `multiple_${words[0].split('?')[0]}s_response`;
        } else {
          return `${words[0]}_response`;
        }
      }

      function DefaultCase(): string {
        if (words[1] === 'search') {
          return `multiple_${words[0]}s_response`;
        } else {
          if (['game', 'tournament', 'registration', 'match', 'user'].includes(words[words.length - 1])) {
            return `${words[words.length - 1]}_response`;
          } else if (words[words.length - 1] === 'admin') {
            return 'user_response';
          } else {
            throw new Error('Request cannot be handled by the mock engine');
          }
        }
      }
    }

  }
}

