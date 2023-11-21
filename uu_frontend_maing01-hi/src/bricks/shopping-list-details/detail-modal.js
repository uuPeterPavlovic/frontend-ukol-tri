//@@viewOn:imports
import { createVisualComponent, Utils, PropTypes, useLsi, useLanguage, useUserPreferences } from "uu5g05";
import { Modal, Box, Line, Text, DateTime } from "uu5g05-elements";
import { PersonPhoto } from "uu_plus4u5g02-elements";
import Config from "./config/config.js";
import importLsi from "../../lsi/import-lsi.js";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  content: () =>
    Config.Css.css({
      width: "100%",
    }),

  image: () =>
    Config.Css.css({
      display: "block",
      width: "100%",
      margin: "auto",
    }),

  text: (modal) =>
    Config.Css.css({
      display: "block",
      marginLeft: modal.style.paddingLeft,
      marginRight: modal.style.paddingRight,
      marginTop: modal.style.paddingTop,
      marginBottom: modal.style.paddingTop,
    }),

  infoLine: (modal) =>
    Config.Css.css({
      display: "block",
      marginLeft: modal.style.paddingLeft,
      marginTop: 8,
    }),

  footer: (modal) =>
    Config.Css.css({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",

      marginTop: 8,
      paddingTop: modal.style.paddingBottom,
      paddingBottom: modal.style.paddingBottom,
      paddingLeft: modal.style.paddingLeft,
      paddingRight: modal.style.paddingRight,
    }),

  photo: () =>
    Config.Css.css({
      marginRight: 8,
    }),
};
//@@viewOff:css

//@@viewOn:helpers
function hasManagePermission(ShoppingList, identity, profileList) {
  const isAuthority = profileList.includes("Authorities");
  const isExecutive = profileList.includes("Executives");
  const isOwner = ShoppingList.uuIdentity === identity.uuIdentity;
  return isAuthority || (isExecutive && isOwner);
}

function InfoLine(props) {
  const { elementProps } = Utils.VisualComponent.splitProps(props);

  return (
    <Text
      {...elementProps}
      category="interface"
      segment="content"
      type="medium"
      significance="subdued"
      colorScheme="building"
    >
      {props.children}
    </Text>
  );
}

function buildCategoryNames(categoryIdList, categoryList) {
  // for faster lookup
  let categoryIds = new Set(categoryIdList);
  return categoryList
    .reduce((acc, category) => {
      if (categoryIds.has(category.id)) {
        acc.push(category.name);
      }
      return acc;
    }, [])
    .join(", ");
}
//@@viewOff:helpers

const DetailModal = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "DetailModal",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    ShoppingListDataObject: PropTypes.object.isRequired,
    categoryList: PropTypes.array,
    onClose: PropTypes.func,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    categoryList: [],
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const [preferences] = useUserPreferences();
    const [language] = useLanguage();
    const lsi = useLsi(importLsi, [DetailModal.uu5Tag]);

    function getRatingCountLsi(ratingCount) {
      const pluralRules = new Intl.PluralRules(language);
      const rule = pluralRules.select(ratingCount);
      return lsi[`${rule}Votes`];
    }

    function getActions() {
      const isActionDisabled = props.ShoppingListDataObject.state === "pending";
      const canManage = hasManagePermission(props.ShoppingListDataObject.data, props.identity, props.profileList);
      let actionList = [];

      if (canManage) {
        actionList.push({
          icon: "mdi-pencil",
          children: lsi.update,
          onClick: () => props.onUpdate(props.ShoppingListDataObject),
          disabled: isActionDisabled,
          primary: true,
        });

        actionList.push({
          icon: "mdi-delete",
          children: lsi.delete,
          onClick: () => props.onDelete(props.ShoppingListDataObject),
          disabled: isActionDisabled,
          collapsed: true,
        });
      }

      return actionList;
    }
    //@@viewOff:private

    //@@viewOn:render
    const ShoppingList = props.ShoppingListDataObject.data;

    return (
      <Modal header={ShoppingList.name} onClose={props.onClose} actionList={getActions()} open>
        {(modal) => (
          <div className={Css.content()}>
            {ShoppingList.text && (
              <Text
                category="interface"
                segment="content"
                type="medium"
                colorScheme="building"
                className={Css.text(modal)}
              >
                {ShoppingList.text}
              </Text>
            )}

            {ShoppingList.imageUrl && <img src={ShoppingList.imageUrl} alt={ShoppingList.name} className={Css.image()} />}

            <Line significance="subdued" />

            {ShoppingList.categoryIdList?.length > 0 && (
              <InfoLine className={Css.infoLine(modal)}>
                {buildCategoryNames(ShoppingList.categoryIdList, props.categoryList)}
              </InfoLine>
            )}

            <InfoLine className={Css.infoLine(modal)}>
              <DateTime value={ShoppingList.sys.cts} dateFormat="short" timeFormat="none" />
            </InfoLine>

            <InfoLine className={Css.infoLine(modal)}>
              {Utils.String.format(getRatingCountLsi(ShoppingList.ratingCount), ShoppingList.ratingCount)}
            </InfoLine>

            <Box significance="distinct" className={Css.footer(modal)}>
              <span>
                <PersonPhoto uuIdentity={ShoppingList.uuIdentity} size="xs" className={Css.photo()} />
                <Text category="interface" segment="content" colorScheme="building" type="medium">
                  {ShoppingList.uuIdentityName}
                </Text>
              </span>
              <span>
                {Utils.String.format(
                  lsi.averageRating,
                  Utils.Number.format(ShoppingList.averageRating.toFixed(ShoppingList.averageRating % 1 ? 1 : 0), {
                    groupingSeparator: preferences.numberGroupingSeparater,
                    decimalSeparator: preferences.numberDecimalSeparator,
                  })
                )}
              </span>
            </Box>
          </div>
        )}
      </Modal>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { DetailModal };
export default DetailModal;
//@@viewOff:exports