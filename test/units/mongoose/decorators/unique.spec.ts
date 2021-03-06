import {Store} from "../../../../src/core/class/Store";
import {descriptorOf} from "../../../../src/core/utils";
import {Unique} from "../../../../src/mongoose/decorators";
import {expect} from "../../../tools";

describe("@Unique()", () => {
    class Test {
    }

    before(() => {
        Unique()(Test, "test", descriptorOf(Test, "test"));
        this.store = Store.from(Test, "test", descriptorOf(Test, "test"));
    });

    it("should set metadata", () => {
        expect(this.store.get("mongooseSchema")).to.deep.eq({
            unique: true
        });
    });
});