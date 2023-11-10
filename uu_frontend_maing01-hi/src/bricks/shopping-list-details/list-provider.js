//@@viewOn:imports
import { createComponent, Utils } from "uu5g05";
import Config from "./config/config";
//@@viewOff:imports

let shoppingList = [
  {
    id: Utils.String.generateId(),
    name: "Shopping list 1",
    text: "nákupní seznam číslo jedna",
    averageRating: 4,
    uuIdentityName: "Jana",
    sys: { cts: "2022-03-17T09:48:38.990Z" },
  },
  {
    id: Utils.String.generateId(),
    name: "Shopping list 2",
    text: "nákupný seznam číslo dva",
    averageRating: 3,
    uuIdentityName: "Michal",
    sys: { cts: "2022-02-14T10:48:38.990Z" },
  },
  {
    id: Utils.String.generateId(),
    name: "Shopping list 3",
    text: "nákupný seznam číslo tři",
    averageRating: 1,
    uuIdentityName: "Jana",
    sys: { cts: "2021-02-14T10:48:38.990Z" },
  },
];

const ListProvider = createComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ListProvider",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    function remove(shoppingList) {
      shoppingList = shoppingList.filter((item) => item.id !== shoppingList.id);
    }

    function update() {
      throw new Error("shopping list update is not implemented yet.");
    }
    //@@viewOff:private

    //@@viewOn:render
    const value = { shoppingList, remove, update };
    return typeof props.children === "function" ? props.children(value) : props.children;
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ListProvider };
export default ListProvider;
//@@viewOff:exports