# node-riminder-api
⚡️ Riminder API Node Wrapper

# Install

```bash
npm install --save riminder
```

# Usage

```typescript
import Riminder from 'riminder';
const client = new Riminder({API_Key: "Your API Key"});
```

# API

## Riminder

Class constructor for your client instance, it should be called with an `options` object where you define your `API_Key`.

> **Note:** All methods return a Promise when called.

## Source

### riminder.source.list

Method that gets a list of sources.

```typescript
client.source.list();
```

### riminder.source.get

Method that gets a source by its id.

```typescript
client.source.get("source_id_here");
```

## Filter

### riminder.filter.list

Method that gets a list of filters.

```typescript
client.filter.list();
```

### riminder.filter.get

Method that gets a filter by its id or its reference. It accepts an object as follows

```typescript
const options: FilterIdOrReference = {
    filter_id: "filter_id",
    // Or
    filter_reference: "filter_reference"
}

client.filter.get(options);
```

## Profile

### riminder.profile.list

Method that gets a list of profiles potentially filtered. It uses the following object to filter the results.

```typescript
interface ProfilesOptions {
  source_ids: Array<string>;
  date_start: Date | number;
  date_end: Date | number;
  page?: number;
  seniority?: Seniority;
  filter_id?: string;
  filter_reference?: string;
  stage?: Stage;
  rating?: number;
  limit?: number;
  sort_by: SortBy;
  order_by?: OrderBy;
}

enum Stage {
  NEW,
  YES,
  LATER,
  NO
}

enum SortBy {
  RECEPTION,
  RANKING
}

enum OrderBy {
  DESC,
  ASC
}

enum Seniority {
  ALL,
  SENIOR,
  JUNIOR
}
```

```typescript
const options: ProfilesOptions = {
    source_ids: ["source_id_1"],
    date_start: new Date(0),
    date_end: Date.now(),
    sort_by: SortBy.RANKING
}

client.profile.list(options);
```

### riminder.profile.add

Method that uploads a resume for a particular profile. It uses the following data:

```typescript
interface ProfileUpload {
  source_id: string;
  profile_reference: string;
  timestamp_reception: Date | number;
  training_metadata?: Array<TrainingMetadata>;
}

interface TrainingMetadata {
  filter_reference: string;
  stage: Stage;
  stage_timestamp: Date | number;
  rating: number;
  rating_timestamp: Date | number;
}
```

You also have to give a file using a `ReadStream`.

```typescript
const options: ProfileUpload = {
    source_id: "source_id",
    profile_reference: "profile_reference",
    timestamp_reception: Date.now(),
    training_metadata: [{
        filter_reference: "filter_reference",
        stage: Stage.YES,
        stage_timestamp: Date.now(),
        rating: 2,
        rating_timestamp: Date.now()
    }]
}

client.profile.add(data, fs.createReadStream("myFile"));
```

### riminder.profile.get

Method that gets a profile from a source using its id or reference.

```typescript
const options: ProfileOptionIdOrReference = {
    source_id: "source_id",
    profile_id: "id",
    // Or
    profile_reference: "reference"
}

client.profile.get(options);
```

### JSON

#### riminder.profile.json.check

Method that check if the structured profile is valid.

```typescript

export interface JsonUploadCheck {
  profile_json: ProfileJSON;
  training_metadata?: Array<TrainingMetadata>;
}

export interface ProfileJSON {
  name: string;
  email: string;
  phone: string;
  summary: string;
  timestamp_reception: Date | number;
  location_details: {
    text: string;
  };
  experiences: Array<Experience>;
  educations: Array<Education>;
  skills: Array<string>;
  languages: Array<string>;
  interests: Array<string>;
  urls: {
    from_resume: Array<string>;
    linkedin: string;
    twitter: string;
    facebook: string;
    github: string;
    picture: string;
  };
}

export interface Experience {
  start: string;
  end: string;
  title: string;
  company: string;
  location_details: {
    text: string;
  };
  location: string;
  description: string;
}

export interface Education {
  start: string;
  end: string;
  title: string;
  school: string;
  location_details: {
    text: string;
  };
  location: string;
  description: string;
}

export interface TrainingMetadata {
  stage: Stage;
  stage_timestamp: Date | number;
  rating: number;
  rating_timestamp: Date | number;
  filter_reference: string;
}
```

