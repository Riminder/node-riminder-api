import Riminder = require("../src/index");
import { Webhooks } from "../src/webhooks";
import * as util from "tweetnacl-util";
import * as sha256 from "fast-sha256";

let app: Riminder;
const API_Key = "api_key";
const Webhooks_Key = "webhooks_key";

function generateSignature(key: string, event: string) {
    const data: Webhooks.ProfileParseResponse = {
        type: event,
        message: "The parsing succeeded",
        profile: {
            profile_id: "id",
            profile_reference: "reference"
        }
    };

    const JSONPayload = JSON.stringify(data);
    const base64Payload = util.encodeBase64(util.decodeUTF8(JSONPayload));

    const signature = sha256.hmac(util.decodeUTF8(key), util.decodeUTF8(base64Payload));
    const base64Signature = util.encodeBase64(signature);

    return `${base64Signature}.${base64Payload}`;
}

const callbackMock = jest.fn();

describe("Webhooks tests",  () => {
    describe("Webhook creation", () => {
        test("It should not create webhooks if no key is given", () => {
            app = new Riminder({ API_Key });
            expect(app.webhooks).toBeUndefined();
        });

        test("It should create webhooks if the key is given", () => {
            app = new Riminder({ API_Key, Webhooks_Key });
            expect(app.webhooks).toBeDefined();
        });

        test("It should throw an error if we try to create webhooks without a key", () => {
            expect(() => {
                const webhooks = new Webhooks(null);
            }).toThrowError("The webhook secret key must be specified");
        });
    });

    describe("Webhooks usage", () => {
        describe("Webhooks binding", () => {
            beforeEach(() => {
                app = new Riminder({ API_Key, Webhooks_Key });
            });

            test("It should throw an error if we try to bind an inexistant event", (done) => {
                expect(() => {
                    app.webhooks.on("not.an.event", (data: Webhooks.Response) => {});
                }).toThrowError("This event doesn't exist");
                done();
            });

            test("It should throw an error if we try to bind two functions to the same event", (done) => {
                expect(() => {
                    app.webhooks
                        .on("profile.parse.success", (data: Webhooks.Response) => {})
                        .on("profile.parse.success", (data: Webhooks.Response) => {});
                }).toThrowError("This callback already has been declared");
                done();
            });

            test("It should bind the event correctly", (done) => {
                expect(app.webhooks.on("profile.parse.success", (data: Webhooks.Response) => 42)).toBeInstanceOf(Webhooks);
                expect(app.webhooks.binding.has("profile.parse.success")).toBeTruthy();
                expect(app.webhooks.binding.get("profile.parse.success")({} as Webhooks.Response)).toBe(42);
                done();
            });
        });

        describe("Webhooks call", () => {
            beforeAll(() => {
                app = new Riminder({ API_Key, Webhooks_Key });
                app.webhooks.on("profile.parse.success", callbackMock);
            });

            test("It should throw an error if the header is not given", () => {
                expect(app.webhooks.handleWebhook({})).toThrowError("The signature is missing from the headers");
            });

            test("It should throw an error if the signature is invalid", () => {
                const signature = generateSignature("wrong_key", "profile.parse.success");
                const headers = {
                    "HTTP-RIMINDER-SIGNATURE": signature
                };
                expect(app.webhooks.handleWebhook(headers)).toThrowError("The signature is invalid");
            });

            test("It should throw an error if the event is unknown", () => {
                const signature = generateSignature(Webhooks_Key, "unknwown.event");
                const headers = {
                    "HTTP-RIMINDER-SIGNATURE": signature
                };
                expect(app.webhooks.handleWebhook(headers)).toThrowError("Unknown event: unknwown.event");
            });

            test("It should call the callbacj function", () => {
                const signature = generateSignature(Webhooks_Key, "profile.parse.error");
                const headers = {
                    "HTTP-RIMINDER-SIGNATURE": signature
                };
                app.webhooks.on("profile.parse.error", callbackMock);
                app.webhooks.handleWebhook(headers)();
                expect(callbackMock).toHaveBeenCalledTimes(1);
            });
        });
    });
});