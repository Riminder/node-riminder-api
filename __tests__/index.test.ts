import * as fs from "fs";
import { generateURLParams } from "../src/utils";
import { httpRequest } from "../src/http";
import Riminder = require("../src/index");
import { RiminderOptions, ProfilesOptions, ProfileUpload, StagePatch, Stage, RatingPatch, Seniority, SortBy, OrderBy } from "../src/types";

let app: Riminder;

function getQueryParamAsArray(query: string): Array<string> {
  return query
    .split("&")
    .map((entry: string) => entry.split("=")[0]);
}

describe("Other tests", () => {
  describe("\"Riminder\" object relative tests", () => {
    test("it should throw an error when no key is given", () => {
      expect(() => {
        app = new Riminder({} as RiminderOptions);
      }).toThrowErrorMatchingSnapshot();
    });
  });

  describe("utils module relative tests", () => {
    test("This should return null if there is no input data", () => {
      expect(generateURLParams(null)).toBeNull();
    });
  });

  describe("http module relative tests", () => {
    test("It should throw an error if the error code is not 200 or 201", () => {
      const headers = {
        "X-API-Key": "api_key",
      };

      expect.assertions(1);
      return httpRequest("localhost", { error: true, headers }).catch((e) => {
        expect(e).toMatchSnapshot();
      });
    });

    test("it should throw an error if something went wrong with the request", () => {
      const headers = {
        "X-API-Key": "api_key",
      };
      expect.assertions(1);
      return httpRequest("localhost", { reject: true, headers }).catch((e) => {
        expect(e).toMatchSnapshot();
      });
    });
  });
});

