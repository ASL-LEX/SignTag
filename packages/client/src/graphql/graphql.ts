/* Generated File DO NOT EDIT. */
/* tslint:disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type AslLexField = {
  __typename?: 'AslLexField';
  lexiconEntry: LexiconEntry;
};

export type BooleanField = {
  __typename?: 'BooleanField';
  value: Scalars['Boolean']['output'];
};

export type CreateDatasetDownloadRequest = {
  dataset: Scalars['ID']['input'];
};

export type CreateStudyDownloadRequest = {
  study: Scalars['ID']['input'];
};

export type Dataset = {
  __typename?: 'Dataset';
  _id: Scalars['ID']['output'];
  description: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type DatasetCreate = {
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export enum DatasetDownloadField {
  EntryZip = 'ENTRY_ZIP'
}

export type DatasetDownloadRequest = {
  __typename?: 'DatasetDownloadRequest';
  _id: Scalars['String']['output'];
  dataset: Dataset;
  date: Scalars['DateTime']['output'];
  entryZip: Scalars['String']['output'];
  status: DownloadStatus;
};

export type DatasetProjectPermission = {
  __typename?: 'DatasetProjectPermission';
  dataset: Dataset;
  projectHasAccess: Scalars['Boolean']['output'];
};

export enum DownloadStatus {
  InProgress = 'IN_PROGRESS',
  Ready = 'READY'
}

export type Entry = {
  __typename?: 'Entry';
  _id: Scalars['String']['output'];
  contentType: Scalars['String']['output'];
  creator: Scalars['ID']['output'];
  dataset: Scalars['ID']['output'];
  dateCreated: Scalars['DateTime']['output'];
  entryID: Scalars['String']['output'];
  isTraining: Scalars['Boolean']['output'];
  meta?: Maybe<Scalars['JSON']['output']>;
  organization: Scalars['ID']['output'];
  signedUrl: Scalars['String']['output'];
  /** Get the number of milliseconds the signed URL is valid for. */
  signedUrlExpiration: Scalars['Float']['output'];
  signlabRecording?: Maybe<SignLabRecorded>;
};

export type FreeTextField = {
  __typename?: 'FreeTextField';
  value: Scalars['String']['output'];
};

/** Represents an entier lexicon */
export type Lexicon = {
  __typename?: 'Lexicon';
  /** Unique identifier for the lexicon */
  _id: Scalars['ID']['output'];
  /** The name of the Lexicon */
  name: Scalars['String']['output'];
  /** Format each entry in the Lexicon is expected to follow */
  schema: Scalars['JSON']['output'];
};

export type LexiconAddEntry = {
  /** Keywords that are similar to search accross */
  associates: Array<Scalars['String']['input']>;
  /** Fields stored on the entry */
  fields: Scalars['JSON']['input'];
  /** Unique user assigned identifier for the entry within the lexicon */
  key: Scalars['String']['input'];
  lexicon: Scalars['String']['input'];
  /** Primary way to search for entries in the lexicon */
  primary: Scalars['String']['input'];
  /** Link to the video that represents the entry */
  video: Scalars['String']['input'];
};

export type LexiconCreate = {
  /** The name of the Lexicon */
  name: Scalars['String']['input'];
  /** Format each entry in the Lexicon is expected to follow */
  schema: Scalars['JSON']['input'];
};

/** Single entry within a whole lexicon  */
export type LexiconEntry = {
  __typename?: 'LexiconEntry';
  /** Keywords that are similar to search accross */
  associates: Array<Scalars['String']['output']>;
  /** Fields stored on the entry */
  fields: Scalars['JSON']['output'];
  /** Unique user assigned identifier for the entry within the lexicon */
  key: Scalars['String']['output'];
  lexicon: Scalars['String']['output'];
  /** Primary way to search for entries in the lexicon */
  primary: Scalars['String']['output'];
  /** Link to the video that represents the entry */
  video: Scalars['String']['output'];
};

export type LexiconUpdate = {
  _id: Scalars['String']['input'];
  /** The name of the Lexicon */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Format each entry in the Lexicon is expected to follow */
  schema?: InputMaybe<Scalars['JSON']['input']>;
};

