export default function Library() {
  const _novels = [{ id: 0, title: "title1", language: "language1" }];
  return (
    <div>
      <ul>
        {_novels.map(({ id, title, language }) => {
          return (
            <li>
              <div>{id}</div>
              <div>{title}</div>
              <div>{language}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
