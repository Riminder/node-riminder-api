# node-riminder-api
⚡️ Riminder API Node Wrapper

## Install

```bash
npm install --save riminder-js-sdk
```

## Usage

```typescript
import { Riminder } from 'riminder-js-sdk';
const app = new Riminder({API_Key: "Your API Key"});
```

## API

### Riminder

Class constructor for your app instance, it should be called with an `options` object where you define your `API_Key`.

### riminder.Riminder.objects

An object containing all the API methods a user can access after instanciating the app.

The next points are available under the `objects` property.

> **Note:** All methods return a Promise when called.

#### objects.getSources

Method that gets a list of sources.

```typescript
const app = new riminderSdk.Riminder({API_Key: "api-key-here"});
app.objects.getSources();
```

#### objects.getSource

Method that gets a source by its id.

```typescript
app.objects.getSource("source_id_here");
```

#### objects.getFilters

Method that gets a list of filters.

```typescript
app.objects.getFilters();
```

#### objects.getFilter

Method that gets a filter by its id or its reference. It accepts an object as follows

```typescript
const options: FilterIdOrReference = {
    filter_id: "filter_id",
    // Or
    filter_reference: "filter_reference"
}

app.objects.getFilter(options);
```

#### objects.getProfiles

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

app.objects.getProfiles(options);
```

#### objects.postResumeForProfile

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

app.objects.postResumeForProfile(data, fs.createReadStream("myFile"));
```

#### objects.getProfile

Method that gets a profile from a source using its id or reference.

```typescript
const options: ProfileOptionIdOrReference = {
    source_id: "source_id",
    profile_id: "id",
    // Or
    profile_reference: "reference"
}

app.objects.getProfile(options);
```

#### objects.getProfileDocuments

Method that gets the documents associated to a profile by its id or reference.

```typescript
const options: ProfileOptionIdOrReference = {
    source_id: "source_id",
    profile_id: "id",
    // Or
    profile_reference: "reference"
}

app.objects.getProfileDocuments(options);
```

#### objects.getProfileParsing

Method that gets the parsing result of a profile by its id or reference.

```typescript
const options: ProfileOptionIdOrReference = {
    source_id: "source_id",
    profile_id: "id",
    // Or
    profile_reference: "reference"
}

app.objects.getProfileParsing(options);
```

#### objects.getProfileScoring

Method that gets the scoring result of a profile by its id or reference.

```typescript
const options: ProfileOptionIdOrReference = {
    source_id: "source_id",
    profile_id: "id",
    // Or
    profile_reference: "reference"
}

app.objects.getProfileScoring(options);
```

#### patchProfileStage

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

app.objects.updateProfileStage(data);
```

#### patchProfileRating

Method that updates the rating of a profile on a particular filter.

```typescript
const data: StagePatch = {
    source_id: "source_id",
    rating: 2,
    profile_id: "profile_id",
    // Or
    profile_reference: "profile_reference",

    filter_id: "filter_id",
    // Or
    filter_reference: "filter_reference"
}

app.objects.updateProfileRating(data);
```

## Todos

- [ ] The browser compatibility needs to be checked