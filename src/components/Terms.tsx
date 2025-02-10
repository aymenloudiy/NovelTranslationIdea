export default function Terms() {
  const _terms = {
    term1: "translation1",
    term2: "translation2",
    term3: "translation3",
    term4: "translation4",
    term5: "translation5",
    term6: "translation6",
    term7: "translation7",
    term8: "translation8",
  };

  return (
    <>
      <div>
        <ul>
          {Object.entries(_terms).map(([key, value]) => (
            <li key={key}>
              <div>{key}</div>
              <div>{value}</div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
