import deserialize from "@/utils/deserialize";
import serialize from "@/utils/serialize";

export interface Response<TData, TMessage = string> {
  data: TData;
  message: TMessage;
}

type Keys<T> = T extends Array<infer U> ? Array<keyof U> : Array<keyof T>;
type ArrayItem<T> = T extends Array<infer U> ? U : T;

export abstract class BaseApi {
  protected resource: string = "http://localhost:3000/api";

  constructor(private readonly baseUrl: string) {}

  private get headers(): HeadersInit {
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      // Authorization: `token $`
    };
  }

  private get defaultOptions(): RequestInit {
    return {
      headers: this.headers,
      credentials: "include",
    };
  }

  private async get<T = unknown[]>(url: string): Promise<Response<T>> {
    const fetchUrl = new URL(`${this.baseUrl}${url}`);

    const response = await fetch(fetchUrl, {
      ...this.defaultOptions,
      method: "GET",
    });
    const resBody = await response.json();

    return deserialize(resBody) as Response<T>;
  }

  private async post<
    TInput extends Record<string, any>,
    TOutput = TInput,
    TMessage = TOutput
  >(
    url: string,
    bodyType: "form" | "json" = "json",
    body: TInput
  ): Promise<Response<TOutput, TMessage>> {
    const options: RequestInit = {
      ...this.defaultOptions,
      method: 'POST'
    }

    if (bodyType === 'form') {
      options.headers = {
        ...this.headers,
        'Content-Type': 'application/x-www-form-urlencoded'
      };

      const formData = new URLSearchParams();
      Object.entries(body).forEach(([key, value]) => {
        if (!value) return;

        if (Array.isArray(value)) {
          value.forEach((v, i) => {
            formData.append(`${key}[${i}]`, JSON.stringify(v));
          });

          return;
        }

        formData.append(key, String(value));
      });

      options.body = formData;
    } else {
      options.body = JSON.stringify(serialize(body))
    }

    const response = await fetch(`${this.baseUrl}${url}`, options)
    const resBody = await response.json()

    return resBody as Response<TOutput, TMessage>;
  }
}

export default BaseApi