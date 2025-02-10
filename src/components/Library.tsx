export default function Library() {
  const _novels = [
    { id: 1, title: "title1", language: "language1" },
    { id: 2, title: "title2", language: "language2" },
    { id: 3, title: "title3", language: "language3" },
    { id: 4, title: "title4", language: "language4" },
    { id: 5, title: "title5", language: "language5" },
    { id: 6, title: "title6", language: "language6" },
    { id: 7, title: "title7", language: "language7" },
    { id: 8, title: "title8", language: "language8" },
  ];
  return (
    <div>
      <ul>
        {_novels.map(({ id, title, language }) => {
          return (
            <li key={id}>
              <div>{title}</div>
              <div>{language}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
