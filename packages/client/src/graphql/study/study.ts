/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type FindStudiesQueryVariables = Types.Exact<{
  project: Types.Scalars['ID']['input'];
}>;


export type FindStudiesQuery = { __typename?: 'Query', findStudies: Array<{ __typename?: 'Study', _id: string, name: string, description: string, instructions: string, project: string, tagsPerEntry: number, tagSchema: { __typename?: 'TagSchema', dataSchema: any, uiSchema: any }, studyConfig?: { __typename?: 'StudyConfig', disableSameUserEntryTagging?: boolean | null, sortByEntryID?: boolean | null, disableClear?: boolean | null } | null }> };

export type DeleteStudyMutationVariables = Types.Exact<{
  study: Types.Scalars['ID']['input'];
}>;


export type DeleteStudyMutation = { __typename?: 'Mutation', deleteStudy: boolean };

export type CreateStudyMutationVariables = Types.Exact<{
  study: Types.StudyCreate;
}>;


export type CreateStudyMutation = { __typename?: 'Mutation', createStudy: { __typename?: 'Study', _id: string, name: string, description: string, instructions: string, project: string, tagsPerEntry: number, tagSchema: { __typename?: 'TagSchema', dataSchema: any, uiSchema: any } } };

export type StudyExistsQueryVariables = Types.Exact<{
  name: Types.Scalars['String']['input'];
  project: Types.Scalars['ID']['input'];
}>;


export type StudyExistsQuery = { __typename?: 'Query', studyExists: boolean };

export type GetStudyDownloadsQueryVariables = Types.Exact<{
  study: Types.Scalars['ID']['input'];
}>;


export type GetStudyDownloadsQuery = { __typename?: 'Query', getStudyDownloads: Array<{ __typename?: 'StudyDownloadRequest', _id: string, date: any, status: string, entryZip: string, tagCSV: string, taggedEntries: string, userCSV?: string | null, study: { __typename?: 'Study', _id: string, name: string, description: string, instructions: string, project: string, tagsPerEntry: number, tagSchema: { __typename?: 'TagSchema', dataSchema: any, uiSchema: any } } }> };

export type CreateStudyDownloadMutationVariables = Types.Exact<{
  downloadRequest: Types.CreateStudyDownloadRequest;
  textOnly: Types.Scalars['Boolean']['input'];
}>;


export type CreateStudyDownloadMutation = { __typename?: 'Mutation', createStudyDownload: { __typename?: 'StudyDownloadRequest', _id: string, status: string, date: any } };


export const FindStudiesDocument = gql`
    query findStudies($project: ID!) {
  findStudies(project: $project) {
    _id
    name
    description
    instructions
    project
    tagsPerEntry
    tagSchema {
      dataSchema
      uiSchema
    }
    studyConfig {
      disableSameUserEntryTagging
      sortByEntryID
      disableClear
    }
  }
}
    `;

/**
 * __useFindStudiesQuery__
 *
 * To run a query within a React component, call `useFindStudiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindStudiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindStudiesQuery({
 *   variables: {
 *      project: // value for 'project'
 *   },
 * });
 */
export function useFindStudiesQuery(baseOptions: Apollo.QueryHookOptions<FindStudiesQuery, FindStudiesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindStudiesQuery, FindStudiesQueryVariables>(FindStudiesDocument, options);
      }
export function useFindStudiesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindStudiesQuery, FindStudiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindStudiesQuery, FindStudiesQueryVariables>(FindStudiesDocument, options);
        }
export type FindStudiesQueryHookResult = ReturnType<typeof useFindStudiesQuery>;
export type FindStudiesLazyQueryHookResult = ReturnType<typeof useFindStudiesLazyQuery>;
export type FindStudiesQueryResult = Apollo.QueryResult<FindStudiesQuery, FindStudiesQueryVariables>;
export const DeleteStudyDocument = gql`
    mutation deleteStudy($study: ID!) {
  deleteStudy(study: $study)
}
    `;
export type DeleteStudyMutationFn = Apollo.MutationFunction<DeleteStudyMutation, DeleteStudyMutationVariables>;

/**
 * __useDeleteStudyMutation__
 *
 * To run a mutation, you first call `useDeleteStudyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteStudyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteStudyMutation, { data, loading, error }] = useDeleteStudyMutation({
 *   variables: {
 *      study: // value for 'study'
 *   },
 * });
 */
export function useDeleteStudyMutation(baseOptions?: Apollo.MutationHookOptions<DeleteStudyMutation, DeleteStudyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteStudyMutation, DeleteStudyMutationVariables>(DeleteStudyDocument, options);
      }
export type DeleteStudyMutationHookResult = ReturnType<typeof useDeleteStudyMutation>;
export type DeleteStudyMutationResult = Apollo.MutationResult<DeleteStudyMutation>;
export type DeleteStudyMutationOptions = Apollo.BaseMutationOptions<DeleteStudyMutation, DeleteStudyMutationVariables>;
export const CreateStudyDocument = gql`
    mutation createStudy($study: StudyCreate!) {
  createStudy(study: $study) {
    _id
    name
    description
    instructions
    project
    tagsPerEntry
    tagSchema {
      dataSchema
      uiSchema
    }
  }
}
    `;
