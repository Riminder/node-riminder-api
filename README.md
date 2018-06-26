# node-riminder-api
⚡️ Riminder API Node Wrapper

# Install

```bash
npm install --save riminder
```

# Usage

```typescript
import Riminder from 'riminder';
const app = new Riminder({API_Key: "Your API Key"});
```

# API

## Riminder

Class constructor for your app instance, it should be called with an `options` object where you define your `API_Key`.

> **Note:** All methods return a Promise when called.

## Source

### riminder.source.list

Method that gets a list of sources.

```typescript
app.source.list();
```

### riminder.source.get

Method that gets a source by its id.

```typescript
app.source.get("source_id_here");
```

## Filter

### riminder.filter.list

Method that gets a list of filters.

```typescript
app.filter.list();
```

### riminder.filter.get

Method that gets a filter by its id or its reference. It accepts an object as follows

```typescript
const options: FilterIdOrReference = {
    filter_id: "filter_id",
    // Or
    filter_reference: "filter_reference"
}

app.filter.get(options);
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

app.profile.list(options);
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
  filter_id: string;
  // Or
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
        filter_id: "filter_id",
        stage: Stage.YES,
        stage_timestamp: Date.now(),
        rating: 2,
        rating_timestamp: Date.now()
    }]
}

app.profile.add(data, fs.createReadStream("myFile"));
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

app.profile.get(options);
```

### Document

#### riminder.profile.document.get

Method that gets the documents associated to a profile by its id or reference.

```typescript
const options: ProfileOptionIdOrReference = {
    source_id: "source_id",
    profile_id: "id",
    // Or
    profile_reference: "reference"
}

app.profile.document.get(options);
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

app.profile.parsing.get(options);
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

app.profile.scoring.list(options);
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

app.profile.stage.set(data);
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

app.profile.rating.set(data);
```

# Webhooks

## Riminder.webhooks

This object is used to handle webhooks. If you give your webhooks secret key when you create the Riminder objects, you can set them up.

```typescript
const app = new Riminder({
    API_Key: "Your API Key",
    Webhooks_Key: "Your Webhooks key"
});
```

## Events

The current list of events is:

```typescript
const events = [
    "profile.parse.success",
    "profile.parse.error",
    "profile.score.success",
    "profile.score.error",
    "filter.train.success",
    "filter.train.error",
    "filter.score.success",
    "filter.score.error"
];
```

### webhooks.on

You can use this funtion to setup a callback function called when a particular event happens.

```typescript
app.webhooks.on("profile.parse.success", (data: Webhooks.Response) => {
    console.log("profile.parse.success received !");
});
```

> **Note:** You can set a callback up only once, otherwise it will throw an error.

### webhooks.handleWebhook

This function is the callback you need to call when a request is received on the webhook endpoint.
It takes an object corresponding to the headers of the request and returns a function.

```typescript
router.post(".../webhooks", app.webhooks.handleWebhook(request.headers));
```

# Todos

- [ ] The browser compatibility needs to be checked