//@@viewOn:imports
import { createComponent, Utils, useState } from "uu5g05";
import Config from "./config/config";
//@@viewOff:imports

const initialShoppingList = [
  {
    id: Utils.String.generateId(),
    name: "nákupní seznam číslo 1",
    text: "víkend",
    averageRating: 4,
    uuIdentityName: "Vlastník: Angelina",
    sys: { cts: "2022-03-17T09:48:38.990Z" },
  },
  {
    id: Utils.String.generateId(),
    name: "nákupní seznam číslo 2",
    text: "řeznictví",
    averageRating: 3,
    uuIdentityName: "Vlastník: Honza",
    sys: { cts: "2022-02-14T10:48:38.990Z" },
  },
  {
    id: Utils.String.generateId(),
    name: "nákupní seznam číslo 3",
    text: "vánoce",
    averageRating: 1,
    uuIdentityName: "Vlastník: Angelina",
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
    const [ShoppingList, setShoppingList] = useState(initialShoppingList);

    function remove(setShoppingList) {
      setShoppingList((prevShoppingList) => prevShoppingList.filter((item) => item.id !== ShoppingList.id));
    }

    function create(values) {
      const ShoppingList = {
        ...values,
        id: Utils.String.generateId(),
        averageRating: Math.round(Math.random() * 5), // <0, 5>
        uuIdentityName: "Vlastník: ",
        sys: {
          cts: new Date().toISOString(),
        },
      };

      setShoppingList((prevShoppingList) => [...prevShoppingList, ShoppingList]);
      return ShoppingList;
    }

    function update() {
      throw new Error("Shopping list update is not implemented yet.");
    }
    //@@viewOff:private

    //@@viewOn:render
    const value = { ShoppingList, remove, update, create };
    return typeof props.children === "function" ? props.children(value) : props.children;
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ListProvider };
export default ListProvider;
//@@viewOff:exports