//@@viewOn:imports
import { createVisualComponent, PropTypes, Utils, useState } from "uu5g05";
import { useAlertBus, Button } from "uu5g05-elements";
import Tile from "./tile";
import Config from "./config/config.js";
//@@viewOff:imports

const ListView = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ListView",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    ShoppingList: PropTypes.array.isRequired,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    ShoppingList: [],
    onUpdate: () => {},
    onDelete: () => {},
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { addAlert } = useAlertBus();

    function showError(error, header = "") {
      addAlert({
        header,
        message: error.message,
        priority: "error",
      });
    }

    function handleDelete(event) {
      const ShoppingList = event.data;

      try {
        props.onDelete(ShoppingList);
        addAlert({
          message: `The Shopping list ${ShoppingList.name} has been deleted.`,
          priority: "success",
          durationMs: 2000,
        });
      } catch (error) {
        ListView.logger.error("Error deleting Shopping list", error);
        showError(error, "Shopping list delete failed!");
      }
    }

    function handleUpdate(event) {
      try {
        props.onUpdate(event.data);
      } catch (error) {
        ListView.logger.error("Error updating shoppipng list", error);
        showError(error, "Shopping list update failed!");
      }
    }
    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props);

    const [filtr, setFiltr] = useState(false);
    function handleClick () {
      setFiltr(!filtr);
    }
        console.log("ve filtru je:", filtr);

    return (
      
      <div {...attrs}>
        <Button onClick = { () => setFiltr(!filtr)}> Filter nearchivované / všechny</Button>
        <br></br>
        <br></br>
        <Button>Vytvořit seznam v modálním okně</Button>
        {props.ShoppingList.filter(item => item.archived).map((ShoppingList) => (
          <Tile
            key={ShoppingList.id}
            ShoppingList={ShoppingList}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            style={{ width: 640, margin: "24px auto" }}
          />
        ))}
        
      </div>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ListView };
export default ListView;
//@@viewOff:exports