```typescript
const data: JsonUploadCheck = {
  profile_json: {
    name: "Marty McFly",
    email: "marty.mcfly@gmail.com",
    phone: "202-555-0141",
    summary: "High school student, loves to time travel",
    timestamp_reception: new Date("1985-10-21"),
    location_details: {
      text: "9303 Lyon Drive, Lyon Estates, Hill Valley CA 95420"
    },
    experiences: [{
      start: "01/01/2017",
      end: "01/01/2018",
      title: "CusCo employee",
      company: "CusCo",
      location_details: {
        text: "Hill Valley"
      },
      location: "Hill Valley",
      description: "Fujitsu company"
    }],
    educations: [{
      start: "01/01/1985",
      end: "01/01/1986",
      title: "Hill Valley High School",
      school: "Hill Valley High School",
      location_details: {
        text: "Hill Valley"
      },
      location: "Hill Valley",
      description: "a school"
    }],
    skills: [
      "skate",
      "time travel"
    ],
    languages: [
      "english"
    ],
    interests: [
      "music",
    ],
    urls: {
      from_resume: [
        "test.com"
      ],
      linkedin: "",
      twitter: "",
      facebook: "",
      github: "",
      picture: ""
    }
  }
};

client.profile.json.check(options);
```

#### riminder.profile.json.add

Method that upload a structured profile to the platform.

```typescript
export interface JsonUpload {
  source_id: string;
  profile_json: ProfileJSON;
  profile_reference?: string;
  training_metadata?: Array<TrainingMetadata>;
}

export interface ProfileJSON {
  name: string;
  email: string;
  phone: string;
  summary: string;
  timestamp_reception: Date | number;
  location_details: {
    text: string;
  };
  experiences: Array<Experience>;
  educations: Array<Education>;
  skills: Array<string>;
  languages: Array<string>;
  interests: Array<string>;
  urls: {
    from_resume: Array<string>;
    linkedin: string;
    twitter: string;
    facebook: string;
    github: string;
    picture: string;
  };
}

export interface Experience {
  start: string;
  end: string;
  title: string;
  company: string;
  location_details: {
    text: string;
  };
  location: string;
  description: string;
}

export interface Education {
  start: string;
  end: string;
  title: string;
  school: string;
  location_details: {
    text: string;
  };
  location: string;
  description: string;
}

export interface TrainingMetadata {
  stage: Stage;
  stage_timestamp: Date | number;
  rating: number;
  rating_timestamp: Date | number;
  filter_reference: string;
}
```

```typescript
const data: JsonUpload = {
  source_id: "source_id",
  profile_reference: "macfly",
  profile_json: {
    name: "Marty McFly",
    email: "marty.mcfly@gmail.com",
    phone: "202-555-0141",
    summary: "High school student, loves to time travel",
    timestamp_reception: new Date("1985-10-21"),
    location_details: {
      text: "9303 Lyon Drive, Lyon Estates, Hill Valley CA 95420"
    },
    experiences: [{
      start: "01/01/2017",
      end: "01/01/2018",
      title: "CusCo employee",
      company: "CusCo",
      location_details: {
        text: "Hill Valley"
      },
      location: "Hill Valley",
      description: "Fujitsu company"
    }],
    educations: [{
      start: "01/01/1985",
      end: "01/01/1986",
      title: "Hill Valley High School",
      school: "Hill Valley High School",
      location_details: {
        text: "Hill Valley"
      },
      location: "Hill Valley",
      description: "a school"
    }],
    skills: [
      "skate",
      "time travel"
    ],
    languages: [
      "english"
    ],
    interests: [
      "music",
    ],
    urls: {
      from_resume: [
        "test.com"
      ],
      linkedin: "",
      twitter: "",
      facebook: "",
      github: "",
      picture: ""
    }
  }
};

client.profile.json.add(options);
```

