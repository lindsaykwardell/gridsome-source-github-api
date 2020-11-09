import 'isomorphic-fetch'

const gql = async (
  url: string,
  query: string,
  variables: { [key: string]: any },
  options: { [key: string]: any }
) => {
  const res = await fetch(url, {
    ...options,
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!res.ok) throw new Error(await res.json());

  const body = await res.json();

  if (body.errors) throw new Error(JSON.stringify(body.errors));

  return body;
};

const url = "https://api.github.com/graphql";

const fetchFromGitHub = (
  token: string,
  graphQLQuery: string,
  variables: { [key: string]: any }
) => {
  return gql(url, graphQLQuery, variables, {
    method: "POST",
    mode: "cors",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

type DefaultOptions = {
  token: string;
  variables: { [key: string]: any };
  graphQLQuery: string;
};

class GitHubSource {
  private defaultOptions: DefaultOptions = {
    token: null,
    variables: {},
    graphQLQuery: `query ($nFirst: Int = 2, $q: String = "") {
      search(query: $q, type: ISSUE, first: $nFirst){
        edges{
          node{
            ... on PullRequest{
              title
            }
          }
        }
      }
    }`,
  };

  private url = "https://api.github.com/graphql";

  constructor(api: any, options: DefaultOptions) {
    const { token, variables, graphQLQuery } = {
      ...this.defaultOptions,
      ...options,
    };

    if (!token) throw new Error("Missing GitHub API token!");
    if (graphQLQuery.trim().indexOf("query") !== 0)
      throw new Error("GitHub API queries must be wrapped in `query{}`.");

    api.loadSource(async (actions: any) => {
      const { data } = await this.fetchFromGitHub(
        token,
        graphQLQuery,
        variables
      );

      actions.addMetadata("githubData", data);
    });
  }

  fetchFromGitHub = (
    token: string,
    graphQLQuery: string,
    variables: { [key: string]: any }
  ) => fetchFromGitHub(token, graphQLQuery, variables);

  fetchJSON = async (
    fetch: any,
    token: string,
    query: string,
    variables: { [key: string]: any }
  ) => {
    const headers = new Headers();
    headers.set("Authorization", `Bearer ${token}`);
    return await fetch(query, variables, {
      headers,
      method: "POST",
      mode: "cors",
    });
  };
}

export = GitHubSource;
