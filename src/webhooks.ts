import Events from "./events";
import * as util from "tweetnacl-util";
import * as sha256 from "fast-sha256";

export namespace Webhooks {
  export interface ResponseBase {
    type: string;
    message: string;
  }
  export interface ProfileParseResponse extends ResponseBase {
    profile: Profile;
  }

  export interface ProfileScoreResponse extends ResponseBase {
    profile: Profile;
    filter: Filter;
    score: number;
  }

  export interface FilterTrainResponse extends ResponseBase {
    filter: Filter;
  }

  export interface FilterScoreResponse extends ResponseBase {
    filter: Filter;
  }

  export type Response = ProfileParseResponse | ProfileScoreResponse | FilterTrainResponse | FilterScoreResponse;

  export interface Profile {
    profile_id: string;
    profile_reference: string;
  }

  export interface Filter {
    filter_id: string;
    filter_reference: string;
  }

  export type EventCallbackMap = Map<string, (data: Webhooks.Response) => any>;
}

export class Webhooks {
  private webhookSecretKey: string;
  binding: Webhooks.EventCallbackMap;

  constructor(secretKey: string) {
    if (!secretKey) {
      throw new Error("The webhook secret key must be specified");
    }

    this.webhookSecretKey = secretKey;
    this.binding = new Map<string, (data: Webhooks.Response) => any>();
  }

  handleWebhook(headers: any): () => void {
    return () => {
      if (!headers["HTTP-RIMINDER-SIGNATURE"]) {
        throw new Error("The signature is missing from the headers");
      }

      const [encodedSignature, encodedPayload] = headers["HTTP-RIMINDER-SIGNATURE"].split(".");
      const expectedSignature = util.encodeBase64(sha256.hmac(util.decodeUTF8(this.webhookSecretKey), util.decodeUTF8(encodedPayload)));

      if (encodedSignature !== expectedSignature) {
        throw new Error("The signature is invalid");
      }

      const payload: Webhooks.Response = JSON.parse(util.encodeUTF8(util.decodeBase64(encodedPayload)));

      if (Events.indexOf(payload.type) < 0) {
        throw new Error(`Unknown event: ${payload.type}`);
      }
      this._callBinding(payload);
    };
  }

  on(event: string, callback: (data: Webhooks.Response) => any) {
    if (Events.indexOf(event) < 0) {
      throw new Error("This event doesn't exist");
    }

    if (this.binding.has(event)) {
      throw new Error("This callback already has been declared");
    }

    this.binding.set(event, callback);

    return this;
  }

  private _callBinding(payload: Webhooks.Response): void {
    if (this.binding.has(payload.type)) {
      this.binding.get(payload.type)(payload);
    }
  }
}