describe("Wrapper test", () => {
    app = new Riminder({API_Key: "api_key"});
    describe("Source endpoints", () => {
        test("It should call the get source list endpoint", () =>
        app.source.list().then((response: any) => {
          expect(response).toMatchSnapshot();
        }));

        test("It should call the get source endpoint", () => {
          app.source.get("id").then((response: any) => {
            expect(response).toMatchSnapshot();
          });
        });
      });

    describe("Filter endpoints", () => {
      test("It should call the get filter list endpoint", () => {
        app.filter.list()
          .then((response: any) => {
            expect(response).toMatchSnapshot();
          });
      });

      test("It sould call the get filter endpoint with the filter id", () => {
        const options = {
          filter_id: "filter_id"
        };
        app.filter.get(options)
          .then((response: any) => {
            expect(response).toMatchSnapshot();
          });
      });

      test("It sould call the get filter endpoint with the filter reference", () => {
        const options = {
          filter_reference: "filter_reference"
        };
        app.filter.get(options)
          .then((response: any) => {
            expect(response).toMatchSnapshot();
          });
      });
    });

    describe("Profile endpoints", () => {
      test("It should call the get profile endpoint using Date object", () => {
        const options: ProfilesOptions = {
          source_ids: ["source1", "source2"],
          date_start: new Date(0),
          date_end: new Date(1234),
          page: 1,
          seniority: Seniority.ALL,
          filter_id: "filter_id",
          filter_reference: "filter_reference",
          stage: Stage.YES,
          rating: 1,
          limit: 30,
          sort_by: SortBy.RECEPTION,
          order_by: OrderBy.DESC,
        };
        app.profile.list(options)
          .then((response: any) => {
          expect(response).toMatchSnapshot();
          expect(getQueryParamAsArray(response.url.query)).toEqual(Object.keys(options));
        });
      });

      test("It should call the get profile endpoint using Date number", () => {
        const options: ProfilesOptions = {
          source_ids: ["source1", "source2"],
          date_start: 0,
          date_end: (new Date("2018-01-01")).getTime(),
          page: 1,
          seniority: Seniority.ALL,
          filter_id: "filter_id",
          filter_reference: "filter_reference",
          stage: Stage.YES,
          rating: 1,
          limit: 30,
          sort_by: SortBy.RECEPTION,
          order_by: OrderBy.DESC,
        };
        app.profile.list(options)
          .then((response: any) => {
          expect(response).toMatchSnapshot();
          expect(getQueryParamAsArray(response.url.query)).toEqual(Object.keys(options));
        });
      });

      test("It should call the get profile endpoint with the profile id", () => {
        const options = {
          source_id: "source_id",
          profile_id: "profile_id",
        };
        app.profile.get(options).then((response: any) => {
          expect(response).toMatchSnapshot();
        });
      });

      test("It should call the get profile endpoint with the profile reference", () => {
        const options = {
          source_id: "source_id",
          profile_reference: "profile_reference",
        };
        app.profile.get(options).then((response: any) => {
          expect(response).toMatchSnapshot();
        });
      });

      test("It should call the get profile document endpoint with the profile id", () => {
        const options = {
          source_id: "source_id",
          profile_id: "profile_id",
        };
        app.profile.document.list(options).then((response: any) => {
          expect(response).toMatchSnapshot();
        });
      });

      test("It should call the get profile document endpoint with the profile reference", () => {
        const options = {
          source_id: "source_id",
          profile_reference: "profile_reference",
        };
        app.profile.document.list(options).then((response: any) => {
          expect(response).toMatchSnapshot();
        });
      });

      test("It should call the get profile parsing endpoint with the profile id", () => {
        const options = {
          source_id: "source_id",
          profile_id: "profile_id",
        };
        app.profile.parsing.get(options).then((response: any) => {
          expect(response).toMatchSnapshot();
        });
      });

      test("It should call the get profile parsing endpoint with the profile reference", () => {
        const options = {
          source_id: "source_id",
          profile_reference: "profile_reference",
        };
        app.profile.parsing.get(options).then((response: any) => {
          expect(response).toMatchSnapshot();
        });
      });

      test("It should call the get profile scoring endpoint with the profile id", () => {
        const options = {
          source_id: "source_id",
          profile_id: "profile_id",
        };
        app.profile.scoring.list(options).then((response: any) => {
          expect(response).toMatchSnapshot();
        });
      });

      test("It should call the get profile scoring endpoint with the profile reference", () => {
        const options = {
          source_id: "source_id",
          profile_reference: "profile_reference",
        };
        app.profile.scoring.list(options).then((response: any) => {
          expect(response).toMatchSnapshot();
        });
      });

      test("It should call the post resume endpoint", () => {
        const data: ProfileUpload = {
          source_id: "source_id",
          profile_reference: "ref",
          timestamp_reception: new Date(Date.now()),
          training_metadata: [{
            filter_id: "filter_id1",
            stage: Stage.YES,
            stage_timestamp: new Date(Date.now()),
            rating: 2,
            rating_timestamp: new Date(Date.now())
          },
          {
            filter_reference: "filter_reference",
            stage: Stage.YES,
            stage_timestamp: new Date(Date.now()),
            rating: 2,
            rating_timestamp: new Date(Date.now())
          }],
        };

        const file = fs.createReadStream("./test.txt");
        app.profile.add(data, file)
          .then((response: any) => {
            const responseWithoutBody = {
              url: response.url,
              options: {
                headers: response.options.headers,
                method: response.options.method
              }
            };
            expect(responseWithoutBody).toMatchSnapshot();
        });
      });

      test("It should call the patch stage endpoint with the the profile id and filter id", () => {
        const data: StagePatch = {
          source_id: "source_id",
          profile_id: "profile_id",
          filter_id: "filter_id",
          stage: Stage.YES,
        };

        app.profile.stage.set(data)
          .then((response: any) => {
            const responseWithoutBody = {
              url: response.url,
              options: {
                headers: response.options.headers,
                method: response.options.method
              }
            };
            expect(responseWithoutBody).toMatchSnapshot();
          });
      });

      test("It should call the patch stage endpoint with the the profile id and filter reference", () => {
        const data: StagePatch = {
          source_id: "source_id",
          profile_id: "profile_id",
          filter_id: "filter_id",
          stage: Stage.YES,
        };
        app.profile.stage.set(data)
          .then((response: any) => {
            const responseWithoutBody = {
              url: response.url,
              options: {
                headers: response.options.headers,
                method: response.options.method
              }
            };
            expect(responseWithoutBody).toMatchSnapshot();
          });
      });

      test("It should call the patch stage endpoint with the the profile reference and filter id", () => {
        const data: StagePatch = {
          source_id: "source_id",
          profile_id: "profile_id",
          filter_id: "filter_id",
          stage: Stage.YES,
        };
        app.profile.stage.set(data)
          .then((response: any) => {
            const responseWithoutBody = {
              url: response.url,
              options: {
                headers: response.options.headers,
                method: response.options.method
              }
            };
            expect(responseWithoutBody).toMatchSnapshot();
          });
      });

      test("It should call the patch stage endpoint with the the profile reference and filter reference", () => {
        const data: StagePatch = {
          source_id: "source_id",
          profile_id: "profile_id",
          filter_id: "filter_id",
          stage: Stage.YES,
        };
        app.profile.stage.set(data)
          .then((response: any) => {
            const responseWithoutBody = {
              url: response.url,
              options: {
                headers: response.options.headers,
                method: response.options.method
              }
            };
            expect(responseWithoutBody).toMatchSnapshot();
          });
      });

      test("It should call the patch rating endpoint with the the profile id and filter id", () => {
        const data: RatingPatch = {
          source_id: "source_id",
          profile_id: "profile_id",
          filter_id: "filter_id",
          rating: 2
        };
        app.profile.rating.set(data)
          .then((response: any) => {
            const responseWithoutBody = {
              url: response.url,
              options: {
                headers: response.options.headers,
                method: response.options.method
              }
            };
            expect(responseWithoutBody).toMatchSnapshot();
          });
      });

      test("It should call the patch rating endpoint with the the profile id and filter reference", () => {
        const data: RatingPatch = {
          source_id: "source_id",
          profile_id: "profile_id",
          filter_id: "filter_id",
          rating: 2
        };
        app.profile.rating.set(data)
          .then((response: any) => {
            const responseWithoutBody = {
              url: response.url,
              options: {
                headers: response.options.headers,
                method: response.options.method
              }
            };
            expect(responseWithoutBody).toMatchSnapshot();
          });
      });

      test("It should call the patch rating endpoint with the the profile reference and filter id", () => {
        const data: RatingPatch = {
          source_id: "source_id",
          profile_id: "profile_id",
          filter_id: "filter_id",
          rating: 2
        };
        app.profile.rating.set(data)
          .then((response: any) => {
            const responseWithoutBody = {
              url: response.url,
              options: {
                headers: response.options.headers,
                method: response.options.method
              }
            };
            expect(responseWithoutBody).toMatchSnapshot();
          });
      });

      test("It should call the patch rating endpoint with the the profile reference and filter reference", () => {
        const data: RatingPatch = {
          source_id: "source_id",
          profile_id: "profile_id",
          filter_id: "filter_id",
          rating: 2
        };
        app.profile.rating.set(data)
          .then((response: any) => {
            const responseWithoutBody = {
              url: response.url,
              options: {
                headers: response.options.headers,
                method: response.options.method
              }
            };
            expect(responseWithoutBody).toMatchSnapshot();
          });
      });
    });
});