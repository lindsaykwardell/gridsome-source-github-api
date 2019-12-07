# gridsome-source-github-api

Source plugin for pulling data into Gridsome from the official GitHub v4 [GraphQL API](https://developer.github.com/v4/). 

Based on [gatsby-source-github-api](https://github.com/ldd/gatsby-source-github-api).

## Install

`npm i gridsome-source-github-api`

## How to use

Follow GitHub's guide [how to generate a token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/).

Once you are done, either create a `gridsome-config.js` file or open the one you already have.

In there, you want to add this plugin and at least add the token in the options object:

```javascript
// In your gridsome-config.js
plugins: [
  {
    use: `gridsome-source-github-api`,
    options: {
      // token: required by the GitHub API
      token: someString,

      // GraphQLquery: defaults to a search query
      graphQLQuery: anotherString,

      // variables: defaults to variables needed for a search query
      variables: someObject
    }
  }
];
```

## Examples

**Search query:**

```javascript
// In your gridsome-config.js
plugins: [
  {
    use: `gridsome-source-github-api`,
    options: {
      token: "hunter2",
      variables: {
        q: "author:lindsaykwardell state:closed type:pr sort:comments",
        nFirst: 2
      }
    }
  }
];
```

resulting API call:

```graphql
  query ($nFirst: Int, $q: String) {
    search(query: "${q}", type: ISSUE, first: ${nFirst}){
      edges{
        node{
          ... on PullRequest{
            title
          }
        }
      }
    }
  }
```

**Custom GraphQL query:**

```javascript
// In your gridsome-config.js
plugins: [
  {
    resolve: `gridsome-source-github-api`,
    options: {
      token: "hunter2",
      variables: {},
      graphQLQuery: `
        query {
          repository(owner:"torvalds",name:"linux"){
            description
          }
        }
        `
    }
  }
];
```

resulting API call:

```graphql
query {
  repository(owner: "torvalds", name: "linux") {
    description
  }
}
```

The data fetched from this plugin is added to your GraphQL metadata under githubData. For example:

```graphql
query {
  metadata {
    githubData{
      user {
        name
      }
    }
  }
}
```

## Tips and Tricks

You'll probably want to use valid GraphQL queries. To help you, GitHub has a [Query Explorer](https://developer.github.com/v4/explorer/) with auto-completion.

![Query Explorer](https://user-images.githubusercontent.com/1187476/30273078-69695a10-96c5-11e7-90b8-7dc876cc214a.png)

## Changelog

- `v0.1.0` Initial fork of `gatsby-source-github-api`
