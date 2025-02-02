const githubQuery = (
    pageCount,
    queryString,
    paginationKeyword,
    paginationString,
) => {
    return {
        query: `
            {
                viewer {
                    name
                }
                search(query: "${queryString} user:gvazq82 sort:updated-desc", type: REPOSITORY, ${paginationKeyword}: ${pageCount}, ${paginationString}) {
                    repositoryCount
                    edges {
                        cursor
                        node {
                            ... on Repository {
                                name
                                description
                                id
                                url
                                licenseInfo {
                                    spdxId
                                }
                            }
                        }
                    }
                    pageInfo {
                        startCursor
                        endCursor
                        hasNextPage
                        hasPreviousPage
                    }
                }
            }
        `
    };
};

export default githubQuery;