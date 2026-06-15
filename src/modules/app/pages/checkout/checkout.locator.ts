export default class CheckoutLocator {
    // Step One - Info form
    static firstNameInput: string = "#first-name";
    static lastNameInput: string = "#last-name";
    static postalCodeInput: string = "#postal-code";
    static continueButton: string = "#continue";
    static cancelButton: string = "#cancel";
    static errorMessage: string = '[data-test="error"]';

    // Step Two - Overview
    static subtotalLabel: string = ".summary_subtotal_label";
    static taxLabel: string = ".summary_tax_label";
    static totalLabel: string = ".summary_total_label";
    static finishButton: string = "#finish";

    // Complete
    static completeHeader: string = ".complete-header";
    static backHomeButton: string = "#back-to-products";
}