export type LexiconUpdateEntry = {
  /** Keywords that are similar to search accross */
  associates?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Fields stored on the entry */
  fields?: InputMaybe<Scalars['JSON']['input']>;
  findByKey: Scalars['String']['input'];
  /** Unique user assigned identifier for the entry within the lexicon */
  key?: InputMaybe<Scalars['String']['input']>;
  lexicon: Scalars['String']['input'];
  /** Primary way to search for entries in the lexicon */
  primary?: InputMaybe<Scalars['String']['input']>;
  /** Link to the video that represents the entry */
  video?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  assignTag?: Maybe<Tag>;
  changeDatasetDescription: Scalars['Boolean']['output'];
  changeDatasetName: Scalars['Boolean']['output'];
  changeStudyDescription: Study;
  changeStudyName: Study;
  completeTag: Scalars['Boolean']['output'];
  completeUploadSession: UploadResult;
  createCatchTrials: Array<Tag>;
  createDataset: Dataset;
  createDatasetDownload: DatasetDownloadRequest;
  createOrganization: Organization;
  createStudy: Study;
  createStudyDownload: StudyDownloadRequest;
  createTags: Array<Tag>;
  createTrainingSet: Scalars['Boolean']['output'];
  createUploadSession: UploadSession;
  deleteEntry: Scalars['Boolean']['output'];
  deleteProject: Scalars['Boolean']['output'];
  deleteStudy: Scalars['Boolean']['output'];
  grantContributor: Scalars['Boolean']['output'];
  grantOwner: Scalars['Boolean']['output'];
  grantProjectDatasetAccess: Scalars['Boolean']['output'];
  grantProjectPermissions: Scalars['Boolean']['output'];
  grantStudyAdmin: Scalars['Boolean']['output'];
  grantTrainedContributor: Scalars['Boolean']['output'];
  lexiconAddEntry: LexiconEntry;
  /** Remove all entries from a given lexicon */
  lexiconClearEntries: Scalars['Boolean']['output'];
  lexiconCreate: Lexicon;
  /** Delete a lexicon entry by key */
  lexiconDeleteEntry: Scalars['Boolean']['output'];
  lexiconUpdate: Lexicon;
  lexiconUpdateEntry: LexiconEntry;
  markDatasetFieldComplete: Scalars['Boolean']['output'];
  markStudyFieldComplete: Scalars['Boolean']['output'];
  removeTag: Scalars['Boolean']['output'];
  saveVideoField: VideoFieldIntermediate;
  setEntryEnabled: Scalars['Boolean']['output'];
  signLabCreateProject: Project;
};


export type MutationAssignTagArgs = {
  study: Scalars['ID']['input'];
};


export type MutationChangeDatasetDescriptionArgs = {
  dataset: Scalars['ID']['input'];
  newDescription: Scalars['String']['input'];
};


export type MutationChangeDatasetNameArgs = {
  dataset: Scalars['ID']['input'];
  newName: Scalars['String']['input'];
};


export type MutationChangeStudyDescriptionArgs = {
  newDescription: Scalars['String']['input'];
  study: Scalars['ID']['input'];
};


export type MutationChangeStudyNameArgs = {
  newName: Scalars['String']['input'];
  study: Scalars['ID']['input'];
};


export type MutationCompleteTagArgs = {
  data: Scalars['JSON']['input'];
  tag: Scalars['ID']['input'];
};


export type MutationCompleteUploadSessionArgs = {
  session: Scalars['ID']['input'];
};


export type MutationCreateCatchTrialsArgs = {
  entries: Array<Scalars['ID']['input']>;
  study: Scalars['ID']['input'];
};


export type MutationCreateDatasetArgs = {
  dataset: DatasetCreate;
};


export type MutationCreateDatasetDownloadArgs = {
  downloadRequest: CreateDatasetDownloadRequest;
};


export type MutationCreateOrganizationArgs = {
  organization: OrganizationCreate;
};


export type MutationCreateStudyArgs = {
  study: StudyCreate;
};


export type MutationCreateStudyDownloadArgs = {
  downloadRequest: CreateStudyDownloadRequest;
};


export type MutationCreateTagsArgs = {
  entries: Array<Scalars['ID']['input']>;
  study: Scalars['ID']['input'];
};


export type MutationCreateTrainingSetArgs = {
  entries: Array<Scalars['ID']['input']>;
  study: Scalars['ID']['input'];
};


export type MutationCreateUploadSessionArgs = {
  dataset: Scalars['ID']['input'];
};


export type MutationDeleteEntryArgs = {
  entry: Scalars['ID']['input'];
};


export type MutationDeleteProjectArgs = {
  project: Scalars['ID']['input'];
};


export type MutationDeleteStudyArgs = {
  study: Scalars['ID']['input'];
};


export type MutationGrantContributorArgs = {
  isContributor: Scalars['Boolean']['input'];
  study: Scalars['ID']['input'];
  user: Scalars['ID']['input'];
};


