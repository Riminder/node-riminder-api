const riminder = require('../temp/index');

const app = new riminder.Riminder({API_Key: 'api_key'});

describe('Wrapper test', () => {
  describe('Source endpoints', () => {
    test('It should call the get sources endpoint', () =>
    app.objects.getSources({}).then((response) => {
      expect(response).toMatchSnapshot();
    }));
  
    test('It should call the get source endpoint', () => {
      app.objects.getSource("id").then((response) => {
        expect(response).toMatchSnapshot();
      });
    });
  });

  describe('Profile endpoints', () => {
    test('It should call the get profiles endpoint', () => {
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
        sort_by: 'DESC',
        order_by: "RECEPTION",
      };
      app.objects.getProfiles(options)
        .then((response) => {
        expect(response).toMatchSnapshot();
        expect(response.url.query.split("&").map(entry => entry.split("=")[0])).toEqual(Object.keys(options));
      })
    });
  
    test('It should call the get profile endpoint with the profile id', () => {
      const options = {
        source_id: "source_id",
        profile_id: "profile_id",
      };
      app.objects.getProfile(options).then((response) => {
        expect(response).toMatchSnapshot();
      });
    });
  
    test('It should call the get profile endpoint with the profile reference', () => {
      const options = {
        source_id: "source_id",
        profile_reference: "profile_reference",
      };
      app.objects.getProfile(options).then((response) => {
        expect(response).toMatchSnapshot();
      });
    });
  
    test('It should call the get profile document endpoint with the profile id', () => {
      const options = {
        source_id: "source_id",
        profile_id: "profile_id",
      };
      app.objects.getProfileDocuments(options).then((response) => {
        expect(response).toMatchSnapshot();
      });
    });
  
    test('It should call the get profile document endpoint with the profile reference', () => {
      const options = {
        source_id: "source_id",
        profile_reference: "profile_reference",
      };
      app.objects.getProfileDocuments(options).then((response) => {
        expect(response).toMatchSnapshot();
      });
    });
  
    test('It should call the get profile parsing endpoint with the profile id', () => {
      const options = {
        source_id: "source_id",
        profile_id: "profile_id",
      };
      app.objects.getProfileParsing(options).then((response) => {
        expect(response).toMatchSnapshot();
      });
    });
  
    test('It should call the get profile parsing endpoint with the profile reference', () => {
      const options = {
        source_id: "source_id",
        profile_reference: "profile_reference",
      };
      app.objects.getProfileParsing(options).then((response) => {
        expect(response).toMatchSnapshot();
      });
    });
  });
});