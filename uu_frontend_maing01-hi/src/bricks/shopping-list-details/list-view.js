//@@viewOn:imports
import { createVisualComponent, PropTypes, Utils, useRef, useLsi, useState } from "uu5g05";
import { Button, Pending, useAlertBus } from "uu5g05-elements";
import Tile from "./tile";
import Config from "./config/config.js";
import DetailModal from "./detail-modal";
import importLsi from "../../lsi/import-lsi";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  tile: () => Config.Css.css({ marginBottom: 24 }),
  buttonArea: () => Config.Css.css({ textAlign: "center", marginBottom: 24 }),
};
//@@viewOff:css

//@@viewOn:helpers
function getShoppingListDataObject(ShoppingListDataList, id) {
  // HINT: We need to also check newData where are newly created items
  // that don't meet filtering, sorting or paging criteria.
  const item =
    ShoppingListDataList.newData?.find((item) => item?.data.id === id) ||
    ShoppingListDataList.data.find((item) => item?.data.id === id);

  return item;
}
//@@viewOff:helpers

const ListView = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ListView",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    ShoppingListDataList: PropTypes.object.isRequired,
    identity: PropTypes.object.isRequired,
    categoryList: PropTypes.array,
    profileList: PropTypes.array,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    categoryList: [],
    profileList: [],
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { addAlert } = useAlertBus();
    const nextPageIndexRef = useRef(1);
    const lsi = useLsi(importLsi, [ListView.uu5Tag]);
    const [itemDetailData, setItemDetailData] = useState({ open: false, id: undefined });
    let activeDataObject;

    if (itemDetailData.id) {
      activeDataObject = getShoppingListDataObject(props.ShoppingListDataList, itemDetailData.id);
    }

    function showError(error, header = "") {
      addAlert({
        header,
        message: error.message,
        priority: "error",
      });
    }

    async function handleDelete(ShoppingListDataObject) {
      try {
        await ShoppingListDataObject.handlerMap.delete();
      } catch (error) {
        ListView.logger.error("Error deleting shopping list", error);
        showError(error, lsi.deleteFail);
        return;
      }

      addAlert({
        message: Utils.String.format(lsi.deleteDone, ShoppingListDataObject.data.name),
        priority: "success",
        durationMs: 2000,
      });
    }

    async function handleUpdate(ShoppingListDataObject) {
      try {
        await ShoppingListDataObject.handlerMap.update();
      } catch (error) {
        ListView.logger.error("Error updating shopping list", error);
        showError(error, lsi.updateFail);
      }
    }

    async function handleLoadNext() {
      try {
        await props.ShoppingListDataList.handlerMap.loadNext({ pageInfo: { pageIndex: nextPageIndexRef.current } });
        nextPageIndexRef.current++;
      } catch (error) {
        ListView.logger.error("Error loading next page", error);
        showError(error, lsi.pageLoadFail);
      }
    }

    const handleItemDetailOpen = (ShoppingListDataObject) => setItemDetailData({ open: true, id: ShoppingListDataObject.data.id });
    const handleItemDetailClose = () => setItemDetailData({ open: false });
    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props);
    const ShoppingListList = props.ShoppingListDataList.data.filter((item) => item !== undefined);

    return (
      <div {...attrs}>
        {ShoppingListList.map((item) => (
          <Tile
            key={item.data.id}
            ShoppingListDataObject={item}
            profileList={props.profileList}
            identity={props.identity}
            onDetail={handleItemDetailOpen}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            className={Css.tile()}
            categoryList={props.categoryList}
          />
        ))}
        <div className={Css.buttonArea()}>
          {props.ShoppingListDataList.state !== "pending" && (
            <Button colorScheme="primary" onClick={handleLoadNext}>
              {lsi.loadNext}
            </Button>
          )}
          {props.ShoppingListDataList.state === "pending" && <Pending />}
        </div>
        {itemDetailData.open && activeDataObject && (
          <DetailModal
            ShoppingListDataObject={activeDataObject}
            profileList={props.profileList}
            identity={props.identity}
            categoryList={props.categoryList}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onClose={handleItemDetailClose}
            open
          />
        )}
      </div>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { ListView };
export default ListView;
//@@viewOff:exports