export type MutationGrantOwnerArgs = {
  targetUser: Scalars['ID']['input'];
};


export type MutationGrantProjectDatasetAccessArgs = {
  dataset: Scalars['ID']['input'];
  hasAccess: Scalars['Boolean']['input'];
  project: Scalars['ID']['input'];
};


export type MutationGrantProjectPermissionsArgs = {
  isAdmin: Scalars['Boolean']['input'];
  project: Scalars['ID']['input'];
  user: Scalars['ID']['input'];
};


export type MutationGrantStudyAdminArgs = {
  isAdmin: Scalars['Boolean']['input'];
  study: Scalars['ID']['input'];
  user: Scalars['ID']['input'];
};


export type MutationGrantTrainedContributorArgs = {
  isTrained: Scalars['Boolean']['input'];
  study: Scalars['ID']['input'];
  user: Scalars['ID']['input'];
};


export type MutationLexiconAddEntryArgs = {
  entry: LexiconAddEntry;
};


export type MutationLexiconClearEntriesArgs = {
  lexicon: Scalars['String']['input'];
};


export type MutationLexiconCreateArgs = {
  lexicon: LexiconCreate;
};


export type MutationLexiconDeleteEntryArgs = {
  key: Scalars['String']['input'];
  lexicon: Scalars['String']['input'];
};


export type MutationLexiconUpdateArgs = {
  updateData: LexiconUpdate;
};


export type MutationLexiconUpdateEntryArgs = {
  lexiconEntry: LexiconUpdateEntry;
};


export type MutationMarkDatasetFieldCompleteArgs = {
  code: Scalars['String']['input'];
  datasetField: DatasetDownloadField;
  downloadRequest: Scalars['ID']['input'];
};


export type MutationMarkStudyFieldCompleteArgs = {
  code: Scalars['String']['input'];
  downloadRequest: Scalars['ID']['input'];
  studyField: StudyDownloadField;
};


export type MutationRemoveTagArgs = {
  tag: Scalars['ID']['input'];
};


export type MutationSaveVideoFieldArgs = {
  field: Scalars['String']['input'];
  index: Scalars['Int']['input'];
  tag: Scalars['ID']['input'];
};


export type MutationSetEntryEnabledArgs = {
  enabled: Scalars['Boolean']['input'];
  entry: Scalars['ID']['input'];
  study: Scalars['ID']['input'];
};


export type MutationSignLabCreateProjectArgs = {
  project: ProjectCreate;
};

export type NumericField = {
  __typename?: 'NumericField';
  value: Scalars['Float']['output'];
};

export type Organization = {
  __typename?: 'Organization';
  _id: Scalars['ID']['output'];
  /** URL where the user logs in against */
  authURL: Scalars['String']['output'];
  name: Scalars['String']['output'];
  /** Tenant ID in the Identity Platform */
  tenantID: Scalars['String']['output'];
};

export type OrganizationCreate = {
  /** URL where the user logs in against */
  authURL: Scalars['String']['input'];
  name: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
  /** Tenant ID in the Identity Platform */
  tenantID: Scalars['String']['input'];
};

export type Permission = {
  __typename?: 'Permission';
  contributor: Scalars['Boolean']['output'];
  owner: Scalars['Boolean']['output'];
  projectAdmin: Scalars['Boolean']['output'];
  studyAdmin: Scalars['Boolean']['output'];
  trainedContributor: Scalars['Boolean']['output'];
};

