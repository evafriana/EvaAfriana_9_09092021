import { screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    // test handleChangeFile
    describe("And I upload an image in file input", () => {
      test("Then I choose a require file", () => {
        const html = NewBillUI();
        document.body.innerHTML = html;
        //to-do write assertion
        const newBill = new Bill {

        }
        const changeFile = jest.fn(newBill.handleChangeFile)
        const fileInput = screen.getByTestId("file");
        fileInput.addEventListener("change", changeFile);
      });
    });
  });
});
