function Item ({item, onData}) {
  
  const name = item.name;

  const selectedItem = () => {
    if(onData) {
      onData(item)
    }
  }

  return (
    <div onClick={selectedItem}>
      <div className={`text-gray-200 flex w-xl`}>
        <div className="text-2xl my-auto">
          {name}
        </div>
      </div>
      <hr className="w-xl border-gray-700" />
    </div>
  )
}

export default Item