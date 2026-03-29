/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateTagsMutationVariables = Types.Exact<{
  study: Types.Scalars['ID']['input'];
  entries: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
}>;


export type CreateTagsMutation = { __typename?: 'Mutation', createTags: Array<{ __typename?: 'Tag', _id: string }> };

export type CreateCatchTrialsMutationVariables = Types.Exact<{
  study: Types.Scalars['ID']['input'];
  entries: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
}>;


export type CreateCatchTrialsMutation = { __typename?: 'Mutation', createCatchTrials: Array<{ __typename?: 'Tag', _id: string }> };

export type CreateTrainingSetMutationVariables = Types.Exact<{
  study: Types.Scalars['ID']['input'];
  entries: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
}>;


export type CreateTrainingSetMutation = { __typename?: 'Mutation', createTrainingSet: boolean };

export type SetEntryEnabledMutationVariables = Types.Exact<{
  study: Types.Scalars['ID']['input'];
  entry: Types.Scalars['ID']['input'];
  enabled: Types.Scalars['Boolean']['input'];
}>;


export type SetEntryEnabledMutation = { __typename?: 'Mutation', setEntryEnabled: boolean };

export type RemoveTagMutationVariables = Types.Exact<{
  tag: Types.Scalars['ID']['input'];
}>;


export type RemoveTagMutation = { __typename?: 'Mutation', removeTag: boolean };

export type IsEntryEnabledQueryVariables = Types.Exact<{
  study: Types.Scalars['ID']['input'];
  entry: Types.Scalars['ID']['input'];
}>;


export type IsEntryEnabledQuery = { __typename?: 'Query', isEntryEnabled: boolean };

export type AssignTagMutationVariables = Types.Exact<{
  study: Types.Scalars['ID']['input'];
}>;


export type AssignTagMutation = { __typename?: 'Mutation', assignTag?: { __typename?: 'Tag', _id: string, entry: { __typename?: 'Entry', _id: string, organization: string, entryID: string, contentType: string, dataset: string, creator: string, dateCreated: any, meta?: any | null, signedUrl: string, signedUrlExpiration: number, isTraining: boolean } } | null };

export type CompleteTagMutationVariables = Types.Exact<{
  tag: Types.Scalars['ID']['input'];
  data: Types.Scalars['JSON']['input'];
}>;


export type CompleteTagMutation = { __typename?: 'Mutation', completeTag: boolean };

export type SaveVideoFieldMutationVariables = Types.Exact<{
  tag: Types.Scalars['ID']['input'];
  field: Types.Scalars['String']['input'];
  index: Types.Scalars['Int']['input'];
}>;


export type SaveVideoFieldMutation = { __typename?: 'Mutation', saveVideoField: { __typename?: 'VideoFieldIntermediate', _id: string, uploadURL: string } };