export type Project = {
  __typename?: 'Project';
  _id: Scalars['ID']['output'];
  created: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type ProjectCreate = {
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type ProjectPermissionModel = {
  __typename?: 'ProjectPermissionModel';
  editable: Scalars['Boolean']['output'];
  isProjectAdmin: Scalars['Boolean']['output'];
  user: User;
};

export type Query = {
  __typename?: 'Query';
  countEntryForDataset: Scalars['Int']['output'];
  countTagForStudy: Scalars['Int']['output'];
  countTrainingTagForStudy: Scalars['Int']['output'];
  datasetExists: Scalars['Boolean']['output'];
  entryForDataset: Array<Entry>;
  entryFromID: Entry;
  exists: Scalars['Boolean']['output'];
  findStudies: Array<Study>;
  /** Get the presigned URL for where to upload the CSV against */
  getCSVUploadURL: Scalars['String']['output'];
  getCatchTrials: Array<Tag>;
  getDatasetDownloads: Array<DatasetDownloadRequest>;
  getDatasetProjectPermissions: Array<DatasetProjectPermission>;
  getDatasets: Array<Dataset>;
  getDatasetsByProject: Array<Dataset>;
  getEntryUploadURL: Scalars['String']['output'];
  getOrganizations: Array<Organization>;
  getProjectPermissions: Array<ProjectPermissionModel>;
  getProjects: Array<Project>;
  getRoles: Permission;
  getStudyDownloads: Array<StudyDownloadRequest>;
  getStudyPermissions: Array<StudyPermissionModel>;
  getTags: Array<Tag>;
  getTrainingTags: Array<Tag>;
  isEntryEnabled: Scalars['Boolean']['output'];
  lexFindAll: Array<Lexicon>;
  /** Fetch all entries for a given lexicon */
  lexiconAllEntries: Array<LexiconEntry>;
  lexiconByKey: LexiconEntry;
  lexiconSearch: Array<LexiconEntry>;
  projectExists: Scalars['Boolean']['output'];
  studyExists: Scalars['Boolean']['output'];
  validateCSV: UploadResult;
};


export type QueryCountEntryForDatasetArgs = {
  dataset: Scalars['ID']['input'];
};


export type QueryCountTagForStudyArgs = {
  study: Scalars['ID']['input'];
};


export type QueryCountTrainingTagForStudyArgs = {
  study: Scalars['ID']['input'];
  user: Scalars['String']['input'];
};


export type QueryDatasetExistsArgs = {
  name: Scalars['String']['input'];
};


export type QueryEntryForDatasetArgs = {
  dataset: Scalars['ID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryEntryFromIdArgs = {
  entry: Scalars['ID']['input'];
};


export type QueryExistsArgs = {
  name: Scalars['String']['input'];
};


export type QueryFindStudiesArgs = {
  project: Scalars['ID']['input'];
};


export type QueryGetCsvUploadUrlArgs = {
  session: Scalars['ID']['input'];
};


export type QueryGetCatchTrialsArgs = {
  study: Scalars['ID']['input'];
}

export type QueryGetDatasetDownloadsArgs = {
  dataset: Scalars['ID']['input'];
};


export type QueryGetDatasetProjectPermissionsArgs = {
  project: Scalars['ID']['input'];
};


export type QueryGetDatasetsByProjectArgs = {
  project: Scalars['ID']['input'];
};


export type QueryGetEntryUploadUrlArgs = {
  contentType: Scalars['String']['input'];
  filename: Scalars['String']['input'];
  session: Scalars['ID']['input'];
};


export type QueryGetProjectPermissionsArgs = {
  project: Scalars['ID']['input'];
};


export type QueryGetRolesArgs = {
  project?: InputMaybe<Scalars['ID']['input']>;
  study?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetStudyDownloadsArgs = {
  study: Scalars['ID']['input'];
};


export type QueryGetStudyPermissionsArgs = {
  study: Scalars['ID']['input'];
};


export type QueryGetTagsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  study: Scalars['ID']['input'];
};


export type QueryGetTrainingTagsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  study: Scalars['ID']['input'];
  user: Scalars['String']['input'];
};


export type QueryIsEntryEnabledArgs = {
  entry: Scalars['ID']['input'];
  study: Scalars['ID']['input'];
};


export type QueryLexiconAllEntriesArgs = {
  lexicon: Scalars['String']['input'];
};


export type QueryLexiconByKeyArgs = {
  key: Scalars['String']['input'];
  lexicon: Scalars['String']['input'];
};


export type QueryLexiconSearchArgs = {
  lexicon: Scalars['String']['input'];
  search: Scalars['String']['input'];
};


export type QueryProjectExistsArgs = {
  name: Scalars['String']['input'];
};


export type QueryStudyExistsArgs = {
  name: Scalars['String']['input'];
  project: Scalars['ID']['input'];
};


export type QueryValidateCsvArgs = {
  session: Scalars['ID']['input'];
};

export type SignLabRecorded = {
  __typename?: 'SignLabRecorded';
  fieldName: Scalars['String']['output'];
};

export type SliderField = {
  __typename?: 'SliderField';
  value: Scalars['Float']['output'];
};

export type Study = {
  __typename?: 'Study';
  _id: Scalars['ID']['output'];
  description: Scalars['String']['output'];
  instructions: Scalars['String']['output'];
  name: Scalars['String']['output'];
  project: Scalars['ID']['output'];
  studyConfig?: Maybe<StudyConfig>;
  tagSchema: TagSchema;
  tagsPerEntry: Scalars['Float']['output'];
};

export type StudyConfig = {
  __typename?: 'StudyConfig';
  disableClear?: Maybe<Scalars['Boolean']['output']>;
  disableSameUserEntryTagging?: Maybe<Scalars['Boolean']['output']>;
  sortByEntryID?: Maybe<Scalars['Boolean']['output']>;
};

export type StudyConfigInput = {
  disableClear?: InputMaybe<Scalars['Boolean']['input']>;
  disableSameUserEntryTagging?: InputMaybe<Scalars['Boolean']['input']>;
  sortByEntryID?: InputMaybe<Scalars['Boolean']['input']>;
};

export type StudyCreate = {
  description: Scalars['String']['input'];
  instructions: Scalars['String']['input'];
  name: Scalars['String']['input'];
  project: Scalars['ID']['input'];
  studyConfig?: InputMaybe<StudyConfigInput>;
  tagSchema: TagSchemaInput;
  tagsPerEntry: Scalars['Float']['input'];
};

export enum StudyDownloadField {
  EntryZip = 'ENTRY_ZIP',
  TaggedEntriesZip = 'TAGGED_ENTRIES_ZIP'
}

export type StudyDownloadRequest = {
  __typename?: 'StudyDownloadRequest';
  _id: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  entryZip: Scalars['String']['output'];
  status: Scalars['String']['output'];
  study: Study;
  tagCSV: Scalars['String']['output'];
  taggedEntries: Scalars['String']['output'];
  userCSV?: Maybe<Scalars['String']['output']>;
};

export type StudyPermissionModel = {
  __typename?: 'StudyPermissionModel';
  isContributor: Scalars['Boolean']['output'];
  isContributorEditable: Scalars['Boolean']['output'];
  isStudyAdmin: Scalars['Boolean']['output'];
  isStudyAdminEditable: Scalars['Boolean']['output'];
  isTrained: Scalars['Boolean']['output'];
  isTrainedEditable: Scalars['Boolean']['output'];
  user: User;
};

export type Tag = {
  __typename?: 'Tag';
  _id: Scalars['String']['output'];
  complete: Scalars['Boolean']['output'];
  /** The data stored in the tag, not populated until a contributor has tagged */
  data?: Maybe<Array<TagField>>;
  /** If the tag is enabled as part of the study, way to disable certain tags */
  enabled: Scalars['Boolean']['output'];
  entry: Entry;
  /** Indicates if the tag is a catch trial */
  isCatchTrial: Scalars['Boolean']['output'];
  /** Way to rank tags based on order to be tagged */
  order: Scalars['Float']['output'];
  study: Study;
  /** If the tag is part of a training */
  training: Scalars['Boolean']['output'];
  /** The user assigned to the tag  */
  user?: Maybe<Scalars['String']['output']>;
};

export type TagField = {
  __typename?: 'TagField';
  field?: Maybe<TagFieldUnion>;
  name: Scalars['String']['output'];
  type: TagFieldType;
};

export enum TagFieldType {
  AslLex = 'ASL_LEX',
  Autocomplete = 'AUTOCOMPLETE',
  Boolean = 'BOOLEAN',
  Embedded = 'EMBEDDED',
  FreeText = 'FREE_TEXT',
  Numeric = 'NUMERIC',
  Slider = 'SLIDER',
  VideoRecord = 'VIDEO_RECORD'
}

export type TagFieldUnion = AslLexField | BooleanField | FreeTextField | NumericField | SliderField | VideoField;

export type TagSchema = {
  __typename?: 'TagSchema';
  dataSchema: Scalars['JSON']['output'];
  uiSchema: Scalars['JSON']['output'];
};

export type TagSchemaInput = {
  dataSchema: Scalars['JSON']['input'];
  uiSchema: Scalars['JSON']['input'];
};

export type UploadResult = {
  __typename?: 'UploadResult';
  message?: Maybe<Scalars['String']['output']>;
  status: UploadStatus;
};

export type UploadSession = {
  __typename?: 'UploadSession';
  /** The ID of the upload session */
  _id: Scalars['ID']['output'];
  created: Scalars['DateTime']['output'];
  dataset: Scalars['String']['output'];
};

export enum UploadStatus {
  Error = 'ERROR',
  Success = 'SUCCESS',
  Warning = 'WARNING'
}

export type User = {
  __typename?: 'User';
  displayName?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  photoURL?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
};

export type VideoField = {
  __typename?: 'VideoField';
  entries: Array<Entry>;
};

export type VideoFieldIntermediate = {
  __typename?: 'VideoFieldIntermediate';
  _id: Scalars['String']['output'];
  uploadURL: Scalars['String']['output'];
};
