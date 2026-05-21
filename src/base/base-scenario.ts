import Element from "./objects/Element";

export default interface BaseScenario {
    shouldHave(): Element[];
}