export type GetTagsQueryVariables = Types.Exact<{
  study: Types.Scalars['ID']['input'];
  page?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  pageSize?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type GetTagsQuery = { __typename?: 'Query', getTags: Array<{ __typename?: 'Tag', _id: string, complete: boolean, entry: { __typename?: 'Entry', _id: string, organization: string, entryID: string, contentType: string, creator: string, dateCreated: any, meta?: any | null, signedUrl: string, signedUrlExpiration: number, isTraining: boolean }, data?: Array<{ __typename?: 'TagField', type: Types.TagFieldType, name: string, field?: { __typename: 'AslLexField', lexiconEntry: { __typename?: 'LexiconEntry', key: string, primary: string, video: string, lexicon: string, associates: Array<string>, fields: any } } | { __typename: 'BooleanField', boolValue: boolean } | { __typename: 'FreeTextField', textValue: string } | { __typename: 'NumericField', numericValue: number } | { __typename: 'SliderField', sliderValue: number } | { __typename: 'VideoField', entries: Array<{ __typename?: 'Entry', _id: string, organization: string, entryID: string, contentType: string, creator: string, dateCreated: any, meta?: any | null, signedUrl: string, signedUrlExpiration: number, isTraining: boolean }> } | null }> | null }> };

export type CountTagForStudyQueryVariables = Types.Exact<{
  study: Types.Scalars['ID']['input'];
}>;


export type CountTagForStudyQuery = { __typename?: 'Query', countTagForStudy: number };

export type CountTrainingTagForStudyQueryVariables = Types.Exact<{
  study: Types.Scalars['ID']['input'];
  user: Types.Scalars['String']['input'];
}>;


export type CountTrainingTagForStudyQuery = { __typename?: 'Query', countTrainingTagForStudy: number };

export type GetTrainingTagsQueryVariables = Types.Exact<{
  study: Types.Scalars['ID']['input'];
  user: Types.Scalars['String']['input'];
  page?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  pageSize?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type GetTrainingTagsQuery = { __typename?: 'Query', getTrainingTags: Array<{ __typename?: 'Tag', _id: string, complete: boolean, entry: { __typename?: 'Entry', _id: string, organization: string, entryID: string, contentType: string, creator: string, dateCreated: any, meta?: any | null, signedUrl: string, signedUrlExpiration: number, isTraining: boolean }, data?: Array<{ __typename?: 'TagField', type: Types.TagFieldType, name: string, field?: { __typename: 'AslLexField', lexiconEntry: { __typename?: 'LexiconEntry', key: string, primary: string, video: string, lexicon: string, associates: Array<string>, fields: any } } | { __typename: 'BooleanField', boolValue: boolean } | { __typename: 'FreeTextField', textValue: string } | { __typename: 'NumericField', numericValue: number } | { __typename: 'SliderField', sliderValue: number } | { __typename: 'VideoField', entries: Array<{ __typename?: 'Entry', _id: string, organization: string, entryID: string, contentType: string, creator: string, dateCreated: any, meta?: any | null, signedUrl: string, signedUrlExpiration: number, isTraining: boolean }> } | null }> | null }> };

export type GetCatchTrialsQueryVariables = Types.Exact<{
  study: Types.Scalars['ID']['input'];
}>;


export type GetCatchTrialsQuery = { __typename?: 'Query', getCatchTrials: Array<{ __typename?: 'Tag', _id: string, data?: any | null, complete: boolean, isCatchTrial: boolean, entry: { __typename?: 'Entry', _id: string, organization: string, entryID: string, contentType: string, creator: string, dateCreated: any, meta?: any | null, signedUrl: string, signedUrlExpiration: number } }> };


export const CreateTagsDocument = gql`
    mutation createTags($study: ID!, $entries: [ID!]!) {
  createTags(study: $study, entries: $entries) {
    _id
  }
}
    `;
export type CreateTagsMutationFn = Apollo.MutationFunction<CreateTagsMutation, CreateTagsMutationVariables>;

/**
 * __useCreateTagsMutation__
 *
 * To run a mutation, you first call `useCreateTagsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTagsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTagsMutation, { data, loading, error }] = useCreateTagsMutation({
 *   variables: {
 *      study: // value for 'study'
 *      entries: // value for 'entries'
 *   },
 * });
 */
export function useCreateTagsMutation(baseOptions?: Apollo.MutationHookOptions<CreateTagsMutation, CreateTagsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTagsMutation, CreateTagsMutationVariables>(CreateTagsDocument, options);
      }
export type CreateTagsMutationHookResult = ReturnType<typeof useCreateTagsMutation>;
export type CreateTagsMutationResult = Apollo.MutationResult<CreateTagsMutation>;
export type CreateTagsMutationOptions = Apollo.BaseMutationOptions<CreateTagsMutation, CreateTagsMutationVariables>;
export const CreateCatchTrialsDocument = gql`
    mutation createCatchTrials($study: ID!, $entries: [ID!]!) {
  createCatchTrials(study: $study, entries: $entries) {
    _id
  }
}
    `;
export type CreateCatchTrialsMutationFn = Apollo.MutationFunction<CreateCatchTrialsMutation, CreateCatchTrialsMutationVariables>;

/**
 * __useCreateCatchTrialsMutation__
 *
 * To run a mutation, you first call `useCreateCatchTrialsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCatchTrialsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCatchTrialsMutation, { data, loading, error }] = useCreateCatchTrialsMutation({
 *   variables: {
 *      study: // value for 'study'
 *      entries: // value for 'entries'
 *   },
 * });
 */
export function useCreateCatchTrialsMutation(baseOptions?: Apollo.MutationHookOptions<CreateCatchTrialsMutation, CreateCatchTrialsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCatchTrialsMutation, CreateCatchTrialsMutationVariables>(CreateCatchTrialsDocument, options);
      }
export type CreateCatchTrialsMutationHookResult = ReturnType<typeof useCreateCatchTrialsMutation>;
export type CreateCatchTrialsMutationResult = Apollo.MutationResult<CreateCatchTrialsMutation>;
export type CreateCatchTrialsMutationOptions = Apollo.BaseMutationOptions<CreateCatchTrialsMutation, CreateCatchTrialsMutationVariables>;
export const CreateTrainingSetDocument = gql`
    mutation createTrainingSet($study: ID!, $entries: [ID!]!) {
  createTrainingSet(study: $study, entries: $entries)
}
    `;
export type CreateTrainingSetMutationFn = Apollo.MutationFunction<CreateTrainingSetMutation, CreateTrainingSetMutationVariables>;

/**
 * __useCreateTrainingSetMutation__
 *
 * To run a mutation, you first call `useCreateTrainingSetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTrainingSetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTrainingSetMutation, { data, loading, error }] = useCreateTrainingSetMutation({
 *   variables: {
 *      study: // value for 'study'
 *      entries: // value for 'entries'
 *   },
 * });
 */
export function useCreateTrainingSetMutation(baseOptions?: Apollo.MutationHookOptions<CreateTrainingSetMutation, CreateTrainingSetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTrainingSetMutation, CreateTrainingSetMutationVariables>(CreateTrainingSetDocument, options);
      }
export type CreateTrainingSetMutationHookResult = ReturnType<typeof useCreateTrainingSetMutation>;
export type CreateTrainingSetMutationResult = Apollo.MutationResult<CreateTrainingSetMutation>;
export type CreateTrainingSetMutationOptions = Apollo.BaseMutationOptions<CreateTrainingSetMutation, CreateTrainingSetMutationVariables>;
export const SetEntryEnabledDocument = gql`
    mutation setEntryEnabled($study: ID!, $entry: ID!, $enabled: Boolean!) {
  setEntryEnabled(study: $study, entry: $entry, enabled: $enabled)
}
    `;
export type SetEntryEnabledMutationFn = Apollo.MutationFunction<SetEntryEnabledMutation, SetEntryEnabledMutationVariables>;

/**
 * __useSetEntryEnabledMutation__
 *
 * To run a mutation, you first call `useSetEntryEnabledMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetEntryEnabledMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setEntryEnabledMutation, { data, loading, error }] = useSetEntryEnabledMutation({
 *   variables: {
 *      study: // value for 'study'
 *      entry: // value for 'entry'
 *      enabled: // value for 'enabled'
 *   },
 * });
 */
export function useSetEntryEnabledMutation(baseOptions?: Apollo.MutationHookOptions<SetEntryEnabledMutation, SetEntryEnabledMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetEntryEnabledMutation, SetEntryEnabledMutationVariables>(SetEntryEnabledDocument, options);
      }
export type SetEntryEnabledMutationHookResult = ReturnType<typeof useSetEntryEnabledMutation>;
export type SetEntryEnabledMutationResult = Apollo.MutationResult<SetEntryEnabledMutation>;
export type SetEntryEnabledMutationOptions = Apollo.BaseMutationOptions<SetEntryEnabledMutation, SetEntryEnabledMutationVariables>;
export const RemoveTagDocument = gql`
    mutation removeTag($tag: ID!) {
  removeTag(tag: $tag)
}
    `;
export type RemoveTagMutationFn = Apollo.MutationFunction<RemoveTagMutation, RemoveTagMutationVariables>;

/**
 * __useRemoveTagMutation__
 *
 * To run a mutation, you first call `useRemoveTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeTagMutation, { data, loading, error }] = useRemoveTagMutation({
 *   variables: {
 *      tag: // value for 'tag'
 *   },
 * });
 */
export function useRemoveTagMutation(baseOptions?: Apollo.MutationHookOptions<RemoveTagMutation, RemoveTagMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveTagMutation, RemoveTagMutationVariables>(RemoveTagDocument, options);
      }
export type RemoveTagMutationHookResult = ReturnType<typeof useRemoveTagMutation>;
export type RemoveTagMutationResult = Apollo.MutationResult<RemoveTagMutation>;
export type RemoveTagMutationOptions = Apollo.BaseMutationOptions<RemoveTagMutation, RemoveTagMutationVariables>;
export const IsEntryEnabledDocument = gql`
    query isEntryEnabled($study: ID!, $entry: ID!) {
  isEntryEnabled(study: $study, entry: $entry)
}
    `;

/**
 * __useIsEntryEnabledQuery__
 *
 * To run a query within a React component, call `useIsEntryEnabledQuery` and pass it any options that fit your needs.
 * When your component renders, `useIsEntryEnabledQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIsEntryEnabledQuery({
 *   variables: {
 *      study: // value for 'study'
 *      entry: // value for 'entry'
 *   },
 * });
 */
export function useIsEntryEnabledQuery(baseOptions: Apollo.QueryHookOptions<IsEntryEnabledQuery, IsEntryEnabledQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IsEntryEnabledQuery, IsEntryEnabledQueryVariables>(IsEntryEnabledDocument, options);
      }
export function useIsEntryEnabledLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IsEntryEnabledQuery, IsEntryEnabledQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IsEntryEnabledQuery, IsEntryEnabledQueryVariables>(IsEntryEnabledDocument, options);
        }
export type IsEntryEnabledQueryHookResult = ReturnType<typeof useIsEntryEnabledQuery>;
export type IsEntryEnabledLazyQueryHookResult = ReturnType<typeof useIsEntryEnabledLazyQuery>;
export type IsEntryEnabledQueryResult = Apollo.QueryResult<IsEntryEnabledQuery, IsEntryEnabledQueryVariables>;
export const AssignTagDocument = gql`
    mutation assignTag($study: ID!) {
  assignTag(study: $study) {
    _id
    entry {
      _id
      organization
      entryID
      contentType
      dataset
      creator
      dateCreated
      meta
      signedUrl
      signedUrlExpiration
      isTraining
    }
  }
}
    `;
export type AssignTagMutationFn = Apollo.MutationFunction<AssignTagMutation, AssignTagMutationVariables>;

/**
 * __useAssignTagMutation__
 *
 * To run a mutation, you first call `useAssignTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAssignTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [assignTagMutation, { data, loading, error }] = useAssignTagMutation({
 *   variables: {
 *      study: // value for 'study'
 *   },
 * });
 */
export function useAssignTagMutation(baseOptions?: Apollo.MutationHookOptions<AssignTagMutation, AssignTagMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AssignTagMutation, AssignTagMutationVariables>(AssignTagDocument, options);
      }
export type AssignTagMutationHookResult = ReturnType<typeof useAssignTagMutation>;
export type AssignTagMutationResult = Apollo.MutationResult<AssignTagMutation>;
export type AssignTagMutationOptions = Apollo.BaseMutationOptions<AssignTagMutation, AssignTagMutationVariables>;
export const CompleteTagDocument = gql`
    mutation completeTag($tag: ID!, $data: JSON!) {
  completeTag(tag: $tag, data: $data)
}
    `;
export type CompleteTagMutationFn = Apollo.MutationFunction<CompleteTagMutation, CompleteTagMutationVariables>;

/**
 * __useCompleteTagMutation__
 *
 * To run a mutation, you first call `useCompleteTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCompleteTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [completeTagMutation, { data, loading, error }] = useCompleteTagMutation({
 *   variables: {
 *      tag: // value for 'tag'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCompleteTagMutation(baseOptions?: Apollo.MutationHookOptions<CompleteTagMutation, CompleteTagMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CompleteTagMutation, CompleteTagMutationVariables>(CompleteTagDocument, options);
      }
export type CompleteTagMutationHookResult = ReturnType<typeof useCompleteTagMutation>;
export type CompleteTagMutationResult = Apollo.MutationResult<CompleteTagMutation>;
export type CompleteTagMutationOptions = Apollo.BaseMutationOptions<CompleteTagMutation, CompleteTagMutationVariables>;
export const SaveVideoFieldDocument = gql`
    mutation saveVideoField($tag: ID!, $field: String!, $index: Int!) {
  saveVideoField(tag: $tag, field: $field, index: $index) {
    _id
    uploadURL
  }
}
    `;
export type SaveVideoFieldMutationFn = Apollo.MutationFunction<SaveVideoFieldMutation, SaveVideoFieldMutationVariables>;

/**
 * __useSaveVideoFieldMutation__
 *
 * To run a mutation, you first call `useSaveVideoFieldMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveVideoFieldMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveVideoFieldMutation, { data, loading, error }] = useSaveVideoFieldMutation({
 *   variables: {
 *      tag: // value for 'tag'
 *      field: // value for 'field'
 *      index: // value for 'index'
 *   },
 * });
 */
export function useSaveVideoFieldMutation(baseOptions?: Apollo.MutationHookOptions<SaveVideoFieldMutation, SaveVideoFieldMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SaveVideoFieldMutation, SaveVideoFieldMutationVariables>(SaveVideoFieldDocument, options);
      }
export type SaveVideoFieldMutationHookResult = ReturnType<typeof useSaveVideoFieldMutation>;
export type SaveVideoFieldMutationResult = Apollo.MutationResult<SaveVideoFieldMutation>;
export type SaveVideoFieldMutationOptions = Apollo.BaseMutationOptions<SaveVideoFieldMutation, SaveVideoFieldMutationVariables>;
export const GetTagsDocument = gql`
    query getTags($study: ID!, $page: Int, $pageSize: Int) {
  getTags(study: $study, page: $page, pageSize: $pageSize) {
    _id
    entry {
      _id
      organization
      entryID
      contentType
      creator
      dateCreated
      meta
      signedUrl
      signedUrlExpiration
      isTraining
    }
    data {
      type
      name
      field {
        __typename
        ... on AslLexField {
          lexiconEntry {
            key
            primary
            video
            lexicon
            associates
            fields
          }
        }
        ... on VideoField {
          entries {
            _id
            organization
            entryID
            contentType
            creator
            dateCreated
            meta
            signedUrl
            signedUrlExpiration
            isTraining
          }
        }
        ... on BooleanField {
          boolValue: value
        }
        ... on FreeTextField {
          textValue: value
        }
        ... on NumericField {
          numericValue: value
        }
        ... on SliderField {
          sliderValue: value
        }
      }
    }
    complete
  }
}
    `;

/**
 * __useGetTagsQuery__
 *
 * To run a query within a React component, call `useGetTagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTagsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTagsQuery({
 *   variables: {
 *      study: // value for 'study'
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *   },
 * });
 */
export function useGetTagsQuery(baseOptions: Apollo.QueryHookOptions<GetTagsQuery, GetTagsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTagsQuery, GetTagsQueryVariables>(GetTagsDocument, options);
      }
export function useGetTagsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTagsQuery, GetTagsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTagsQuery, GetTagsQueryVariables>(GetTagsDocument, options);
        }
