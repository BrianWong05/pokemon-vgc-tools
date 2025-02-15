import { icons } from "../assets/icons";
import physical from "../assets/images/Physical_SV_icon.png"
import special from "../assets/images/Special_SV_icon.png"
import status from "../assets/images/Status_SV_icon.png"

const categoryIcons = {
  physical: physical,
  special: special,
  status: status,
};

function Move({move}) {

  const props = ["contact", "heal", "power", "bite", "bullet", "slicing", "wind", "dance", "pulse", "sound", "punch"];
  const flags = Object.keys(move.flags);
  const moveProp = flags.filter((item) =>
    props.some((prop) => item.toLowerCase().includes(prop))
  );
  
  const type = move.type.toLocaleLowerCase();
  const category = move.category.toLocaleLowerCase();
  const basePower = (move.basePower ? move.basePower : '-');
  const accuracy = (move.accuracy===true ? '-' : move.accuracy);
  const priority = (move.priority ? (move.priority > 0 ? `+${move.priority}` : move.priority) : '-');
  const icon = icons[type];
  const categoryIcon = categoryIcons[category];
  console.log(move);
  

  return (
    <>
    <div>
      <div className={`text-gray-200 flex w-xl`}>
        <div className="block pl-5 py-5 justify-between w-full">
          <div className="flex justify-between">
            <img src={categoryIcon} className="h-9" />
            <div className="text-2xl my-auto">{move.name}</div>
            <img src={icon} className="h-9" /> 
          </div>
          <div className="text-sm">target: {move.target}</div>
          {moveProp.map((prop) => {
            return <div className="text-sm">{prop} </div>
          })}
          <div className="text-sm text-justify">{move.desc}</div>
        </div>
        <div className="h-50 w-30 content-center">
          <div className="text-center">
            <div className="text-xl">
              {basePower}
            </div>
            <div className="text-xs">
              Power
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl">
              {accuracy}
            </div>
            <div className="text-xs">
              Accurcay
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl">
              {priority}
            </div>
            <div className="text-xs">
              Priority
            </div>
          </div>
        </div>
      </div>
      <hr className="w-xl border-gray-700" />
      </div>
    </>
  )

};

export default Move