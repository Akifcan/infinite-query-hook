import usePagination from "../hooks/pagination.hook";

const Posts = () => {
  const {
    data,
    isError,
    isFetcing,
    isPending,
    isQueryUp,
    hasData,
    handleFetchNextPage,
    refetch,
  } = usePagination<PostProps>({
    url: '/posts',
    pageIncrement: () => +20,
    enabled: true,
    useScrolltoEnd: false,
    initialPage: 0,
    params: { _limit: "20" },
  });

  if (!isQueryUp) {
    return <button onClick={refetch}>Get your posts</button>;
  }

  if (isPending) {
    return <h1>Please wait</h1>;
  }

  if (isError || !data) {
    return <h1>Unexcepted error occured</h1>;
  }

  return (
    <>
      <ul>
        {data.map((item) => {
          return (
            <li key={item.id}>
              <b>{item.id}</b> {item.title}
            </li>
          );
        })}
      </ul>
      {isFetcing && <p>Loading your posts...</p>}
      {hasData ? (
        <button disabled={isFetcing} onClick={handleFetchNextPage}>
          {isFetcing ? "Please wait..." : "Load More"}
        </button>
      ) : (
        <p style={{marginBlockStart: 10}}>Reached end of the page</p>
      )}
    </>
  );
};

export default Posts;
