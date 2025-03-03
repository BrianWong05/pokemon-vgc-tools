import TypeTag from "@/components/TypeTag";

function TypeDefense({ typeDefense, times }) {
  return (
    <div className="flex sm:justify-center">
      {Object.values(typeDefense).includes(times) && (
        <div className="flex flex-col px-5 py-1">
          <div className="py-1">{times}x damage</div>
          <div className="flex gap-3 w-full sm:w-110 flex-wrap">
            {Object.keys(typeDefense)
              .filter((key) => typeDefense[key] === times)
              .map((type) => {
                return <TypeTag type={type} />;
              })}
          </div>
        </div>
      )}
    </div>
  );
}

export default TypeDefense;
