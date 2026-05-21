import BaseLocator from "../../../../base/base-locator";

export default class ProductLocator extends BaseLocator {
    static productName: string = '.inventory_details_name';
    static productDescription: string = '.inventory_details_desc';
    static productPrice: string = '.inventory_details_price';
    static productImage: string = '.inventory_details_img';
    static addToCartButton: string = '[data-test="add-to-cart"]';
    static backButton: string = '#back-to-products';
}