export type GetTagsQueryHookResult = ReturnType<typeof useGetTagsQuery>;
export type GetTagsLazyQueryHookResult = ReturnType<typeof useGetTagsLazyQuery>;
export type GetTagsQueryResult = Apollo.QueryResult<GetTagsQuery, GetTagsQueryVariables>;
export const CountTagForStudyDocument = gql`
    query countTagForStudy($study: ID!) {
  countTagForStudy(study: $study)
}
    `;

/**
 * __useCountTagForStudyQuery__
 *
 * To run a query within a React component, call `useCountTagForStudyQuery` and pass it any options that fit your needs.
 * When your component renders, `useCountTagForStudyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCountTagForStudyQuery({
 *   variables: {
 *      study: // value for 'study'
 *   },
 * });
 */
export function useCountTagForStudyQuery(baseOptions: Apollo.QueryHookOptions<CountTagForStudyQuery, CountTagForStudyQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CountTagForStudyQuery, CountTagForStudyQueryVariables>(CountTagForStudyDocument, options);
      }
export function useCountTagForStudyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CountTagForStudyQuery, CountTagForStudyQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CountTagForStudyQuery, CountTagForStudyQueryVariables>(CountTagForStudyDocument, options);
        }
export type CountTagForStudyQueryHookResult = ReturnType<typeof useCountTagForStudyQuery>;
export type CountTagForStudyLazyQueryHookResult = ReturnType<typeof useCountTagForStudyLazyQuery>;
export type CountTagForStudyQueryResult = Apollo.QueryResult<CountTagForStudyQuery, CountTagForStudyQueryVariables>;
export const CountTrainingTagForStudyDocument = gql`
    query countTrainingTagForStudy($study: ID!, $user: String!) {
  countTrainingTagForStudy(study: $study, user: $user)
}
    `;

