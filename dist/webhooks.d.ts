export declare namespace Webhooks {
    interface ResponseBase {
        type: string;
        message: string;
    }
    interface ProfileParseResponse extends ResponseBase {
        profile: Profile;
    }
    interface ProfileScoreResponse extends ResponseBase {
        profile: Profile;
        filter: Filter;
        score: number;
    }
    interface FilterTrainResponse extends ResponseBase {
        filter: Filter;
    }
    interface FilterScoreResponse extends ResponseBase {
        filter: Filter;
    }
    type Response = ProfileParseResponse | ProfileScoreResponse | FilterTrainResponse | FilterScoreResponse;
    interface Profile {
        profile_id: string;
        profile_reference: string;
    }
    interface Filter {
        filter_id: string;
        filter_reference: string;
    }
    type EventCallbackMap = Map<string, (data: Webhooks.Response, type: string) => any>;
}
export declare class Webhooks {
    private webhookSecretKey;
    binding: Webhooks.EventCallbackMap;
    constructor(secretKey: string);
    handle(headers: any): () => void;
    on(event: string, callback: (data: Webhooks.Response, type?: string) => any): this;
    private _callBinding;
}