export type CreateStudyMutationFn = Apollo.MutationFunction<CreateStudyMutation, CreateStudyMutationVariables>;

/**
 * __useCreateStudyMutation__
 *
 * To run a mutation, you first call `useCreateStudyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateStudyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createStudyMutation, { data, loading, error }] = useCreateStudyMutation({
 *   variables: {
 *      study: // value for 'study'
 *   },
 * });
 */
export function useCreateStudyMutation(baseOptions?: Apollo.MutationHookOptions<CreateStudyMutation, CreateStudyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateStudyMutation, CreateStudyMutationVariables>(CreateStudyDocument, options);
      }
export type CreateStudyMutationHookResult = ReturnType<typeof useCreateStudyMutation>;
export type CreateStudyMutationResult = Apollo.MutationResult<CreateStudyMutation>;
export type CreateStudyMutationOptions = Apollo.BaseMutationOptions<CreateStudyMutation, CreateStudyMutationVariables>;
export const StudyExistsDocument = gql`
    query studyExists($name: String!, $project: ID!) {
  studyExists(name: $name, project: $project)
}
    `;

/**
 * __useStudyExistsQuery__
 *
 * To run a query within a React component, call `useStudyExistsQuery` and pass it any options that fit your needs.
 * When your component renders, `useStudyExistsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStudyExistsQuery({
 *   variables: {
 *      name: // value for 'name'
 *      project: // value for 'project'
 *   },
 * });
 */
export function useStudyExistsQuery(baseOptions: Apollo.QueryHookOptions<StudyExistsQuery, StudyExistsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StudyExistsQuery, StudyExistsQueryVariables>(StudyExistsDocument, options);
      }
export function useStudyExistsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StudyExistsQuery, StudyExistsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StudyExistsQuery, StudyExistsQueryVariables>(StudyExistsDocument, options);
        }
export type StudyExistsQueryHookResult = ReturnType<typeof useStudyExistsQuery>;
export type StudyExistsLazyQueryHookResult = ReturnType<typeof useStudyExistsLazyQuery>;
export type StudyExistsQueryResult = Apollo.QueryResult<StudyExistsQuery, StudyExistsQueryVariables>;
export const GetStudyDownloadsDocument = gql`
    query getStudyDownloads($study: ID!) {
  getStudyDownloads(study: $study) {
    _id
    date
    status
    entryZip
    tagCSV
    taggedEntries
    userCSV
    study {
      _id
      name
      description
      instructions
      project
      tagsPerEntry
      tagSchema {
        dataSchema
        uiSchema
      }
    }
  }
}
    `;

/**
 * __useGetStudyDownloadsQuery__
 *
 * To run a query within a React component, call `useGetStudyDownloadsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStudyDownloadsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStudyDownloadsQuery({
 *   variables: {
 *      study: // value for 'study'
 *   },
 * });
 */
export function useGetStudyDownloadsQuery(baseOptions: Apollo.QueryHookOptions<GetStudyDownloadsQuery, GetStudyDownloadsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStudyDownloadsQuery, GetStudyDownloadsQueryVariables>(GetStudyDownloadsDocument, options);
      }
export function useGetStudyDownloadsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStudyDownloadsQuery, GetStudyDownloadsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStudyDownloadsQuery, GetStudyDownloadsQueryVariables>(GetStudyDownloadsDocument, options);
        }
export type GetStudyDownloadsQueryHookResult = ReturnType<typeof useGetStudyDownloadsQuery>;
export type GetStudyDownloadsLazyQueryHookResult = ReturnType<typeof useGetStudyDownloadsLazyQuery>;
export type GetStudyDownloadsQueryResult = Apollo.QueryResult<GetStudyDownloadsQuery, GetStudyDownloadsQueryVariables>;
export const CreateStudyDownloadDocument = gql`
    mutation createStudyDownload($downloadRequest: CreateStudyDownloadRequest!, $textOnly: Boolean!) {
  createStudyDownload(downloadRequest: $downloadRequest, textOnly: $textOnly) {
    _id
    status
    date
  }
}
    `;
export type CreateStudyDownloadMutationFn = Apollo.MutationFunction<CreateStudyDownloadMutation, CreateStudyDownloadMutationVariables>;

/**
 * __useCreateStudyDownloadMutation__
 *
 * To run a mutation, you first call `useCreateStudyDownloadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateStudyDownloadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createStudyDownloadMutation, { data, loading, error }] = useCreateStudyDownloadMutation({
 *   variables: {
 *      downloadRequest: // value for 'downloadRequest'
 *      textOnly: // value for 'textOnly'
 *   },
 * });
 */
export function useCreateStudyDownloadMutation(baseOptions?: Apollo.MutationHookOptions<CreateStudyDownloadMutation, CreateStudyDownloadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateStudyDownloadMutation, CreateStudyDownloadMutationVariables>(CreateStudyDownloadDocument, options);
      }
export type CreateStudyDownloadMutationHookResult = ReturnType<typeof useCreateStudyDownloadMutation>;
export type CreateStudyDownloadMutationResult = Apollo.MutationResult<CreateStudyDownloadMutation>;
export type CreateStudyDownloadMutationOptions = Apollo.BaseMutationOptions<CreateStudyDownloadMutation, CreateStudyDownloadMutationVariables>;