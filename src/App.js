import github from "./db";
import query from "./query";
import { useCallback, useEffect, useState } from "react";
import RepoInfo from "./RepoInfo.js";
import SearchBox from "./SearchBox.js";
import NavButtons from "./NavButtons.js";

function App() {
  // Allows to retrieve elements from the state
  let [ userName, setUserName ] = useState("");
  let [ repoList, setRepoList ] = useState(null);
  let [ pageCount, setPageCount ] = useState(10);
  let [ queryString, setQueryString ] = useState(""); 
  let [ totalCount, setTotalCount ] = useState(null); 
  
  let [ startCursor, setStartCoursor ] = useState(null);
  let [ endCursor, setEndCoursor ] = useState(null);
  let [ hasPreviousPage, setHasPreviousPage ] = useState(false);
  let [ hasNextPage, setHasNextPage ] = useState(true);
  let [ paginationKeyword, setPaginationKeyword ] = useState("first");
  let [ paginationString, setPaginationString ] = useState("");

  
  const fetchData = useCallback(() => {
    const queryObject = query(pageCount, queryString, paginationKeyword, paginationString);
    console.log('Query', queryObject);

    const body = JSON.stringify(queryObject);

    fetch(github.baseURL, {
      method: "POST",
      headers: github.headers,
      body,
    })
    .then(response => response.json())
    .then(data => {
      const viewer = data.data.viewer;
      const repos = data.data.search.edges;
      const total = data.data.search.repositoryCount;
      const start = data.data.search.pageInfo?.startCursor;
      const end = data.data.search.pageInfo?.endCursor; 
      const next = data.data.search.pageInfo?.hasNextPage
      const prev = data.data.search.pageInfo?.hasPreviousPage;
      
      setUserName(viewer.name);
      setRepoList(repos);
      setTotalCount(total);

      setStartCoursor(start);
      setEndCoursor(end);
      setHasNextPage(next);
      setHasPreviousPage(prev);
    }).catch(err => {
      console.error('Error', err);
    });
  }, [pageCount, queryString, paginationKeyword, paginationString]);

  // Load the data when needed in the application.
  // React Hook, side effect in function components.
  // Called twice using useEffect
  useEffect(() => {
    fetchData();
  }, [fetchData]);


  return (
    <div className="App container mt-5">
      <h1 className="text-primary">
        <i className="bi bi-diagram-2-fill"></i> Repos
      </h1>
      <p>Hey there {userName}</p>
      <SearchBox 
        totalCount={totalCount}
        pageCount={pageCount}
        queryString={queryString}
        onQueryChange={(myString) => { 
          setQueryString(myString);
        }}
        onTotalChange={(newTotal) => { 
          setPageCount(newTotal);
        }}
      />
      <NavButtons
        start={startCursor}
        end={endCursor}
        next={hasNextPage}
        previous={hasPreviousPage}
        onPage={(myKeyword, myString) => {
          setPaginationKeyword(myKeyword);
          setPaginationString(myString);
        }}
      ></NavButtons>
      {
        repoList && (
          <ul className="list-group list-group-flush">
            {
              repoList.map((repo) => (
                <RepoInfo key={repo.node.id} repo={repo.node}></RepoInfo>
              ))
            }
          </ul>
        )
      }
     <NavButtons
        start={startCursor}
        end={endCursor}
        next={hasNextPage}
        previous={hasPreviousPage}
        onPage={(myKeyword, myString) => {
          setPaginationKeyword(myKeyword);
          setPaginationString(myString);
        }}
      ></NavButtons> 
    </div>
  );
}
export default App;