### Document

#### riminder.profile.document.list

Method that gets the documents associated to a profile by its id or reference.

```typescript
const options: ProfileOptionIdOrReference = {
    source_id: "source_id",
    profile_id: "id",
    // Or
    profile_reference: "reference"
}

client.profile.document.list(options);
```

### Parsing

#### riminder.profile.parsing.get

Method that gets the parsing result of a profile by its id or reference.

```typescript
const options: ProfileOptionIdOrReference = {
    source_id: "source_id",
    profile_id: "id",
    // Or
    profile_reference: "reference"
}

client.profile.parsing.get(options);
```

### Scoring

#### riminder.profile.scoring.list

Method that gets the scoring result of a profile by its id or reference.

```typescript
const options: ProfileOptionIdOrReference = {
    source_id: "source_id",
    profile_id: "id",
    // Or
    profile_reference: "reference"
}

client.profile.scoring.list(options);
```

### Revealing

#### riminder.profile.revealing.get

Method that reveals the interpretability result of a profile (by id or reference) with a filter (by id or reference).

```typescript
const options: ProfileOptionIdOrReference = {
    source_id: "source_id",
    profile_id: "id",
    // Or
    profile_reference: "reference",
    filter_id: "id",
    // Or
    filter_reference: "reference"
}

client.profile.revealing.get(options);
```

### Staging

#### riminder.profile.stage.set

Method that updates the stage of a profile on a particular filter.

```typescript
enum Stage {
  NEW,
  YES,
  LATER,
  NO
}

const data: StagePatch = {
    source_id: "source_id",
    stage: Stage.YES,
    profile_id: "profile_id",
    // Or
    profile_reference: "profile_reference",

    filter_id: "filter_id",
    // Or
    filter_reference: "filter_reference"
}

client.profile.stage.set(data);
```

### Rating

#### riminder.profile.rating.set

Method that updates the rating of a profile on a particular filter.

```typescript
const data: RatingPatch = {
    source_id: "source_id",
    rating: 2,
    profile_id: "profile_id",
    // Or
    profile_reference: "profile_reference",

    filter_id: "filter_id",
    // Or
    filter_reference: "filter_reference"
}

client.profile.rating.set(data);
```

# Webhooks

## Riminder.webhooks

This object is used to handle webhooks. If you give your webhooks secret key when you create the Riminder objects, you can set them up.

```typescript
const client = new Riminder({
    API_Key: "Your API Key",
    Webhooks_Key: "Your Webhooks key"
});
```

## Check

### webhooks.check

This function is used to check if the webhook integration is set up.

```typescript
client.webhooks.check().then((response: WebhooksResponse) => console.log(response))

export interface WebhooksResponse {
  team_name: string;
  webhook_id: string;
  webhook_url: string;
}
```

## Events

The current list of events is:

```typescript
const events = [
  "profile.parse.success",
  "profile.parse.error",
  "profile.score.success",
  "profile.score.error",
  "filter.train.start",
  "filter.train.success",
  "filter.train.error",
  "filter.score.start",
  "filter.score.success",
  "filter.score.error",
  "action.stage.success",
  "action.stage.error",
  "action.rating.success",
  "action.rating.error",
];
```

### webhooks.on

You can use this funtion to setup a callback function called when a particular event happens. The eventName is not mandatory, it's only here for simplicity.

```typescript
client.webhooks.on("profile.parse.success", (webhooksData: Webhooks.Response, eventName?: string) => {
    console.log("profile.parse.success received !");
});
```

> **Note:** You can set a callback up only once, otherwise it will throw an error.

### webhooks.handle

This function is the callback you need to call when a request is received on the webhook endpoint.
It takes an object corresponding to the headers of the request and returns a function.

```typescript
router.post(".../webhooks", client.webhooks.handle(request.headers));
```

# Todos
