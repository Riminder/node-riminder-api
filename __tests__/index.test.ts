import * as fs from "fs";
import { generateURLParams } from "../src/utils";
import { Riminder, RiminderOptions } from "../src/index";

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
});

describe("Wrapper test", () => {
    describe("Source endpoints", () => {
        test("It should call the get sources endpoint", () =>
        app.objects.getSources().then((response: any) => {
          expect(response).toMatchSnapshot();
        }));

        test("It should call the get source endpoint", () => {
          app.objects.getSource("id").then((response: any) => {
            expect(response).toMatchSnapshot();
          });
        });
      });

    describe("Filter endpoints", () => {
      test("It should call the get filters endpoint", () => {
        app.objects.getFilters()
          .then((response: any) => {
            expect(response).toMatchSnapshot();
          });
      });

      test("It sould call the get filter endpoint with the filter id", () => {
        const options = {
          filter_id: "filter_id"
        };
        app.objects.getFilter(options)
          .then((response: any) => {
            expect(response).toMatchSnapshot();
          });
      });
      test("It sould call the get filter endpoint with the filter reference", () => {
        const options = {
          filter_reference: "filter_reference"
        };
        app.objects.getFilter(options)
          .then((response: any) => {
            expect(response).toMatchSnapshot();
          });
      });
    });

    describe("Profile endpoints", () => {
      test("It should call the get profiles endpoint", () => {
        const options = {
          source_ids: ["source1", "source2"],
          date_start: "1234",
          date_end: "1456",
          page: 1,
          seniority: "ALL",
          filter_id: "filter_id",
          filter_reference: "filter_reference",
          stage: "YES",
          rating: "1",
          limit: 30,
          sort_by: "DESC",
          order_by: "RECEPTION",
        };
        app.objects.getProfiles(options)
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
        app.objects.getProfile(options).then((response: any) => {
          expect(response).toMatchSnapshot();
        });
      });

      test("It should call the get profile endpoint with the profile reference", () => {
        const options = {
          source_id: "source_id",
          profile_reference: "profile_reference",
        };
        app.objects.getProfile(options).then((response: any) => {
          expect(response).toMatchSnapshot();
        });
      });

      test("It should call the get profile document endpoint with the profile id", () => {
        const options = {
          source_id: "source_id",
          profile_id: "profile_id",
        };
        app.objects.getProfileDocuments(options).then((response: any) => {
          expect(response).toMatchSnapshot();
        });
      });

      test("It should call the get profile document endpoint with the profile reference", () => {
        const options = {
          source_id: "source_id",
          profile_reference: "profile_reference",
        };
        app.objects.getProfileDocuments(options).then((response: any) => {
          expect(response).toMatchSnapshot();
        });
      });

      test("It should call the get profile parsing endpoint with the profile id", () => {
        const options = {
          source_id: "source_id",
          profile_id: "profile_id",
        };
        app.objects.getProfileParsing(options).then((response: any) => {
          expect(response).toMatchSnapshot();
        });
      });

      test("It should call the get profile parsing endpoint with the profile reference", () => {
        const options = {
          source_id: "source_id",
          profile_reference: "profile_reference",
        };
        app.objects.getProfileParsing(options).then((response: any) => {
          expect(response).toMatchSnapshot();
        });
      });

      test("It should call the post resume endpoint", () => {
        const data = {
          source_id: "source_id",
          profile_reference: "ref",
          training_metadata: [{
            filter_id: "filter_id1",
            stage: "stage",
            stage_timestamp: "1234",
            rating: 2,
            rating_timestamp: "1234"
          },
          {
            filter_reference: "filter_reference",
            stage: "stage",
            stage_timestamp: "1234",
            rating: 2,
            rating_timestamp: "1234"
          }],
        };

        const file = fs.createReadStream("./test.txt");
        app.objects.createResumeForProfile(data, file)
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
        const data = {
          source_id: "source_id",
          profile_id: "profile_id",
          filter_id: "filter_id",
          stage: "YES",
        };
        app.objects.updateProfileStage(data)
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
        const data = {
          source_id: "source_id",
          profile_id: "profile_id",
          filter_reference: "filter_reference",
          stage: "YES",
        };
        app.objects.updateProfileStage(data)
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
        const data = {
          source_id: "source_id",
          profile_reference: "profile_reference",
          filter_id: "filter_id",
          stage: "YES",
        };
        app.objects.updateProfileStage(data)
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
        const data = {
          source_id: "source_id",
          profile_id: "profile_reference",
          filter_id: "filter_reference",
          stage: "YES",
        };
        app.objects.updateProfileStage(data)
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
        const data = {
          source_id: "source_id",
          profile_id: "profile_id",
          filter_id: "filter_id",
          rating: "2"
        };
        app.objects.updateProfileRating(data)
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
        const data = {
          source_id: "source_id",
          profile_id: "profile_id",
          filter_reference: "filter_reference",
          rating: "2"
        };
        app.objects.updateProfileRating(data)
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
        const data = {
          source_id: "source_id",
          profile_reference: "profile_reference",
          filter_id: "filter_id",
          rating: "2"
        };
        app.objects.updateProfileRating(data)
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
        const data = {
          source_id: "source_id",
          profile_id: "profile_reference",
          filter_id: "filter_reference",
          rating: "2"
        };
        app.objects.updateProfileRating(data)
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