/**
 * __useCountTrainingTagForStudyQuery__
 *
 * To run a query within a React component, call `useCountTrainingTagForStudyQuery` and pass it any options that fit your needs.
 * When your component renders, `useCountTrainingTagForStudyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCountTrainingTagForStudyQuery({
 *   variables: {
 *      study: // value for 'study'
 *      user: // value for 'user'
 *   },
 * });
 */
export function useCountTrainingTagForStudyQuery(baseOptions: Apollo.QueryHookOptions<CountTrainingTagForStudyQuery, CountTrainingTagForStudyQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CountTrainingTagForStudyQuery, CountTrainingTagForStudyQueryVariables>(CountTrainingTagForStudyDocument, options);
      }
export function useCountTrainingTagForStudyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CountTrainingTagForStudyQuery, CountTrainingTagForStudyQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CountTrainingTagForStudyQuery, CountTrainingTagForStudyQueryVariables>(CountTrainingTagForStudyDocument, options);
        }
export type CountTrainingTagForStudyQueryHookResult = ReturnType<typeof useCountTrainingTagForStudyQuery>;
export type CountTrainingTagForStudyLazyQueryHookResult = ReturnType<typeof useCountTrainingTagForStudyLazyQuery>;
export type CountTrainingTagForStudyQueryResult = Apollo.QueryResult<CountTrainingTagForStudyQuery, CountTrainingTagForStudyQueryVariables>;
export const GetTrainingTagsDocument = gql`
    query getTrainingTags($study: ID!, $user: String!, $page: Int, $pageSize: Int) {
  getTrainingTags(study: $study, user: $user, page: $page, pageSize: $pageSize) {
    _id
    entry {
      _id
      organization
      entryID
      contentType
      creator
      dateCreated
      meta
      signedUrl
      signedUrlExpiration
      isTraining
    }
    data {
      type
      name
      field {
        __typename
        ... on AslLexField {
          lexiconEntry {
            key
            primary
            video
            lexicon
            associates
            fields
          }
        }
        ... on VideoField {
          entries {
            _id
            organization
            entryID
            contentType
            creator
            dateCreated
            meta
            signedUrl
            signedUrlExpiration
            isTraining
          }
        }
        ... on BooleanField {
          boolValue: value
        }
        ... on FreeTextField {
          textValue: value
        }
        ... on NumericField {
          numericValue: value
        }
        ... on SliderField {
          sliderValue: value
        }
      }
    }
    complete
  }
}
    `;

