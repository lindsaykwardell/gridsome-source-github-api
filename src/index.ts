// @ts-ignore
import fetcher from "graphql-fetch";

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
    }`
  };

  private url = "https://api.github.com/graphql";

  constructor(api: any, options: DefaultOptions) {
    const { token, variables, graphQLQuery } = {
      ...this.defaultOptions,
      ...options
    };

    if (!token) throw new Error("Missing GitHub API token!");

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
  ) => {
    const fetch = fetcher(this.url);
    return this.fetchJSON(fetch, token, graphQLQuery, variables);
  };

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
      mode: "cors"
    });
  };
}

export = GitHubSource