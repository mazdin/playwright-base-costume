import BaseLocator from "../../../../base/base-locator";

export default class CartLocator extends BaseLocator {
    static cartList: string = '.cart_list';
    static cartItem: string = '.cart_item';
    static itemName: string = '.inventory_item_name';
    static removeButton: string = 'button[data-test^="remove-"]';
    static continueShoppingButton: string = '#continue-shopping';
    static checkoutButton: string = '#checkout';
}