/**
 * __useGetTrainingTagsQuery__
 *
 * To run a query within a React component, call `useGetTrainingTagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTrainingTagsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTrainingTagsQuery({
 *   variables: {
 *      study: // value for 'study'
 *      user: // value for 'user'
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *   },
 * });
 */
export function useGetTrainingTagsQuery(baseOptions: Apollo.QueryHookOptions<GetTrainingTagsQuery, GetTrainingTagsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTrainingTagsQuery, GetTrainingTagsQueryVariables>(GetTrainingTagsDocument, options);
      }
export function useGetTrainingTagsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTrainingTagsQuery, GetTrainingTagsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTrainingTagsQuery, GetTrainingTagsQueryVariables>(GetTrainingTagsDocument, options);
        }
export type GetTrainingTagsQueryHookResult = ReturnType<typeof useGetTrainingTagsQuery>;
export type GetTrainingTagsLazyQueryHookResult = ReturnType<typeof useGetTrainingTagsLazyQuery>;
export type GetTrainingTagsQueryResult = Apollo.QueryResult<GetTrainingTagsQuery, GetTrainingTagsQueryVariables>;
export const GetCatchTrialsDocument = gql`
    query getCatchTrials($study: ID!) {
  getCatchTrials(study: $study) {
    _id
    entry {
      _id
      organization
      entryID
      contentType
      creator
      dateCreated
      meta
      signedUrl
      signedUrlExpiration
    }
    data
    complete
    isCatchTrial
  }
}
    `;

/**
 * __useGetCatchTrialsQuery__
 *
 * To run a query within a React component, call `useGetCatchTrialsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCatchTrialsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCatchTrialsQuery({
 *   variables: {
 *      study: // value for 'study'
 *   },
 * });
 */
export function useGetCatchTrialsQuery(baseOptions: Apollo.QueryHookOptions<GetCatchTrialsQuery, GetCatchTrialsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCatchTrialsQuery, GetCatchTrialsQueryVariables>(GetCatchTrialsDocument, options);
      }
export function useGetCatchTrialsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCatchTrialsQuery, GetCatchTrialsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCatchTrialsQuery, GetCatchTrialsQueryVariables>(GetCatchTrialsDocument, options);
        }
export type GetCatchTrialsQueryHookResult = ReturnType<typeof useGetCatchTrialsQuery>;
export type GetCatchTrialsLazyQueryHookResult = ReturnType<typeof useGetCatchTrialsLazyQuery>;
export type GetCatchTrialsQueryResult = Apollo.QueryResult<GetCatchTrialsQuery, GetCatchTrialsQueryVariables>;