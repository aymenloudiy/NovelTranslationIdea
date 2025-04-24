export default function Terms() {
  const _terms = [
    { novelId: "id1", term: "term1", translation: "translation1" },
    { novelId: "id2", term: "term2", translation: "translation2" },
    { novelId: "id3", term: "term3", translation: "translation3" },
    { novelId: "id4", term: "term4", translation: "translation4" },
    { novelId: "id5", term: "term5", translation: "translation5" },
    { novelId: "id6", term: "term6", translation: "translation6" },
    { novelId: "id7", term: "term7", translation: "translation7" },
    { novelId: "id8", term: "term8", translation: "translation8" },
  ];
  return (
    <>
      <div>
        <ul>
          {_terms.map(({ novelId, term, translation }) => (
            <li key={novelId}>
              <div>{term}</div>
              <div>{translation}</div>
              <div></div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
