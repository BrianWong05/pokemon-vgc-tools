import Item from "./Item";

function ItemList ({gens, onData}) {
  const items = Array.from(gens.get(9).items);
  console.log(Array.from(gens.get(9).items));

  return (
    <div className="bg-[#24283B]">
      <h2 className="text-3xl text-center text-gray-200 h-25 pt-10">Items</h2>
      <div className="flex flex-wrap justify-center">
        {items.map((item) => {
          return <Item key={item.num} item={item} onData={onData} />
        })}
      </div>
    </div>
  )
}

export default ItemList